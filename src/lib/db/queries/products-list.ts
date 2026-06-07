/**
 * Products list data layer
 * Extracted from ProductsIsland.astro for separation of concerns.
 * Handles paginated, filterable, sortable products list + business filter dropdown.
 */
import { getDb, getRawDb } from "@/lib/db";
import { products, businesses } from "@/db/schema";
import { desc, eq, like, asc, and } from "drizzle-orm";

export type BusinessSummary = {
  id: string;
  title: string;
  slug: string;
};

export type ProductListItem = {
  id: string;
  title: string;
  slug: string;
  priceFields: string | null;
  productType: string | null;
  businessId: string | null;
};

export type ProductListParams = {
  search: string;
  businessId: string;
  sort: 'recent' | 'name';
  page: number;
  limit: number;
};

export type ProductListResult = {
  products: ProductListItem[];
  total: number;
  businesses: BusinessSummary[];
  totalPages: number;
};

export async function getProductList(
  params: ProductListParams,
): Promise<ProductListResult> {
  const { search, businessId, sort, page, limit } = params;
  const offset = (page - 1) * limit;
  const empty: ProductListResult = {
    products: [],
    total: 0,
    businesses: [],
    totalPages: 0,
  };

  try {
    const db = await getDb();
    const rawDb = await getRawDb();
    if (!db) return empty;

    // Fetch all businesses for filter dropdown
    const allBusinesses = await db
      .select({
        id: businesses.id,
        title: businesses.title,
        slug: businesses.slug,
      })
      .from(businesses)
      .where(eq(businesses.status, 'active'))
      .orderBy(asc(businesses.title))
      .limit(100)
      .all();

    // Build WHERE conditions
    const conditions = [eq(products.active, 1)];
    if (search) conditions.push(like(products.title, `%${search}%`));
    if (businessId) conditions.push(eq(products.businessId, businessId));

    // Count total
    let total = 0;
    if (rawDb) {
      try {
        const stmt = rawDb.prepare(
          'SELECT COUNT(*) as count FROM products WHERE active = 1 AND deleted_at IS NULL',
        );
        const result = (await stmt.first()) as { count?: number } | null;
        total = result?.count ?? 0;
      } catch (e) {
        console.error('[ProductsList] count error:', e);
      }
    }

    // Fetch paginated products
    let query = db
      .select({
        id: products.id,
        title: products.title,
        slug: products.slug,
        priceFields: products.priceFields,
        productType: products.productType,
        businessId: products.businessId,
      })
      .from(products)
      .where(and(...conditions));

    query = sort === 'name'
      ? query.orderBy(asc(products.title))
      : query.orderBy(desc(products.createdAt));

    const paginatedProducts = await query.limit(limit).offset(offset).all();

    return {
      products: paginatedProducts,
      total,
      businesses: allBusinesses,
      totalPages: Math.ceil(total / limit),
    };
  } catch (e) {
    console.error('[ProductsList] DB error:', e);
    return empty;
  }
}
