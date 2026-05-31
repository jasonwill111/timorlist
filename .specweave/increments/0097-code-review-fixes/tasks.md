# Tasks: Code Review Fixes

## Task Notation

- `[T###]`: Task ID
- `[P]`: Parallelizable
- `[ ]`: Not started
- `[x]`: Completed

## T-001: Fix Media Upload entityType
**User Story:** US-001 | **Status:** [x] completed
**AC:** AC-US1-01, AC-US1-02
**Test:** Given media upload with valid file and type `'businesses/biz-123/profile'` → When handler executes → Then `validateMediaFile()` receives `'businesses'` as entity type

**Changes:**
- File: `src/actions/media/upload.ts:43-44`
- Add: `const entityType = input.type.split('/')[0];` before validation call

---

## T-002: Fix Auth Cookie Security
**User Story:** US-002 | **Status:** [x] completed
**AC:** AC-US2-01, AC-US2-02, AC-US2-03
**Test:** Given production environment → When session created → Then cookie has `secure: true, sameSite: 'strict'`

**Changes:**
- File: `src/lib/auth.ts:39-45`
- Update `cookieConfig` block with conditional secure and strict sameSite

---

## T-003: Fix Business Rating Columns
**User Story:** US-003 | **Status:** [x] completed
**AC:** AC-US3-01, AC-US3-02, AC-US3-03
**Test:** Given existing reviews → When updateBusinessRating() runs → Then `ratingAverage` and `ratingCount` columns updated in DB

**Changes:**
- File: `src/lib/db/queries/businesses.ts:175-182`
- Change `rating` → `ratingAverage`, `reviewCount` → `ratingCount`

---

## T-004: Fix BusinessListNew DB Filter
**User Story:** US-004 | **Status:** [x] completed
**AC:** AC-US4-01, AC-US4-02, AC-US4-03
**Test:** Given business list page → When loaded → Then only active/live/published rows fetched from DB

**Changes:**
- File: `src/components/islands/BusinessListNew.astro:47-55`
- Import `inArray` from drizzle-orm
- Replace `.all()` + client filter with `.where(inArray(...))`