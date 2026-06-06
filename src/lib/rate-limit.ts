// Rate limiter for Cloudflare Workers
// Primary: KV-backed (distributed, persists across cold starts)
// Fallback: in-memory Map (per-instance, resets on cold start)

import { env } from 'cloudflare:workers';

const WINDOW_MS = 60 * 1000; // 1 minute window
const MAX_REQUESTS_PER_WINDOW = 1000; // 1000 requests/min for testing
const AUTH_MAX_REQUESTS = 100; // 100 auth attempts/min for testing

// In-memory fallback store (per-instance)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetIn: number; // seconds until reset
}

/**
 * Extract client IP from Cloudflare headers
 */
export function getClientIP(request: Request): string {
  // Cloudflare Workers provides the real client IP
  const cfConnectingIP = request.headers.get('CF-Connecting-IP');
  if (cfConnectingIP) return cfConnectingIP;

  // Fallback to X-Forwarded-For (for other proxies)
  const forwardedFor = request.headers.get('X-Forwarded-For');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  // Fallback
  return '127.0.0.1';
}

/**
 * In-memory rate limit check (for testing)
 */
export function checkRateLimitInMemory(identifier: string): RateLimitResult {
  return checkRateLimitInMemoryInternal(identifier, Date.now());
}

function checkRateLimitInMemoryInternal(identifier: string, now: number, maxRequests: number = MAX_REQUESTS_PER_WINDOW): RateLimitResult {
  const record = rateLimitStore.get(identifier);

  // Window expired or doesn't exist - reset
  if (!record || now > record.resetTime) {
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + WINDOW_MS,
    });
    return {
      allowed: true,
      remaining: maxRequests - 1,
      resetIn: Math.ceil(WINDOW_MS / 1000),
    };
  }

  // Check limit BEFORE incrementing
  if (record.count >= maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetIn: Math.ceil((record.resetTime - now) / 1000),
    };
  }

  // Under limit - increment
  record.count++;
  return {
    allowed: true,
    remaining: maxRequests - record.count,
    resetIn: Math.ceil((record.resetTime - now) / 1000),
  };
}

/**
 * Check rate limit using KV storage (primary), falls back to in-memory
 */
export async function checkRateLimit(identifier: string): Promise<RateLimitResult> {
  return checkRateLimitWithLimit(identifier, MAX_REQUESTS_PER_WINDOW);
}

/**
 * Check rate limit with custom max requests
 * Primary: KV-backed (distributed, persists across cold starts)
 * Fallback: in-memory Map (per-instance, resets on cold start)
 */
export async function checkRateLimitWithLimit(identifier: string, maxRequests: number): Promise<RateLimitResult> {
  const key = `ratelimit:${identifier}`;
  const now = Date.now();
  try {
    // Primary: use KV storage
    const stored = await env.SESSION.get(key);
    let record: { count: number; resetTime: number };
    if (stored) {
      record = JSON.parse(stored as string);
      // Window expired — reset
      if (now > record.resetTime) {
        record = { count: 1, resetTime: now + WINDOW_MS };
      } else if (record.count >= maxRequests) {
        // Limit exceeded
        return {
          allowed: false,
          remaining: 0,
          resetIn: Math.ceil((record.resetTime - now) / 1000),
        };
      } else {
        record.count++;
      }
    } else {
      record = { count: 1, resetTime: now + WINDOW_MS };
    }
    await env.SESSION.put(key, JSON.stringify(record));
    return {
      allowed: true,
      remaining: maxRequests - record.count,
      resetIn: Math.ceil(WINDOW_MS / 1000),
    };
  } catch {
    // Fallback: in-memory (for local dev or KV errors)
    return checkRateLimitInMemoryInternal(identifier, now, maxRequests);
  }
}

/**
 * Check auth-specific rate limit (stricter, per-IP)
 * Uses AUTH_MAX_REQUESTS (5 per minute) instead of default
 */
export async function checkAuthRateLimit(clientIP: string): Promise<RateLimitResult> {
  return checkRateLimitWithLimit(`auth:${clientIP}`, AUTH_MAX_REQUESTS);
}

export function getRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    'X-RateLimit-Limit': MAX_REQUESTS_PER_WINDOW.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': result.resetIn.toString(),
  };
}

// Cleanup old entries periodically (call this in your worker)
export function cleanupRateLimitStore() {
  const now = Date.now();
  for (const [key, record] of rateLimitStore.entries()) {
    if (now > record.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}