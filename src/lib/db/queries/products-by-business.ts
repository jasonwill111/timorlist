/**
 * Products section data layer
 * Extracted from ProductsSection.astro for separation of concerns.
 */
import { getDb } from "@/lib/db";
import { products } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export type ProductSummary = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  priceFields: string | null;
  specifications: string | null;
  createdAt: Date;
};

export async function getProductsByBusiness(
  businessId: string,
): Promise<ProductSummary[]> {
  try {
    const db = await getDb();
    if (!db) return [];

    return await db
      .select()
      .from(products)
      .where(eq(products.businessId, businessId))
      .orderBy(desc(products.createdAt))
      .all();
  } catch (e) {
    console.error("[ProductsSection] DB error:", e);
    return [];
  }
}
