/**
 * Admin Public Sectors Query Functions
 */
import { getDb } from '@/lib/db';
import { publicSectors } from '@/db/schema';
import { desc, isNull } from 'drizzle-orm';

export interface PublicSectorData {
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

export async function getAdminPublicSectors(limit = 100): Promise<PublicSectorData[]> {
  const db = await getDb();
  if (!db) return [];

  const rows = await db.select({
    id: publicSectors.id,
    title: publicSectors.title,
    slug: publicSectors.slug,
    email: publicSectors.email,
    contactNumber: publicSectors.contactNumber,
    status: publicSectors.status,
    aboutUs: publicSectors.aboutUs,
    latestUpdate: publicSectors.latestUpdate,
    createdAt: publicSectors.createdAt,
    updatedAt: publicSectors.updatedAt,
  })
    .from(publicSectors)
    .where(isNull(publicSectors.deletedAt))
    .orderBy(desc(publicSectors.createdAt))
    .limit(limit)
    .all();

  return rows;
}