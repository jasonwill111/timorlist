// API endpoint to get SKU usage for a business page
export const prerender = false;

import { getDb } from '@/lib/db';
import { products, businesses, orders } from '@/db/schema';
import { eq, sql, desc } from 'drizzle-orm';
import { getPlanLimits, GRACE_PERIOD_DAYS } from '@/lib/subscription';

export async function GET({ params }: { params: Record<string, string> }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  try {
    const { businessPageId } = params;

    // Get business with plan info
    const business = await db.select({
      status: businesses.status,
    })
      .from(businesses)
      .where(eq(businesses.id, businessPageId!))
      .limit(1)
      .get() ?? undefined;

    if (!business) {
      return new Response(JSON.stringify({
        success: false,
        error: { message: 'Business not found' }
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Get active subscription from orders table
    const activeOrder = await db.select({
      servicePackageId: orders.servicePackageId,
      planExpiresAt: orders.planExpiresAt,
      status: orders.status,
    })
      .from(orders)
      .where(eq(orders.typeId, businessPageId!))
      .where(eq(orders.type, 'business'))
      .where(eq(orders.status, 'paid'))
      .orderBy(desc(orders.planExpiresAt))
      .limit(1)
      .get() ?? undefined;

    const now = Date.now();
    let effectivePlan: string | null = null;
    let isExpired = false;

    if (activeOrder?.planExpiresAt) {
      const gracePeriodEnd = activeOrder.planExpiresAt + GRACE_PERIOD_DAYS * 24 * 60 * 60 * 1000;
      if (now > gracePeriodEnd) {
        effectivePlan = 'expired';
        isExpired = true;
      } else if (now > activeOrder.planExpiresAt) {
        // In grace period - still works but showing expiry
        effectivePlan = activeOrder.servicePackageId || null;
      } else {
        effectivePlan = activeOrder.servicePackageId || null;
      }
    }

    const planData = effectivePlan && !isExpired ? await getPlanLimits(effectivePlan) : null;
    const limit = planData?.skuLimit || 0;

    // Count current products
    const countResult = await db.select({ count: sql<number>`count(*)` })
      .from(products)
      .where(eq(products.businessId, businessPageId!));

    const current = Number(countResult[0]?.count) || 0;
    const remaining = Math.max(0, limit - current);

    return new Response(JSON.stringify({
      success: true,
      data: {
        plan: effectivePlan,
        limit,
        current,
        remaining,
        canAdd: remaining > 0,
        isExpired,
        expiresAt: activeOrder?.planExpiresAt ? new Date(activeOrder.planExpiresAt).toISOString() : null,
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('SKU usage error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: { message: 'Failed to get SKU usage' }
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}