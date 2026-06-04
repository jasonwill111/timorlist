// API endpoint for admin SKU/product listing
// Returns ALL products (including soft-deleted) for the admin panel.
// Requires admin/editor role via session cookie.
export const prerender = false;

import { getDb } from '@/lib/db';
import { products } from '@/db/schema';
import { desc } from 'drizzle-orm';
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

export async function GET({ request }: { request: Request }) {
  // Server-side auth check
  const user = await getUserFromRequest(request);
  if (!user || !['admin', 'super_admin', 'editor'].includes(user.role)) {
    console.warn('[admin/skus GET] Unauthorized access attempt');
    return jsonResponse({ success: false, error: { message: 'Unauthorized' } }, 401);
  }

  const db = await getDb();
  if (!db) {
    return jsonResponse({ success: false, error: { message: 'Database not available' } }, 500);
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
    return jsonResponse({ success: false, error: { message: String(error) } }, 500);
  }
}