/**
 * API middleware helpers: rate limiting, CORS, method enforcement.
 * Reusable wrappers for common API request guards.
 */
import { checkRateLimitWithLimit, getClientIP } from './rate-limit';
import { jsonResponse } from './api-helpers';

export type ApiHandler = (request: Request) => Promise<Response> | Response;
export type ApiMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/**
 * Wrap a handler to only allow the specified HTTP method(s).
 * Returns 405 Method Not Allowed for other methods.
 */
export function withMethods(handler: ApiHandler, allowedMethods: ApiMethod[]): ApiHandler {
  return async (request: Request) => {
    if (!allowedMethods.includes(request.method as ApiMethod)) {
      return new Response('Method Not Allowed', {
        status: 405,
        headers: { Allow: allowedMethods.join(', ') },
      });
    }
    return handler(request);
  };
}

/**
 * Apply rate limiting before the handler runs.
 * Returns 429 Too Many Requests when limit is exceeded.
 */
export async function withRateLimit(
  request: Request,
  handler: ApiHandler,
  options: { limit?: number; key?: string } = {},
): Promise<Response> {
  const ip = getClientIP(request);
  const key = options.key || `${request.method}:${new URL(request.url).pathname}:${ip}`;
  const limit = options.limit ?? 60;
  const result = await checkRateLimitWithLimit(key, limit);
  if (!result.allowed) {
    return new Response(
      JSON.stringify({ success: false, error: { code: 'RATE_LIMITED', message: 'Too many requests' } }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': String(result.resetIn),
        },
      },
    );
  }
  return handler(request);
}

/**
 * Add permissive CORS headers (suitable for public API endpoints).
 */
export function withCors(response: Response, origin = '*'): Response {
  response.headers.set('Access-Control-Allow-Origin', origin);
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
}

/**
 * Handle CORS preflight (OPTIONS) request.
 */
export function handleCorsPreflight(request: Request, origin = '*'): Response {
  if (request.method !== 'OPTIONS') return jsonResponse({}, 0);
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
}
