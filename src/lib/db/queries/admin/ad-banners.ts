/**
 * Admin Ad Banners Query Functions
 * Business logic layer for admin banner management
 */
import { getDb } from '@/lib/db';
import { adBanners, businesses } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

export interface HeroData {
  id: string;
  title: string;
  description: string | null;
  imageId: string | null;
  externalUrl: string | null;
  linkedBusinessPageId: string | null;
  isActive: boolean;
  position: string | null;
  sortOrder: number | null;
  createdAt: number | null;
}

export interface HeroWithBusiness extends HeroData {
  businessTitle?: string;
}

export async function getAdminHeroes(): Promise<HeroData[]> {
  const db = await getDb();
  if (!db) return [];

  const heroes = await db
    .select()
    .from(adBanners)
    .orderBy(desc(adBanners.createdAt))
    .all();

  return heroes.map(h => ({
    id: h.id,
    title: h.title || '',
    description: h.description || null,
    imageId: h.imageId || null,
    externalUrl: h.linkUrl || null,
    linkedBusinessPageId: h.linkedBusinessPageId || null,
    isActive: h.isActive === 1,
    position: h.position || null,
    sortOrder: h.sortOrder || null,
    createdAt: h.createdAt || null,
  }));
}

export async function getAdminBusinessesForDropdown(): Promise<{ id: string; title: string }[]> {
  const db = await getDb();
  if (!db) return [];

  const bizList = await db
    .select({ id: businesses.id, title: businesses.title })
    .from(businesses)
    .orderBy(desc(businesses.createdAt))
    .all();

  return bizList.map(b => ({ id: b.id, title: b.title || '' }));
}