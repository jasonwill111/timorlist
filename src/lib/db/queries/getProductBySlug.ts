import { getRawDb } from '../../db';

export interface ProductWithDetails {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  productType: string | null;
  priceFields: string | null;
  specifications: string | null;
  images: string | null;
  featured: number | null;
  active: number | null;
  views: number | null;
  likes: number | null;
  businessId: string;
  categoryId: string;
  createdAt: number | null;
  updatedAt: number | null;
  // Joined fields
  businessTitle?: string;
  businessSlug?: string;
  businessContactNumber?: string;
  businessCountryCode?: string;
  businessEmail?: string;
  categoryName?: string;
  images_list?: Array<{ id: string; r2Key: string; filename: string | null; alt: string | null }>;
  priceData?: { price: string | number; currency?: string; unit?: string } | null;
}

export async function getProductBySlug(slug: string): Promise<ProductWithDetails | null> {
  const db = await getRawDb();
  if (!db) return null;

  try {
    const product = await db
      .prepare(`
        SELECT id, title, slug, description, product_type as productType,
               price_fields as priceFields, specifications, images,
               featured, active, views, likes,
               business_id as businessId, category_id as categoryId,
               created_at as createdAt, updated_at as updatedAt
        FROM products
        WHERE slug = ? AND (deleted_at IS NULL OR deleted_at = 0)
        LIMIT 1
      `)
      .bind(slug)
      .first() as ProductWithDetails | null;

    if (!product) return null;

    // Fetch business
    if (product.businessId) {
      const biz = await db
        .prepare('SELECT title, slug, contact_name as contactNumber, country_code as countryCode, email FROM businesses WHERE id = ? LIMIT 1')
        .bind(product.businessId)
        .first() as { title: string; slug: string; contactNumber: string | null; countryCode: string | null; email: string | null } | null;
      if (biz) {
        product.businessTitle = biz.title;
        product.businessSlug = biz.slug;
        product.businessContactNumber = biz.contactNumber;
        product.businessCountryCode = biz.countryCode;
        product.businessEmail = biz.email;
      }
    }

    // Fetch category
    if (product.categoryId) {
      const cat = await db
        .prepare('SELECT name FROM product_categories WHERE id = ? LIMIT 1')
        .bind(product.categoryId)
        .first() as { name: string } | null;
      if (cat) product.categoryName = cat.name;
    }

    // Fetch images
    if (product.images) {
      try {
        const imageIds: string[] = typeof product.images === 'string'
          ? JSON.parse(product.images) : [];
        if (imageIds.length > 0) {
          const placeholders = imageIds.map(() => '?').join(',');
          const result = await db
            .prepare(`SELECT id, r2_key as r2Key, filename, alt FROM media WHERE id IN (${placeholders}) AND (deleted_at IS NULL OR deleted_at = 0)`)
            .bind(...imageIds)
            .all();
          product.images_list = (result.results as unknown as ProductWithDetails['images_list']) || [];
        }
      } catch (e) {
        console.error('Failed to parse product images:', e);
      }
    }

    // Parse price fields
    if (product.priceFields && typeof product.priceFields === 'string') {
      try {
        product.priceData = JSON.parse(product.priceFields);
      } catch {}
    }

    return product;
  } catch (e) {
    console.error('getProductBySlug failed:', e instanceof Error ? e.message : String(e));
    return null;
  }
}
