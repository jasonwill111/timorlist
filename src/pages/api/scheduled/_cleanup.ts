// Scheduled cleanup - runs weekly to delete expired businesses (past grace period)
export const prerender = false;

// Cloudflare Workers scheduled handler type
type ScheduledHandler = (event: { scheduledTime: number; cron: string }) => Promise<Response>;

import { getDb } from '@/lib/db';
import { businesses, media, products, orders } from '@/db/schema';
import { lt, and, inArray, eq, desc } from 'drizzle-orm';
import { getR2Bucket, deleteFolderFromR2 } from '@/lib/media';
import { GRACE_PERIOD_DAYS } from '@/lib/subscription';

export const onRequest: ScheduledHandler = async (_event) => {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const now = Date.now(); // current timestamp in milliseconds
  // Grace period = 30 days after planExpiresAt
  const cutoffDate = now - (GRACE_PERIOD_DAYS * 24 * 60 * 60 * 1000);

  // Starting cleanup silently

  try {
    // Find all businesses
    const allBusinesses = await db
      .select({
        id: businesses.id,
        slug: businesses.slug,
        ownerId: businesses.ownerId,
      })
      .from(businesses)
      .all();

    // Filter those past grace period by checking orders
    const expiredBusinesses: typeof allBusinesses = [];

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
        const graceEnd = activeOrder.planExpiresAt + (GRACE_PERIOD_DAYS * 24 * 60 * 60 * 1000);
        if (graceEnd < now) {
          expiredBusinesses.push(business);
        }
      }
      // Businesses without orders are not expired (they're in initial state)
    }

    // Found count not logged to reduce log noise

    let deletedCount = 0;

    for (const business of expiredBusinesses) {
      try {
        // 1. Delete R2 folder
        const entityFolder = `businesses/${business.id}`;
        await deleteFolderFromR2(entityFolder);

        // 2. Delete media records
        await db.delete(media)
          .where(and(
            eq(media.entityId, business.id),
            eq(media.entityType, 'businesses')
          ))
          .run();

        // 3. Delete products
        await db.delete(products).where(inArray(products.businessId, [business.id])).run();

        // 4. Soft delete business (set deleted_at)
        await db.update(businesses)
          .set({ deletedAt: Math.floor(now / 1000) })
          .where(eq(businesses.id, business.id))
          .run();

        deletedCount++;
      } catch (error) {
        console.error(`[Cleanup] Error deleting business ${business.id}:`, error);
      }
    }

    // Completion silently logged
    return new Response(JSON.stringify({
      success: true,
      deletedCount,
      timestamp: new Date().toISOString(),
    }), { status: 200 });
  } catch (error) {
    console.error('[Cleanup] Fatal error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: String(error),
      timestamp: new Date().toISOString(),
    }), { status: 500 });
  }
};