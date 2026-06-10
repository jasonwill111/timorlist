---
increment: 0156-data-layer-extraction
title: Data Layer Extraction — Query Functions
type: refactor
priority: P0
status: completed
created: 2026-06-08T00:00:00.000Z
structure: user-stories
test_mode: test-after
project: timorup
---

## User Stories

### US-001: Extract admin/media data layer
**Project**: timorup

**As a** developer
**I want** admin/media.astro to import data from a query function
**So that** frontmatter contains no drizzle-orm imports and no raw SQL

**Acceptance Criteria**:
- [x] **AC-US1-01**: admin/media.astro frontmatter has zero imports from `@/db/schema` or `drizzle-orm`
- [x] **AC-US1-02**: admin/media.astro imports from `getMediaList` in `src/lib/db/queries/media-listing.ts`
- [x] **AC-US1-03**: admin/media.astro imports `MediaIsland` exactly once (was added in this increment, not deduplicated)
- [x] **AC-US1-04**: `getMediaList` returns `{ items, total, totalPages, totalSizeMB, entityTypes, categories }` — same shape as current inline logic

---

### US-002: Extract admin/listings data layer
**Project**: timorup

**As a** developer
**I want** admin/listings/new and admin/listings/[id]/edit to import data from query functions
**So that** frontmatter contains no db.prepare() calls or drizzle-orm imports

**Acceptance Criteria**:
- [x] **AC-US2-01**: admin/listings/new.astro frontmatter has zero imports from `@/db/schema` or `drizzle-orm`
- [x] **AC-US2-02**: admin/listings/new.astro imports from `getListingCategories` in `src/lib/db/queries/listings.ts`
- [x] **AC-US2-03**: admin/listings/[id]/edit.astro frontmatter has zero imports from `@/db/schema` or `drizzle-orm`
- [x] **AC-US2-04**: admin/listings/[id]/edit.astro imports `getAllListingCategories` from `src/lib/db/queries/listings.ts` and `getListingById` from `src/lib/db/queries/admin-listings.ts`

---

### US-003: Extract business/product data layer
**Project**: timorup

**As a** developer
**I want** business/[slug]/product/new and business/[slug]/product/[id]/edit to import data from query functions
**So that** frontmatter contains no db.prepare() calls or drizzle-orm imports

**Acceptance Criteria**:
- [x] **AC-US3-01**: business/[slug]/product/new.astro frontmatter has zero imports from `@/db/schema` or `drizzle-orm`
- [x] **AC-US3-02**: business/[slug]/product/new.astro imports `getProductCategories` from `src/lib/db/queries/products.ts`; mutations use `actions.products.createProduct` (server action, not query layer)
- [x] **AC-US3-03**: business/[slug]/product/[id]/edit.astro frontmatter has zero imports from `@/db/schema` or `drizzle-orm`
- [x] **AC-US3-04**: business/[slug]/product/[id]/edit.astro imports `getProductCategories` from `src/lib/db/queries/products.ts`; mutations use `actions.products.updateProduct` (server action, not query layer)

---

### US-004: Extract business/[slug]/product/[id]/index data layer
**Project**: timorup

**As a** developer
**I want** business/[slug]/product/[id]/index.astro to use the existing `getProductById` query function
**So that** the 109-line raw SQL frontmatter is replaced with a single function call

**Acceptance Criteria**:
- [x] **AC-US4-01**: business/[slug]/product/[id]/index.astro frontmatter uses `getProductWithDetails` from `src/lib/db/queries/products.ts`
- [x] **AC-US4-02**: business/[slug]/product/[id]/index.astro has zero `db.prepare()` calls
- [x] **AC-US4-03**: business/[slug]/product/[id]/index.astro frontmatter reduced from ~109 lines to 68 lines; inline post-processing (title/desc, spec/price parsing, type labels) remains in frontmatter as non-DB wiring logic

---

### US-005: Build verification
**Project**: timorup

**As a** developer
**I want** all changes to pass `astro build`
**So that** refactoring does not break the project

**Acceptance Criteria**:
- [x] **AC-US5-01**: `pnpm exec -- astro build` exits with code 0
- [x] **AC-US5-02**: No page file imports from `@/db/schema` directly (grep check = 0)
- [x] **AC-US5-03**: All existing query functions in `src/lib/db/queries/` remain intact

---

## Verification

```bash
# Zero schema imports in pages
grep -r "from '@/db/schema'" src/pages/ --include="*.astro" | wc -l
# Expected: 0

# Zero db.prepare in pages
grep -r "db.prepare" src/pages/ --include="*.astro" | wc -l
# Expected: 0

# Build passes
pnpm exec -- astro build
# Expected: exit 0
```
