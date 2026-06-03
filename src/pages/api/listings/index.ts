// API endpoint to get all listings (classified ads) with filters
export const prerender = false;

import { getDb } from '@/lib/db';
import { listings, listingCategories } from '@/db/schema';
import { eq, desc, like, and, or, ne, type SQL } from 'drizzle-orm';
import { checkRateLimit, getRateLimitHeaders } from '@/lib/rate-limit';
import { PaginationSchema } from '@/lib/validation';

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

function getClientIP(request: Request): string {
  return request.headers.get('cf-connecting-ip') ||
         request.headers.get('x-forwarded-for')?.split(',')[0] ||
         'unknown';
}

export async function GET({ url, request }: { url: URL; request: Request }) {
  try {
    const db = await getDb();
    if (!db) throw new Error("Database not available");
    // Rate limiting
    const clientIP = getClientIP(request);
    const rateLimit = await checkRateLimit(`listings:${clientIP}`);
    if (!rateLimit.allowed) {
      return new Response(JSON.stringify({
        success: false,
        error: { message: 'Rate limit exceeded', resetIn: rateLimit.resetIn }
      }), {
        status: 429,
        headers: { 'Content-Type': 'application/json', ...getRateLimitHeaders(rateLimit) },
      });
    }
    const search = url.searchParams.get('search') || '';
    const category = url.searchParams.get('category') || '';
    const sort = url.searchParams.get('sort') || 'recent';
    const { page, limit } = PaginationSchema.parse({
      page: url.searchParams.get('page') || '1',
      limit: url.searchParams.get('limit') || '20',
    });
    const offset = (page - 1) * limit;

    // Get category ID if filtering
    let categoryId = '';
    if (category) {
      const cats = await db
        .select()
        .from(listingCategories)
        .where(like(listingCategories.slug, category))
        .all();
      if (cats.length > 0) {
        categoryId = cats[0].id;
      }
    }
    // Build conditions - show published or active listings (both statuses are valid in DB)
    // Use UNION to combine and limit results at the database level
    const maxResults = 1000; // Safety cap to prevent memory issues
    const publishedResults = await db.select()
      .from(listings)
      .where(eq(listings.status, 'published'))
      .limit(maxResults)
      .all();
    const activeResults = await db.select()
      .from(listings)
      .where(eq(listings.status, 'active'))
      .limit(maxResults)
      .all();
    // Combine both results and deduplicate by id
    const resultsMap = new Map<string, typeof publishedResults[0]>();
    publishedResults.forEach(r => resultsMap.set(r.id, r));
    activeResults.forEach(r => resultsMap.set(r.id, r));
    const results = Array.from(resultsMap.values());
    // Apply search filter
    let filteredResults = results;
    if (search) {
      const searchLower = search.toLowerCase();
      filteredResults = filteredResults.filter(r =>
        r.title.toLowerCase().includes(searchLower) ||
        (r.description && r.description.toLowerCase().includes(searchLower)) ||
        (r.location && r.location.toLowerCase().includes(searchLower))
      );
    }
    // Apply category filter
    if (categoryId) {
      filteredResults = filteredResults.filter(r => r.categoryId === categoryId);
    }
    // Apply sorting
    switch (sort) {
      case 'recent':
        filteredResults.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        break;
      case 'price-low':
        filteredResults.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-high':
        filteredResults.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'popular':
        filteredResults.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
    }
    // Apply pagination
    const paginated = filteredResults.slice(offset, offset + limit);
    const total = filteredResults.length;

    // Get category names
    const categoryMap = new Map<string, string>();
    const allCategories = await db.select().from(listingCategories).all() as { id: string; name: string }[];
    allCategories.forEach((cat) => categoryMap.set(cat.id, cat.name));

    const responseData = paginated.map((listing) => ({
      ...listing,
      categoryName: categoryMap.get(listing.categoryId || '') || 'Listing',
    }));

    return new Response(JSON.stringify({
      success: true,
      data: responseData,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[API/listings] Error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: { message: getErrorMessage(error) }
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}