/**
 * Search Query Functions
 * Full-text search for businesses using raw SQL
 */
import { getRawDb } from '@/lib/db';

// ============================================
// Interfaces
// ============================================

export interface SearchResult {
  id: string;
  title: string;
  slug: string;
  category_id: string | null;
  address: string | null;
  profile_image_id: string | null;
  tags: string | null;
  likes: number | null;
  saves: number | null;
  views: number | null;
  status: string | null;
  about_us: string | null;
  categoryName: string | null;
}

export interface SearchResults {
  results: SearchResult[];
  total: number;
  totalPages: number;
}

// ============================================
// Query Functions
// ============================================

/**
 * Build category map for search results
 */
export async function getCategoriesForSearch(): Promise<Record<string, string>> {
  const db = await getRawDb();
  if (!db) return {};

  try {
    const categories = await db.prepare(
      'SELECT id, name, parent_id as parentId FROM business_categories'
    ).all() as { results: Array<{ id: string; name: string }> } | null;

    const map: Record<string, string> = {};
    const items = categories?.results || [];
    items.forEach(c => { map[c.id] = c.name; });
    return map;
  } catch {
    return {};
  }
}

/**
 * Search businesses by query string with pagination
 */
export async function searchBusinesses(
  query: string,
  page: number = 1,
  limit: number = 12,
): Promise<SearchResults> {
  const db = await getRawDb();
  if (!db) return { results: [], total: 0, totalPages: 0 };

  const offset = (page - 1) * limit;
  const searchPattern = `%${query.toLowerCase()}%`;
  const results: SearchResult[] = [];
  let total = 0;

  try {
    // Count total
    const countResult = await db.prepare(`
      SELECT COUNT(*) as count FROM businesses
      WHERE status IN ('active', 'published', 'live')
        AND (LOWER(title) LIKE ? OR LOWER(about_us) LIKE ?)
    `).bind(searchPattern, searchPattern).first() as { count: number } | undefined;
    total = countResult?.count || 0;

    // Fetch paginated results
    const dataResult = await db.prepare(`
      SELECT id, title, slug, category_id, address, profile_image_id as profileImageId,
             tags, likes, saves, views, status, about_us as aboutUs
      FROM businesses
      WHERE status IN ('active', 'published', 'live')
        AND (LOWER(title) LIKE ? OR LOWER(about_us) LIKE ?)
      ORDER BY
        CASE WHEN LOWER(title) LIKE ? THEN 0 ELSE 1 END,
        likes DESC
      LIMIT ? OFFSET ?
    `).bind(searchPattern, searchPattern, searchPattern, limit, offset).all();

    const rows = (dataResult as unknown as { results: SearchResult[] } | null)?.results || [];
    rows.forEach(b => {
      b.categoryName = undefined; // filled by caller with categoryMap
      results.push(b);
    });
  } catch {
    // Search failed — return empty
  }

  return {
    results,
    total,
    totalPages: Math.ceil(total / limit),
  };
}
