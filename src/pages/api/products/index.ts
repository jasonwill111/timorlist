// API endpoint for products/SKUs
// - GET: list products (optionally filtered by businessId). Returns ALL products when no filter.
// - POST: create a new product (authenticated users only).
export const prerender = false;

import { getDb } from '@/lib/db';
import { products } from '@/db/schema';
import { and, eq, isNull, desc, type SQL } from 'drizzle-orm';
import { initAuth } from '@/lib/auth';

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

async function getUserFromRequest(request: Request): Promise<{ id: string; role: string } | null> {
  const cookieHeader = request.headers.get('cookie') || '';
  const tokenMatch = cookieHeader.match(/better-auth\.session_token=([^;]+)/);
  if (!tokenMatch?.[1]) return null;

  try {
    const authApi = (await initAuth()).api;
    const session = await authApi.getSession({
      headers: { cookie: `better-auth.session_token=${tokenMatch[1]}` },
    });
    return session?.user ?? null;
  } catch {
    return null;
  }
}

export async function GET({ url }: { url: URL }) {
  const db = await getDb();
  if (!db) {
    return jsonResponse({ success: false, error: { message: 'Database not available' } }, 500);
  }

  try {
    const businessId = url.searchParams.get('businessId');
    const includeDeleted = url.searchParams.get('includeDeleted') === 'true';

    const conditions: SQL[] = [];
    if (businessId) {
      conditions.push(eq(products.businessId, businessId));
    }
    // Default: hide soft-deleted rows
    if (!includeDeleted) {
      conditions.push(isNull(products.deletedAt));
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const rows = await db
      .select()
      .from(products)
      .where(where)
      .orderBy(desc(products.createdAt))
      .all();

    return jsonResponse({ success: true, data: rows });
  } catch (error) {
    console.error('[products GET] error:', error);
    return jsonResponse({ success: false, error: { message: String(error) } }, 500);
  }
}

export async function POST({ request }: { request: Request }) {
  // Server-side auth check - no client-controlled isAdmin bypass
  const user = await getUserFromRequest(request);
  if (!user || !['admin', 'super_admin', 'editor', 'user'].includes(user.role)) {
    console.warn('[products POST] Unauthorized access attempt');
    return jsonResponse({ success: false, error: { message: 'Unauthorized' } }, 401);
  }

  const db = await getDb();
  if (!db) {
    return jsonResponse({ success: false, error: { message: 'Database not available' } }, 500);
  }

  try {
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return jsonResponse({ success: false, error: { message: 'Invalid JSON body' } }, 400);
    }

    const { title, businessId, categoryId, productType, priceFields, specifications, description, images } = body as Record<string, unknown>;

    if (typeof title !== 'string' || !title.trim()) {
      return jsonResponse({ success: false, error: { message: 'title is required' } }, 400);
    }
    if (typeof businessId !== 'string' || !businessId) {
      return jsonResponse({ success: false, error: { message: 'businessId is required' } }, 400);
    }
    if (typeof categoryId !== 'string' || !categoryId) {
      return jsonResponse({ success: false, error: { message: 'categoryId is required' } }, 400);
    }

    const now = Date.now();
    const id = crypto.randomUUID();
    const slug = title.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').slice(0, 80) || 'item';
    const productSlug = `${slug}-${id.slice(0, 8)}`;

    const priceFieldsValue = priceFields === null || priceFields === undefined ? null : typeof priceFields === 'string' ? priceFields : JSON.stringify(priceFields);
    const specificationsValue = specifications === null || specifications === undefined ? null : typeof specifications === 'string' ? specifications : JSON.stringify(specifications);
    const imagesValue = images === null || images === undefined ? '[]' : typeof images === 'string' ? images : JSON.stringify(images);

    await db.insert(products).values({
      id,
      businessId,
      categoryId,
      title: title.trim(),
      slug: productSlug,
      description: typeof description === 'string' ? description : null,
      productType: typeof productType === 'string' ? productType : 'product',
      priceFields: priceFieldsValue,
      specifications: specificationsValue,
      images: imagesValue,
      active: 1,
      featured: 0,
      sortOrder: 0,
      views: 0,
      likes: 0,
      saves: 0,
      shares: 0,
      deletedAt: null,
      createdAt: now,
      updatedAt: now,
    });

    const created = await db.select().from(products).where(eq(products.id, id)).limit(1).get();
    console.log('[products POST] created:', { id, slug: productSlug, userId: user.id });

    return jsonResponse({ success: true, data: created ?? { id, slug: productSlug } }, 201);
  } catch (error) {
    console.error('[products POST] error:', error);
    return jsonResponse({ success: false, error: { message: String(error) } }, 500);
  }
}