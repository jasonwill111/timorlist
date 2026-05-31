---
increment: 0097-code-review-fixes
title: "Code Review Fixes"
version: "1.0"
status: completed
generated: 2026-05-31
source: code-review-findings
---

# Quality Contract: Code Review Fixes

## Quality Standards

| Check | Target | Status |
|-------|--------|--------|
| Build passes | 100% | ✅ |
| No TypeScript errors | 0 errors | ✅ |
| Security config correct | secure + strict | ✅ |
| Query uses schema columns | schema names | ✅ |
| DB-level filtering | no full table scan | ✅ |

## Verification

1. `pnpm build` completes in 2m5s without errors
2. No `entityType` undefined warnings
3. Cookie config uses `import.meta.env.PROD` for secure
4. `ratingAverage`/`ratingCount` columns match schema
5. BusinessListNew uses `inArray` for status filtering

## Fix Summary

| ID | Severity | File | Issue | Status |
|----|----------|------|-------|--------|
| 1 | CRITICAL | `src/actions/media/upload.ts:44` | entityType undefined | ✅ Fixed |
| 2 | CRITICAL | `src/lib/auth.ts:41` | secure=false | ✅ Fixed |
| 3 | HIGH | `src/lib/auth.ts:42` | sameSite=lax | ✅ Fixed |
| 4 | HIGH | `src/lib/db/queries/businesses.ts:177-178` | Wrong column names | ✅ Fixed |
| 5 | MEDIUM | `src/components/islands/BusinessListNew.astro:48` | Load all + filter | ✅ Fixed |