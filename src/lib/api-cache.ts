/**
 * Response caching helpers for API routes.
 * Wraps a Response with Cache-Control headers based on cache preset.
 */
import { API_CACHE, PRIVATE_CACHE, SHORT_CACHE, STATIC_CACHE } from './cache-headers';

export type CachePreset = 'STATIC' | 'SHORT' | 'PRIVATE' | 'API';

const PRESET_HEADERS: Record<CachePreset, string> = {
  STATIC: STATIC_CACHE,
  SHORT: SHORT_CACHE,
  PRIVATE: PRIVATE_CACHE,
  API: API_CACHE,
};

/**
 * Apply a cache preset to a Response.
 */
export function withCache(response: Response, preset: CachePreset): Response {
  response.headers.set('Cache-Control', PRESET_HEADERS[preset]);
  return response;
}

/**
 * Apply a custom Cache-Control header to a Response.
 */
export function withCacheHeader(response: Response, cacheControl: string): Response {
  response.headers.set('Cache-Control', cacheControl);
  return response;
}

/**
 * Create a cached JSON response.
 */
export function cachedJsonResponse(body: unknown, preset: CachePreset = 'API', status = 200): Response {
  return withCache(jsonResponseSafe(body, status), preset);
}

function jsonResponseSafe(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
