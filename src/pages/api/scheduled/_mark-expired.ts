// Scheduled job - Check for expired subscriptions
// NOTE: Subscription status is now derived from orders table, not cached on businesses.
// This job is kept for monitoring purposes but no longer updates business records.
export const prerender = false;

import { getDb } from '@/lib/db';
import { businesses, orders } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { GRACE_PERIOD_DAYS } from '@/lib/subscription';

export async function GET({ request }: { params: Record<string, string>; request: Request }) {
  // Verify this is an internal/scheduled call
  const authHeader = request.headers.get('authorization');
  const expectedToken = import.meta.env.CLEANUP_SECRET;

  if (authHeader !== `Bearer ${expectedToken}`) {
    return new Response(JSON.stringify({
      success: false,
      error: { message: 'Unauthorized' }
    }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }

  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const now = Date.now();

  try {
    // Count businesses with expired subscriptions (those past grace period)
    const allBusinesses = await db.select({ id: businesses.id })
      .from(businesses)
      .all();

    let expiredCount = 0;

    for (const business of allBusinesses) {
      const activeOrder = await db.select({
        planExpiresAt: orders.planExpiresAt,
      })
        .from(orders)
        .where(eq(orders.typeId, business.id))
        .where(eq(orders.type, 'business'))
        .where(eq(orders.status, 'paid'))
        .orderBy(desc(orders.planExpiresAt))
        .limit(1)
        .get();

      if (activeOrder?.planExpiresAt) {
        const graceEnd = activeOrder.planExpiresAt + (GRACE_PERIOD_DAYS * 24 * 60 * 60 * 1000);
        if (graceEnd < now) {
          expiredCount++;
        }
      }
    }

    return new Response(JSON.stringify({
      success: true,
      data: {
        executedAt: new Date().toISOString(),
        note: 'Subscription status is now derived from orders table',
        totalBusinesses: allBusinesses.length,
        expiredPastGracePeriod: expiredCount,
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[Mark Expired] Job failed:', error);
    return new Response(JSON.stringify({
      success: false,
      error: { message: 'Job failed', details: String(error) }
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// Also support POST for easier cron triggering
export async function POST({ request }: { params: Record<string, string>; request: Request }) {
  return GET({ request, params: {} });
}