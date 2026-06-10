/**
 * Blog Listing Query Functions
 * 统一 blog 列表查询
 */
import { getDb } from '@/lib/db';
import { blogPosts, blogCategories } from '@/db/schema';
import { eq, desc, and, like, sql } from 'drizzle-orm';

export interface BlogPostListing {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImageId: string | null;
  authorName: string | null;
  status: string;
  tags: string | null;
  publishedAt: number | null;
  createdAt: number | null;
}

export async function getBlogCategories(): Promise<Array<{ id: string; name: string; slug: string }>> {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db
      .select({ id: blogCategories.id, name: blogCategories.name, slug: blogCategories.slug })
      .from(blogCategories)
      .where(eq(blogCategories.isActive, true))
      .all();
  } catch {
    return [];
  }
}

export async function getBlogListing(
  categorySlug: string = '',
  page: number = 1,
  limit: number = 12,
) {
  const db = await getDb();
  if (!db) return { posts: [], categories: [], total: 0, totalPages: 0 };

  const offset = (page - 1) * limit;

  try {
    // Find category ID from slug
    let categoryId: string | null = null;
    if (categorySlug) {
      const foundCategory = await db
        .select()
        .from(blogCategories)
        .where(eq(blogCategories.slug, categorySlug))
        .get();
      if (foundCategory) {
        categoryId = (foundCategory as { id: string }).id;
      }
    }

    // Fetch categories
    const categories = await db
      .select({ id: blogCategories.id, name: blogCategories.name, slug: blogCategories.slug })
      .from(blogCategories)
      .where(eq(blogCategories.isActive, true))
      .all();

    // Build WHERE conditions
    const conditions = [eq(blogPosts.status, 'published')];
    if (categoryId) conditions.push(eq(blogPosts.categoryId, categoryId));

    // Count total
    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(blogPosts)
      .where(and(...conditions as any))
      .get();
    const total = countResult?.count || 0;

    // Fetch paginated posts
    const posts = await db
      .select({
        id: blogPosts.id,
        title: blogPosts.title,
        slug: blogPosts.slug,
        excerpt: blogPosts.excerpt,
        coverImageId: blogPosts.coverImageId,
        authorName: blogPosts.authorName,
        status: blogPosts.status,
        tags: blogPosts.tags,
        publishedAt: blogPosts.publishedAt,
        createdAt: blogPosts.createdAt,
      })
      .from(blogPosts)
      .where(and(...conditions as any))
      .orderBy(desc(blogPosts.publishedAt))
      .limit(limit)
      .offset(offset)
      .all();

    return { posts, categories, total, totalPages: Math.ceil(total / limit) };
  } catch {
    return { posts: [], categories: [], total: 0, totalPages: 0 };
  }
}
