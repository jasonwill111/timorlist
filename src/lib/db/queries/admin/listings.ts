/**
 * Admin Listings Query Functions
 */
import { getDb } from '@/lib/db';
import { listings } from '@/db/schema';
import { desc, eq, like, or } from 'drizzle-orm';

export interface ListingData {
  id: string;
  title: string | null;
  slug: string | null;
  ownerId: string | null;
  categoryId: string | null;
  status: string | null;
  description: string | null;
  price: string | null;
  condition: string | null;
  location: string | null;
  contactName: string | null;
  contactNumber: string | null;
  email: string | null;
  imageIds: string | null;
  planExpiresAt: number | null;
  featured: number | null;
  createdAt: number | null;
  updatedAt: number | null;
}

export interface ListingStats {
  total: number;
  published: number;
  draft: number;
  expired: number;
}

export async function getAdminListings(): Promise<ListingData[]> {
  const db = await getDb();
  if (!db) return [];

  const rows = await db
    .select()
    .from(listings)
    .orderBy(desc(listings.createdAt))
    .all();

  return rows.map(r => ({
    id: r.id,
    title: r.title,
    slug: r.slug,
    ownerId: r.ownerId,
    categoryId: r.categoryId,
    status: r.status,
    description: r.description,
    price: r.price,
    condition: r.condition,
    location: r.location,
    contactName: r.contactName,
    contactNumber: r.contactNumber,
    email: r.email,
    imageIds: r.imageIds,
    planExpiresAt: r.planExpiresAt,
    featured: r.featured,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
  }));
}

export async function getAdminListingStats(): Promise<ListingStats> {
  const all = await getAdminListings();
  const now = Date.now() / 1000;
  return {
    total: all.length,
    published: all.filter(l => l.status === 'active' || l.status === 'published').length,
    draft: all.filter(l => l.status === 'draft').length,
    expired: all.filter(l => l.planExpiresAt && l.planExpiresAt < now).length,
  };
}