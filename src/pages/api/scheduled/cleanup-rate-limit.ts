/**
 * Scheduled Rate Limit Cleanup Endpoint
 * 
 * This endpoint is called by wrangler cron triggers to clean up
 * expired entries from the in-memory rate limit store.
 * 
 * Runs: Every hour (defined in wrangler.jsonc triggers.crons)
 */
import { cleanupRateLimitStore } from '@/lib/rate-limit';
import { unauthorizedResponse } from '@/lib/api-helpers';
/**
 * Endpoint: /api/scheduled/cleanup-rate-limit
 * Method: GET
 * Auth: Cron secret or internal call only
 */
export const prerender = false;
export async function GET({ request }: { request: Request }) {
  // Verify this is a cron invocation (from wrangler)
  const isCron = request.headers.get('CF-Cron-Trigger-Requested') === 'true' ||
                 request.headers.get('User-Agent')?.includes('Cloudflare-Cron');
  // Optional: verify cron secret for additional security
  const authHeader = request.headers.get('Authorization');
  const cronSecret = import.meta.env.CRON_SECRET || '';
  // If cron secret is configured, enforce auth; allow if cron trigger from Cloudflare
  if (cronSecret) {
    // Auth is required - check Bearer token
    if (authHeader !== `Bearer ${cronSecret}`) {
      return unauthorizedResponse();
    }
  } else if (!isCron) {
    // No cron secret configured - only allow if called by Cloudflare cron
    return unauthorizedResponse();
  }
  try {
    // Perform cleanup
    const cleanedCount = cleanupRateLimitStore();
    
    const response = {
      success: true,
      timestamp: new Date().toISOString(),
      cleanedEntries: cleanedCount,
      message: `Cleaned up ${cleanedCount} expired rate limit entries`,
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        // Prevent caching of this endpoint response
        'Cache-Control': 'no-store, no-cache',
      },
    });
  } catch (error) {
    console.error('[RateLimitCleanup] Error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: 'Cleanup failed',
      message: error instanceof Error ? error.message : 'Unknown error',
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}