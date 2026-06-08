// Astro Server Actions for Admin Public Sectors Management
import { defineAction } from 'astro:actions';
import { z } from 'zod';
import { getDb } from '@/lib/db';
import { publicSectors } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getAdminUser } from '@/lib/admin-auth';
import { createErrorResponse, ErrorCode } from '@/lib/errors';

export const adminPublicSectors = {
  // Create a new public sector (draft status)
  create: defineAction({
    input: z.object({
      title: z.string().min(1),
      slug: z.string().min(1),
      email: z.string().optional().nullable(),
      contactNumber: z.string().optional().nullable(),
      aboutUs: z.string().optional().nullable(),
      latestUpdate: z.string().optional().nullable(),
    }),
    handler: async (input) => {
      const user = await getAdminUser();
      if (!user) return createErrorResponse(ErrorCode.AUTH_REQUIRED, 'Authentication required');
      const db = await getDb();
      if (!db) return createErrorResponse(ErrorCode.SERVER_DB_ERROR, 'Database not available');
      const now = Math.floor(Date.now() / 1000);
      const newItem = {
        id: `ps-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        title: input.title,
        slug: input.slug,
        email: input.email || null,
        contactNumber: input.contactNumber || null,
        aboutUs: input.aboutUs || null,
        latestUpdate: input.latestUpdate || null,
        status: 'draft' as const,
        ownerId: user.id,
        createdAt: now,
        updatedAt: now,
      };

      await db.insert(publicSectors).values(newItem);
      return { success: true, data: { id: newItem.id, slug: newItem.slug } };
    },
  }),

  // Update a public sector
  update: defineAction({
    input: z.object({
      id: z.string(),
      title: z.string().min(1).optional(),
      slug: z.string().min(1).optional(),
      email: z.string().optional().nullable(),
      contactNumber: z.string().optional().nullable(),
      aboutUs: z.string().optional().nullable(),
      latestUpdate: z.string().optional().nullable(),
    }),
    handler: async (input) => {
      const user = await getAdminUser();
      if (!user) return createErrorResponse(ErrorCode.AUTH_REQUIRED, 'Authentication required');
      const db = await getDb();
      if (!db) return createErrorResponse(ErrorCode.SERVER_DB_ERROR, 'Database not available');

      const existing = await db.select()
        .from(publicSectors)
        .where(eq(publicSectors.id, input.id))
        .limit(1)
        .get();

      if (!existing) return createErrorResponse(ErrorCode.BUSINESS_NOT_FOUND, 'Public sector not found');

      const updateData: Record<string, unknown> = { updatedAt: Math.floor(Date.now() / 1000) };
      if (input.title !== undefined) updateData.title = input.title;
      if (input.slug !== undefined) updateData.slug = input.slug;
      if (input.email !== undefined) updateData.email = input.email;
      if (input.contactNumber !== undefined) updateData.contactNumber = input.contactNumber;
      if (input.aboutUs !== undefined) updateData.aboutUs = input.aboutUs;
      if (input.latestUpdate !== undefined) updateData.latestUpdate = input.latestUpdate;

      await db.update(publicSectors)
        .set(updateData)
        .where(eq(publicSectors.id, input.id))
        .run();

      return { success: true, data: { id: input.id } };
    },
  }),

  // Update public sector status
  updateStatus: defineAction({
    input: z.object({
      id: z.string(),
      status: z.enum(['draft', 'active', 'deleted']),
    }),
    handler: async (input) => {
      const user = await getAdminUser();
      if (!user) return createErrorResponse(ErrorCode.AUTH_REQUIRED, 'Authentication required');

      const db = await getDb();
      if (!db) return createErrorResponse(ErrorCode.SERVER_DB_ERROR, 'Database not available');

      const existing = await db.select()
        .from(publicSectors)
        .where(eq(publicSectors.id, input.id))
        .limit(1)
        .get();

      if (!existing) return createErrorResponse(ErrorCode.BUSINESS_NOT_FOUND, 'Public sector not found');

      await db.update(publicSectors)
        .set({ status: input.status, updatedAt: Math.floor(Date.now() / 1000) })
        .where(eq(publicSectors.id, input.id))
        .run();

      return { success: true, data: { id: input.id, status: input.status } };
    },
  }),
};