/**
 * Admin Dashboard Query Functions
 */
import { getDb } from '@/lib/db';
import { businesses, users, products } from '@/db/schema';
import { sql, eq, gte } from 'drizzle-orm';

export async function getAdminStats() {
  const db = await getDb();
  if (!db) return { userCount: 0, businessCount: 0, nonProfitCount: 0, productCount: 0, mtdUserCount: 0 };

  const now = Math.floor(Date.now() / 1000);
  const thirtyDaysAgo = now - (30 * 24 * 60 * 60);

  const [userCount] = await db.select({ count: sql<number>`count(*)` }).from(users).get() ?? [{ count: 0 }];
  const [businessCount] = await db.select({ count: sql<number>`count(*)` }).from(businesses).get() ?? [{ count: 0 }];
  const [nonProfitCount] = await db.select({ count: sql<number>`count(*)` }).from(businesses).where(eq(businesses.entityType, 'nonprofit')).get() ?? [{ count: 0 }];
  const [productCount] = await db.select({ count: sql<number>`count(*)` }).from(products).get() ?? [{ count: 0 }];
  const [mtdUserCount] = await db.select({ count: sql<number>`count(*)` }).from(users).where(gte(users.createdAt, thirtyDaysAgo)).get() ?? [{ count: 0 }];

  return {
    userCount: userCount.count ?? 0,
    businessCount: businessCount.count ?? 0,
    nonProfitCount: nonProfitCount.count ?? 0,
    productCount: productCount.count ?? 0,
    mtdUserCount: mtdUserCount.count ?? 0,
  };
}
