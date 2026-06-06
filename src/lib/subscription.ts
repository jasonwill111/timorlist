// Subscription and SKU limit helper functions
// Uses orders table for subscription state (not cached on businesses)
import { getDb } from './db';
import { businesses, products, servicePackages, orders } from '@/db/schema';
import { eq, and, count, desc } from 'drizzle-orm';

export interface PlanLimits {
  skuLimit: number;
  maxImages: number;
  maxVideos: number;
  maxBusinessImages: number;
  maxBusinessVideos: number;
}

/**
 * Get plan limits from DB by plan slug
 * Now queries servicePackages table with variants JSON
 */
export async function getPlanLimits(planSlug: string | null): Promise<PlanLimits | null> {
  if (!planSlug) return null;

  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const plan = await db.select()
    .from(servicePackages)
    .where(eq(servicePackages.slug, planSlug))
    .limit(1)
    .get() ?? undefined;

  if (!plan) return null;

  try {
    const variants = JSON.parse(plan.variants);
    if (!Array.isArray(variants) || variants.length === 0) return null;

    // Use first variant's limits (or could be configurable)
    const variant = variants[0];
    return {
      skuLimit: variant.limits?.skuLimit ?? 0,
      maxImages: variant.limits?.maxImages ?? 0,
      maxVideos: variant.limits?.maxVideos ?? 0,
      maxBusinessImages: variant.limits?.maxBusinessImages ?? 0,
      maxBusinessVideos: variant.limits?.maxBusinessVideos ?? 0,
    };
  } catch (e) {
    console.warn('[Subscription] Failed to parse plan variants JSON:', e instanceof Error ? e.message : String(e));
    return null;
  }
}

export type SubscriptionStatus = 'none' | 'active' | 'expired' | 'cancelled';

// Grace period in days for businesses
export const GRACE_PERIOD_DAYS = 30;

export interface SubscriptionInfo {
  status: SubscriptionStatus;
  planSlug: string | null;
  skuLimit: number;
  skuCount: number;
  expiresAt: Date | null;
  gracePeriodEndDate: Date | null;
  isInGracePeriod: boolean;
  isActive: boolean;
}

/**
 * Get subscription info for a business
 * Uses getSubscriptionDashboard for batching
 */
export async function getSubscriptionInfo(businessId: string): Promise<SubscriptionInfo | null> {
  const dashboard = await getSubscriptionDashboard(businessId);
  if (!dashboard) return null;

  return {
    status: dashboard.status,
    planSlug: dashboard.planSlug,
    skuLimit: dashboard.skuLimit,
    skuCount: dashboard.skuCount,
    expiresAt: dashboard.expiresAt,
    gracePeriodEndDate: dashboard.gracePeriodEndDate,
    isInGracePeriod: dashboard.isInGracePeriod,
    isActive: dashboard.isActive,
  };
}

/**
 * Check if user can create SKU for a business
 */
export async function canCreateSku(businessId: string): Promise<{ can: boolean; reason?: string }> {
  const info = await getSubscriptionDashboard(businessId);
  if (!info) return { can: false, reason: 'Business not found' };

  // Non-profit or business without subscription
  if (info.status === 'none') {
    return { can: false, reason: 'Business is pending payment confirmation' };
  }

  // Expired
  if (info.status === 'expired') {
    return { can: false, reason: 'Subscription expired' };
  }

  // Cancelled
  if (info.status === 'cancelled') {
    return { can: false, reason: 'Subscription cancelled' };
  }

  // In grace period
  if (info.isInGracePeriod) {
    return { can: false, reason: 'Cannot create SKUs during grace period' };
  }

  // Check SKU limit
  if (info.skuLimit > 0 && info.skuCount >= info.skuLimit) {
    return { can: false, reason: `SKU limit reached (${info.skuCount}/${info.skuLimit})` };
  }

  return { can: true };
}

/**
 * Check if user can edit business content
 */
export async function canEditBusiness(businessId: string): Promise<{ can: boolean; reason?: string }> {
  const info = await getSubscriptionDashboard(businessId);
  if (!info) return { can: false, reason: 'Business not found' };

  // In grace period - cannot edit
  if (info.isInGracePeriod) {
    return { can: false, reason: 'Cannot edit during grace period. Please renew your subscription.' };
  }

  return { can: true };
}

/**
 * Check if business is in grace period
 */
export async function isInGracePeriod(businessId: string): Promise<boolean> {
  const info = await getSubscriptionDashboard(businessId);
  return info?.isInGracePeriod ?? false;
}

/**
 * Calculate grace period end date from expiry date
 */
export function calculateGracePeriodEnd(expiryTimestamp: number): number {
  return expiryTimestamp + (GRACE_PERIOD_DAYS * 24 * 60 * 60 * 1000);
}

/**
 * Get days remaining in grace period
 */
