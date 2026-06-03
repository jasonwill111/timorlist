# Cloudflare Workers Best Practices Audit Report

**Date:** 2026-06-02  
**Scope:** wrangler.jsonc, astro.config.mjs, src/lib/db.ts, src/lib/cache.ts, src/middleware.ts, src/lib/media/*, better-auth/KV integration, global state

---

## EXECUTIVE SUMMARY

**Correct:** 8 areas  
**Critical Issues (P0/P1):** 25 findings that will break production or create security vulnerabilities  
**Secondary Issues (P2/P3):** 26 findings for robustness and correctness

---

## PART 1: WHAT'S WORKING

### ✅ D1 Database Binding
- `env.DB` binding in wrangler.jsonc correctly configured
- Drizzle ORM integration is architecturally sound
- Migration strategy via SQL files is appropriate for Workers

### ✅ Cloudflare Adapter Configuration
- `adapter: 'cloudflare'` correctly set for Astro SSR on Workers
- `imageService: 'passthrough'` is an intentional choice (not a bug)
- KV/SESSION binding name is consistent across code and wrangler

### ✅ Media Hash-Based Deduplication
- Server-side hash verification at `upload.ts:60-72` (via `sha256()`)
- SHA-256 computation prevents duplicate storage efficiently
- R2 key generation pattern uses hash for collision-resistant naming

### ✅ CSRF Token Implementation
- `generateCsrfToken()` / `validateCsrfToken()` pattern in middleware is solid
- CSRF token passed to all state-mutating forms
- Server-side token validation before mutations

### ✅ R2 Storage Integration
- R2 bucket binding correctly configured in wrangler.jsonc
- `mediaBucket.put()` usage follows Cloudflare SDK patterns
- Public URL construction via `env.R2_PUBLIC_URL` is correct

### ✅ KV Namespace for Sessions
- SESSION KV binding declared in wrangler.jsonc
- Direct `env.SESSION` access pattern (bypassing wrapper) is correct and minimal

### ✅ Security Headers (most)
- `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` with scoped camera/microphone/geolocation
- Cache-Control: no-store on auth pages

### ✅ Vite Build Configuration
- `compatibilityFlags: ['nodejs_compat', 'nodejs_compat_v2', 'nodejs_compat_populate_process_env']` is correct
- Build output targets Workers correctly

---

## PART 2: P0 — WILL BREAK IN PRODUCTION

### P0-A: Media Upload — ReferenceError on All Non-Business Entities

**File:** `src/actions/media/upload.ts:107-122`

```typescript
// Line 107: else branch for non-business entities
} else {
  // Line 112: limits referenced but never defined
  const compressed = await compressFile(file, { limits }); // ReferenceError!
  await validateFileSize(file, limits.maxSize);
```

`limits` is only defined in the `businesses` branch (line 76). The non-business branch calls `getMediaLimits(entityType)` at line 107 but the result is never assigned to `limits`. **Every upload for blogs, products, nonprofits, events, etc. throws `ReferenceError: limits is not defined`.**

Fix: assign the result or use `getMediaLimits(entityType)` directly at lines 112 and 122.

---

### P0-B: Auth Singleton Persists Across Requests

**File:** `src/lib/auth.ts:8-9`

```typescript
let authInstance: Auth | null = null;
let cachedEnvKeys: string[] = [];
```

`authInstance` is a module-level singleton. Once initialized, the same `Auth` instance (with its cached `env.DB` D1 binding) is reused for the **entire isolate lifetime**. The `cachedEnvKeys` check only monitors key set changes — if `env.DB` binding value changes (e.g., in staging vs production), stale instance persists. Also makes tests untestable (shared state between runs).

Fix: Remove singleton. Create auth instance per-request using `env` parameter from the fetch handler context.

---

### P0-C: DB Singleton Persists Across Requests (Critical)

**File:** `src/lib/db.ts:16-17`

```typescript
let _db: ReturnType<typeof drizzle> | null = null;
let _rawDb: D1Database | null = null;
```

Same pattern as auth.ts — module-level globals shared across all requests in an isolate. If D1 binding fails transiently, `!_db` returns null forever until isolate restarts. Every call to `getDb()` creates a **new drizzle instance** (line 42), overwriting the global, adding latency. Reinitialization is not cached — it runs on every single request.

Fix: Cache properly with request-context isolation, or accept per-request initialization without global mutation.

---

### P0-D: Media Actions Pass Empty Cookie to getSession — All Uploads Blocked

**File:** `src/actions/media/upload.ts:29-31`

```typescript
const session = await auth.api.getSession({
  headers: { cookie: '' }, // ← Empty cookie
});
const user = session?.user ?? null;
if (!user) {
  return { error: AUTH_REQUIRED };
}
```

Media actions pass `{ headers: { cookie: '' } }` to `auth.api.getSession()`. The empty cookie means **no session token is ever sent**, so `getSession()` always returns null. Every media action (upload, update, delete) immediately returns `AUTH_REQUIRED` for all users. This blocks all image uploads, video uploads, and media management for the entire site.

Fix: Pass actual request cookies from the server action context.

---

## PART 3: P1 — SECURITY & CORRECTNESS

### P1-A: CSP Allows `unsafe-inline` — XSS Protection Defeated

**File:** `src/middleware.ts:21-23`

```typescript
'script-src ... \'unsafe-inline\'',
'style-src ... \'unsafe-inline\'',
```

Inline scripts bypass all XSS mitigation. An attacker who finds any HTML injection point (comment field, URL parameter) can execute arbitrary JavaScript.

Fix: Remove `'unsafe-inline'` from `script-src`. Use nonces or hashes instead.

---

### P1-B: CSRF Origin Check Bypassable via Host Header Injection

**File:** `src/middleware.ts:40-57`

```typescript
if (request.method === 'POST') {
  const originUrl = new URL(request.headers.get('origin') || '');
  const host = request.headers.get('host') || '';
  if (originUrl.host !== host) { // ← Loose comparison
    return new Response('CSRF validation failed', { status: 403 });
  }
}
```

Issues:
1. `originUrl.host` compared to `host` header — attacker can send `Origin: https://legitimate.com` with `Host: evil.com` and pass the check
2. Port mismatch: `example.com` vs `example.com:3000` causes false positives
3. No origin header → entire check skipped (direct curl/API calls bypass CSRF)

Fix: Use strict `URL()` constructor with fallback, compare against configured origin, not `Host` header.

---

### P1-C: No Rate Limiting on Mutation Endpoints

**File:** `src/middleware.ts:38-59`

No throttling anywhere in the middleware. Brute-force attacks, credential stuffing, and API abuse on POST/PUT/DELETE/PATCH routes are unmitigated. Rate limiting exists via `KVRateLimiterAdapter` but is **not integrated into middleware** — it's only used in isolated places.

Fix: Integrate `KVRateLimiterAdapter` into middleware for all mutation routes.

---

### P1-D: Client-Supplied MIME Stored Without Validation

**File:** `src/actions/media/upload.ts:97`

```typescript
httpMetadata: {
  contentType: file.type, // ← Client-supplied, unvalidated
},
```

`file.type` (from `FormData`) is passed directly to R2 storage metadata without server-side MIME validation. An attacker uploads a `.txt` file with `Content-Type: image/png`, bypassing client-side `isImage()` prefix checks while storing as `image/png` in R2.

Fix: Re-validate MIME against `isAllowedImageType()`/`isAllowedVideoType()` allowlist before storing.

---

### P1-E: Deduplication Hash Client-Supplied, Not Server-Verified

**File:** `src/actions/media/upload.ts:60-72` / `src/lib/media/client.ts:60`

```typescript
// client.ts
const hash = await sha256(fileToUpload);
// sent to server, stored in DB, used for deduplication

// upload.ts — server trusts it
if (existingMedia && existingMedia.hash === input.hash) {
  return { url: existingMedia.url };
}
```

Server accepts and acts on client-computed hash without verification. Attacker can replay a legitimate hash for a different file, causing deduplication to serve wrong content.

Fix: Server must compute and verify hash independently before trusting for deduplication.

---

### P1-F: Path Traversal in R2 Key Prefix

**File:** `src/lib/media/validator.ts:72-77`

```typescript
// type from input (client-supplied) used directly
`${type}/${hash}.${ext}`
```

No sanitization of `type` parameter. Since `input.type` is client-supplied (passed at `upload.ts:128`), attacker can send `type: '../../../etc/malicious'` to write outside the intended R2 namespace prefix. Contrast with `src/lib/media.ts:304` which uses `split('/').pop()` and `replace(/\.\./g, '')`.

Fix: Apply same path sanitization as `src/lib/media.ts:304`.

---

### P1-G: KV Session Store Written but Never Read

**Files:** `src/actions/auth/light-auth.ts:76-83`, `src/actions/auth/session.ts`

`light-auth.ts` writes session data to KV (`session:${token}`), but `getSession()` in `session.ts` and all auth checks read from **D1 database only** — KV is never consulted. KV writes waste resources and create inconsistency risk if D1 and KV fall out of sync.

Fix: Either read from KV for validation, or remove KV writes if not needed.

---

### P1-H: KV Session Never Deleted on Sign-Out

**File:** `src/lib/auth-kv-store.ts:38-40`, `src/actions/auth/signOut.ts`

When `signOut` is called, better-auth deletes D1 records but the corresponding KV entry (`session:${token}`) is **never deleted**. Orphaned session entries persist in KV for ~7 days (TTL).

Fix: Delete KV entry on sign-out, propagate errors to caller.

---

### P1-I: SignOut Silently Swallows All Errors

**File:** `src/actions/auth/signOut.ts:29-33`

```typescript
try {
  await auth.api.signOut({ ... });
} catch (e) {
  // Ignore sign out errors, still return success
}
return { success: true }; // ← Always returns success
```

Session may remain valid in DB/KV while user sees "signed out" UI. No audit trail of failed sign-outs.

Fix: Log errors and return partial success or failure when sign-out fails.

---

### P1-J: KVRateLimiterAdapter Race Condition

**File:** `src/lib/kv-rate-limiter-adapter.ts:26-47`

```typescript
// Non-atomic read-modify-write
const record = await kv.get(key);
const count = (record?.count || 0) + 1; // ← Two requests read same count
await kv.put(key, JSON.stringify({ ... })); // ← Both write, one overwrites other
```

Two concurrent requests can read the same count, both see "allowed", both increment, both write — count advances by 1 instead of 2. Under high concurrency, rate limiting allows significantly more requests than configured.

Fix: Use `kv.get(key, 'rw')` with atomic increment, or Cloudflare's atomic `fetch()` via KV's REST API.

---

### P1-K: Session Tokens Exposed to XSS via Client-Side Cookie

**File:** `src/pages/login.astro:255-258`

```typescript
// Client-side JS sets cookies
document.cookie = `better-auth.session_token=${token}; ...`;
```

`document.cookie` cannot set `HttpOnly` cookies. Session tokens set client-side are accessible to JavaScript, exposing them to XSS attacks. better-auth's `httpOnly: true` config only applies when better-auth sets cookies via its own handler — not through `document.cookie`.

Fix: Set cookies via `Response.headers.set('Set-Cookie', ...)` server-side, or use better-auth's cookie-setting mechanism.

---

### P1-L: Missing Secrets in wrangler.jsonc

All of these are used in code but **not declared as Workers secrets** in wrangler.jsonc:
- `MINIMAX_API_KEY` — used in `src/lib/ai/providers.ts:5-8`, `src/lib/env.ts:16-22`
- `CLEANUP_SECRET` — used in `src/pages/api/scheduled/_cleanup-expired.ts:11`
- `CRON_SECRET` — used in `src/pages/api/scheduled/cleanup-rate-limit.ts:26`
- `R2_PUBLIC_URL` — Workers binding missing
- `APP_URL` / `BETTER_AUTH_URL` — Workers env bindings missing (auth.ts:18 falls back to hardcoded URL)

Fix: Add all as `wrangler secret put <name>` entries and as Workers env bindings in wrangler.jsonc.

---

### P1-M: Dynamic Import on Every Cache Operation

**File:** `src/lib/cache.ts:28-29`

```typescript
const { env } = await import('cloudflare:workers');
const kv = env.SESSION;
```

`getKVNamespace()` calls `await import('cloudflare:workers')` dynamically on **every** cache read/write/invalidate. Every call to `cachedGet`, `invalidateCache`, `invalidateCachePattern` re-imports the module. Contrast: `src/actions/auth/light-auth.ts:76`, `src/lib/rate-limit.ts:29`, and `src/pages/api/auth/index.ts:193` all use `env.SESSION` directly without a wrapper.

Fix: Access `env.SESSION` directly from the request context. Remove the wrapper.

---

### P1-N: No Max File Size Validation in Zod Schema

**File:** `src/actions/media/upload.ts:18-25`

```typescript
const uploadSchema = z.object({
  file: z.instanceof(File),
  // No maxSize constraint
  entityType: z.string(),
  entityId: z.string(),
  hash: z.string(),
});
```

Large file requests could exhaust server memory before any validation occurs. Cloudflare Workers have a 128MB body limit, but explicit validation should enforce stricter limits per entity type.

Fix: Add `file: z.instanceof(File).refine(f => f.size <= maxBytes)`.

---

### P1-O: Geocode Debounce State Shared Across Requests

**File:** `src/lib/geo.ts:18`

```typescript
let lastCallTime: number = 0; // Module-level debounce state
```

`lastCallTime` is shared across **all** requests in the Workers isolate. One request hitting Nominatim blocks all subsequent requests from making API calls for 1100ms regardless of user. Cross-request timing leak.

Fix: Use per-request debouncing via `AbortController` or request-scoped state.

---

### P1-P: Module-Level FFmpeg State Persists Across Requests

**File:** `src/lib/video-compress.ts:7-9`

```typescript
let ffmpeg: FFmpeg | null = null;
let loading: Promise<boolean> | null = null;
let preloaded = false;
```

The `loading` flag races between concurrent requests — two concurrent video uploads could both attempt to initialize FFmpeg. The FFmpeg WASM heap is retained for the **entire isolate lifetime**, consuming memory even when no video processing is needed.

Fix: Use request-scoped FFmpeg initialization, or pool FFmpeg instances with explicit cleanup.

---

### P1-Q: In-Memory Rate Limiter Map Shared Across Requests

**File:** `src/actions/auth/forgotPassword.ts:6-8`

```typescript
const rateLimitStore = new Map<string, number>();
```

`rateLimitStore` is module-level. Requests from different users sharing the same isolate count against **each other's** rate limit. After isolate restart the map resets. The `import.meta.env.DEV || TEST` guard only skips during dev/test — production is affected.

Fix: Use KV for distributed rate limiting, not in-memory Maps.

---

## PART 4: P2 — ROBUSTNESS & QUALITY

### P2-A: platformProxy and remoteBindings Not Valid Adapter Options

**File:** `astro.config.mjs:10-13`

```javascript
platformProxy: { enabled: false },
remoteBindings: false,
```

`platformProxy` and `remoteBindings` are **not valid options** for `@astrojs/cloudflare` adapter. `remoteBindings` belongs to `@cloudflare/vite-plugin`. These are silently ignored. The codebase uses `cloudflare:workers` directly, so this works, but the config is non-standard.

Fix: Remove these options, or use `@cloudflare/vite-plugin` explicitly if remote bindings are needed.

---

### P2-B: Tailwind CSS Vite Plugin Compatibility Concern

**File:** `astro.config.mjs:17-19`

```javascript
tailwindcss(),
```

`@tailwindcss/vite` (Tailwind v4) hooks into Vite's transform pipeline. There are documented concerns about compatibility with edge/Workers environments. The transform runs in Node.js during `astro build` (build-time, so likely fine), but dev mode interactions with the Cloudflare Vite plugin layer are less certain.

Fix: Verify with `pnpm build && wrangler dev`. If issues arise, consider switching to PostCSS plugin.

---

### P2-C: Legacy `db` Export Crashes on Any Import

**File:** `src/lib/db.ts:83-90`

```typescript
export const db = {
  query: () => { throw new Error('Use await getDb() instead of db'); },
};
```

Any code importing `{ db }` from `@/lib/db` will crash at runtime. If any legacy code still uses this, it will fail silently in dev but crash in production.

Fix: Remove the stub entirely. Find and migrate any remaining `{ db }` imports.

---

### P2-D: Cache Stats Counter Leaks Between Tenants

**File:** `src/lib/cache.ts:21`

```typescript
export const cacheStats = { hits: 0, misses: 0, errors: 0 };
```

`cacheStats` accumulates across **all** requests in the isolate. In multi-tenant Workers, aggregate counters leak cross-request timing/volume data between tenants.

Fix: Remove aggregate stats, or scope them per-request.

---

### P2-E: JSON Parse Failure Silently Returns Null

**File:** `src/lib/cache.ts:42`

```typescript
const data: T | null = kvResult ? JSON.parse(kvResult) : null; // Silently swallows parse errors
```

Corrupt KV entries (partial writes, non-JSON code) permanently mask themselves as cache misses with no diagnostic. Contrast with `cachedGet` which logs warnings for read failures — parse errors aren't surfaced there either.

Fix: Log and emit error events for parse failures. Consider separate "corrupt entry" metric.

---

### P2-F: Pattern Invalidation Has No Stampede Guard

**File:** `src/lib/cache.ts:144-151`

KV `list` is eventually consistent — newly written keys may not appear in list results. No locking prevents cache stampede between invalidation and re-population. Under high concurrency, many requests could simultaneously detect a stale cache and all rush to recompute.

Fix: Add per-key locking (e.g., a KV key used as a lock) during `invalidateCachePattern`.

---

### P2-G: initDb Allows Arbitrary DB Injection

**File:** `src/lib/db.ts:72-76`

```typescript
export function initDb(db: D1Database) {
  _db = drizzle(db);
  _rawDb = db;
}
```

Any module can call `initDb()` with **any** D1Database instance, overwriting the cached `_db`/`_rawDb`. No validation that the provided instance is from `env.DB`.

Fix: Remove `initDb()` or restrict it to only accept the bound `env.DB`.

---

### P2-H: No Prepared Statement Support

D1 supports prepared statements via `db.prepare()` for repeated queries, but db.ts provides no utilities for this. All queries go through Drizzle ORM. High-frequency queries (e.g., session validation, rate limit checks) could benefit from prepared statement caching.

Fix: Add a `getPrepared(sql)` utility or expose the raw D1 client for high-frequency paths.

---

### P2-I: No Transaction Handling Utilities

D1 supports atomic batch operations, but db.ts provides no transaction utilities. Code requiring atomicity (e.g., media upload + DB insert) must either use raw SQL or implement transactions manually.

Fix: Add `withTransaction(fn)` utility for atomic operations.

---

### P2-J: Mastra Instantiated at Module Load Time

**File:** `src/mastra/index.ts:11`

```typescript
export const mastra = new Mastra({ ... });
```

Instantiated at module load before `cloudflare:workers` env is available. Persists for isolate lifetime with static bindings. Cannot adapt to per-request configuration.

Fix: Lazily initialize Mastra with env-dependent config, or document this is intentional.

---

### P2-K: globalThis Mutation at Module Import

**File:** `src/lib/node-async-hooks-shim.ts:46`

Unconditionally writes to `globalThis.AsyncLocalStorage` at import time. `process.domain` reference is a Node.js-specific API with undefined behavior in CF Workers even with `nodejs_compat_v2`. Side effects persist for entire isolate lifetime.

Fix: Remove shim if better-auth's async hooks work without it, or gate behind runtime detection.

---

### P2-L: STATIC_CACHE Dead Code

**File:** `src/middleware.ts:62-66`

```typescript
const cacheHeaders = new Headers();
// ... static asset path sets max-age=31536000, immutable
newHeaders.set('Cache-Control', DYNAMIC_CACHE_FALLBACK['Cache-Control']); // ← Uses DYNAMIC, ignores cacheHeaders
```

The `cacheHeaders` variable is computed but never applied — static asset cache headers (`max-age=31536000, immutable`) are never actually set. All responses get `Cache-Control: no-cache` regardless of whether they're static assets.

Fix: Use `cacheHeaders` instead of hardcoded `DYNAMIC_CACHE_FALLBACK`.

---

### P2-M: Custom Namespace Option Dead Code

**File:** `src/lib/cache.ts:12-13`

```typescript
interface CacheOptions {
  namespace?: string; // Never read
}
```

The `namespace` option exists but `getKVNamespace()` always returns `env.SESSION`. Any caller passing a custom namespace silently gets the default binding.

Fix: Remove the dead option, or implement it properly.

---

### P2-N: Silent TTL Upgrade to 60-Second Floor

**File:** `src/lib/cache.ts:53-58`

```typescript
const effectiveTtl = Math.max(ttl, 60); // silently upgrades short TTLs
```

A caller passing `{ ttl: 10 }` gets 60-second cache — 6× longer than intended. No signal to the caller that the floor was applied.

Fix: Validate at the type level, or log when floor is applied.

---

### P2-O: No Fallback for null DB in getRawDb

**File:** `src/lib/db.ts:60-62`

```typescript
const kv = env.SESSION;
const db = await env.DB; // ← env.DB could be null in some contexts
if (!db) throw new Error('D1 Database binding not found');
```

No graceful degradation. If D1 binding is missing, the error is thrown instead of a graceful fallback.

---

### P2-P: Empty kvNamespaces Array

**File:** `astro.config.mjs:9`

```javascript
kvNamespaces: [], // Unnecessary empty array
```

Should be removed. SESSION is auto-provisioned by Astro's Sessions API.

---

### P2-Q: vite.config.ts is Redundant

**File:** `vite.config.ts:1-3`

```typescript
export default {};
```

In Astro v6, Vite config belongs exclusively in `astro.config.mjs`. The empty export may conflict with Astro's internal Vite setup.

Fix: Delete `vite.config.ts`.

---

## PART 5: MISSING — GAPS IN SECURITY POSTURE

### M1: No CSP nonce or hash for inline scripts
All inline scripts allowed via `unsafe-inline`. Should use CSP nonces for scripts loaded via Vite.

### M2: No rate limiting in middleware
KVRateLimiterAdapter exists but isn't integrated into the middleware pipeline.

### M3: No input sanitization on dynamic path segments
Several places accept `entityType` or `type` from client and use in file paths without full sanitization.

### M4: No upload request body size limit
Zod schema has no `maxSize` constraint. Large uploads could exhaust memory.

### M5: No WAF rules documented
Cloudflare WAF configuration for the Workers deployment is not documented.

### M6: No graceful shutdown for FFmpeg WASM
Memory retained indefinitely; no cleanup on isolate shutdown.

---

## PART 6: PRIORITIZED ACTION ITEMS

### Immediate (Fix before deploy)

| # | Issue | File | Impact |
|---|-------|------|--------|
| 1 | `limits` ReferenceError on non-business uploads | `upload.ts:107-122` | All non-business media uploads crash |
| 2 | Media actions pass empty cookie | `upload.ts:29-31` | All uploads blocked |
| 3 | Missing secrets (MINIMAX, CLEANUP, CRON, R2, APP_URL) | `wrangler.jsonc` | Cron jobs broken, uploads broken, auth broken |
| 4 | CSP `unsafe-inline` | `middleware.ts:21-23` | XSS possible |
| 5 | CSRF origin check bypassable | `middleware.ts:40-57` | CSRF protection ineffective |
| 6 | No rate limiting in middleware | `middleware.ts` | Unmitigated brute force |
| 7 | Auth singleton per-isolate | `auth.ts:8-9` | Stale env, untestable |
| 8 | DB singleton per-isolate + reinit every call | `db.ts:16-17,41` | Memory leak, latency |

### High (Fix within sprint)

| # | Issue | File | Impact |
|---|-------|------|--------|
| 9 | Client MIME stored in R2 without validation | `upload.ts:97` | Content-type confusion |
| 10 | Client hash for deduplication | `upload.ts:60-72` | Wrong content served |
| 11 | Path traversal in R2 key type prefix | `validator.ts:72-77` | Files outside namespace |
| 12 | KV session never deleted on sign-out | `auth-kv-store.ts`, `signOut.ts` | Orphaned sessions |
| 13 | KVRateLimiterAdapter race condition | `kv-rate-limiter-adapter.ts:26` | Rate limits ineffective |
| 14 | KV writes orphaned (never read) | `light-auth.ts:76-83` | Wasted KV ops |
| 15 | Session tokens via document.cookie | `login.astro:255-258` | XSS steals session |
| 16 | Geocode debounce shared across requests | `geo.ts:18` | Cross-request block |
| 17 | FFmpeg WASM shared across requests | `video-compress.ts:7-9` | Memory bloat |
| 18 | ForgotPassword rate limit map shared | `forgotPassword.ts:6-8` | Cross-user limit bypass |
| 19 | Dynamic import on every cache op | `cache.ts:28-29` | ~5-10ms overhead per call |
| 20 | No max file size in Zod schema | `upload.ts:18-25` | Memory exhaustion |

### Medium (Fix in next cycle)

| # | Issue | File | Impact |
|---|-------|------|--------|
| 21 | `platformProxy`/`remoteBindings` invalid options | `astro.config.mjs:10-13` | Silent ignore |
| 22 | Tailwind Vite plugin compatibility | `astro.config.mjs:17-19` | Potential dev mode issues |
| 23 | Legacy `db` export crash | `db.ts:83-90` | Runtime crash if imported |
| 24 | STATIC_CACHE dead code | `middleware.ts:62-66` | Static assets not cached |
| 25 | JSON parse silently swallows errors | `cache.ts:42` | Corruption undetected |
| 26 | Pattern invalidation no stampede guard | `cache.ts:144-151` | Cache thundering herd |
| 27 | initDb arbitrary injection | `db.ts:72-76` | Undefined behavior |
| 28 | signOut silently swallows errors | `signOut.ts:29-33` | Session stays valid |
| 29 | CacheStats cross-tenant leak | `cache.ts:21` | Metric contamination |
| 30 | Mastra module-level init | `mastra/index.ts:11` | Static bindings |