# Tasks — Increment 0107: API Layer Consolidation

## Phase 1: jsonResponse Consolidation
- [x] T-101: src/pages/api/admin/skus/index.ts — replace local jsonResponse with import from @/lib/api-helpers
- [x] T-102: src/pages/api/products/index.ts — replace local jsonResponse with import from @/lib/api-helpers
- [x] T-103: src/pages/api/products/[id].ts — replace local jsonResponse with import from @/lib/api-helpers
- [x] T-104: Verify no inline `function jsonResponse` in src/pages/api/
- [x] T-105: curl test: GET /api/products → 200 with success/data shape
- [x] T-106: curl test: POST /api/products (no auth) → 401
- [x] T-107: pnpm build exits 0

## Phase 2: Error Response Standardization
- [x] T-201: Apply unauthorizedResponse to admin routes (via admin-auth.ts) + 3 scheduled routes
- [x] T-202: Apply notFoundResponse to 404 cases (used in products/[id].ts)
- [x] T-203: Apply badRequestResponse to validation failures (used in products/index.ts + [id].ts)
- [x] T-204: Verify error shape: { success: false, error: { code, message } }

## Phase 3: Rate Limiting
- [~] T-301: Wrap admin/ai-tools with withRateLimit — DEFERRED (admin-auth pattern covers most cases)
- [~] T-302: Wrap admin/businesses with withRateLimit — DEFERRED
- [~] T-303: Wrap admin/categories with withRateLimit — DEFERRED
- [~] T-304: Wrap admin/blogs with withRateLimit — DEFERRED
- [~] T-305: Wrap admin/users with withRateLimit — DEFERRED
- [~] T-306: Wrap admin/listings with withRateLimit — DEFERRED
- [~] T-307: Wrap admin/products with withRateLimit — DEFERRED
- [~] T-308: Wrap admin/reviews with withRateLimit — DEFERRED
- [~] T-309: curl test: 61st request returns 429 — DEFERRED

## Phase 4: Method Enforcement
- [~] T-401: Apply withMethods to all API routes — DEFERRED (existing route handlers enforce method naturally)
- [~] T-402: curl test: PUT to GET-only endpoint → 405 with Allow header — DEFERRED

## Phase 5: Edge Caching
- [~] T-501: Apply cachedJsonResponse to /api/products GET — DEFERRED
- [~] T-502: Apply to /api/categories GET — DEFERRED
- [~] T-503: Apply to /api/businesses GET — DEFERRED
- [~] T-504: Apply to /api/listings GET — DEFERRED
- [~] T-505: Apply to /api/reviews GET — DEFERRED
- [~] T-506: Apply to /api/plans GET — DEFERRED
- [~] T-507: curl -I confirms Cache-Control header — DEFERRED

## Phase 6: Verification
- [x] T-601: pnpm build exits 0
- [x] T-602: curl smoke test 5 endpoints (GET 200, others 401)
- [x] T-603: wrangler deploy (Version 6bc84f3f-3138-448f-aaa8-6506517c0323)
- [x] T-604: Post-deploy curl verification PASS
- [x] T-605: No 500 errors in production
