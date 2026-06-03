/**
 * Sentry initialization for Cloudflare Workers
 * @sentry/cloudflare v10 uses withSentry() wrapper + CloudflareClient, not Sentry.init()
 */
import * as Sentry from '@sentry/cloudflare';
export function initSentry(env: { SENTRY_DSN?: string }) {
  if (!env.SENTRY_DSN) {
    console.warn('[Sentry] SENTRY_DSN not configured - error tracking disabled');
    return null;
  }
  // v10: no init() call needed — use CloudflareClient directly in handlers
  const client = new Sentry.CloudflareClient({ dsn: env.SENTRY_DSN });
  console.log('[Sentry] CloudflareClient created');
  return client;
}
export { Sentry };