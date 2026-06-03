// Action Helper Utilities - Unified helpers for auth + DB operations
// Provides consistent patterns for authentication and database access in actions

import { getAuth } from './auth';
import { getDb } from './db';
import { createErrorResponse, type ErrorResponse } from './errors';
import { ErrorCode } from './errors';

// Re-export for convenience
export { ErrorCode } from './errors';
export { createErrorResponse } from './errors';
export type { ErrorResponse };

/**
 * Action result type - standard return type for all actions
 */
export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: { code: string; message: string } };

/**
 * User type from better-auth session
 */
export type AuthUser = { id: string; role?: string };

/**
 * Cookies context interface for getting session from cookies
 */
export type CookiesContext = {
  cookies: { get: (name: string) => { value: string } | undefined; toString: () => string };
};

/**
 * WithAuth: Get authenticated user from request context
 * Use when you need auth but not DB access
 * Uses getAuth() which has proper env context from cloudflare:workers
 */
export async function withAuth<T>(
  _context: CookiesContext,
  handler: (user: AuthUser) => ActionResult<T>
): Promise<ActionResult<T>> {
  const auth = await getAuth();
  const session = await auth.api.getSession().catch(() => null);

  if (!session?.user) {
    return createErrorResponse(ErrorCode.AUTH_REQUIRED, 'Authentication required');
  }

  return handler(session.user);
}

/**
 * WithDb: Get database instance with error handling
 * Use when you need DB but not auth
 */
export async function withDb<T>(
  handler: (db: NonNullable<Awaited<ReturnType<typeof getDb>>>) => ActionResult<T>
): Promise<ActionResult<T>> {
  const db = await getDb();
  if (!db) {
    return createErrorResponse(ErrorCode.SERVER_DB_ERROR, 'Database not available');
  }
  return handler(db);
}

/**
 * WithAuthAndDb: Combined helper for authenticated DB operations
 * Use when you need both auth and DB access
 */
export async function withAuthAndDb<T>(
  _context: CookiesContext,
  handler: (user: AuthUser, db: NonNullable<Awaited<ReturnType<typeof getDb>>>) => ActionResult<T>
): Promise<ActionResult<T>> {
  const auth = await getAuth();
  const session = await auth.api.getSession().catch(() => null);

  if (!session?.user) {
    return createErrorResponse(ErrorCode.AUTH_REQUIRED, 'Authentication required');
  }

  const db = await getDb();
  if (!db) {
    return createErrorResponse(ErrorCode.SERVER_DB_ERROR, 'Database not available');
  }

  return handler(session.user, db);
}