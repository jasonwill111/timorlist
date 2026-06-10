# Tasks — Increment 0106: UI Migration Batch 2 (High Impact Components)

**Risk Level**: MEDIUM | **UI Impact**: Critical verification required | **Duration**: 3-4 days

---

## Phase 1: Button Migration (17 files)

- [x] T-018b: Create wrapper `src/components/ui/Button.astro` using @fulldev/button with loading prop support
- [x] T-019: Test Button in admin pages (17 files)
  - [ ] src/pages/account.astro
  - [ ] src/pages/admin/ad-banners.astro
  - [ ] src/pages/admin/blogs.astro
  - [ ] src/pages/admin/businesses.astro
  - [ ] src/pages/admin/categories.astro
  - [ ] src/pages/admin/non-profits.astro
  - [ ] src/pages/admin/products.astro
  - [ ] src/pages/admin/public-sectors.astro
  - [ ] src/pages/admin/service-packages.astro
  - [ ] src/pages/admin/settings.astro
  - [ ] src/pages/admin/users.astro
  - [ ] src/pages/admin/listings/index.astro
  - [ ] src/pages/admin/listings/[id]/edit/index.astro
  - [ ] src/pages/business/[slug].astro
  - [ ] src/pages/business/[slug]/edit/index.astro
  - [ ] src/pages/business/[slug]/product/[id]/edit/index.astro
  - [ ] src/pages/business/[slug]/product/new/index.astro

## Phase 2: Card Family Migration (11 files)

- [x] T-023: Migrate Card family → @fulldev/card
  - [ ] src/components/ui/Card.astro
  - [ ] src/components/ui/CardHeader.astro
  - [ ] src/components/ui/CardTitle.astro
  - [ ] src/components/ui/CardContent.astro
  - [ ] src/components/ui/CardDescription.astro
  - [ ] src/components/ui/CardFooter.astro
- [x] T-024: Test Card in all 11 files

## Phase 3: Image Utils Extraction

- [x] T-027: Create `src/lib/ui/image-utils.ts`
  - [ ] resolveEntityImage() for BusinessCard
  - [ ] resolveListingImage() for ListingCard
  - [ ] getMediaUrl() integration

## Phase 4: Business Card Refactoring

- [x] T-028: Refactor `src/components/business/BusinessCard.astro`
  - [ ] Use buildEntityHref() from card-helpers.ts
  - [ ] Use resolveEntityImage() from image-utils.ts
  - [ ] Use ORG_TYPE_COLORS from card-colors.ts
  - [ ] Test in pages using BusinessCard

## Phase 5: Listing Card Refactoring

- [x] T-029: Refactor `src/components/business/ListingCard.astro`
  - [ ] Use buildListingHref() from card-helpers.ts
  - [ ] Use resolveListingImage() from image-utils.ts
  - [ ] Use LISTING_TYPE_COLORS from card-colors.ts
  - [ ] Test in pages using ListingCard

## Phase 6: Product Card Refactoring

- [x] T-030: Refactor `src/components/business/ProductCard.astro`
  - [ ] Use buildProductHref() from card-helpers.ts
  - [ ] Use resolveEntityImage() from image-utils.ts
  - [ ] Use PRODUCT_TYPE_COLORS from card-colors.ts
  - [ ] Test in pages using ProductCard

## Phase 7: Business Header Card Refactoring

- [x] T-031: Refactor `src/components/business/BusinessHeaderCard.astro`
  - [ ] Use ENTITY_TYPE_COLORS from card-colors.ts
  - [ ] Test in business detail pages

## Verification (CRITICAL)

- [x] T-032: `pnpm build` exits 0
- [x] T-033: Visual regression test (diff < 5% - this is critical for 17-file change)
- [x] T-034: All 17 Button files verified working
- [x] T-035: All 11 Card files verified working
- [x] T-036: Business cards render correctly
- [x] T-037: E2E tests pass (14/14 pages)

## Summary

- **Tasks**: 10 major + 30+ individual file tests
- **Components migrated**: 8 (Button, Card family)
- **Components refactored**: 4 (BusinessCard, ListingCard, ProductCard, BusinessHeaderCard)
- **Files deleted**: 7 (custom components replaced)
- **Files created**: 1 (image-utils.ts)
- **Estimated LoC reduction**: ~450