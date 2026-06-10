// Media Upload Server Action - R2 upload with deduplication
import { defineAction } from 'astro:actions';
import { z } from 'zod';
import { getDb } from '@/lib/db';
import { media, businesses } from '@/db/schema';
import { eq, and, count } from 'drizzle-orm';
import { getAuth } from '@/lib/auth';
import { getMediaLimits } from '@/lib/media-limits';
import { getR2PublicUrl, getR2Bucket } from '@/lib/media';
import { validateMediaFile, buildR2Key } from '@/lib/media/validator';
import { getErrorMessage, createErrorResponse, ErrorCode } from '@/lib/errors';
import { sha256 } from '@/lib/media/hash';

const uploadSchema = z.object({
  file: z.instanceof(File).refine(f => f.size <= 10 * 1024 * 1024, { message: 'File too large (max 10MB)' }),
  type: z.string(),
  typeId: z.string(),
  hash: z.string().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
});

export const uploadMedia = defineAction({
  accept: 'form',
  input: uploadSchema,
  handler: async (input) => {
    const db = await getDb();
    if (!db) return createErrorResponse(ErrorCode.SERVER_DB_ERROR, 'Database not available');

    const auth = await getAuth();
    const session = await auth.api.getSession({ headers: { cookie: '' } }).catch(() => null);
    const user = session?.user;

    if (!user) {
      return createErrorResponse(ErrorCode.AUTH_REQUIRED, 'Authentication required');
    }

    try {
      const file = input.file;
      if (!file) {
        return createErrorResponse(ErrorCode.MEDIA_NO_FILE, 'No file provided');
      }

      const isAllowedImageType = (mime: string) =>
        ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/avif'].includes(mime);
      const isAllowedVideoType = (mime: string) =>
        ['video/mp4', 'video/webm', 'video/quicktime'].includes(mime);

      if (!isAllowedImageType(file.type) && !isAllowedVideoType(file.type)) {
        return createErrorResponse(ErrorCode.MEDIA_TYPE_NOT_ALLOWED, 'File type not allowed');
      }

      const entityType = input.type.split('/')[0]!;
      const validation = validateMediaFile(file, entityType);
      if (!validation.valid) {
        return createErrorResponse(validation.error!.code, validation.error!.message);
      }

      const { isImage, isVideo } = validation;
      const id = crypto.randomUUID();
      const timestamp = Date.now();

      const serverHash = await sha256(file);

      if (input.hash && input.hash !== serverHash) {
        return createErrorResponse(ErrorCode.MEDIA_UPLOAD_ERROR, 'Hash verification failed');
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

      const limits = getMediaLimits(entityType);

      if (entityType === 'businesses') {
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

      const r2Key = buildR2Key({
        type: input.type,
        filename: file.name,
        timestamp,
        id,
      });

      let finalUrl: string;
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

      
      await db.insert(media).values({
        id,
        r2Key: storedPath,
        filename: file.name,
        mimeType: finalMimeType,
        size: file.size,
        hash: serverHash,
        entityType: entityType,
        entityId: input.typeId,
        purpose: "gallery",
      }).run();

      return {
        success: true,
        data: {
          id,
          r2Key: storedPath,
          filename: file.name,
          mimeType: finalMimeType,
          size: file.size,
          entityType,
          entityId: input.typeId,
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
