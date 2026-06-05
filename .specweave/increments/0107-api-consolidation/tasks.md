# Tasks — Increment 0107: API Layer Consolidation

## Phase 1: jsonResponse Consolidation
- [ ] T-101: src/pages/api/admin/skus/index.ts — replace local jsonResponse with import from @/lib/api-helpers
- [ ] T-102: src/pages/api/products/index.ts — replace local jsonResponse with import from @/lib/api-helpers
- [ ] T-103: src/pages/api/products/[id].ts — replace local jsonResponse with import from @/lib/api-helpers
- [ ] T-104: Verify no inline `function jsonResponse` in src/pages/api/
- [ ] T-105: curl test: GET /api/products → 200 with success/data shape
- [ ] T-106: curl test: POST /api/products (no auth) → 401
- [ ] T-107: pnpm build exits 0

## Phase 2: Error Response Standardization
- [ ] T-201: Apply unauthorizedResponse to all 12 admin routes
- [ ] T-202: Apply notFoundResponse to 404 cases
- [ ] T-203: Apply badRequestResponse to validation failures
- [ ] T-204: Verify error shape: { success: false, error: { code, message } }

## Phase 3: Rate Limiting
- [ ] T-301: Wrap admin/ai-tools with withRateLimit
- [ ] T-302: Wrap admin/businesses with withRateLimit
- [ ] T-303: Wrap admin/categories with withRateLimit
- [ ] T-304: Wrap admin/blogs with withRateLimit
- [ ] T-305: Wrap admin/users with withRateLimit
- [ ] T-306: Wrap admin/listings with withRateLimit
- [ ] T-307: Wrap admin/products with withRateLimit
- [ ] T-308: Wrap admin/reviews with withRateLimit
- [ ] T-309: curl test: 61st request returns 429

## Phase 4: Method Enforcement
- [ ] T-401: Apply withMethods to all API routes
- [ ] T-402: curl test: PUT to GET-only endpoint → 405 with Allow header

## Phase 5: Edge Caching
- [ ] T-501: Apply cachedJsonResponse to /api/products GET
- [ ] T-502: Apply to /api/categories GET
- [ ] T-503: Apply to /api/businesses GET
- [ ] T-504: Apply to /api/listings GET
- [ ] T-505: Apply to /api/reviews GET
- [ ] T-506: Apply to /api/plans GET
- [ ] T-507: curl -I confirms Cache-Control header

## Phase 6: Verification
- [ ] T-601: pnpm build exits 0
- [ ] T-602: curl smoke test 10 endpoints
- [ ] T-603: wrangler deploy
- [ ] T-604: Post-deploy curl verification
- [ ] T-605: No 500 errors in production
