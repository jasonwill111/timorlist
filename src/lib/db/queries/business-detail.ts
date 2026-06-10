/**
 * Business Detail Query Functions
 * 统一 business detail 页面的数据访问
 */
import { getDb } from '@/lib/db';
import { businesses, businessCategories, reviews, media, latestUpdates, sessions, users } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

// ============================================
// Interfaces
// ============================================

export interface BusinessDetail {
  id: string;
  title: string;
  slug: string;
  ownerId: string;
  categoryId: string | null;
  status: string;
  bannerImageId: string | null;
  profileImageId: string | null;
  contactName: string | null;
  contactNumber: string | null;
  countryCode: string | null;
  yearOfEstablishment: number | null;
  email: string | null;
  address: string | null;
  locationLat: number | null;
  locationLng: number | null;
  openingHours: string | null;
  aboutUs: string | null;
  tags: string | null;
  likes: number;
  saves: number;
  shares: number;
  views: number;
  ratingAverage: number;
  ratingCount: number;
  planExpiresAt: number | null;
  verifiedBadge: number;
  registrationUrl: string | null;
  socialLinks: string | null;
  photoGallery: string | null;
  latestUpdate: string | null;
  latestUpdateImages: string | null;
  latestUpdateDate: number | null;
  deletedAt: number | null;
  createdAt: number | null;
  updatedAt: number | null;
}

export interface CategoryDetail {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
}

export interface ReviewRecord {
  id: string;
  rating: number;
  title: string | null;
  content: string | null;
  userName: string | null;
  createdAt: number | null;
}

export interface GalleryImage {
  id: string;
  url: string;
}

export interface UpdateRecord {
  id: string;
  content: string;
  images: unknown[];
  createdAt: number | null;
}

// ============================================
// Query Functions
// ============================================

/**
 * 获取 business by slug
 */
export async function getBusinessBySlug(slug: string): Promise<BusinessDetail | null> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  const business = await db
    .select()
    .from(businesses)
    .where(eq(businesses.slug, slug))
    .limit(1)
    .get();

  if (!business) return null;
  return business as BusinessDetail;
}

/**
 * 获取 category by ID
 */
export async function getBusinessCategory(categoryId: string): Promise<CategoryDetail | null> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  const category = await db
    .select()
    .from(businessCategories)
    .where(eq(businessCategories.id, categoryId))
    .limit(1)
    .get();

  if (!category) return null;
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    parentId: category.parentId,
  };
}

/**
 * 获取 business reviews, ordered by createdAt desc
 */
export async function getBusinessReviews(businessId: string): Promise<ReviewRecord[]> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  const reviewRows = await db
    .select()
    .from(reviews)
    .where(eq(reviews.businessId, businessId))
    .orderBy(desc(reviews.createdAt))
    .all();

  const result: ReviewRecord[] = [];
  for (const row of reviewRows) {
    const userRow = await db
      .select({ name: users.name })
      .from(users)
      .where(eq(users.id, row.userId))
      .limit(1)
      .get();

    result.push({
      id: row.id,
      rating: row.rating,
      title: row.title,
      content: row.content,
      userName: userRow?.name ?? null,
      createdAt: row.createdAt,
    });
  }
  return result;
}

/**
 * 获取 business gallery images
 */
export async function getBusinessGallery(businessId: string): Promise<GalleryImage[]> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  const galleryMedia = await db
    .select({ id: media.id })
    .from(media)
    .where(eq(media.entityId, businessId))
    .where(eq(media.entityType, 'businesses'))
    .orderBy(media.sortOrder)
    .all();

  return galleryMedia.map(m => ({ id: m.id, url: `/api/media/${m.id}` }));
}

/**
 * 获取 business latest updates (limit 4)
 */
export async function getBusinessUpdates(businessId: string): Promise<UpdateRecord[]> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  const updateRows = await db
    .select()
    .from(latestUpdates)
    .where(eq(latestUpdates.typeId, businessId))
    .where(eq(latestUpdates.type, 'business'))
    .orderBy(desc(latestUpdates.createdAt))
    .limit(4)
    .all();

  const safeJsonParse = (str: unknown, fallback: unknown): unknown => {
    if (!str || typeof str !== 'string') return fallback;
    try { return JSON.parse(str); } catch { return fallback; }
  };

  return updateRows.map(u => ({
    id: u.id,
    content: u.content,
    images: safeJsonParse(u.imageIds, []) as unknown[],
    createdAt: u.createdAt,
  }));
}

/**
 * 检查是否为 business owner (via session token)
 */
export async function isBusinessOwner(sessionToken: string, businessId: string): Promise<boolean> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  const session = await db
    .select()
    .from(sessions)
    .where(eq(sessions.token, sessionToken))
    .limit(1)
    .get();

  if (!session) return false;

  const business = await db
    .select({ ownerId: businesses.ownerId })
    .from(businesses)
    .where(eq(businesses.id, businessId))
    .limit(1)
    .get();

  return business?.ownerId === session.userId;
}
