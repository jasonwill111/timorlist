/**
 * Admin Orders Query Functions
 */
import { getDb } from '@/lib/db';
import { orders } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';

export interface OrderData {
  id: string;
  servicePackageId: string | null;
  variantSnapshot: string | null;
  type: string | null;
  typeId: string | null;
  userId: string | null;
  amount: number | null;
  paymentMethod: string | null;
  status: string | null;
  planExpiresAt: number | null;
  paidDate: number | null;
  createdAt: number | null;
  adminNotes: string | null;
}

export async function getAdminOrders(status?: string): Promise<OrderData[]> {
  const db = await getDb();
  if (!db) return [];

  let query = db.select({
    id: orders.id,
    servicePackageId: orders.servicePackageId,
    variantSnapshot: orders.variantSnapshot,
    type: orders.type,
    typeId: orders.typeId,
    userId: orders.userId,
    amount: orders.amount,
    paymentMethod: orders.paymentMethod,
    status: orders.status,
    planExpiresAt: orders.planExpiresAt,
    paidDate: orders.paidDate,
    createdAt: orders.createdAt,
    adminNotes: orders.adminNotes,
  })
    .from(orders)
    .orderBy(desc(orders.createdAt))
    .limit(100);

  if (status) {
    query = query.where(eq(orders.status, status)) as typeof query;
  }

  return query.all();
}