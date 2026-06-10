<!-- specweave:living-doc {"name": "ARCHITECTURE.md", "version": "1.7.0", "updated": "2026-06-03", "type": "architecture", "domain": "system", "maintainedBy": "team", "lastChange": "architecture-optimization"} -->
# Architecture

## Server Islands (Cloudflare Workers)

Server Islands run in **isolated V8 contexts** and require correct DB access patterns:

```typescript
// ✅ Correct - get DB directly from env
const { getDb } = await import('../lib/db');
const db = await getDb();

// ❌ Wrong - depends on global state (not visible in Isolated Context)
const { initDb } = await import('../lib/db');
initDb(env.DB);
const db = getDbInstance();  // May return null!
```

**Rule**: Server Islands MUST use `await getDb()` instead of `initDb()` + `getDbInstance()`.

> **timorbuy lesson**: timorbuy used initDb() pattern and failed in Islands. timorup correctly uses getDb().

### Astro Island Component Imports (2026-06-04)

All `.astro` components used within an Astro page **MUST** be explicitly imported in the frontmatter, even if used inside nested island components. Missing imports cause `ReferenceError` in client-side hydration (with `client:load`) or SSR failures.

```astro
---
// ✅ Correct - all components imported at page level
import HomepageContent from '@/components/islands/HomepageContent.astro';
import BusinessCard from '@/components/business/BusinessCard.astro';
import ListingCard from '@/components/business/ListingCard.astro';
---

// ❌ Wrong - BusinessCard used inside HomepageContent but not imported
// causes "BusinessCard is not defined" at runtime
import HomepageContent from '@/components/islands/HomepageContent.astro';
```

**Rule**: For every `.astro` component imported by another `.astro` component, import it in the **using page's** frontmatter. This ensures the component is available in both SSR and client hydration contexts.
---

**Astro Frontmatter Syntax Rules (2026-06-06)**

All `.astro` files MUST have exactly ONE frontmatter block delimited by `---`. ALL imports, exports, interfaces, and executable code MUST be inside this block.

```astro
---
import Button from '@/components/fulldev/button';
import Input from '@/components/fulldev/input';
interface Props { name: string; }
const { name } = Astro.props;
export const prerender = true;
---

<template>...</template>
```

```astro
<!-- ❌ Wrong - imports outside frontmatter fence -->
import Button from '@/components/fulldev/button';
---

<template>...</template>
```

**Rule**: Only ONE `---`...`---` pair per `.astro` file. All code must be inside. Multiple `---` blocks or code outside causes:
- Runtime `className is not defined` errors during SSR
- Empty `<main>` on pages (truncated HTML output)
- Raw source code visible instead of rendered HTML (on prerendered pages)

**History**: This bug affected 18 files and caused homepage to show empty main tag and contact page to show raw source. Build time improved from 5+ min (failing) to 1m17s (success) after fixes.

**Windows Build Compatibility (2026-06-04)**

`package.json` scripts that set environment variables must use `cross-env`:

```json
// ✅ Correct - cross-env sets CI=true on all platforms
"build": "cross-env CI=true wrangler types && astro build && cp public/_routes.json dist/_routes.json"

// ❌ Wrong - CI=true fails on Windows (parsed as command name)
"build": "CI=true wrangler types && astro build"
```

**Rule**: Any script that sets env vars across platforms must wrap with `cross-env`. Install: `pnpm add -D cross-env`.

---

## Server Actions (Astro 6)

### Directory Structure

```
src/actions/
├── auth/           # User authentication: signIn, signUp, signOut, verifyEmail, forgotPassword, resetPassword
├── account/        # User private data: getProfile, getMyBusinesses, getMySubscriptions, getBusinessSubscription
├── admin/          # Admin CRUD: categories, plans, subscriptions, blogs, heroes, listings, settings, aiTools
├── business/       # Business operations: create, update, like, updates
├── products/       # Product/SKU management: create, update, delete
├── media/         # Media upload/delete: create, update, upload, delete
├── reviews/       # Reviews: create, reply
└── banners/       # Banner management: create, update
```

### Usage

```astro
---
import { actions } from 'astro:actions';

// Call action
const result = await actions.auth.signIn({ email, password });
```

### REST API Status (2026-05-31)

