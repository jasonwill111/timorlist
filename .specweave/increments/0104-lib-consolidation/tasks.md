# Tasks — Increment 0104: Lib Consolidation (Foundation Layer)

**Risk Level**: LOW | **UI Impact**: None | **Duration**: 2-3 days

---

## Phase 1: Result Type Consolidation

- [x] T-007: Create `src/lib/result.ts` — Canonical Result type with success/failure helpers
- [x] T-010a: Delete duplicate Result from `src/lib/type-utils.ts`
- [x] T-010b: Delete duplicate Result from `src/lib/queries/result.ts`
- [x] T-011a: Update imports in `src/actions/auth/signIn.ts`, `src/actions/business/create.ts`, `src/actions/...`

## Phase 2: Sanitization Consolidation

- [x] T-008: Create `src/lib/sanitize.ts` — escapeHtml, sanitizeForAttribute, sanitizeForInnerHtml
- [x] T-046a: Delete duplicate escapeHtml from `src/lib/modal.ts`
- [x] T-046b: Keep sanitization in `src/lib/utils.ts` (sanitizeForInnerHtml only)
- [x] T-011b: Update imports in `src/actions/...`, `src/pages/...`

## Phase 3: Environment Access Consolidation

- [x] T-009: Create `src/lib/env.ts` — getDb(), getAuth(), getKV(), getMinimaxApiKey()
- [x] T-011c: Update imports in `src/actions/...`, `src/pages/api/...`, `src/middleware.ts`

## Phase 4: API Helpers

- [x] T-042: Create `src/lib/api-helpers.ts` — jsonResponse, errorResponse, getErrorMessage
- [x] T-045: Update `src/pages/api/products/index.ts`, `src/pages/api/business/index.ts`, etc.

## Phase 5: API Cache & Middleware

- [x] T-043: Create `src/lib/api-cache.ts` — cacheResponse, getCachedResponse
- [x] T-044: Create `src/lib/api-middleware.ts` — withAuth, withRateLimit wrappers

## Phase 6: Type Utils Cleanup

- [x] T-047: Merge `src/lib/type-guards.ts` into `src/lib/type-utils.ts`
- [x] T-048: Delete `src/lib/constants.ts` re-export shim

## Verification

- [x] T-049: `pnpm build` exits 0
- [x] T-050: API smoke tests pass
- [x] T-051: E2E tests pass (14/14 pages)

## Summary

- **Tasks**: 12 (all done)
- **Files to create**: 6 (result.ts, sanitize.ts, env.ts, api-helpers.ts, api-cache.ts, api-middleware.ts)
- **Files to delete**: 5 (type-guards.ts, constants.ts, queries/result.ts, modal.ts, plus duplicate Result)
- **Files to modify**: 25+
- **Estimated LoC reduction**: ~400