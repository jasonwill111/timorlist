---
increment: 0097-code-review-fixes
title: "Code Review Fixes"
type: feature
priority: P1
status: completed
created: 2026-05-31
structure: user-stories
test_mode: TDD
coverage_target: 80
---

# Code Review Fixes

**Project:** timorup

## Summary

Fix 2 critical + 2 high security and data integrity issues found in full project code review.

---

## User Stories

### US-001: Fix Media Upload Runtime Error
**Project:** timorup

**As a** developer
**I want** the media upload action to work correctly
**So that** users can upload files without crashes

**Acceptance Criteria**:
- [x] **AC-US1-01**: `entityType` is extracted from `input.type` before `validateMediaFile()` call
- [x] **AC-US1-02**: Build passes without errors

---

### US-002: Fix Auth Cookie Security
**Project:** timorup

**As a** security engineer
**I want** session cookies to be secure in production
**So that** session hijacking is prevented on HTTP connections

**Acceptance Criteria**:
- [x] **AC-US2-01**: `secure` cookie flag is `true` when `import.meta.env.PROD` is true
- [x] **AC-US2-02**: `sameSite` is set to `'strict'` to prevent CSRF
- [x] **AC-US2-03**: Production build succeeds

---

### US-003: Fix Businesses Query Column Names
**Project:** timorup

**As a** backend developer
**I want** the business rating update query to use correct column names
**So that** ratings are stored correctly in the database

**Acceptance Criteria**:
- [x] **AC-US3-01**: Update query uses `ratingAverage` instead of `rating`
- [x] **AC-US3-02**: Update query uses `ratingCount` instead of `reviewCount`
- [x] **AC-US3-03**: Build passes with no type errors

---

### US-004: Fix BusinessListNew DB Query
**Project:** timorup

**As a** frontend developer
**I want** the business list to filter at database level
**So that** memory usage is reduced with large datasets

**Acceptance Criteria**:
- [x] **AC-US4-01**: Status filtering uses `WHERE IN` clause at DB level
- [x] **AC-US4-02**: No client-side filtering of full dataset
- [x] **AC-US4-03**: Build passes

---

## Changes Made

| File | Issue | Fix |
|------|-------|-----|
| `src/actions/media/upload.ts:44` | entityType undefined | Extract from `input.type.split('/')[0]` |
| `src/lib/auth.ts:41-42` | secure=false, sameSite=lax | `secure: import.meta.env.PROD`, `sameSite: 'strict'` |
| `src/lib/db/queries/businesses.ts:177-178` | rating/reviewCount | ratingAverage/ratingCount |
| `src/components/islands/BusinessListNew.astro:48` | .all() then filter | `inArray(businesses.status, ['active', 'live', 'published'])` |

---

## Verification

- Build: `pnpm build` passes
- No TypeScript errors
- All 4 files modified correctly