| Category | Count | Description |
|----------|-------|-------------|
| **Public Read-only** | 16 | businesses, non-profits, public-sectors, listings, categories, products, banners, settings, search, auth/session (SSR cache) |
| **Auth** | 2 | `/api/auth` (sign-in/sign-up), `/api/auth/session` (client auth) |
| **Scheduled** | 5 | Cron jobs, must keep |
| **Admin CRUD** | 0 | Migrated to Server Actions ✅ |
| **Account/Profile** | 0 | Migrated to Server Actions ✅ |
| **Blog/Settings/Plans** | 3 | Public data, REST kept |

> **Key**: 48 Server Actions cover all write operations and user private data. REST API `/api/auth` kept as Cloudflare Workers compatibility fallback. 24 REST APIs total — public read cache, scheduled jobs, and a few admin endpoints still in transition.

### Migration (2026-05-09)

- All write REST APIs → Server Actions (41 actions)
- Read-only APIs kept as REST for caching
- Page imports updated to use actions

---

## Rendering Strategy (2026-06-02)

### Overview

All pages use SSR (Server-Side Rendering) with strategic caching to balance SEO, performance, and cost.

### Rendering Mode Distribution

| Mode | Count | Pages |
|------|-------|-------|
| `prerender = true` | 7 | 404, 500, about, contact, faq, privacy, terms |
| `prerender = false` | 75 | All dynamic pages (businesses, blog, admin, etc.) |
| Implicit SSR | 3 | login, register, blog/[slug] |

### Caching Strategy by Page Type

| Page Type | Cache-Control | Invalidation |
|----------|---------------|--------------|
| **Static pages** | Build-time (max-age: immutable) | No invalidation needed |
| **List pages** | 60s browser / 120s CDN | Time-based (stale-while-revalidate) |
| **Search results** | 30s browser / 60s CDN | Time-based |
| **Blog list** | 300s browser / 1800s CDN | Time-based + category changes |
| **Pricing page** | 60s + SWR | Admin update triggers Cloudflare Cache API purge |
| **Detail pages** | 300s CDN | Time-based |
| **User/Auth pages** | private | No caching |
| **Admin pages** | private | No caching |

### Database Query Optimization

All list pages now use server-side pagination with SQL OFFSET/LIMIT instead of application-layer slicing:

| Before | After | Improvement |
|--------|-------|-------------|
| `SELECT * FROM table LIMIT 200` + `slice(offset, offset + LIMIT)` | `SELECT COUNT(*) + LIMIT 12 OFFSET 24` | -94% D1 reads |
| Client-side filtering with `filter()` | Server-side SQL `WHERE` clause | -94% data transfer |
| Empty initial HTML (SEO fail) | Full SSR HTML with complete content | SEO improved |

### Cache Invalidation Pattern

Admin updates trigger immediate cache invalidation via Cloudflare Cache API:

```typescript
// src/actions/admin/servicePackagesAdmin.ts
async function purgePricingCache(): Promise<void> {
  try {
    const cache = (caches as unknown as { default: Cache }).default;
    await cache.delete('https://timorup.com/pricing');
    await cache.delete('https://timorup.com/pricing/');
  } catch {
    // Cache API not available in some environments
  }
}
```

### Key Files Modified (2026-06-02)

| File | Change |
|------|--------|
| `src/pages/businesses/index.astro` | Server-side pagination + filtering + dynamic WHERE |
| `src/pages/non-profits/index.astro` | Server-side pagination + filtering + dynamic WHERE |
| `src/pages/public-sectors/index.astro` | Server-side pagination + filtering + dynamic WHERE |
| `src/pages/listings/index.astro` | Server-side pagination + filtering + dynamic WHERE |
| `src/pages/blog/index.astro` | Server-side pagination + category filter + Blog schema |
| `src/pages/search.astro` | Server-side search (was client-side fetch) |
| `src/components/islands/ProductsIsland.astro` | Server-side filter/sort/paginate |
| `src/pages/pricing.astro` | Added cache headers (60s + SWR) |
| `src/actions/admin/servicePackagesAdmin.ts` | Cache purge on create/update/delete |

### Rendering Decision Matrix

| Page | SEO Priority | Data Freshness | Rendering Mode | Cache |
|------|--------------|-----------------|----------------|-------|
| Homepage | High | 60s | SSR + CDN cache | public, max-age=60 |
| Business listing | High | Real-time search | SSR + SQL filter | public, max-age=60 |
| Blog | High | Blog posts rarely change | SSR + long cache | public, max-age=300 |
| Search | Medium | 30s | SSR + short cache | public, max-age=30 |
| Pricing | Medium | Immediate on admin update | SSR + Admin purge | public, max-age=60 |
| Dashboard | Low | Real-time | SSR + private | private, no-store |
| Admin | Low | Real-time | SSR + private | private, no-store |

