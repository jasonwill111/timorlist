// Astro Server Actions for Admin Listings Management
import { defineAction } from 'astro:actions';
import { z } from 'zod';
import { requireAdmin } from '@/lib/admin-auth';
import { createErrorResponse, ErrorCode } from '@/lib/errors';
import { listListings, createListing, updateListing, deleteListing } from '@/lib/db/queries/admin-listings';

const createSchema = z.object({
  title: z.string().min(1),
  slug: z.string().optional(),
  categoryId: z.string().optional().nullable(),
  description: z.string().min(1),
  price: z.string().optional().nullable(),
  condition: z.enum(['new', 'like-new', 'good', 'fair', 'poor']).optional().nullable(),
  location: z.string().optional().nullable(),
  locationLat: z.number().optional().nullable(),
  locationLng: z.number().optional().nullable(),
  contactName: z.string().optional().nullable(),
  contactNumber: z.string().optional().nullable(),
  countryCode: z.string().default('+670'),
  email: z.email().optional().or(z.literal('')),
  tags: z.string().optional().nullable(),
  imageIds: z.string().optional().nullable(),
  status: z.enum(['draft', 'published']).default('draft'),
  ownerId: z.string().optional(),
});

const updateSchema = createSchema.partial().extend({
  id: z.string(),
});

const listSchema = z.object({
  status: z.enum(['draft', 'published']).optional(),
  search: z.string().optional(),
});

export const listings = {
  // List listings
  list: defineAction({
    input: listSchema.optional(),
    handler: async (input, { cookies }) => {
      const authResult = await requireAdmin(cookies);
      if ('error' in authResult) return createErrorResponse(ErrorCode.AUTH_REQUIRED, 'Authentication required');

      const filters = input
      ? { ...(input.status !== undefined && { status: input.status }), ...(input.search !== undefined && { search: input.search }) }
      : undefined;
      const listings = await listListings(filters);

      return { success: true, data: listings };
    },
  }),

  // Create listing
  create: defineAction({
    input: createSchema,
    handler: async (input, { cookies }) => {
      const authResult = await requireAdmin(cookies);
      if ('error' in authResult) return createErrorResponse(ErrorCode.AUTH_REQUIRED, 'Authentication required');

      const createInput: Parameters<typeof createListing>[0] = {
        title: input.title,
        description: input.description,
        countryCode: input.countryCode,
        status: input.status,
        ownerId: input.ownerId || authResult.userId,
      };
      if (input.slug !== undefined) createInput.slug = input.slug;
      if (input.categoryId !== undefined) createInput.categoryId = input.categoryId;
      if (input.price !== undefined) createInput.price = input.price;
      if (input.condition !== undefined) createInput.condition = input.condition;
      if (input.location !== undefined) createInput.location = input.location;
      if (input.locationLat !== undefined) createInput.locationLat = input.locationLat;
      if (input.locationLng !== undefined) createInput.locationLng = input.locationLng;
      if (input.contactName !== undefined) createInput.contactName = input.contactName;
      if (input.contactNumber !== undefined) createInput.contactNumber = input.contactNumber;
      if (input.email !== undefined) createInput.email = input.email || null;
      if (input.tags !== undefined) createInput.tags = input.tags;
      if (input.imageIds !== undefined) createInput.imageIds = input.imageIds;

      const result = await createListing(createInput);

      return { success: true, data: result };
    },
  }),

  // Update listing
  update: defineAction({
    input: updateSchema,
    handler: async (input, { cookies }) => {
      const authResult = await requireAdmin(cookies);
      if ('error' in authResult) return createErrorResponse(ErrorCode.AUTH_REQUIRED, 'Authentication required');

      const { id, ...data } = input;
      const updateInput: { id: string; title?: string; description?: string; slug?: string; status?: 'draft' | 'published' } = { id };
      if (data.title !== undefined) updateInput.title = data.title;
      if (data.description !== undefined) updateInput.description = data.description;
      if (data.slug !== undefined) updateInput.slug = data.slug;
      if (data.status !== undefined) updateInput.status = data.status;
      await updateListing(updateInput);

      return { success: true };
    },
  }),

  // Delete listing
  delete: defineAction({
    input: z.object({ id: z.string() }),
    handler: async (input, { cookies }) => {
      const authResult = await requireAdmin(cookies);
      if ('error' in authResult) return createErrorResponse(ErrorCode.AUTH_REQUIRED, 'Authentication required');

      await deleteListing(input.id);

      return { success: true };
    },
  }),
};