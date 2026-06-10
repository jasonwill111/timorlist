# Tasks: 0151 -- Extract business/[slug].astro data layer

## Task Notation
- [T###]: Task ID | [P]: Parallelizable | [x]: Completed | [ ]: Pending

---

## US-001: Create business-detail query module (P0)

### T-001: Create `src/lib/db/queries/business-detail.ts` with interfaces
**Status**: [x] completed
**Test**: Given business-detail.ts -> When imported -> Then all interfaces export correctly
**AC**: AC-US1-01
**File**: src/lib/db/queries/business-detail.ts

### T-002: Implement `getBusinessBySlug`
**Status**: [x] completed
**Test**: Given slug "test" -> When called -> Returns business record or null
**AC**: AC-US1-02
**File**: src/lib/db/queries/business-detail.ts

### T-003: Implement `getBusinessCategory`
**Status**: [x] completed
**Test**: Given categoryId -> When called -> Returns category or null
**AC**: AC-US1-03
**File**: src/lib/db/queries/business-detail.ts

### T-004: Implement `getBusinessReviews`
**Status**: [x] completed
**Test**: Given businessId -> When called -> Returns reviews ordered by createdAt desc
**AC**: AC-US1-04
**File**: src/lib/db/queries/business-detail.ts

### T-005: Implement `getBusinessGallery` and `getBusinessUpdates`
**Status**: [x] completed
**Test**: Given businessId -> When called -> Returns gallery images and updates (limit 4)
**AC**: AC-US1-05, AC-US1-06
**File**: src/lib/db/queries/business-detail.ts

### T-006: Implement `isBusinessOwner`
**Status**: [x] completed
**Test**: Given valid session token and owner businessId -> When called -> Returns true
**AC**: AC-US1-07
**File**: src/lib/db/queries/business-detail.ts

---

## US-002: Wire query functions into business/[slug].astro (P0)

### T-007: Replace DB queries in frontmatter with query function calls
**Status**: [x] completed
**Test**: Given business/[slug].astro -> When parsed -> Then no raw db.select().from() calls remain
**AC**: AC-US2-01
**File**: src/pages/business/[slug].astro

### T-008: Verify frontmatter ≤ 30 lines of meaningful code
**Status**: [x] completed
**Test**: Given business/[slug].astro -> When counted -> Then frontmatter meaningful lines ≤ 30
**AC**: AC-US2-03
**File**: src/pages/business/[slug].astro

---

## US-003: Build Verification (P0)

### T-009: Build verification
**Status**: [x] completed
**Test**: Given all changes -> When pnpm exec -- astro build -> Then exit code 0

---

## Progress
| US | Done | Total |
|----|------|-------|
| US-001 | 6/6 | 6 |
| US-002 | 2/2 | 2 |
| US-003 | 1/1 | 1 |
| **Total** | **0/9** | **9** |
