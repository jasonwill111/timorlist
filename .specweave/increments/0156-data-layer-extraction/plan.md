# Implementation Plan: Data Layer Extraction — Query Functions

## Overview

Extract all remaining inline DB logic from 5 Astro page files into query functions under `src/lib/db/queries/`. Each page's frontmatter currently mixes data fetching (DB queries), authorization checks, and page-level wiring. After extraction, pages only wire data and import from query functions — zero `@/db/schema` imports and zero `db.prepare()` calls.

## Architecture

### Existing Query Function Structure

```
src/lib/db/queries/
├── auth.ts          # User session/auth queries
├── businesses.ts    # Business CRUD (getBusinessBySlug, etc.)
├── products.ts # Product CRUD (getProductBySlug, getProductById)
├── media-listing.ts # Media list with filters + aggregation
├── listings.ts      # [to create] Admin listing CRUD
└── ...
```

### Data Flow After Extraction

```
Page frontmatter
  └── import { getX } from '@/lib/db/queries/queries.ts'
       └── (no @/db/schema, no db.prepare(), no drizzle-orm imports)

Query function
  └── getDb() → drizzle orm → tables
  └── Return typed result
```

## Design

### Query Functions to Create/Extend

| File | Functions | Scope |
|------|-----------|--------|
| `listings.ts` | `getAdminListings(businessId?)`, `getListingById(id)`, `createListing(data)`, `updateListing(id, data)` | admin/listings pages |
| `products.ts` | `createProduct(data)`, `updateProduct(id, data)` (extend existing) | business/product pages |
| `media-listing.ts` | Already exists — fix duplicate import | admin/media |

### Key Architecture Decision: No New Abstraction Layer

We extend existing query files rather than creating new ones. The `products.ts` file already has `getProductById` — we only add `createProduct` and `updateProduct`. The `media-listing.ts` already has `getMediaList` — we only fix the duplicate import issue.

**Why**: Existing query files follow a consistent pattern (typed returns, error handling via null). Adding new files would introduce inconsistency.

## Rationale

1. **Minimal risk**: Each page is modified one at a time, build verified after each change
2. **Incremental verification**: `astro build` after each task ensures no regression
3. **Parallel-safe**: admin/media and admin/listings are independent — can be tackled separately
4. **Build gate first**: admin/media fix (T-001) verifies the pattern works before tackling larger frontmatter files

## Implementation Phases

### Phase 1: Fix admin/media (T-001)
- Remove duplicate `MediaIsland` import
- Remove drizzle import line (`import { eq, like, sql, desc, isNull, and } from 'drizzle-orm'`)
- Verify build

### Phase 2: Create listings query functions (T-002, T-003)
- Create `src/lib/db/queries/listings.ts` with all 4 functions
- Wire admin/listings/new.astro
- Wire admin/listings/[id]/edit.astro

### Phase 3: Extend products query functions (T-004, T-005)
- Add `createProduct` and `updateProduct` to existing `products.ts`
- Wire business/[slug]/product/new.astro
- Wire business/[slug]/product/[id]/edit.astro

### Phase 4: Wire existing getProductById (T-006)
- Replace raw SQL in business/[slug]/product/[id]/index.astro with `getProductById`

### Phase 5: Final verification (T-007)
- `astro build`
- grep verification for zero schema imports

## Testing Strategy

- **Build verification**: `pnpm exec -- astro build` after each task (iron law: no claims without fresh evidence)
- **Grep verification**: `grep -r "from '@/db/schema'" src/pages/` →0
- **Grep verification**: `grep -r "db.prepare" src/pages/` → 0

No new unit tests needed — the query functions are thin wrappers over existing drizzle patterns. Integration verified via successful build.