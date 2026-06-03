// Drizzle DB Instance - Astro 6 Cloudflare Workers + Remote Bindings
// Uses cloudflare:workers env.DB (works in both local dev and production)

import { drizzle } from 'drizzle-orm/d1';
import * as schema from '@/db/schema';

// Type for Cloudflare Workers env
interface CfEnv {
  DB?: D1Database;
  SESSION?: KVNamespace;
  MEDIA_BUCKET?: R2Bucket;
  [key: string]: unknown;
}

// Module-level cached instances - per-isolate, cached after first init
// NOTE: In Cloudflare Workers, each isolate handles one request at a time,
// so these globals are safe for the isolate lifetime
let _cachedDb: ReturnType<typeof drizzle<typeof schema>> | null = null;
let _cachedRawDb: D1Database | null = null;
let _cacheBindingKey: string | null = null;

/**
 * Get Drizzle DB instance (cached per binding)
 * Uses cloudflare:workers env.DB - works with remote bindings in local dev
 * Caches the instance so we don't re-create drizzle on every request
 */
export async function getDb(): Promise<ReturnType<typeof drizzle<typeof schema>> | null> {
  try {
    // Get env from cloudflare:workers module
    const { env: workersEnv } = await import('cloudflare:workers');
    const cfEnv = workersEnv as CfEnv;

    if (cfEnv?.DB) {
      // Create a cache key from the binding reference (stable for isolate lifetime)
      const bindingKey = String(cfEnv.DB);

      // Return cached instance if binding hasn't changed
      if (_cachedDb && _cacheBindingKey === bindingKey) {
        return _cachedDb;
      }

      // Create new instance and cache it
      const freshDb = drizzle(cfEnv.DB as D1Database, { schema });
      _cachedDb = freshDb;
      _cachedRawDb = cfEnv.DB as D1Database;
      _cacheBindingKey = bindingKey;
      console.log('[getDb] Fresh DB initialized from cloudflare:workers env.DB');
      return freshDb;
    } else {
      console.error('[getDb] env.DB not available');
      // Return cached instance even if binding is missing (better than null)
      if (_cachedDb) return _cachedDb;
      return null;
    }
  } catch (e) {
    console.error('[getDb] Failed to initialize:', e);
    // Return cached instance on error (better than null)
    if (_cachedDb) return _cachedDb;
    return null;
  }
}

/**
 * Get raw D1Database instance for direct queries (cached)
 * NOTE: Returns null if env.DB is not bound. Requires cloudflare:workers env.DB binding.
 * In production, ensure the DB binding is configured in wrangler.jsonc.
 */
export async function getRawDb(): Promise<D1Database | null> {
  if (_cachedRawDb) return _cachedRawDb;
  try {
    const { env: workersEnv } = await import('cloudflare:workers');
    const cfEnv = workersEnv as CfEnv;
    if (cfEnv?.DB) {
      _cachedRawDb = cfEnv.DB as D1Database;
      return _cachedRawDb;
    }
  } catch {
    // cloudflare:workers not available
  }
  return _cachedRawDb;
}

/**
 * Initialize DB with a D1Database instance (for middleware/context)
 * Use this when you have a raw D1Database from a request context
 */
export function initDb(d1Db: D1Database): ReturnType<typeof drizzle<typeof schema>> {
  _cachedDb = drizzle(d1Db, { schema });
  _cachedRawDb = d1Db;
  _cacheBindingKey = String(d1Db);
  return _cachedDb;
}

/**
 * Check if db is ready
 */
export function isDbReady(): boolean {
  return _cachedDb !== null;
}

// Legacy sync export - DO NOT USE
export const db = {
  select: () => {
    throw new Error('Use await getDb() instead of db');
  }
};
