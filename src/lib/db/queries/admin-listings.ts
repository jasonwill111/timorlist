/**
 * Admin Listings Query Functions
 * Centralized CRUD for admin listing management
 */
import { getDb } from '@/lib/db';
import { listings as listingsTable } from '@/db/schema';
import { eq, and, like, desc } from 'drizzle-orm';
import { generateUniqueSlug } from '@/lib/utils';
import { nanoid } from 'nanoid';

export interface ListingRecord {
  id: string;
  title: string;
  slug: string;
  ownerId: string;
  categoryId: string | null;
  status: string;
  description: string;
  price: string | null;
  condition: string | null;
  location: string | null;
  address: string | null;
  locationLat: number | null;
  locationLng: number | null;
  contactName: string | null;
  contactNumber: string | null;
  countryCode: string | null;
  email: string | null;
  imageIds: string | null;
  tags: string | null;
  likes: number;
  saves: number;
  views: number;
  createdAt: number;
  updatedAt: number;
  lastRenewedAt: number | null;
  parsedTags: string[];
  parsedImageIds: string[];
}

export interface ListingFilters {
  status?: 'draft' | 'published';
  search?: string;
}

export interface CreateListingInput {
  title: string;
  slug?: string;
  categoryId?: string | null;
  description: string;
  price?: string | null;
  condition?: 'new' | 'like-new' | 'good' | 'fair' | 'poor' | null;
  location?: string | null;
  locationLat?: number | null;
  locationLng?: number | null;
  contactName?: string | null;
  contactNumber?: string | null;
  countryCode: string;
  email?: string | null;
  tags?: string | null;
  imageIds?: string | null;
  status: 'draft' | 'published';
  ownerId: string;
}

export interface UpdateListingInput extends Partial<Omit<CreateListingInput, 'title' | 'description' | 'status' | 'ownerId'>> {
  id: string;
  title?: string;
  description?: string;
  status?: 'draft' | 'published';
  ownerId?: string;
}

/**
 * List listings with optional filters
 */
export async function listListings(filters?: ListingFilters) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  let query = db.select().from(listingsTable);
  const conditions = [];

  if (filters?.status) {
    conditions.push(eq(listingsTable.status, filters.status));
  }
  if (filters?.search) {
    conditions.push(like(listingsTable.title, `%${filters.search}%`));
  }

  return conditions.length > 0
    ? await query.where(and(...conditions)).all()
    : await query.orderBy(desc(listingsTable.createdAt)).all();
}

/**
 * Create a new listing
 */
export async function createListing(input: CreateListingInput): Promise<{ id: string; slug: string }> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  const slug = input.slug || generateUniqueSlug(input.title);
  const id = nanoid();
  const now = Math.floor(Date.now() / 1000);

  const newListing = {
    id,
    title: input.title,
    slug,
    ownerId: input.ownerId,
    categoryId: input.categoryId || null,
    description: input.description,
    price: input.price || null,
    condition: input.condition || null,
    location: input.location || null,
    locationLat: input.locationLat || null,
    locationLng: input.locationLng || null,
    contactName: input.contactName || null,
    contactNumber: input.contactNumber || null,
    countryCode: input.countryCode,
    email: input.email || null,
    tags: input.tags || null,
    imageIds: input.imageIds || null,
    status: input.status,
    likes: 0,
    saves: 0,
    views: 0,
    createdAt: now,
    updatedAt: now,
    lastRenewedAt: now,
  };

  await db.insert(listingsTable).values(newListing).run();
  return { id, slug };
}

/**
 * Update an existing listing
 */
export async function updateListing(input: UpdateListingInput): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  const { id, ...data } = input;
  const updateData: Record<string, unknown> = { updatedAt: Math.floor(Date.now() / 1000) };

  if (data.title !== undefined) updateData.title = data.title;
  if (data.slug !== undefined) updateData.slug = data.slug;
  if (data.categoryId !== undefined) updateData.categoryId = data.categoryId;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.price !== undefined) updateData.price = data.price;
  if (data.condition !== undefined) updateData.condition = data.condition;
  if (data.location !== undefined) updateData.location = data.location;
  if (data.locationLat !== undefined) updateData.locationLat = data.locationLat;
  if (data.locationLng !== undefined) updateData.locationLng = data.locationLng;
  if (data.contactName !== undefined) updateData.contactName = data.contactName;
  if (data.contactNumber !== undefined) updateData.contactNumber = data.contactNumber;
  if (data.countryCode !== undefined) updateData.countryCode = data.countryCode;
  if (data.email !== undefined) updateData.email = data.email;
  if (data.tags !== undefined) updateData.tags = data.tags;
  if (data.imageIds !== undefined) updateData.imageIds = data.imageIds;
  if (data.status !== undefined) updateData.status = data.status;

  await db.update(listingsTable).set(updateData).where(eq(listingsTable.id, id)).run();
}

/**
 * Delete a listing
 */
export async function deleteListing(id: string): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  await db.delete(listingsTable).where(eq(listingsTable.id, id)).run();
}

/**
 * Get a single listing by ID
 */

export async function getListingById(id: string): Promise<ListingRecord | null> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  const row = await db
    .select()
    .from(listingsTable)
    .where(eq(listingsTable.id, id))
    .limit(1)
    .get();

  if (!row) return null;

  const parsedTags: string[] = row.tags ? (() => {
    try { return JSON.parse(row.tags as string); } catch { return []; }
  })() : [];

  const parsedImageIds: string[] = row.imageIds ? (() => {
    try { return JSON.parse(row.imageIds as string); } catch { return []; }
  })() : [];

  return { ...row, parsedTags, parsedImageIds };
}
