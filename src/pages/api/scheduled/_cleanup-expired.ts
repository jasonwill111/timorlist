// Scheduled cleanup job - Delete expired listings after grace period
export const prerender = false;
import { getDb } from '@/lib/db';
import { businesses, products, orders } from '@/db/schema';
import { eq, lt, and, sql, desc } from 'drizzle-orm';
import { GRACE_PERIOD_DAYS } from '@/lib/subscription';
import { unauthorizedResponse } from '@/lib/api-helpers';
export async function GET({ request }: { params: Record<string, string>; request: Request }) {
  // Verify this is an internal/scheduled call
  const authHeader = request.headers.get('authorization');
  const expectedToken = import.meta.env.CLEANUP_SECRET;
  if (authHeader !== `Bearer ${expectedToken}`) {
    return unauthorizedResponse();
  }
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const now = new Date();
  const nowTimestamp = Math.floor(now.getTime() / 1000);
  // Grace period = 30 days after planExpiresAt
  const gracePeriodEndThreshold = nowTimestamp - (GRACE_PERIOD_DAYS * 24 * 60 * 60);

  try {
    // Find all businesses
    const allBusinesses = await db.select({ id: businesses.id })
      .from(businesses)
      .all();

    // Filter those past grace period by checking orders
    const expiredBusinesses: { id: string }[] = [];

    for (const business of allBusinesses) {
      // Get most recent paid order
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
        // Grace period = planExpiresAt + 30 days (all in milliseconds)
        const graceEnd = activeOrder.planExpiresAt + (GRACE_PERIOD_DAYS * 24 * 60 * 60 * 1000);
        if (graceEnd < now.getTime()) {
          expiredBusinesses.push(business);
        }
      }
    }

    const results: {
      deleted: string[];
      failed: { id: string; error: string }[];
      totalSkusDeleted: number;
    } = {
      deleted: [],
      failed: [],
      totalSkusDeleted: 0,
    };

    for (const business of expiredBusinesses) {
      try {
        // Count SKUs before deletion
        const skuCountResult = await db.select({ count: sql<number>`count(*)` })
          .from(products)
          .where(eq(products.businessId, business.id))
          .get() ?? undefined;
        const skuCount = Number(skuCountResult?.count) || 0;

        // Delete all SKUs for this listing
        await db.delete(products)
          .where(eq(products.businessId, business.id))
          .run();

        results.totalSkusDeleted += skuCount;

        // Soft delete the business (set deleted_at) instead of hard delete
        await db.update(businesses)
          .set({ deletedAt: nowTimestamp })
          .where(eq(businesses.id, business.id))
          .run();

        results.deleted.push(business.id);
      } catch (err) {
        const error = err instanceof Error ? err.message : String(err);
        results.failed.push({ id: business.id, error });
        console.error(`[Cleanup] Failed to delete business ${business.id}:`, error);
      }
    }

    return new Response(JSON.stringify({
      success: true,
      data: {
        executedAt: now.toISOString(),
        businessesFound: expiredBusinesses.length,
        deleted: results.deleted.length,
        skusDeleted: results.totalSkusDeleted,
        failed: results.failed.length,
        deletedIds: results.deleted,
        failedIds: results.failed,
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[Cleanup] Job failed:', error);
    return new Response(JSON.stringify({
      success: false,
      error: { message: 'Cleanup job failed', details: String(error) }
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