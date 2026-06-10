/**
 * Admin Products (SKUs) Query Functions
 */
import { getDb } from '@/lib/db';
import { products, businesses } from '@/db/schema';
import { desc, eq, like, or, and } from 'drizzle-orm';

export interface ProductData {
  id: string;
  businessId: string | null;
  categoryId: string | null;
  title: string | null;
  slug: string | null;
  description: string | null;
  productType: string | null;
  priceFields: string | null;
  specifications: string | null;
  images: string | null;
  featured: number | null;
  active: number | null;
  sortOrder: number | null;
  views: number | null;
  likes: number | null;
  saves: number | null;
  shares: number | null;
  deletedAt: number | null;
  createdAt: number | null;
  updatedAt: number | null;
  // Joined
  businessTitle?: string;
}

export interface BusinessOption {
  value: string;
  label: string;
}

export async function getAdminProducts(): Promise<ProductData[]> {
  const db = await getDb();
  if (!db) return [];

  const rows = await db
    .select({
      id: products.id,
      businessId: products.businessId,
      categoryId: products.categoryId,
      title: products.title,
      slug: products.slug,
      description: products.description,
      productType: products.productType,
      priceFields: products.priceFields,
      specifications: products.specifications,
      images: products.images,
      featured: products.featured,
      active: products.active,
      sortOrder: products.sortOrder,
      views: products.views,
      likes: products.likes,
      saves: products.saves,
      shares: products.shares,
      deletedAt: products.deletedAt,
      createdAt: products.createdAt,
      updatedAt: products.updatedAt,
      businessTitle: businesses.title,
    })
    .from(products)
    .leftJoin(businesses, eq(products.businessId, businesses.id))
    .orderBy(desc(products.createdAt))
    .all();

  return rows;
}

export async function getAdminBusinessOptions(): Promise<BusinessOption[]> {
  const db = await getDb();
  if (!db) return [];

  const rows = await db
    .select({ id: businesses.id, title: businesses.title })
    .from(businesses)
    .orderBy(businesses.title)
    .all();

  return rows.map(b => ({ value: b.id, label: b.title || 'Untitled' }));
}