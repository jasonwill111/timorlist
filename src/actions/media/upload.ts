import { isAllowedImageType, isAllowedVideoType } from '@/lib/media-limits';
import { sha256 } from '@/lib/media/hash';
// Media Upload Server Action - R2 upload with deduplication
import { defineAction } from 'astro:actions';
import { z } from 'zod';
import { getDb } from '@/lib/db';
import { media, businesses } from '@/db/schema';
import { eq, and, count } from 'drizzle-orm';
import { initAuth } from '@/lib/auth';
import { getMediaLimits } from '@/lib/media-limits';
import { getR2PublicUrl, isR2Available, getR2Bucket } from '@/lib/media';
import { validateMediaFile, buildR2Key } from '@/lib/media/validator';
import { getErrorMessage, createErrorResponse, ErrorCode } from '@/lib/errors';

export const uploadMedia = defineAction({
  accept: 'form',
    file: z.instanceof(File).refine(f => f.size <= 10 * 1024 * 1024, { message: 'File too large (max 10MB)' }),
    type: z.string(),           // R2 path prefix (e.g., 'businesses/biz-123/profile')
    typeId: z.string(),        // entity ID
    hash: z.string().optional(),
    width: z.number().optional(),
    height: z.number().optional(),
  handler: async (input, context) => {
    const db = await getDb();
    if (!db) return createErrorResponse(ErrorCode.SERVER_DB_ERROR, "Database not available");
    const auth = await initAuth();
    const session = await auth.api.getSession({
      headers: { cookie: context.cookies.toString() },
    }).catch(() => null);
    const user = session?.user;

    if (!user) {
      return createErrorResponse(ErrorCode.AUTH_REQUIRED, 'Authentication required');
    }

    try {
      const file = input.file as File;
      if (!file) {
        return createErrorResponse(ErrorCode.MEDIA_NO_FILE, 'No file provided');
      }

      // Server-side MIME validation (client-provided type can be spoofed)
      if (!isAllowedImageType(file.type) && !isAllowedVideoType(file.type)) {
        return createErrorResponse(ErrorCode.MEDIA_TYPE_NOT_ALLOWED, 'File type not allowed');
      }

      // Use centralized validation - extract entityType from input.type (e.g., 'businesses/biz-123/profile' -> 'businesses')
      const entityType = input.type.split('/')[0];
      const validation = validateMediaFile(file, entityType);
      if (!validation.valid) {
        return createErrorResponse(validation.error!.code, validation.error!.message);
      }

      const { isImage, isVideo } = validation;

      const id = crypto.randomUUID();
      const timestamp = Date.now();

      // Server-side hash computation (don't trust client-provided hash)
      const serverHash = await sha256(file);

      // Check deduplication by hash (use server-computed hash for both lookup and storage)
      if (input.hash) {
        // Client provided hash - verify it matches server-computed hash
        if (input.hash !== serverHash) {
          // Hash mismatch - reject client hash, treat as new upload
          // (attacker trying to replay legitimate hash for different file)
          return createErrorResponse(ErrorCode.MEDIA_UPLOAD_ERROR, 'Hash verification failed');
        }
      }
      const existing = await db.select().from(media).where(eq(media.hash, serverHash)).limit(1);
      if (existing.length > 0 && existing[0]) {
        const rec = existing[0];
        return {
          success: true,
          data: {
            id: rec.id,
            r2Key: rec.r2Key,
            filename: rec.filename,
            mimeType: rec.mimeType,
            size: rec.size,
            entityType: rec.entityType,
            entityId: rec.entityId,
          },
          isDuplicate: true,
        };
      }

      // Parse type to check business limits
      // type format: 'businesses/{id}/profile'
      const typeParts = input.type.split('/');
      // Get limits for this entity type (works for ALL entity types)
      const limits = getMediaLimits(entityType);

      if (entityType === 'businesses') {
        // Check ownership
        const [business] = await db.select({ ownerId: businesses.ownerId })
          .from(businesses)
          .where(eq(businesses.id, input.typeId))
          .limit(1);

        if (!business) {
          return createErrorResponse(ErrorCode.BUSINESS_NOT_FOUND, 'Business not found');
        }

        if (business.ownerId !== user.id && (user as { role?: string }).role !== 'admin' && (user as { role?: string }).role !== 'super_admin') {
          return createErrorResponse(ErrorCode.BUSINESS_FORBIDDEN, 'Access denied to this business');
        }

        // Check image/video limits by entity
        const imageCountResult = await db.select({ count: count() })
          .from(media)
          .where(and(eq(media.entityType, entityType), eq(media.entityId, input.typeId)))
          .get() ?? undefined;

        if (isImage && limits.maxImages > 0 && (imageCountResult?.count || 0) >= limits.maxImages) {
          return createErrorResponse(ErrorCode.MEDIA_LIMIT_REACHED, `Maximum ${limits.maxImages} images allowed`);
        }

        if (isVideo && limits.maxVideos > 0 && (imageCountResult?.count || 0) >= limits.maxVideos) {
          return createErrorResponse(ErrorCode.MEDIA_LIMIT_REACHED, `Maximum ${limits.maxVideos} videos allowed`);
        }
      } else {
        // Non-business entities: check count against entity-specific limits
        const entityMediaCount = await db.select({ count: count() })
          .from(media)
          .where(and(eq(media.entityType, entityType), eq(media.entityId, input.typeId)))
          .get() ?? undefined;

        if (isImage && limits.maxImages > 0 && (entityMediaCount?.count || 0) >= limits.maxImages) {
          return createErrorResponse(ErrorCode.MEDIA_LIMIT_REACHED, `Maximum ${limits.maxImages} images allowed`);
        }

        if (isVideo && limits.maxVideos > 0 && (entityMediaCount?.count || 0) >= limits.maxVideos) {
          return createErrorResponse(ErrorCode.MEDIA_LIMIT_REACHED, `Maximum ${limits.maxVideos} videos allowed`);
        }
      }

      // Build R2 key
      const r2Key = buildR2Key({
        type: input.type,
        typeId: input.typeId,
        filename: file.name,
        timestamp,
        id,
      });

      let finalUrl: string;
      let finalSize = file.size;
      let finalMimeType = file.type;
      let storedPath: string;

      const bucket = getR2Bucket();
      if (bucket) {
        const buffer = Buffer.from(await file.arrayBuffer());
        await bucket.put(r2Key, buffer, {
          httpMetadata: {
            contentType: file.type,
            cacheControl: 'public, max-age=31536000, immutable',
          },
        });
        finalUrl = `${getR2PublicUrl()}/${r2Key}`;
        storedPath = r2Key;
      } else {
        const buffer = Buffer.from(await file.arrayBuffer());
        const base64 = buffer.toString('base64');
        finalUrl = `data:${file.type};base64,${base64}`;
        storedPath = finalUrl;
      }

      const [created] = await db.insert(media).values({
        id,
        r2Key: storedPath,
        filename: file.name,
        mimeType: finalMimeType,
        hash: serverHash,
      }).returning();

      if (!created) {
        return createErrorResponse(ErrorCode.MEDIA_UPLOAD_ERROR, 'Failed to create media record');
      }

      return {
        success: true,
        data: {
          id: created.id,
          r2Key: created.r2Key,
          filename: file.name,
          mimeType: finalMimeType,
          size: finalSize,
          entityType: created.entityType,
          entityId: created.entityId,
          width: input.width ?? null,
          height: input.height ?? null,
        },
        isDuplicate: false,
      };
    } catch (error) {
      return createErrorResponse(ErrorCode.MEDIA_UPLOAD_ERROR, getErrorMessage(error));
    }
  },
});