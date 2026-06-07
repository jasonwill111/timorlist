/**
 * Admin Reviews Query Functions
 */
import { getDb } from '@/lib/db';
import { reviews } from '@/db/schema';
import { desc } from 'drizzle-orm';

export interface ReviewData {
  id: string;
  businessId: string | null;
  userId: string | null;
  rating: number | null;
  comment: string | null;
  reply: string | null;
  isEdited: boolean | null;
  createdAt: number | null;
  businessTitle?: string;
  userName?: string;
  userEmail?: string;
}

export async function getAdminReviews(limit = 100): Promise<ReviewData[]> {
  const db = await getDb();
  if (!db) return [];

  const rows = await db
    .select()
    .from(reviews)
    .orderBy(desc(reviews.createdAt))
    .limit(limit)
    .all();

  return rows.map(r => ({
    id: r.id,
    businessId: r.businessId,
    userId: r.userId,
    rating: r.rating,
    comment: r.comment,
    reply: r.reply,
    isEdited: r.isEdited,
    createdAt: r.createdAt,
  }));
}