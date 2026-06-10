// Products Delete Server Action
import { defineAction } from 'astro:actions';
import { z } from 'zod';
import { getDb } from '@/lib/db';
import { products } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { requireAdmin } from '@/lib/admin-auth';
import { createErrorResponse, ErrorCode, getErrorMessage } from '@/lib/errors';


export const deleteProduct = defineAction({
  input: z.object({
    id: z.string(),
  }),
  handler: async (input, { cookies }) => {
    const authResult = await requireAdmin(cookies);
    if ('error' in authResult) {
      return { success: false, error: { code: authResult.error, message: 'Admin access required' } };
    }

    const db = await getDb();
if (!db) return createErrorResponse(ErrorCode.SERVER_DB_ERROR, "Database not available");
    try {
      await db.delete(products).where(eq(products.id, input.id)).run();
      return { success: true };
    } catch (error) {
      return { success: false, error: { message: getErrorMessage(error) } };
    }
  },
});