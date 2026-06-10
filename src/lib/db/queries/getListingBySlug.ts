import { getRawDb } from '@/lib/db';

interface Listing {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  price: string | null;
  condition: string | null;
  location: string | null;
  address: string | null;
  contactName: string | null;
  contactNumber: string | null;
  countryCode: string | null;
  email: string | null;
  imageIds: string | null;
  tags: string | null;
  likes: number | null;
  saves: number | null;
  views: number | null;
  status: string | null;
  categoryId: string | null;
  createdAt: number | null;
  updatedAt: number | null;
}

interface ListingImages {
  id: string;
  r2_key: string;
  alt: string | null;
}

interface ListingResult {
  listing: Listing | null;
  category: { name: string; parentId: string | null } | null;
  listingType: string | null;
  images: ListingImages[];
}

export async function getListingBySlug(slug: string): Promise<ListingResult> {
  if (!slug) return { listing: null, category: null, listingType: null, images: [] };

  const db = await getRawDb();
  if (!db) return { listing: null, category: null, listingType: null, images: [] };

  try {
    const listing = await db.prepare(`
      SELECT id, title, slug, description, price, condition, location, address,
             contact_name as contactName, contact_number as contactNumber, country_code as countryCode, email,
             image_ids as imageIds, tags,
             likes, saves, views, status, category_id as categoryId,
             created_at as createdAt, updated_at as updatedAt
      FROM listings WHERE slug = ? LIMIT 1
    `).bind(slug).first() as Listing | null;

    if (!listing) return { listing: null, category: null, listingType: null, images: [] };

    let category: { name: string; parentId: string | null } | null = null;
    let listingType: string | null = null;
    if (listing.categoryId) {
      category = await db.prepare('SELECT name, parent_id as parentId FROM listing_categories WHERE id = ? LIMIT 1')
        .bind(listing.categoryId).first() as { name: string; parentId: string | null } | null;
      if (category?.parentId) listingType = category.parentId;
    }

    let images: ListingImages[] = [];
    if (listing.imageIds) {
      try {
        const ids: string[] = listing.imageIds ? JSON.parse(listing.imageIds) : [];
        if (Array.isArray(ids) && ids.length > 0) {
          const placeholders = ids.map(() => '?').join(',');
          const imgsResult = await db.prepare(
            `SELECT id, r2_key, alt FROM media WHERE id IN (${placeholders})`
          ).bind(...ids).all();
          images = (imgsResult.results as unknown as ListingImages[]) || [];
        }
      } catch {
        images = [];
      }
    }

    return { listing, category, listingType, images };
  } catch (e) {
    console.error('[getListingBySlug] DB error:', e);
    return { listing: null, category: null, listingType: null, images: [] };
  }
}