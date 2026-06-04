/**
 * Rating recalculation utilities.
 * Centralizes the logic for computing average ratings and review counts
 * for entities, so that the same query is not duplicated across queries.
 */
import { getDb } from './db';
import { reviews } from '@/db/schema';
import { eq, avg, count } from 'drizzle-orm';

export interface RatingStats {
  avgRating: number | null;
  reviewCount: number;
}

/**
 * Get average rating and review count for a business from the reviews table.
 * Used by getReviewStats (read) and updateBusinessRating (write).
 */
export async function getRatingStats(businessId: string): Promise<RatingStats> {
  const db = await getDb();
  if (!db) {
    return { avgRating: null, reviewCount: 0 };
  }
  const stats = await db
    .select({
      avgRating: avg(reviews.rating),
      reviewCount: count(),
    })
    .from(reviews)
    .where(eq(reviews.businessId, businessId))
    .get();
  return {
    avgRating: stats?.avgRating ?? null,
    reviewCount: stats?.reviewCount ?? 0,
  };
}
