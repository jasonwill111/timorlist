/**
 * KV Cache Utility - Cloudflare Workers
 *
 * Provides caching layer for D1 queries to reduce database load.
 * Note: KV TTL minimum is 60 seconds.
 */
interface CacheOptions {
  /** Time to live in seconds (minimum 60) */
  ttl: number;
  /** Custom KV namespace binding */
  namespace?: KVNamespace;
}
// Cached KV namespace (module-level, initialized once)
let _kv: KVNamespace | null = null;
/**
 * Get KV namespace - cached after first call
 */
async function getKVNamespace(): Promise<KVNamespace | null> {
  if (_kv) return _kv;
  try {
    const { env } = await import('cloudflare:workers');
    const session = (env as unknown as Record<string, unknown>).SESSION as KVNamespace;
    _kv = session;
    return _kv;
  } catch {
    return null;
  }
}
/**
 * Get cached value from KV
 */
async function getFromKV<T>(key: string, kv: KVNamespace): Promise<T | null> {
  const value = await kv.get(key);
  if (value) {
    try {
      return JSON.parse(value) as T;
    } catch {
      console.warn(`[Cache] JSON parse failed for key ${key}, discarding corrupt entry`);
      return null;
    }
  }
  return null;
}
/**
 * Set cached value to KV
 */
// KV TTL minimum is 60 seconds - floor prevents silent failures on short TTLs
async function setToKV<T>(key: string, value: T, kv: KVNamespace, ttl: number): Promise<void> {
  const effectiveTtl = Math.max(ttl, 60);
  await kv.put(key, JSON.stringify(value), {
    expirationTtl: effectiveTtl,
  });
}
/**
 * Invalidate cache key
 */
async function invalidateKV(key: string, kv: KVNamespace): Promise<void> {
  await kv.delete(key);
}
/**
 * Get cached data or fetch and cache it
 *
 * @example
 * const categories = await cachedGet(
 *   'categories:business',
 *   () => db.select().from(businessCategories).all(),
 *   { ttl: 300 }
 * );
 */
export async function cachedGet<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: CacheOptions
): Promise<T> {
  const kv = await getKVNamespace();
  if (!kv) {
    // No KV available, fetch directly
    return fetcher();
  }
  // Try cache first
  const cached = await getFromKV<T>(key, kv);
  if (cached !== null) {
    return cached;
  }
  // Fetch fresh data
  const data = await fetcher();
  // Store in cache (fire and forget)
  setToKV(key, data, kv, options.ttl).catch((e) => {
    console.warn(`[Cache] KV write failed for ${key}:`, e);
  });
  return data;
}
/**
 * Invalidate specific cache keys
 */
export async function invalidateCache(...keys: string[]): Promise<void> {
  const kv = await getKVNamespace();
  if (!kv) return;
  await Promise.all(keys.map((key) => invalidateKV(key, kv)));
}
/**
 * Invalidate cache keys by pattern (prefix matching)
 * Note: This requires listing all keys which can be slow
 */
export async function invalidateCachePattern(pattern: string): Promise<void> {
  const kv = await getKVNamespace();
  if (!kv) return;
  try {
    const list = await kv.list({ prefix: pattern });
    await Promise.all(list.keys.map((key) => kv.delete(key.name)));
  } catch (e) {
    console.warn(`[Cache] Pattern invalidation failed for ${pattern}:`, e);
  }
}
// Cache key builders for consistent naming
export const cacheKeys = {
  categories: (type: string) => `categories:${type}`,
  business: (slug: string) => `business:${slug}`,
  listing: (slug: string) => `listing:${slug}`,
  nonProfit: (slug: string) => `non-profit:${slug}`,
  publicSector: (slug: string) => `public-sector:${slug}`,
  popularItems: (type: string) => `popular:${type}`,
  siteStats: () => 'stats:site',
} as const;