# Tasks: 0148 -- List Pages Data Layer Extraction

## Task Notation
- [T###]: Task ID | [P]: Parallelizable | [x]: Completed | [ ]: Pending

---

## US-001: product/[slug].astro Extraction (P0)

### T-001: Extract product/[slug].astro DB logic to query function
**Status**: [x] completed
**Test**: Given pages/product/[slug].astro -> When frontmatter simplified -> Then < 30 lines
**File**: src/pages/product/[slug].astro, src/lib/db/queries/getProductBySlug.ts

---

## US-002: public-sectors/index.astro Extraction (P1)

### T-002: Extract public-sectors/index.astro DB logic
**Status**: [x] completed
**Test**: Given pages/public-sectors/index.astro -> When frontmatter simplified -> Then < 30 lines
**File**: src/pages/public-sectors/index.astro, src/lib/db/queries/getPublicSectors.ts

---

## US-003: non-profits/index.astro Extraction (P1)

### T-003: Extract non-profits/index.astro DB logic
**Status**: [x] completed
**Test**: Given pages/non-profits/index.astro -> When frontmatter simplified -> Then < 30 lines
**File**: src/pages/non-profits/index.astro, src/lib/db/queries/getNonProfits.ts

---

## US-004: businesses/index.astro Extraction (P1)

### T-004: Extract businesses/index.astro DB logic
**Status**: [x] completed
**Test**: Given pages/businesses/index.astro -> When frontmatter simplified -> Then < 30 lines
**File**: src/pages/businesses/index.astro, src/lib/db/queries/getBusinesses.ts

---

## US-005: blog/index.astro Extraction (P1)

### T-005: Extract blog/index.astro DB logic
**Status**: [x] completed
**Test**: Given pages/blog/index.astro -> When frontmatter simplified -> Then < 30 lines
**File**: src/pages/blog/index.astro, src/lib/db/queries/getBlogPosts.ts

---

## US-006: Build Verification (P0)

### T-006: Build verification
**Status**: [x] completed
**Test**: Given all changes -> When pnpm exec -- astro build -> Then exit code 0

---

## Progress
| US | Done | Total |
|----|------|-------|
| US-001 | 0/1 | 1 |
| US-002 | 0/1 | 1 |
| US-003 | 0/1 | 1 |
| US-004 | 0/1 | 1 |
| US-005 | 0/1 | 1 |
| US-006 | 0/1 | 1 |
| **Total** | **0/6** | **6** |
