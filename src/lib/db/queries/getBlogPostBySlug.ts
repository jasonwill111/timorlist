import { getDb } from '@/lib/db';
import { blogPosts } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { formatUnixTimestamp } from '@/lib/utils';

export async function getBlogPostBySlug(slug: string) {
  if (!slug) return null;
  const db = await getDb();
  if (!db) return null;

  try {
    const post = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.slug, slug))
      .get();

    if (!post || post.status !== 'published') return null;

    return {
      ...post,
      tags: post.tags ? JSON.parse(post.tags as string) : [],
      publishDate: formatUnixTimestamp(post.publishedAt ?? post.createdAt),
    };
  } catch (e) {
    console.error('[getBlogPostBySlug] DB error:', e);
    return null;
  }
}