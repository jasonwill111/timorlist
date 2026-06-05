// API endpoint for a single product/SKU
// - GET: load one product (returns raw row including camelCase Drizzle fields)
// - PUT: update an existing product (authenticated users only)
// - DELETE: soft-delete a product (authenticated users only)
export const prerender = false;

import { getDb } from '@/lib/db';
import { products } from '@/db/schema';
import { and, eq, isNull } from 'drizzle-orm';
import { initAuth } from '@/lib/auth';
import { jsonResponse, unauthorizedResponse, notFoundResponse, badRequestResponse, errorResponse } from '@/lib/api-helpers';

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
    return errorResponse('Database not available', 'SERVER_DB_ERROR', 500);
  }

  try {
    const { id } = params;
    if (!id) {
      return badRequestResponse('Product id is required');
    }

    const includeDeleted = url.searchParams.get('includeDeleted') === 'true';
    const where = includeDeleted
      ? eq(products.id, id)
      : and(eq(products.id, id), isNull(products.deletedAt));

    const row = await db.select().from(products).where(where).limit(1).get();

    if (!row) {
      return notFoundResponse('Product not found');
    }

    return jsonResponse(row);
  } catch (error) {
    console.error('[products/:id GET] error:', error);
    return errorResponse(String(error), 'SERVER_ERROR', 500);
  }
}

export async function PUT({ params, request }: { params: { id: string }; request: Request }) {
  // Server-side auth check - no client-controlled isAdmin bypass
  const user = await getUserFromRequest(request);
  if (!user || !['admin', 'super_admin', 'editor', 'user'].includes(user.role)) {
    console.warn('[products/:id PUT] Unauthorized access attempt');
    return unauthorizedResponse();
  }

  const db = await getDb();
  if (!db) {
    return errorResponse('Database not available', 'SERVER_DB_ERROR', 500);
  }

  try {
    const { id } = params;
    if (!id) {
      return badRequestResponse('Product id is required');
    }

    const existing = await db.select().from(products).where(eq(products.id, id)).limit(1).get();
    if (!existing) {
      return notFoundResponse('Product not found');
    }

    const body = await request.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return badRequestResponse('Invalid JSON body');
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
    return errorResponse(String(error), 'SERVER_ERROR', 500);
  }
}

export async function DELETE({ params, request }: { params: { id: string }; request: Request }) {
  // Server-side auth check - no client-controlled isAdmin bypass
  const user = await getUserFromRequest(request);
  if (!user || !['admin', 'super_admin', 'editor', 'user'].includes(user.role)) {
    console.warn('[products/:id DELETE] Unauthorized access attempt');
    return unauthorizedResponse();
  }

  const db = await getDb();
  if (!db) {
    return errorResponse('Database not available', 'SERVER_DB_ERROR', 500);
  }

  try {
    const { id } = params;
    if (!id) {
      return badRequestResponse('Product id is required');
    }

    const existing = await db.select().from(products).where(eq(products.id, id)).limit(1).get();
    if (!existing) {
      return notFoundResponse('Product not found');
    }

    // Soft delete: set deletedAt to current timestamp
    await db.update(products).set({ deletedAt: Date.now(), updatedAt: Date.now() }).where(eq(products.id, id));
    console.log('[products/:id DELETE] soft-deleted:', { id, userId: user.id });

    return jsonResponse({ success: true });
  } catch (error) {
    console.error('[products/:id DELETE] error:', error);
    return errorResponse(String(error), 'SERVER_ERROR', 500);
  }
}
