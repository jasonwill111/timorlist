// API endpoint for admin SKU/product listing
// Returns ALL products (including soft-deleted) for the admin panel.
// Requires admin/editor role via session cookie.
export const prerender = false;

import { getDb } from '@/lib/db';
import { products } from '@/db/schema';
import { desc } from 'drizzle-orm';
import { initAuth } from '@/lib/auth';
import { jsonResponse, unauthorizedResponse, errorResponse } from '@/lib/api-helpers';

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

export async function GET({ request }: { request: Request }) {
  const user = await getUserFromRequest(request);
  if (!user || !['admin', 'super_admin', 'editor'].includes(user.role)) {
    console.warn('[admin/skus GET] Unauthorized access attempt');
    return unauthorizedResponse();
  }

  const db = await getDb();
  if (!db) {
    return errorResponse('Database not available', 'SERVER_DB_ERROR', 500);
  }

  try {
    // Admin view: show all products including soft-deleted, newest first.
    const rows = await db
      .select()
      .from(products)
      .orderBy(desc(products.createdAt))
      .all();

    return jsonResponse({ success: true, data: rows });
  } catch (error) {
    console.error('[admin/skus GET] error:', error);
    return errorResponse(String(error), 'SERVER_ERROR', 500);
  }
}
