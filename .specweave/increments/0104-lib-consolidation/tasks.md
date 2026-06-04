# Tasks — Increment 0104: Lib Consolidation (Foundation Layer)

**Risk Level**: LOW | **UI Impact**: None | **Duration**: 2-3 days

---

## Phase 1: Result Type Consolidation

- [ ] T-007: Create `src/lib/result.ts` — Canonical Result type with success/failure helpers
- [ ] T-010a: Delete duplicate Result from `src/lib/type-utils.ts`
- [ ] T-010b: Delete duplicate Result from `src/lib/queries/result.ts`
- [ ] T-011a: Update imports in `src/actions/auth/signIn.ts`, `src/actions/business/create.ts`, `src/actions/...`

## Phase 2: Sanitization Consolidation

- [ ] T-008: Create `src/lib/sanitize.ts` — escapeHtml, sanitizeForAttribute, sanitizeForInnerHtml
- [ ] T-046a: Delete duplicate escapeHtml from `src/lib/modal.ts`
- [ ] T-046b: Keep sanitization in `src/lib/utils.ts` (sanitizeForInnerHtml only)
- [ ] T-011b: Update imports in `src/actions/...`, `src/pages/...`

## Phase 3: Environment Access Consolidation

- [ ] T-009: Create `src/lib/env.ts` — getDb(), getAuth(), getKV(), getMinimaxApiKey()
- [ ] T-011c: Update imports in `src/actions/...`, `src/pages/api/...`, `src/middleware.ts`

## Phase 4: API Helpers

- [ ] T-042: Create `src/lib/api-helpers.ts` — jsonResponse, errorResponse, getErrorMessage
- [ ] T-045: Update `src/pages/api/products/index.ts`, `src/pages/api/business/index.ts`, etc.

## Phase 5: API Cache & Middleware

- [ ] T-043: Create `src/lib/api-cache.ts` — cacheResponse, getCachedResponse
- [ ] T-044: Create `src/lib/api-middleware.ts` — withAuth, withRateLimit wrappers

## Phase 6: Type Utils Cleanup

- [ ] T-047: Merge `src/lib/type-guards.ts` into `src/lib/type-utils.ts`
- [ ] T-048: Delete `src/lib/constants.ts` re-export shim

## Verification

- [ ] T-049: `pnpm build` exits 0
- [ ] T-050: API smoke tests pass
- [ ] T-051: E2E tests pass (14/14 pages)

## Summary

- **Tasks**: 12
- **Files to create**: 6 (result.ts, sanitize.ts, env.ts, api-helpers.ts, api-cache.ts, api-middleware.ts)
- **Files to delete**: 5 (type-guards.ts, constants.ts, queries/result.ts, modal.ts, plus duplicate Result)
- **Files to modify**: 25+
- **Estimated LoC reduction**: ~400