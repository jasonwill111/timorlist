# Tasks — Increment 0107: API Layer Consolidation

**Source of truth**: src/lib/api-helpers.ts, src/lib/api-cache.ts, src/lib/api-middleware.ts (created in 0103)

## Phase 1: jsonResponse Consolidation

- [ ] T-101: `src/pages/api/admin/skus/index.ts` — replace local jsonResponse with import from @/lib/api-helpers
- [ ] T-102: `src/pages/api/products/index.ts` — replace local jsonResponse with import from @/lib/api-helpers
- [ ] T-103: `src/pages/api/products/[id].ts` — replace local jsonResponse with import from @/lib/api-helpers
- [ ] T-104: Verify no inline `function jsonResponse` remains in src/pages/api/
- [ ] T-105: curl test: GET /api/products → 200 with success/data shape
- [ ] T-106: curl test: POST /api/products (no auth) → 401 with success:false shape
- [ ] T-107: `pnpm build` exits 0

## Phase 2: Error Response Standardization

- [ ] T-201: Apply `unauthorizedResponse` from @/lib/api-helpers to all 12 admin routes
- [ ] T-202: Apply `notFoundResponse` to all routes that return 404
- [ ] T-203: Apply `badRequestResponse` to validation failures
- [ ] T-204: Verify error shape: `{ success: false, error: { code, message } }`

## Phase 3: Rate Limiting

- [ ] T-301: Wrap admin/ai-tools endpoints with withRateLimit (60/min/IP)
- [ ] T-302: Wrap admin/businesses endpoints with withRateLimit
- [ ] T-303: Wrap admin/categories endpoints with withRateLimit
- [ ] T-304: Wrap admin/blogs endpoints with withRateLimit
- [ ] T-305: Wrap admin/users endpoints with withRateLimit
- [ ] T-306: Wrap admin/listings endpoints with withRateLimit
- [ ] T-307: Wrap admin/products endpoints with withRateLimit
- [ ] T-308: Wrap admin/reviews endpoints with withRateLimit
- [ ] T-309: curl test: 61st request returns 429 with Retry-After header

## Phase 4: Method Enforcement

- [ ] T-401: Apply withMethods to all API routes declaring allowed methods
- [ ] T-402: curl test: PUT to GET-only endpoint returns 405 with Allow header

## Phase 5: Edge Caching

- [ ] T-501: Apply cachedJsonResponse with 'API' preset to /api/products GET
- [ ] T-502: Apply cachedJsonResponse to /api/categories GET
- [ ] T-503: Apply cachedJsonResponse to /api/businesses GET
- [ ] T-504: Apply cachedJsonResponse to /api/listings GET
- [ ] T-505: Apply cachedJsonResponse to /api/reviews GET
- [ ] T-506: Apply cachedJsonResponse to /api/plans GET
- [ ] T-507: curl -I test confirms Cache-Control header present

## Phase 6: Verification

- [ ] T-601: `pnpm build` exits 0
- [ ] T-602: curl smoke test: 10 endpoints (mix of GET/POST/PUT/DELETE) all return expected shapes
- [ ] T-603: wrangler deploy to production
- [ ] T-604: Post-deploy curl verification on production URL
- [ ] T-605: No 500 errors in production logs after deploy

## Completion Criteria

- [ ] Zero inline `jsonResponse` functions in `src/pages/api/`
- [ ] All admin write endpoints rate-limited
- [ ] All endpoints use `withMethods` to declare allowed methods
- [ ] All public GET endpoints have cache headers
- [ ] `pnpm build` exits 0
- [ ] Production curl tests pass