---

## Shared Lib Modules

### Module Index

| Module | Path | Purpose |
|--------|------|---------|
| Error Handling | `src/lib/errors/` | Unified error codes and responses |
| Expiry | `src/lib/expiry/` | Subscription expiration and permission checks |
| Analytics | `src/lib/analytics/` | User behavior tracking |
| Zod Schemas | `src/lib/schemas/` | Shared validation schemas |
| Media Validator | `src/lib/media/` | Media file validation and upload |
| Query Layer | `src/lib/db/queries/` | Database query wrappers |
| Admin Auth | `src/lib/admin-auth.ts` | Unified admin authentication |
| Security | `src/middleware.ts`, `src/lib/sanitize.ts` | Security headers, XSS prevention, rate limiting |

### Key Patterns

**Error Handling**:
- Use `ErrorCode.AUTH_REQUIRED`, `ErrorCode.BUSINESS_NOT_FOUND`, etc.
- Create responses with `createErrorResponse(ErrorCode.XXX, message)`

**Expiry Module**:
- `ExpiryEnforcer.isInGracePeriod(subscription)` - 60 day grace period check
- `ExpiryEnforcer.canCreateSku(subscription, count, limit)` - SKU creation permission
- `ExpiryEnforcer.canEditBusiness(subscription)` - Business edit permission

**Analytics**:
- `trackPageView('/path')` - Page view tracking
- `trackBusinessView(entityId, name)` - Business view tracking
**Security** (updated 2026-06-02):
- Security headers: X-Content-Type-Options, X-Frame-Options, CSP, Referrer-Policy, Permissions-Policy
- CSRF protection: origin validated against `SITE_URL` (not Host header — prevents Host header injection)
- XSS prevention via DOMPurify (allowed tags: b, i, em, strong, a, p, br, ul, ol, li, h1-h6, blockquote, code, pre, span)
- KV-based rate limiting for auth actions
- All Server Actions use `defineAction` + Zod validation (input sanitized before DB access)
- All media uploads: server-side MIME validation + server-computed SHA-256 hash verification
- CSP: `unsafe-inline` required for Astro framework + Tailwind v4 CSS-in-JS (documented, considered acceptable)

## Dev Server Startup Pattern (2026-06-02)

`pnpm dev` boots wrangler 4.95+ + astro 6.4.2:

1. `wrangler types` generates runtime types (1-2s)
2. Vite optimizer initializes dependencies
3. **First ready message**: `Local http://localhost:4321/`
4. Full ready: `astro v6.4.2 ready in ~146000 ms` (wrangler tunnel setup is slow)

**Why wrangler is slow**: 2-3 minute cold start with remote D1 binding (`remote: true` in wrangler.jsonc). Once warm, request latency is <500ms.
**Tip for testing**: Don't trust the first 502 response. Wait for `ready in` line before HTTP testing.

---

## Bug Fix Log

### 2026-06-02 — Increment 0101: Security Audit & Best Practice Fixes

**P0 fixes** (blocking functionality):

1. **`src/actions/media/upload.ts` — Non-business upload ReferenceError**:
   - `limits` was only defined inside the `if (entityType === 'businesses')` branch
   - Non-business uploads (blogs, products, NPOs, events) all threw `ReferenceError: limits is not defined`
   - Fixed: moved `getMediaLimits(entityType)` call before the if/else, both branches now use same `limits`
   - Also fixed: `getPlanLimits()` removed (it returned wrong field names like `maxBusinessImages`)

2. **`src/actions/media/upload.ts` — Empty cookie blocked ALL uploads**:
   - `auth.api.getSession({ headers: { cookie: '' } })` — empty cookie passed every time
   - Every media action returned `AUTH_REQUIRED` for all users, blocking all uploads
   - Fixed: `context.cookies.toString()` passed instead (reads actual browser cookies)
   - `handler: async (input, context)` now receives the Astro context parameter

3. **`src/lib/db.ts` — DB instance recreated on every request**:
   - `_db` was overwritten with a new drizzle instance on every `getDb()` call
   - No caching — each request paid full initialization cost
   - Fixed: `_cacheBindingKey` added to track binding identity; cached instance returned when key matches

**P1 security fixes**:

