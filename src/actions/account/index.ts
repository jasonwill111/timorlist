// Account Server Actions - User's own data
import { defineAction } from 'astro:actions';
import * as z from 'zod';
import { getDb } from '@/lib/db';
import { users, businesses, businessCategories, orders, listings as listingsTable } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { getAuth } from '@/lib/auth';
import { createErrorResponse, ErrorCode } from '@/lib/errors';

/**
 * Get current user's profile
 */
export const getProfile = defineAction({
  accept: 'json',
  handler: async () => {
    try {
      const auth = await getAuth();
      const session = await auth.api.getSession();

      if (!session?.user) {
        return createErrorResponse(ErrorCode.AUTH_REQUIRED, 'Authentication required');
      }

      const db = await getDb();
      if (!db) return createErrorResponse(ErrorCode.SERVER_DB_ERROR, 'Database not available');

      const user = await db.select({
        id: users.id,
        name: users.name,
        email: users.email,
        phone: users.phone,
        image: users.image,
        role: users.role,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1)
      .get();

      if (!user) {
        return createErrorResponse(ErrorCode.USER_NOT_FOUND, 'User not found');
      }

      return { success: true, data: user };
    } catch (error) {
      console.error('[account.getProfile] Error:', error);
      return createErrorResponse(ErrorCode.SERVER_ERROR, 'Failed to fetch profile');
    }
  },
});

/**
 * Get current user's businesses
 */
export const getMyBusinesses = defineAction({
  accept: 'json',
  handler: async () => {
    try {
      const auth = await getAuth();
      const session = await auth.api.getSession();

      if (!session?.user) {
        return createErrorResponse(ErrorCode.AUTH_REQUIRED, 'Authentication required');
      }

      const db = await getDb();
      if (!db) return createErrorResponse(ErrorCode.SERVER_DB_ERROR, 'Database not available');

      const businessList = await db.select({
        id: businesses.id,
        title: businesses.title,
        slug: businesses.slug,
        status: businesses.status,
        categoryId: businesses.categoryId,
        createdAt: businesses.createdAt,
        ratingAverage: businesses.ratingAverage,
        views: businesses.views,
        planExpiresAt: businesses.planExpiresAt,
        categoryName: businessCategories.name,
      })
      .from(businesses)
      .leftJoin(businessCategories, eq(businesses.categoryId, businessCategories.id))
      .where(eq(businesses.ownerId, session.user.id))
      .orderBy(desc(businesses.createdAt))
      .all();

      const businessesWithCategory = businessList.map((biz) => ({
        ...biz,
        categoryName: biz.categoryName || 'Uncategorized',
      }));

      return { success: true, data: businessesWithCategory };
    } catch (error) {
      console.error('[account.getMyBusinesses] Error:', error);
      return createErrorResponse(ErrorCode.SERVER_ERROR, 'Failed to fetch businesses');
    }
  },
});

/**
 * Get current user's subscription/orders
 */
export const getMySubscriptions = defineAction({
  accept: 'json',
  handler: async () => {
    try {
      const auth = await getAuth();
      const session = await auth.api.getSession();

      if (!session?.user) {
        return createErrorResponse(ErrorCode.AUTH_REQUIRED, 'Authentication required');
      }

      const db = await getDb();
      if (!db) return createErrorResponse(ErrorCode.SERVER_DB_ERROR, 'Database not available');

      // Get user's orders
      const userOrders = await db.select({
        id: orders.id,
        typeId: orders.typeId,
        servicePackageId: orders.servicePackageId,
        variantSnapshot: orders.variantSnapshot,
        type: orders.type,
        amount: orders.amount,
        status: orders.status,
        paymentMethod: orders.paymentMethod,
        planExpiresAt: orders.planExpiresAt,
        paidDate: orders.paidDate,
        createdAt: orders.createdAt,
      })
      .from(orders)
      .where(eq(orders.userId, session.user.id))
      .orderBy(desc(orders.createdAt))
      .all();

      // Get business titles for orders
      const businessMap = new Map<string, string>();
      const bizIds = [...new Set(userOrders.map(o => o.typeId).filter(Boolean))];
      if (bizIds.length > 0) {
        const businessList = await db.select({
          id: businesses.id,
          title: businesses.title,
        })
        .from(businesses)
        .all();

        businessList.forEach((biz) => {
          if (bizIds.includes(biz.id)) {
            businessMap.set(biz.id, biz.title);
          }
        });
      }

      // Add business titles and parse variant
      const ordersWithBusiness = userOrders.map((order) => {
        let variantName = '';
        try {
          const snapshot = JSON.parse(order.variantSnapshot || '{}');
          variantName = snapshot?.name || '';
        } catch {}

        return {
          ...order,
          variantName,
          businessTitle: order.typeId ? (businessMap.get(order.typeId) || 'Unknown Business') : null,
        };
      });

      // Calculate subscription summary
      const activeSubscription = userOrders.find(o =>
        o.status === 'paid' && o.planExpiresAt && new Date(o.planExpiresAt * 1000) > new Date()
      );

      return {
        success: true,
        data: {
          orders: ordersWithBusiness,
          activeSubscription: activeSubscription || null,
          hasActivePlan: !!activeSubscription,
        },
      };
    } catch (error) {
      console.error('[account.getMySubscriptions] Error:', error);
      return createErrorResponse(ErrorCode.SERVER_ERROR, 'Failed to fetch subscriptions');
    }
  },
});

/**
 * Get business subscription status by business ID
 * Used in product management pages to check if user can add products
 */
export const getBusinessSubscription = defineAction({
  accept: 'json',
  input: z.object({
    businessId: z.string(),
  }),
  handler: async (input) => {
    try {
      const auth = await getAuth();
      const session = await auth.api.getSession();

      if (!session?.user) {
        return createErrorResponse(ErrorCode.AUTH_REQUIRED, 'Authentication required');
      }

      const db = await getDb();
      if (!db) return createErrorResponse(ErrorCode.SERVER_DB_ERROR, 'Database not available');

      // Get business to verify ownership
      const business = await db.select({
        id: businesses.id,
        ownerId: businesses.ownerId,
        planExpiresAt: businesses.planExpiresAt,
      })
      .from(businesses)
      .where(eq(businesses.id, input.businessId))
      .limit(1)
      .get();

      if (!business) {
        return createErrorResponse(ErrorCode.BUSINESS_NOT_FOUND, 'Business not found');
      }

      // Check if user owns this business
      if (business.ownerId !== session.user.id) {
        return createErrorResponse(ErrorCode.AUTH_REQUIRED, 'Access denied');
      }

      // Get active subscription from orders table
      const activeOrder = await db.select({
        servicePackageId: orders.servicePackageId,
        planExpiresAt: orders.planExpiresAt,
        paidDate: orders.paidDate,
        variantSnapshot: orders.variantSnapshot,
      })
      .from(orders)
      .where(eq(orders.typeId, input.businessId))
      .where(eq(orders.type, 'business'))
      .where(eq(orders.status, 'paid'))
      .orderBy(desc(orders.planExpiresAt))
      .limit(1)
      .get();

      const now = Math.floor(Date.now() / 1000);
      let status: 'trial' | 'active' | 'expired' | 'none' = 'none';
      if (activeOrder) {
        const gracePeriod = 30 * 24 * 60 * 60; // 30 days
        if (activeOrder.planExpiresAt && activeOrder.planExpiresAt + gracePeriod > now) {
          status = 'active';
        } else {
          status = 'expired';
        }
      }

      return {
        success: true,
        data: {
          businessId: business.id,
          status,
          planExpiresAt: activeOrder?.planExpiresAt ?? null,
          servicePackageId: activeOrder?.servicePackageId ?? null,
        },
      };
    } catch (error) {
      console.error('[account.getBusinessSubscription] Error:', error);
      return createErrorResponse(ErrorCode.SERVER_ERROR, 'Failed to fetch subscription');
    }
  },
});