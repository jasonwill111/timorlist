/**
 * Admin Non-Profits Query Functions
 */
import { getDb } from '@/lib/db';
import { nonProfits } from '@/db/schema';
import { desc, isNull } from 'drizzle-orm';

export interface NonProfitData {
  id: string;
  title: string | null;
  slug: string | null;
  email: string | null;
  contactNumber: string | null;
  status: string | null;
  aboutUs: string | null;
  latestUpdate: string | null;
  createdAt: number | null;
  updatedAt: number | null;
}

export async function getAdminNonProfits(limit = 100): Promise<NonProfitData[]> {
  const db = await getDb();
  if (!db) return [];

  const rows = await db.select({
    id: nonProfits.id,
    title: nonProfits.title,
    slug: nonProfits.slug,
    email: nonProfits.email,
    contactNumber: nonProfits.contactNumber,
    status: nonProfits.status,
    aboutUs: nonProfits.aboutUs,
    latestUpdate: nonProfits.latestUpdate,
    createdAt: nonProfits.createdAt,
    updatedAt: nonProfits.updatedAt,
  })
    .from(nonProfits)
    .where(isNull(nonProfits.deletedAt))
    .orderBy(desc(nonProfits.createdAt))
    .limit(limit)
    .all();

  return rows;
}