/**
 * Listings Listing Query Functions
 * 统一 listings 列表查询
 */
import { getRawDb } from '@/lib/db';

// Map UI type filter values -> listing category slugs
export const TYPE_TO_CATEGORY_SLUGS: Record<string, string[]> = {
  product: ['for-sale', 'product'],
  vehicle: ['vehicles'],
  property: ['property-sale'],
  job: ['jobs'],
  service: ['services'],
  wanted: ['wanted'],
};

export interface ListingRecord {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  price: string | null;
  categoryId: string | null;
  location: string | null;
  imageIds: string | null;
  likes: number | null;
  views: number | null;
  status: string | null;
  createdAt: number | null;
}

export async function getListings(
  search: string = '',
  type: string = '',
  page: number = 1,
  limit: number = 12,
) {
  const db = await getRawDb();
  if (!db) return { results: [], total: 0, totalPages: 0 };

  const offset = (page - 1) * limit;
  const conditions: string[] = ["status IN ('active', 'published', 'live')"];
  const params: (string | number)[] = [];

  if (search) {
    conditions.push("(LOWER(title) LIKE ? OR LOWER(description) LIKE ?)");
    const searchPattern = `%${search.toLowerCase()}%`;
    params.push(searchPattern, searchPattern);
  }

  if (type) {
    const categorySlugs = TYPE_TO_CATEGORY_SLUGS[type] || [];
    if (categorySlugs.length > 0) {
      const placeholders = categorySlugs.map(() => '?').join(',');
      conditions.push(`category_id IN (SELECT id FROM listing_categories WHERE slug IN (${placeholders}) OR parent_id IN (SELECT id FROM listing_categories WHERE slug IN (${placeholders})))`);
      params.push(...categorySlugs, ...categorySlugs);
    }
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  try {
    const countResult = await db.prepare(
      `SELECT COUNT(*) as count FROM listings ${whereClause}`
    ).bind(...params).first() as { count: number } | undefined;
    const total = countResult?.count || 0;

    const dataResult = await db.prepare(`
      SELECT id, title, slug, description, price, category_id, location, image_ids,
             likes, views, status, created_at
      FROM listings ${whereClause}
      ORDER BY created_at DESC LIMIT ? OFFSET ?
    `).bind(...params, limit, offset).all();

    const results = (dataResult as unknown as { results: ListingRecord[] } | null)?.results || [];
    return { results, total, totalPages: Math.ceil(total / limit) };
  } catch {
    return { results: [], total: 0, totalPages: 0 };
  }
}
