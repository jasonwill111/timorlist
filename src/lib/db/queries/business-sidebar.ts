/**
 * Business sidebar data layer
 * Extracted from BusinessSidebar.astro for separation of concerns.
 */
import { getDb } from "@/lib/db";
import { businessCategories } from "@/db/schema";
import { eq } from "drizzle-orm";

export type BusinessSidebarData = {
  category: { id: string; name: string } | null;
};

export async function getBusinessSidebarData(
  categoryId: string | null,
): Promise<BusinessSidebarData> {
  if (!categoryId) {
    return { category: null };
  }

  try {
    const db = await getDb();
    if (!db) return { category: null };

    const category = await db
      .select()
      .from(businessCategories)
      .where(eq(businessCategories.id, categoryId))
      .get();

    return {
      category: category ? { id: category.id, name: category.name } : null,
    };
  } catch (e) {
    console.error("[BusinessSidebar] DB error:", e);
    return { category: null };
  }
}
