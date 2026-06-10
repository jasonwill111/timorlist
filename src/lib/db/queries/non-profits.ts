/**
 * Non-Profits Query Functions
 * 统一 non-profits 列表查询
 */
import { getRawDb } from '@/lib/db';

export interface NonProfit {
  id: string;
  title: string;
  slug: string;
  category_id: string | null;
  address: string | null;
  profile_image_id: string | null;
  status: string | null;
  about_us: string | null;
}

export interface CategoryRecord {
  id: string;
  name: string;
  parentId: string | null;
}

export async function getNonProfitCategories(): Promise<{ parentCats: CategoryRecord[]; categoryMap: Record<string, string>; childMap: Record<string, string[]> }> {
  const db = await getRawDb();
  if (!db) return { parentCats: [], categoryMap: {}, childMap: {} };

  try {
    const allCats = (await db.prepare(
      'SELECT id, name, parent_id as parentId FROM non_profit_categories'
    ).all()).results as unknown as CategoryRecord[];

    const parentCats = allCats.filter(c => !c.parentId);
    const categoryMap: Record<string, string> = {};
    const childMap: Record<string, string[]> = {};

    for (const c of allCats) {
      categoryMap[c.id] = c.name;
      if (c.parentId) {
        if (!childMap[c.parentId]) childMap[c.parentId] = [];
        childMap[c.parentId].push(c.id);
      }
    }

    return { parentCats, categoryMap, childMap };
  } catch {
    return { parentCats: [], categoryMap: {}, childMap: {} };
  }
}

export async function getNonProfits(
  search: string = '',
  parentCat: string = '',
  childCat: string = '',
  page: number = 1,
  limit: number = 12,
) {
  const db = await getRawDb();
  if (!db) return { results: [], total: 0, totalPages: 0 };

  const offset = (page - 1) * limit;
  const conditions: string[] = ["status IN ('active', 'published', 'live')"];
  const params: (string | number)[] = [];

  if (search) {
    const pattern = `%${search.toLowerCase()}%`;
    conditions.push("(LOWER(title) LIKE ? OR LOWER(about_us) LIKE ?)");
    params.push(pattern, pattern);
  }

  if (childCat) {
    conditions.push("category_id = ?");
    params.push(childCat);
  } else if (parentCat) {
    const childMap = (await getNonProfitCategories()).childMap;
    const childIds = childMap[parentCat] || [];
    if (childIds.length > 0) {
      const placeholders = childIds.map(() => '?').join(', ');
      conditions.push(`category_id IN (${placeholders})`);
      params.push(...childIds);
    }
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  try {
    const countResult = await db.prepare(
      `SELECT COUNT(*) as count FROM non_profits ${whereClause}`
    ).bind(...params).first() as { count: number } | undefined;
    const total = countResult?.count || 0;

    const dataResult = await db.prepare(`
      SELECT id, title, slug, category_id, address, profile_image_id, status, about_us
      FROM non_profits ${whereClause}
      ORDER BY created_at DESC LIMIT ? OFFSET ?
    `).bind(...params, limit, offset).all();

    const results = (dataResult as unknown as { results: NonProfit[] } | null)?.results || [];
    return { results, total, totalPages: Math.ceil(total / limit) };
  } catch {
    return { results: [], total: 0, totalPages: 0 };
  }
}
