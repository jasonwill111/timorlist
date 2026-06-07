# Tasks — Increment 0133: Islands Data Layer Split

## Phase A: BusinessSidebar (1 query, smallest)
- [x] T-001: Create `src/lib/db/queries/business-sidebar.ts` with `getBusinessSidebarData`
- [x] T-002: Refactor `BusinessSidebar.astro` to use query
- [x] T-003: Remove inline DB query, getDb, schema imports

## Phase B: ProductsSection (1 query, medium)
- [x] T-004: Create `src/lib/db/queries/products-by-business.ts` with `getProductsByBusiness`
- [x] T-005: Refactor `ProductsSection.astro` to use query
- [x] T-006: Remove inline DB query, deduplicate identical ternary

## Phase C: ProductsIsland (4 queries, largest)
- [x] T-007: Create `src/lib/db/queries/products-list.ts` with `getProductList`
- [x] T-008: Refactor `ProductsIsland.astro` to use query
- [x] T-009: Remove inline DB queries, schema imports, filter building logic

## Phase D: Build Verification
- [x] T-010: `pnpm build` exits 0
- [x] T-011: /products-services renders correctly
- [x] T-012: Business detail page sidebar renders

## Summary

- 3 new query files in lib/db/queries/
- 3 islands frontmatter reduced to single line data fetch
- Net: -150 lines of data logic from components

## Definition of Done
- [x] 3 islands use lib/ data layer
- [x] `pnpm build` exit 0
- [x] No visual regression