export async function getGracePeriodDaysRemaining(businessId: string): Promise<number> {
  const info = await getSubscriptionInfo(businessId);
  if (!info || !info.isInGracePeriod || !info.gracePeriodEndDate) return 0;

  const now = new Date();
  const diff = info.gracePeriodEndDate.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export interface SubscriptionDashboard {
  businessId: string;
  status: SubscriptionStatus;
  planSlug: string | null;
  skuLimit: number;
  skuCount: number;
  maxImages: number;
  maxVideos: number;
  expiresAt: Date | null;
  gracePeriodEndDate: Date | null;
  isInGracePeriod: boolean;
  isActive: boolean;
}

/**
 * Get full subscription dashboard for a business
 * Batched: 1 business query + 1 order query + 1 SKU count + 1 plan lookup (if needed)
 *
 * Subscription state now comes from orders table, not cached on businesses
 */
export async function getSubscriptionDashboard(businessId: string): Promise<SubscriptionDashboard | null> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Query 1: Verify business exists
  const business = await db.select({ id: businesses.id })
    .from(businesses)
    .where(eq(businesses.id, businessId))
    .limit(1)
    .get() ?? undefined;

  if (!business) return null;

  // Query 2: Get active subscription from orders table (most recent paid order)
  const activeOrder = await db.select({
    servicePackageId: orders.servicePackageId,
    planExpiresAt: orders.planExpiresAt,
    paidDate: orders.paidDate,
    variantSnapshot: orders.variantSnapshot,
    status: orders.status,
  })
    .from(orders)
    .where(eq(orders.typeId, businessId))
    .where(eq(orders.type, 'business'))
    .where(eq(orders.status, 'paid'))
    .orderBy(desc(orders.planExpiresAt))
    .limit(1)
    .get() ?? undefined;

  // Query 3: Count SKUs
  const skuResult = await db.select({ count: count() })
    .from(products)
    .where(eq(products.businessId, businessId))
    .get() ?? undefined;

  const skuCount = skuResult?.count ?? 0;
  const now = Date.now();

  // Determine status from orders table
  let status: SubscriptionStatus = 'none';
  let planSlug: string | null = null;
  let expiresAt: Date | null = null;
  let gracePeriodEndDate: Date | null = null;
  let isInGracePeriod = false;

  if (activeOrder) {
    // servicePackageId is the id (e.g., "sp-business-basic"), need to look up the slug
    const servicePackage = await db.select({ slug: servicePackages.slug })
      .from(servicePackages)
      .where(eq(servicePackages.id, activeOrder.servicePackageId))
      .limit(1)
      .get() ?? undefined;
    planSlug = servicePackage?.slug || null;
    expiresAt = activeOrder.planExpiresAt ? new Date(activeOrder.planExpiresAt) : null;
    
    // Grace period = planExpiresAt + 30 days
    const gracePeriodEnd = activeOrder.planExpiresAt 
      ? (activeOrder.planExpiresAt + GRACE_PERIOD_DAYS * 24 * 60 * 60 * 1000)
      : null;
    gracePeriodEndDate = gracePeriodEnd ? new Date(gracePeriodEnd) : null;

    // Status logic
    if (now <= activeOrder.planExpiresAt!) {
      status = 'active';
    } else if (gracePeriodEnd && now <= gracePeriodEnd) {
      status = 'active'; // Still in grace period
      isInGracePeriod = true;
    } else {
      status = 'expired';
    }
  }

  // Query 4: Get plan limits (only if plan exists)
  let skuLimit = 0;
  let maxImages = 0;
  let maxVideos = 0;

  if (planSlug) {
    const plan = await db.select({ variants: servicePackages.variants })
      .from(servicePackages)
      .where(eq(servicePackages.slug, planSlug))
      .limit(1)
      .get() ?? undefined;

    if (plan?.variants) {
      try {
        const variants = JSON.parse(plan.variants);
        if (Array.isArray(variants) && variants.length > 0) {
          skuLimit = variants[0].limits?.skuLimit ?? 0;
          maxImages = variants[0].limits?.maxImages ?? 0;
          maxVideos = variants[0].limits?.maxVideos ?? 0;
        }
      } catch {
        // Ignore parse errors
      }
    }
  }

  return {
    businessId,
    status,
    planSlug,
    skuLimit,
    skuCount,
    maxImages,
    maxVideos,
    expiresAt,
    gracePeriodEndDate,
    isInGracePeriod,
    isActive: status === 'active' && !isInGracePeriod,
  };
}

/**
 * Check if listing is past grace period (ready for deletion)
 */
export async function isPastGracePeriod(businessId: string): Promise<boolean> {
  const dashboard = await getSubscriptionDashboard(businessId);
  if (!dashboard || !dashboard.gracePeriodEndDate) return false;
  return new Date() > dashboard.gracePeriodEndDate;
}