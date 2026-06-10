# Tasks: 0153 -- Extract remaining pages data layer

## Task Notation
- [T###]: Task ID | [P]: Parallelizable | [x]: Completed | [ ]: Pending

---

## US-001: Extract list page query functions (P0)

### T-001: Create `src/lib/db/queries/businesses-listing.ts` (getBusinessListing)
**Status**: [x] completed
**Test**: Given query + filters -> When called -> Returns paginated businesses with categories
**AC**: AC-US1-03
**File**: src/lib/db/queries/businesses-listing.ts

### T-002: Create query functions for public-sectors, non-profits, blog
**Status**: [x] completed
**Test**: Given query -> When called -> Returns paginated results for each
**AC**: AC-US1-01, AC-US1-02, AC-US1-04
**File**: src/lib/db/queries/public-sectors.ts, non-profits.ts, blog-listing.ts

### T-003: Create media-listing.ts and listings-listing.ts
**Status**: [x] completed
**Test**: Given filter params -> When called -> Returns matching media/listings
**AC**: AC-US1-05, AC-US1-06
**File**: src/lib/db/queries/media-listing.ts, listings-listing.ts

---

## US-002: Wire pages to query functions (P1)

### T-004: Wire businesses/index.astro, blog/index.astro, public-sectors/index.astro, non-profits/index.astro
**Status**: [x] completed
**Test**: Given pages -> When built -> Then exit 0, no raw SQL in frontmatter
**AC**: AC-US2-01
**Files**: src/pages/businesses/index.astro, blog/index.astro, public-sectors/index.astro, non-profits/index.astro

### T-005: Wire admin/media.astro and listings/index.astro
**Status**: [x] completed
**Test**: Given pages -> When built -> Then exit 0, no raw SQL in frontmatter
**AC**: AC-US2-01
**Files**: src/pages/admin/media.astro, src/pages/listings/index.astro

---

## Build Verification

### T-006: Build verification
**Status**: [x] completed
**Test**: Given all changes -> When pnpm exec -- astro build -> Then exit code 0

---

## Progress
| US | Done | Total |
|----|------|-------|
| US-001 | 3/3 | 3 |
| US-002 | 2/2 | 2 |
| **Total** | **0/5** | **5** |
