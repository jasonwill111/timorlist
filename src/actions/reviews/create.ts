import { getDb } from '@/lib/db';
import { reviews, businesses } from '@/db/schema';
import { eq, avg, count } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { getErrorMessage } from '@/lib/errors';
// Reviews Create Server Action
import { defineAction } from 'astro:actions';
import { z } from 'zod';
import { verifyBusinessExists } from '@/lib/db/queries/businesses';
import { sanitizeText } from '@/lib/sanitize';


const CreateReviewSchema = z.object({
  businessId: z.string().min(1),
  userId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  content: z.string().optional().default(''),
});

export const createReview = defineAction({
  input: CreateReviewSchema,
  handler: async (input) => {
    try {
      // Verify business via query layer
      const businessExists = await verifyBusinessExists(input.businessId);
      if (!businessExists) {
        return { success: false, error: { message: 'Business not found' } };
      }

      // Sanitize comment to prevent XSS
      const sanitizedComment = sanitizeText(input.content || '');

      const db = await getDb();
      if (!db) return { success: false, error: { message: 'Database not available' } };

      const now = Math.floor(Date.now() / 1000);
      const reviewId = nanoid();

      // Atomic: insert review + update business rating in one transaction
      await db.transaction(async (tx) => {
        // Step 1: Insert the review
        await tx.insert(reviews).values({
          id: reviewId,
          businessId: input.businessId,
          userId: input.userId,
          rating: input.rating,
          content: sanitizedComment,
          createdAt: now,
          updatedAt: now,
        }).run();

        // Step 2: Recalculate and update business rating
        const stats = await tx
          .select({
            avgRating: avg(reviews.rating),
            reviewCount: count(),
          })
          .from(reviews)
          .where(eq(reviews.businessId, input.businessId))
          .get();

        await tx.update(businesses)
          .set({
            ratingAverage: (stats?.avgRating as number | null) || null,
            ratingCount: (stats?.reviewCount as number) || 0,
            updatedAt: now,
          })
          .where(eq(businesses.id, input.businessId))
          .run();
      });

      return { success: true, data: { id: reviewId } };
    } catch (error) {
      return { success: false, error: { message: getErrorMessage(error) } };
    }
  },
});
