// API endpoint for a single product/SKU
// - GET: load one product (returns raw row including camelCase Drizzle fields)
// - PUT: update an existing product (authenticated users only)
// - DELETE: soft-delete a product (authenticated users only)
export const prerender = false;

import { getDb } from '@/lib/db';
import { products } from '@/db/schema';
import { and, eq, isNull } from 'drizzle-orm';
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

export async function GET({ params, url }: { params: { id: string }; url: URL }) {
  const db = await getDb();
  if (!db) {
    return jsonResponse({ success: false, error: { message: 'Database not available' } }, 500);
  }

  try {
    const { id } = params;
    if (!id) {
      return jsonResponse({ success: false, error: { message: 'Product id is required' } }, 400);
    }

    const includeDeleted = url.searchParams.get('includeDeleted') === 'true';
    const where = includeDeleted
      ? eq(products.id, id)
      : and(eq(products.id, id), isNull(products.deletedAt));

    const row = await db.select().from(products).where(where).limit(1).get();

    if (!row) {
      return jsonResponse({ success: false, error: { message: 'Product not found' } }, 404);
    }

    return jsonResponse(row);
  } catch (error) {
    console.error('[products/:id GET] error:', error);
    return jsonResponse({ success: false, error: { message: String(error) } }, 500);
  }
}

export async function PUT({ params, request }: { params: { id: string }; request: Request }) {
  // Server-side auth check - no client-controlled isAdmin bypass
  const user = await getUserFromRequest(request);
  if (!user || !['admin', 'super_admin', 'editor', 'user'].includes(user.role)) {
    console.warn('[products/:id PUT] Unauthorized access attempt');
    return jsonResponse({ success: false, error: { message: 'Unauthorized' } }, 401);
  }

  const db = await getDb();
  if (!db) {
    return jsonResponse({ success: false, error: { message: 'Database not available' } }, 500);
  }

  try {
    const { id } = params;
    if (!id) {
      return jsonResponse({ success: false, error: { message: 'Product id is required' } }, 400);
    }

    const existing = await db.select().from(products).where(eq(products.id, id)).limit(1).get();
    if (!existing) {
      return jsonResponse({ success: false, error: { message: 'Product not found' } }, 404);
    }

    const body = await request.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return jsonResponse({ success: false, error: { message: 'Invalid JSON body' } }, 400);
    }

    const updates: Record<string, unknown> = { updatedAt: Date.now() };
    const allowed = [
      'title',
      'description',
      'productType',
      'businessId',
      'categoryId',
      'featured',
      'active',
      'sortOrder',
      'priceFields',
      'specifications',
      'images',
    ] as const;

    for (const key of allowed) {
      if (!(key in body)) continue;
      const v = (body as Record<string, unknown>)[key];
      if ((key === 'priceFields' || key === 'specifications' || key === 'images') && v !== null && typeof v !== 'string') {
        updates[key] = JSON.stringify(v);
      } else {
        updates[key] = v;
      }
    }

    await db.update(products).set(updates).where(eq(products.id, id));

    const updated = await db.select().from(products).where(eq(products.id, id)).limit(1).get();
    console.log('[products/:id PUT] updated:', { id, userId: user.id });
    return jsonResponse({ success: true, data: updated });
  } catch (error) {
    console.error('[products/:id PUT] error:', error);
    return jsonResponse({ success: false, error: { message: String(error) } }, 500);
  }
}

export async function DELETE({ params, request }: { params: { id: string }; request: Request }) {
  // Server-side auth check - no client-controlled isAdmin bypass
  const user = await getUserFromRequest(request);
  if (!user || !['admin', 'super_admin', 'editor', 'user'].includes(user.role)) {
    console.warn('[products/:id DELETE] Unauthorized access attempt');
    return jsonResponse({ success: false, error: { message: 'Unauthorized' } }, 401);
  }

  const db = await getDb();
  if (!db) {
    return jsonResponse({ success: false, error: { message: 'Database not available' } }, 500);
  }

  try {
    const { id } = params;
    if (!id) {
      return jsonResponse({ success: false, error: { message: 'Product id is required' } }, 400);
    }

    const existing = await db.select().from(products).where(eq(products.id, id)).limit(1).get();
    if (!existing) {
      return jsonResponse({ success: false, error: { message: 'Product not found' } }, 404);
    }

    // Soft delete: set deletedAt to current timestamp
    await db.update(products).set({ deletedAt: Date.now(), updatedAt: Date.now() }).where(eq(products.id, id));
    console.log('[products/:id DELETE] soft-deleted:', { id, userId: user.id });

    return jsonResponse({ success: true });
  } catch (error) {
    console.error('[products/:id DELETE] error:', error);
    return jsonResponse({ success: false, error: { message: String(error) } }, 500);
  }
}