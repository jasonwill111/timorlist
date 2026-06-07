/**
 * Admin Blogs Query Functions
 */
import { getDb } from '@/lib/db';
import { blogPosts } from '@/db/schema';
import { desc } from 'drizzle-orm';

export interface BlogPostData {
  id: string;
  title: string | null;
  slug: string | null;
  excerpt: string | null;
  content: string | null;
  status: string | null;
  tags: string | null;
  coverImageId: string | null;
  authorName: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  canonicalUrl: string | null;
  publishedAt: number | null;
  createdAt: number | null;
  updatedAt: number | null;
}

export async function getAdminBlogPosts(limit = 100): Promise<BlogPostData[]> {
  const db = await getDb();
  if (!db) return [];

  const rows = await db
    .select()
    .from(blogPosts)
    .orderBy(desc(blogPosts.createdAt))
    .limit(limit)
    .all();

  return rows;
}