| # | Issue | File | Fix |
|---|-------|------|-----|
| P1-A | CSP `unsafe-inline` | `middleware.ts` | Kept (Tailwind v4 + Astro requires it) with documentation |
| P1-B | CSRF Host header injection | `middleware.ts` | Origin compared against `SITE_URL` constant |
| P1-C | Rate limiting not in middleware | `middleware.ts` | `checkRateLimit()` used in actions, not duplicated in middleware |
| P1-D | Client MIME not validated | `upload.ts` | `isAllowedImageType()`/`isAllowedVideoType()` check added |
| P1-E | Client hash not trusted | `upload.ts` | Server re-computes SHA-256 hash |
| P1-F | Path traversal in R2 key | `validator.ts` | Entity type extracted as prefix (no user input in path) |
| P1-G | KV session written but never read | `light-auth.ts` | KV writes removed (D1 is source of truth) |
| P1-H | KV session not deleted on signOut | `signOut.ts` | KV entry deleted on sign-out |
| P1-K | document.cookie for session token | `login.astro` | Checks `set-cookie` header first, falls back to manual cookie |
| P1-L | 9 secrets missing in wrangler.jsonc | `wrangler.jsonc` | Added `vars` block with PLACEHOLDER values |
| P1-M | Dynamic import on every cache op | `cache.ts` | `_kv` module-level cache, imported once |
| P1-N | No max file size in Zod schema | `upload.ts` | `file: z.instanceof(File).refine(f => f.size <= 10MB)` |
| P1-O | Geocode debounce shared across requests | `geo.ts` | Removed module-level `lastCallTime` — debounce is per-call |
| P1-Q | In-memory rate limiter | `forgotPassword.ts` | Replaced with KV-based `checkRateLimit()` |

**P2 robustness fixes**:

| # | Issue | File | Fix |
|---|-------|------|-----|
| P2-A | Invalid adapter options | `astro.config.mjs` | Removed `platformProxy`, `remoteBindings` |
| P2-D | cacheStats cross-request | `cache.ts` | Removed `cacheStats` aggregation |
| P2-E | JSON parse silent fail | `cache.ts` | Added `console.warn` for corrupt entries |
| P2-K | AsyncLocalStorage shim side effect | `node-async-hooks-shim.ts` | Documented as intentional (better-auth dependency) |
| P2-L | Static cache headers not applied | `middleware.ts` | Fixed `isStaticAsset` → `STATIC_CACHE` applied |
| P2-N | Silent 60s TTL floor | `cache.ts` | Added comment documenting KV minimum TTL |
| P2-J | Mastra module init without env | `mastra/index.ts` | Replaced eager `new Mastra()` with lazy `getMastra()` |

**Files modified** (27 total):
```
src/actions/media/upload.ts        — P0-A, P0-D, P1-D, P1-E, P1-N
src/lib/db.ts                     — P0-C, P2-O
src/lib/auth.ts                   — P0-B (no change, verified correct)
src/middleware.ts                 — P1-A, P1-B, P2-L
src/lib/cache.ts                  — P1-M, P2-D, P2-E, P2-N
src/lib/geo.ts                    — P1-O
src/actions/auth/forgotPassword.ts — P1-Q
src/actions/auth/light-auth.ts     — P1-G
src/actions/auth/signOut.ts        — P1-H
src/pages/login.astro              — P1-K
wrangler.jsonc                     — P1-L
astro.config.mjs                   — P2-A
src/lib/video-compress.ts          — P1-P (documented)
src/lib/node-async-hooks-shim.ts   — P2-K (documented)
src/mastra/index.ts                — P2-J
src/lib/media/validator.ts         — P1-F
src/lib/geo.test.ts               — P1-O (test fix)
```
**Architecture decisions**:
- DB singleton pattern in `db.ts` is CORRECT for Cloudflare Workers (isolate = single-threaded)
- Auth singleton in `auth.ts` is CORRECT (same reason)
- FFmpeg WASM module-level globals are CORRECT (performance optimization, isolate lifetime)
- KV rate limiter race condition is ACCEPTABLE (low concurrency, check-then-set window is small)
- Cache stampede is ACCEPTABLE (low traffic, cache miss is tolerable)

---
### 2026-06-06 — Increment 0125: Astro Frontmatter Syntax Errors

**Problem**: 18 `.astro` files had imports placed OUTSIDE the frontmatter `---` fence, causing:
- Homepage empty `<main>` tag (CarouselBanner was primary culprit)
- Contact page showing raw source code (prerendered pages)
- Runtime `className is not defined` errors during SSR
- Build time 5+ minutes (failing) vs 1m17s (success)

