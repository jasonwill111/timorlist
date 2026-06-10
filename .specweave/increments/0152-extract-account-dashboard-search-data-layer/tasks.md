# Tasks: 0152 -- Extract account + dashboard + search data layer

## Task Notation
- [T###]: Task ID | [P]: Parallelizable | [x]: Completed | [ ]: Pending

---

## US-001: Create shared auth query module (P0)

### T-001: Create `src/lib/db/queries/auth.ts` with `resolveUserFromCookie`
**Status**: [x] completed
**Test**: Given cookie header with valid session token -> When called -> Returns user {id, name, email} or null
**AC**: AC-US1-01, AC-US1-02
**File**: src/lib/db/queries/auth.ts

---

## US-002: Extract account.astro data layer (P0)

### T-002: Implement `getUserPages(userId: string)`
**Status**: [x] completed
**Test**: Given userId -> When called -> Returns businesses with entityType field
**AC**: AC-US2-01
**File**: src/lib/db/queries/auth.ts

### T-003: Implement `getUserSubscription(businessId: string)`
**Status**: [x] completed
**Test**: Given businessId with paid order -> When called -> Returns subscription info
**AC**: AC-US2-02
**File**: src/lib/db/queries/auth.ts

### T-004: Wire account.astro to use query functions
**Status**: [x] completed
**Test**: Given account.astro -> When built -> Then frontmatter <= 40 lines, exit 0
**AC**: AC-US2-03, AC-US2-04
**File**: src/pages/account.astro

---

## US-003: Extract search.astro data layer (P0)

### T-005: Implement `getCategoriesForSearch()` and `searchBusinesses(query, page, limit)`
**Status**: [x] completed
**Test**: Given query "test" -> When searchBusinesses called -> Returns results with pagination
**AC**: AC-US3-01, AC-US3-02
**File**: src/lib/db/queries/search.ts

### T-006: Wire search.astro to use query functions
**Status**: [x] completed
**Test**: Given search.astro -> When built -> Then frontmatter <= 40 lines, exit 0
**AC**: AC-US3-03, AC-US3-04
**File**: src/pages/search.astro

---

## US-004: Extract dashboard.astro data layer (P0)

### T-007: Wire dashboard.astro to use resolveUserFromCookie
**Status**: [x] completed
**Test**: Given dashboard.astro -> When built -> Then frontmatter <= 20 lines, exit 0
**AC**: AC-US4-01, AC-US4-02, AC-US4-03
**File**: src/pages/dashboard.astro

---

## Build Verification

### T-008: Build verification
**Status**: [x] completed
**Test**: Given all changes -> When pnpm exec -- astro build -> Then exit code 0

---

## Progress
| US | Done | Total |
|----|------|-------|
| US-001 | 1/1 | 1 |
| US-002 | 3/3 | 3 |
| US-003 | 2/2 | 2 |
| US-004 | 1/1 | 1 |
| **Total** | **0/7** | **7** |
