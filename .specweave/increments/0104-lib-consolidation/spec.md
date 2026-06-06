---
increment: 0104-lib-consolidation
title: "Lib Consolidation - Foundation Layer"
type: refactor
priority: P1
status: pending
created: 2026-06-04
project: TimorUp
parent: 0103-fulldev-migration-refactor
dependsOn: ["0103-fulldev-migration-refactor"]
---

# Increment 0104: Lib Consolidation - Foundation Layer

## Overview

Refactor backend utility layer to eliminate duplications and create canonical implementations. This increment has **ZERO UI impact** - all changes are backend-only with no visual changes.

**Risk Level**: LOW  
**UI Impact**: None  
**API Impact**: None (helpers refactor internals only)

## Tasks (12)

### Result Type Consolidation

- [ ] T-007: Create `src/lib/result.ts` — Canonical Result type with success/failure helpers
  ```typescript
  export type Result<T, E = Error> = { ok: true; data: T } | { ok: false; error: E };
  export const success = <T>(data: T): Result<T> => ({ ok: true, data });
  export const failure = <E>(error: E): Result<never, E> => ({ ok: false, error });
  ```
- [ ] T-010a: Delete duplicate Result from `src/lib/type-utils.ts`
- [ ] T-010b: Delete duplicate Result from `src/lib/queries/result.ts`
- [ ] T-011a: Update imports in all files using Result type

### Sanitization Consolidation

- [ ] T-008: Create `src/lib/sanitize.ts` — Canonical escaping functions
  ```typescript
  export function escapeHtml(str: string): string { ... }
  export function sanitizeForAttribute(str: string): string { ... }
  export function sanitizeForInnerHtml(str: string): string { ... }
  ```
- [ ] T-046a: Delete duplicate escapeHtml from `src/lib/modal.ts`
- [ ] T-046b: Delete duplicate escapeHtml from `src/lib/utils.ts` (keep sanitization there)
- [ ] T-011b: Update imports in all files using escapeHtml

### Environment Access Consolidation

- [ ] T-009: Create `src/lib/env.ts` — Canonical env access
  ```typescript
  export function getDb(): D1Database { ... }
  export function getAuth(): Auth } { ... }
  export function getKV(): KVNamespace { ... }
  export function getMinimaxApiKey(): string { ... }
  ```
- [ ] T-011c: Update imports in all files using env access

### API Helpers

- [ ] T-042: Create `src/lib/api-helpers.ts`
  ```typescript
  export function getErrorMessage(error: unknown): string { ... }
  export function jsonResponse(data: unknown, status = 200): Response { ... }
  export function errorResponse(message: string, status = 400): Response { ... }
  ```

### API Cache Helpers

- [ ] T-043: Create `src/lib/api-cache.ts`
  ```typescript
  export function cacheResponse(response: Response, ttl: number): Response { ... }
  export async function getCachedResponse(key: string): Promise<Response | null> { ... }
  ```

### API Middleware

- [ ] T-044: Create `src/lib/api-middleware.ts`
  ```typescript
  export function withAuth(handler: (request: Request, user: User) => Promise<Response>): Handler { ... }
  export function withRateLimit(handler: Handler, limit: number): Handler { ... }
  ```

### Type Utils Cleanup

- [ ] T-047: Merge `src/lib/type-guards.ts` into `src/lib/type-utils.ts` (65 lines merge)
- [ ] T-048: Delete `src/lib/constants.ts` re-export shim

### Update API Endpoints

- [ ] T-045: Update all API files to use new lib helpers

## Files to Modify

| File | Changes |
|------|---------|
| src/lib/result.ts | NEW - canonical Result type |
| src/lib/sanitize.ts | NEW - canonical escaping |
| src/lib/env.ts | NEW - canonical env access |
| src/lib/api-helpers.ts | NEW - JSON/error helpers |
| src/lib/api-cache.ts | NEW - cache utilities |
| src/lib/api-middleware.ts | NEW - middleware helpers |
| src/lib/type-utils.ts | MODIFY - merge type-guards.ts |
| src/pages/api/**/*.ts | MODIFY - use new helpers |
| src/actions/**/*.ts | MODIFY - use new helpers |

## Files to Delete

- src/lib/type-guards.ts (merged into type-utils.ts)
- src/lib/constants.ts (re-export shim)
- src/lib/queries/result.ts (merged into result.ts)
- src/lib/modal.ts (escapeHtml consolidated to sanitize.ts)

## Verification

### Build Test
```bash
pnpm build  # Must exit 0
```

### API Smoke Tests
```bash
for endpoint in /api/products /api/business /api/auth /api/listings; do
  curl -sf https://timorup.jasonwill.workers.dev$endpoint > /dev/null && echo "$endpoint: OK" || echo "$endpoint: FAIL"
done
```

### Functional Tests
```bash
node e2e-test.cjs  # All 14 pages should pass
```

## Rollback

```bash
git checkout 0103-security-fixes
npx wrangler deploy --env production
```

## Acceptance Criteria

- [ ] `pnpm build` exits 0
- [ ] All API endpoints respond correctly
- [ ] No duplicate Result type definitions
- [ ] No duplicate escapeHtml implementations
- [ ] Env access consolidated to single module
- [ ] All imports updated to canonical locations
- [ ] E2E tests pass (14/14 pages)

## Estimated Reduction

- **Files deleted**: 5
- **Files modified**: 25+
- **Lines reduced**: ~400 (duplicate code removed)