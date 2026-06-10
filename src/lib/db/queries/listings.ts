/**
 * Listings & Listing Categories Query Functions
 * Covers both admin and public listing pages
 */
import { getDb } from '@/lib/db';
import { listings as listingsTable, listingCategories } from '@/db/schema';
import { eq, asc } from 'drizzle-orm';

export interface ListingCategoryRow {
  id: string;
  name: string;
  parentId: string | null;
}

/**
 * 获取所有 listing categories (flat, ordered by name)
 */
export async function getAllListingCategories(): Promise<ListingCategoryRow[]> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  return db.select().from(listingCategories).orderBy(asc(listingCategories.name)).all();
}

/**
 * 获取单个 listing by ID
 */
