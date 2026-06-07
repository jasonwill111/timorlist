/**
 * Homepage featured content queries
 * Extracted from HomepageContent.astro for separation of concerns.
 * Data layer only — UI lives in HomepageTabs.astro
 */
import { eq, desc, or } from "drizzle-orm";
import {
  businesses,
  listings,
  nonProfits,
  publicSectors,
  listingCategories,
} from "@/db/schema";
import { getDb } from "@/lib/db";

export type FeaturedBusiness = {
  id: string;
  title: string;
  slug: string;
  category: string;
  rating: number;
  reviews: number;
  likes: number;
  location: string;
  tag: string;
  tags: string[];
  profileImageId: string | null;
  entityType: string;
  entityTypeDisplay: string;
  isNew: boolean;
};

export type FeaturedListing = {
  id: string;
  title: string;
  slug: string;
  price: string;
  listingType: string;
  location: string;
  imageIds: string[];
  likes: number;
};

const TYPE_MAP: Record<string, string> = {
  vehicles: "vehicle",
  "property-sale": "property",
  "for-sale": "product",
  jobs: "job",
  services: "service",
  rentals: "rental",
  wanted: "wanted",
  community: "community",
  "pets-animals": "pet",
  agriculture: "agriculture",
};

function safeJsonParse<T>(str: unknown, fallback: T): T {
  if (!str || typeof str !== "string") return fallback;
  try {
    return JSON.parse(str) as T;
  } catch {
    return fallback;
  }
}

async function selectFeaturedEntity(table: typeof businesses, display: string, slug: string) {
  const db = await getDb();
  if (!db) return [] as FeaturedBusiness[];

  const result = await db
    .select({
      id: table.id,
      title: table.title,
      slug: table.slug,
      tags: table.tags,
      likes: table.likes,
      status: table.status,
      categoryId: table.categoryId,
      profileImageId: table.profileImageId,
    })
    .from(table)
    .where(
      or(
        eq(table.status, "active"),
        eq(table.status, "live"),
        eq(table.status, "published"),
      ),
    )
    .orderBy(desc(table.likes))
    .limit(12);

  return result.map((b) => {
    const tags = safeJsonParse(b.tags, [] as string[]);
    return {
      id: b.id,
      title: b.title,
      slug: b.slug,
      category: display,
      rating: 0,
      reviews: 0,
      likes: b.likes || 0,
      location: "Dili",
      tag: tags[0] || "",
      tags,
      profileImageId: b.profileImageId,
      entityType: slug,
      entityTypeDisplay: display,
      isNew: false,
    };
  });
}

export async function getFeaturedBusinesses(): Promise<FeaturedBusiness[]> {
  return selectFeaturedEntity(businesses, "Business", "business");
}

export async function getFeaturedPublicSectors(): Promise<FeaturedBusiness[]> {
  return selectFeaturedEntity(publicSectors, "Public Sector", "publicsector");
}

export async function getFeaturedNonProfits(): Promise<FeaturedBusiness[]> {
  return selectFeaturedEntity(nonProfits, "Non-Profit", "nonprofit");
}

export async function getFeaturedListings(): Promise<FeaturedListing[]> {
  const db = await getDb();
  if (!db) return [] as FeaturedListing[];

  const allListings = await db
    .select({ listing: listings, category: listingCategories })
    .from(listings)
    .leftJoin(listingCategories, eq(listings.categoryId, listingCategories.id))
    .limit(12)
    .all();

  return allListings
    .filter(
      (l) => l.listing.status === "active" || l.listing.status === "published",
    )
    .map((l) => {
      const imageIds = safeJsonParse(l.listing.imageIds, [] as string[]);
      const categoryParentSlug = l.category?.slug || "for-sale";
      const listingType = TYPE_MAP[categoryParentSlug] || "product";
      return {
        id: l.listing.id,
        title: l.listing.title,
        slug: l.listing.slug,
        price: l.listing.price || "",
        listingType,
        location: l.listing.location || "",
        imageIds,
        likes: l.listing.likes || 0,
      };
    });
}

export type HomepageContent = {
  businesses: FeaturedBusiness[];
  listings: FeaturedListing[];
  publicSectors: FeaturedBusiness[];
  nonProfits: FeaturedBusiness[];
};

export async function getHomepageContent(): Promise<HomepageContent> {
  const [businesses, listings, publicSectors, nonProfits] = await Promise.all([
    getFeaturedBusinesses(),
    getFeaturedListings(),
    getFeaturedPublicSectors(),
    getFeaturedNonProfits(),
  ]);
  return { businesses, listings, publicSectors, nonProfits };
}
