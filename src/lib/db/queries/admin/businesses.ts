/**
 * Admin Businesses Query Functions
 */
import { getDb } from '@/lib/db';
import { businesses } from '@/db/schema';
import { like, or, desc } from 'drizzle-orm';

export interface BusinessData {
  id: string;
  title: string | null;
  slug: string | null;
  email: string | null;
  contactNumber: string | null;
  status: string | null;
  planExpiresAt: number | null;
  createdAt: number | null;
  updatedAt: number | null;
}

export async function getAdminBusinesses(
  search?: string,
  status?: string,
  limit = 100
): Promise<BusinessData[]> {
  const db = await getDb();
  if (!db) return [];

  const rows = await db.select({
    id: businesses.id,
    title: businesses.title,
    slug: businesses.slug,
    email: businesses.email,
    contactNumber: businesses.contactNumber,
    status: businesses.status,
    planExpiresAt: businesses.planExpiresAt,
    createdAt: businesses.createdAt,
    updatedAt: businesses.updatedAt,
  })
    .from(businesses)
    .orderBy(desc(businesses.createdAt))
    .limit(limit)
    .all();

  return rows;
}