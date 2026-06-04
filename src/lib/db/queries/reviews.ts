/**
 * Reviews Query Functions
 * Centralized CRUD for business reviews
 */
import { getDb } from '@/lib/db';
import { reviews, businesses } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { getRatingStats } from '@/lib/rating';
import type { RatingStats } from '@/lib/rating';

export interface CreateReviewInput {
  businessId: string;
  userId: string;
  rating: number;
  content: string;
}


/**
 * Create a new review
 */
export async function createReview(input: CreateReviewInput): Promise<{ id: string }> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  const id = nanoid();
  const now = Math.floor(Date.now() / 1000);

  await db.insert(reviews).values({
    id,
    businessId: input.businessId,
    userId: input.userId,
    rating: input.rating,
    content: input.content,
    createdAt: now,
    updatedAt: now,
  }).run();

  return { id };
}

/**
 * Get reviews by business ID
 */
export async function getReviewsByBusiness(businessId: string): Promise<Array<{
  id: string;
  rating: number;
  content: string;
  createdAt: number;
}>> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  return db
    .select({
      id: reviews.id,
      rating: reviews.rating,
      content: reviews.content,
      createdAt: reviews.createdAt,
    })
    .from(reviews)
    .where(eq(reviews.businessId, businessId))
    .orderBy(reviews.createdAt)
    .all();
}

/**
 * Get review statistics for a business
 */
export async function getReviewStats(businessId: string): Promise<RatingStats> {
  return getRatingStats(businessId);
}