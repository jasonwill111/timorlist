/**
 * Media Listing Query Functions
 * 统一 admin media 列表查询
 */
import { getDb } from '@/lib/db';
import { media } from '@/db/schema';
import { eq, and, desc, sql } from 'drizzle-orm';

export async function getMediaList(
  entityTypeFilter: string = '',
  entityIdFilter: string = '',
  categoryFilter: string = '',
  page: number = 1,
  limit: number = 24,
) {
  const db = await getDb();
  if (!db) return { items: [], total: 0, totalPages: 0, totalSizeMB: '0', entityTypes: [], categories: [] };

  const offset = (page - 1) * limit;

  // Build conditions
  const conditions = [];

  if (entityTypeFilter) {
    conditions.push(eq(media.entityType, entityTypeFilter));
  }
  if (entityIdFilter) {
    conditions.push(eq(media.entityId, entityIdFilter));
  }
  if (categoryFilter) {
    conditions.push(eq(media.purpose, categoryFilter));
  }

  const entityTypeRows = await db.selectDistinct({ entityType: media.entityType }).from(media).all();
  const purposeRows = await db.selectDistinct({ purpose: media.purpose }).from(media).all();
  const entityTypes = entityTypeRows.map(r => r.entityType).filter(Boolean) as string[];
  const categories = purposeRows.map(r => r.purpose).filter(Boolean) as string[];

  // Count
  const baseQuery = db.select({ count: sql<number>`count(*)` }).from(media);
  const total = conditions.length > 0
    ? (await db.select({ count: sql<number>`count(*)` }).from(media).where(and(...conditions)).get()).count
    : (await baseQuery.get()).count;

  // Paginated results
  const items = conditions.length > 0
    ? await db.select().from(media).where(and(...conditions)).orderBy(desc(media.createdAt)).limit(limit).offset(offset).all()
    : await db.select().from(media).orderBy(desc(media.createdAt)).limit(limit).offset(offset).all();

  const totalSize = items.reduce((acc: number, item: any) => acc + (item.size || 0), 0);
  const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(2);

  return { items, total, totalPages: Math.ceil(total / limit), totalSizeMB, entityTypes, categories };
}