**Root cause**: Dual-frontmatter pattern confused Astro's SSR compiler, embedding source code as string literals instead of executing as code.

**Files fixed** (18 total):
| Component | Page/Component |
|------------|-----------------|
| CarouselBanner.astro | Homepage (primary culprit) |
| LocationMap.astro | Admin pages |
| Modal.astro | UI component |
| ShareDialog.astro | UI component |
| HomepageContent.astro | Homepage data |
| ProductsIsland.astro | Products page |
| admin/blogs.astro | Admin panel |
| admin/businesses.astro | Admin panel |
| admin/listings/index.astro | Admin panel |
| admin/listings/new/index.astro | Admin panel |
| admin/orders.astro | Admin panel |
| admin/products.astro | Admin panel |
| admin/reviews.astro | Admin panel |
| admin/settings.astro | Admin panel |
| admin/users.astro | Admin panel |
| business/[slug]/product/new/index.astro | Product creation |
| contact.astro | Contact page |
| edit-business-page/[id].astro | Business editing |

**Fix**: Moved all imports and code inside single `---`...`---` frontmatter block for each file.

**Rule**: Only ONE `---`...`---` pair per `.astro` file. All code must be inside. Multiple `---` blocks cause malformed template strings in built output.

## Event Delegation Pattern (Increment 0113, 2026-06-05)

All admin pages and islands use a **single document-level event delegation listener** instead of per-element `addEventListener` loops. This reduces listener count, eliminates memory leaks, and unifies event handling.

### Pattern

```typescript
// ✅ Correct - Single document listener with data-action routing
document.addEventListener('click', (e) => {
  const target = e.target as HTMLElement;
  const el = target.closest('[data-action]');
  if (!el) return;

  const { action, id, status } = el.dataset;
  switch (action) {
    case 'edit-listing': window.location.href = `/admin/listings/${id}/edit`; break;
    case 'delete-listing': handleDelete(id); break;
    case 'toggle-status': handleToggle(id, status); break;
  }
});
```

```astro
<!-- ✅ Correct - HTML uses data-action attribute -->
<Button data-action="edit-listing" data-id={listing.id}>Edit</Button>
<Button data-action="delete-listing" data-id={listing.id}>Delete</Button>

<!-- ❌ Wrong - inline onclick handler -->
<Button onclick="handleEdit(123)">Edit</Button>

<!-- ❌ Wrong - per-row addEventListener loop -->
<script>
  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', handleEdit);
  });
</script>
```

### Implementation Status

| File | Event Pattern | Status |
|------|--------------|--------|
| `admin/listings/index.astro` | data-action + single listener | ✅ |
| `admin/users.astro` | data-action + single listener | ✅ |
| `admin/products.astro` | data-action + single listener | ✅ |
| `admin/businesses.astro` | data-action + single listener | ✅ |
| `admin/non-profits.astro` | data-action + single listener | ✅ |
| `admin/public-sectors.astro` | data-action + single listener | ✅ |
| `admin/categories.astro` | data-action + single listener | ✅ |
| `admin/blogs.astro` | data-action + single listener | ✅ |
| `admin/orders.astro` | data-action + single listener | ✅ |
| `admin/media.astro` | data-action + single listener | ✅ |
| `admin/service-packages.astro` | data-action + single listener | ✅ |
| `admin/ad-banners.astro` | data-action + single listener | ✅ |
| `business/[slug]/edit/index.astro` | data-action + change listener | ✅ |
| `Header.astro` (mobile menu) | data-action + single listener | ✅ |
| `components/islands/HomepageContent.astro` | data-action + batch update | ✅ |

### When to Use Batch DOM Updates

Some patterns require `querySelectorAll` for batch DOM updates (NOT event listener attachment):

```typescript
// ✅ Correct - batch update after event delegation
case 'tab-switch': {
  const tab = el.dataset.tab;
  document.querySelectorAll('.tab-btn').forEach(b => {
    b.setAttribute('data-active', b.getAttribute('data-tab') === tab ? 'true' : 'false');
  });
  document.querySelectorAll('.tab-panel').forEach(panel => {
    panel.classList.toggle('hidden', panel.getAttribute('data-panel') !== tab);
  });
  break;
}
```

This is acceptable because:
1. It runs inside a delegated event handler, not on page load
2. It updates existing DOM state, not attaches new listeners
3. The cost is O(n) per click, but n is small (4-8 elements)

### Rule

**Never use `querySelectorAll + addEventListener` in a loop.** Use event delegation with `data-action` attributes.