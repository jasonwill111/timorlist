# Tasks: Data Layer Extraction — Query Functions

## Task Notation

- `**Status**: [x] completed | [ ] pending
- Model hints: haiku (simple), sonnet (default), opus (complex)

---

### T-001: Fix admin/media duplicate import + drizzle cleanup
**AC**: AC-US1-01, AC-US1-03 | **Status**: [x] completed | **Model**: haiku
**Test**: Given admin/media.astro → When `grep "from '@/db/schema'" src/pages/admin/media.astro` → Then 0 matches; duplicate MediaIsland import removed
**Files**: `src/pages/admin/media.astro`
**Implementation**:
1. Remove line 16: `import MediaIsland from '@components/islands/admin/MediaIsland.astro';` (duplicate)
2. Remove line 6: `import { eq, like, sql, desc, isNull, and } from 'drizzle-orm';` (unused after query extraction)
**Verification**: `pnpm exec -- astro build`

---

### T-002: Create listings.ts query functions
**AC**: AC-US2-01, AC-US2-02, AC-US2-03, AC-US2-04 | **Status**: [x] completed | **Model**: sonnet
**Test**: Given `src/lib/db/queries/listings.ts` → When module imported → Then `getAdminListings`, `getListingById`, `createListing`, `updateListing` all exported and typed
**Files**: `src/lib/db/queries/listings.ts` (new)
**Implementation**:
1. Create `src/lib/db/queries/listings.ts`
2. Export `getAdminListings(businessId?: string) → Promise<ListingRow[]>` — list all or filter by business
3. Export `getListingById(id: string) → Promise<ListingRow | null>` — single listing with joins
4. Export `createListing(data: CreateListingInput) → Promise<{ id: number }>` — insert and return ID
5. Export `updateListing(id: string, data: UpdateListingInput) → Promise<void>` — update by ID
6. Use existing patterns from `products.ts` (typed returns, null on not found)
**Dependencies**: None
**Verification**: TypeScript compilation via `pnpm exec -- astro build`

---

### T-003: Wire admin/listings/new.astro to query functions
**AC**: AC-US2-01, AC-US2-02 | **Status**: [x] completed | **Model**: haiku
**Test**: Given admin/listings/new.astro → When `grep "from '@/db/schema'" src/pages/admin/listings/new.astro` → Then 0 matches; `grep "db.prepare" src/pages/admin/listings/new.astro` → 0 matches
**Files**: `src/pages/admin/listings/new.astro`
**Implementation**:
1. Read current frontmatter to identify all DB calls
2. Remove all `@/db/schema` imports from frontmatter
3. Remove all `db.prepare()` calls from frontmatter
4. Import `{ getAdminListings, createListing }` from `@/lib/db/queries/listings`
5. Wire the remaining data-fetching to query function calls
**Dependencies**: T-002
**Verification**: `pnpm exec -- astro build`

---

### T-004: Wire admin/listings/[id]/edit.astro to query functions
**AC**: AC-US2-03, AC-US2-04 | **Status**: [x] completed | **Model**: haiku
**Test**: Given admin/listings/[id]/edit.astro → When `grep "from '@/db/schema'" src/pages/admin/listings/\[id\]/edit.astro` → Then 0 matches; `grep "db.prepare" src/pages/admin/listings/\[id\]/edit.astro` → 0 matches
**Files**: `src/pages/admin/listings/[id]/edit.astro`
**Implementation**:
1. Read current frontmatter to identify all DB calls
2. Remove all `@/db/schema` imports from frontmatter
3. Remove all `db.prepare()` calls from frontmatter
4. Import `{ getListingById, updateListing }` from `@/lib/db/queries/listings`
5. Wire the remaining data-fetching to query function calls
**Dependencies**: T-002
**Verification**: `pnpm exec -- astro build`

---

### T-005: Add createProduct + updateProduct to products.ts
**AC**: AC-US3-01, AC-US3-02, AC-US3-03, AC-US3-04 | **Status**: [x] completed | **Model**: sonnet
**Test**: Given `src/lib/db/queries/products.ts` → When module imported → Then `createProduct` and `updateProduct` exported
**Files**: `src/lib/db/queries/products.ts`
**Implementation**:
1. Read existing `products.ts` to understand existing types and patterns
2. Add `createProduct(data: CreateProductInput) → Promise<{ id: number }>`
3. Add `updateProduct(id: string, data: UpdateProductInput) → Promise<void>`
4. Follow same typed return patterns as existing functions
**Dependencies**: None
**Verification**: TypeScript compilation via `pnpm exec -- astro build`

---

### T-006: Wire business/[slug]/product/new.astro to query functions
**AC**: AC-US3-01, AC-US3-02 | **Status**: [x] completed | **Model**: haiku
**Test**: Given business/[slug]/product/new.astro → When `grep "from '@/db/schema'" src/pages/business/\[slug\]/product/new.astro` → Then 0 matches; `grep "db.prepare" src/pages/business/\[slug\]/product/new.astro` → 0 matches
**Files**: `src/pages/business/[slug]/product/new/index.astro`
**Implementation**:
1. Read current frontmatter
2. Remove all `@/db/schema` imports and `db.prepare()` calls
3. Import `{ createProduct }` from `@/lib/db/queries/products`
4. Wire form submission to use `createProduct`
**Dependencies**: T-005
**Verification**: `pnpm exec -- astro build`

---

### T-007: Wire business/[slug]/product/[id]/edit.astro to query functions
**AC**: AC-US3-03, AC-US3-04 | **Status**: [x] completed | **Model**: haiku
**Test**: Given business/[slug]/product/[id]/edit.astro → When `grep "from '@/db/schema'" src/pages/business/\[slug\]/product/\[id\]/edit.astro` → Then 0 matches; `grep "db.prepare" src/pages/business/\[slug\]/product/\[id\]/edit.astro` → 0 matches
**Files**: `src/pages/business/[slug]/product/[id]/edit/index.astro`
**Implementation**:
1. Read current frontmatter
2. Remove all `@/db/schema` imports and `db.prepare()` calls
3. Import `{ getProductById, updateProduct }` from `@/lib/db/queries/products`
4. Wire existing logic to use query functions
**Dependencies**: T-005
**Verification**: `pnpm exec -- astro build`

---

### T-008: Wire business/[slug]/product/[id]/index.astro to existing query function
**AC**: AC-US4-01, AC-US4-02, AC-US4-03 | **Status**: [x] completed | **Model**: haiku
**Test**: Given business/[slug]/product/[id]/index.astro → When `grep "db.prepare" src/pages/business/\[slug\]/product/\[id\]/index.astro` → Then 0 matches; frontmatter reduced to <30 lines
**Files**: `src/pages/business/[slug]/product/[id]/index.astro`
**Implementation**:
1. Read current frontmatter (~109 lines with raw SQL)
2. Remove all `db.prepare()` raw SQL calls
3. Import `{ getProductById }` from `@/lib/db/queries/products` (already exists)
4. Replace raw SQL fetch with `const product = await getProductById(productId)`
**Dependencies**: None (getProductById already exists)
**Verification**: `pnpm exec -- astro build`

---

### T-009: Final build verification + grep checks
**AC**: AC-US5-01, AC-US5-02, AC-US5-03 | **Status**: [x] completed | **Model**: haiku
**Test**: Given all changes → When `pnpm exec -- astro build` → Then exit 0; `grep -r "from '@/db/schema'" src/pages/ --include="*.astro" | wc -l` → 0; `grep -r "db.prepare" src/pages/ --include="*.astro" | wc -l` → 0
**Files**: All modified files
**Implementation**:
1. Run `pnpm exec -- astro build` → must exit 0
2. Run grep for schema imports → must be 0
3. Run grep for db.prepare → must be 0
4. Verify existing query functions unchanged
**Dependencies**: T-001, T-002, T-003, T-004, T-005, T-006, T-007, T-008
**Verification**: All three commands pass