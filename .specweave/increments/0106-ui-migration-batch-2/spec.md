---
increment: 0106-ui-migration-batch-2
title: UI Component Migration - Batch 2 (High Impact Components)
type: refactor
priority: P1
status: completed
created: 2026-06-04T00:00:00.000Z
project: TimorUp
parent: 0103-fulldev-migration-refactor
dependsOn:
  - 0105-ui-migration-batch-1
---

# Increment 0106: UI Component Migration - Batch 2

## Overview

Replace high-impact UI components (Button, Card) with @fulldev equivalents. These components have **high blast radius** (used in 11-17 files) but are **pure presentation** with no domain logic.

**Risk Level**: MEDIUM  
**UI Impact**: Visual equivalence critical  
**Files Affected**: ~30

## Prerequisites

- [x] Batch 1 completed (0105)
- [x] @fulldev/button, @fulldev/card installed

## Components to Migrate

| Component | Files | Usage | Risk |
|-----------|-------|-------|------|
| Button.astro | 17 | All buttons, CTAs | HIGH |
| Card.astro | 11 | All card containers | MEDIUM |
| CardHeader.astro | 4 | Card headers | LOW |
| CardTitle.astro | 4 | Card titles | LOW |
| CardContent.astro | 4 | Card content | LOW |
| CardDescription.astro | 4 | Card descriptions | LOW |
| CardFooter.astro | 4 | Card footers | LOW |

## Tasks (10)

### Button Migration

- [x] T-018b: Migrate `src/components/ui/Button.astro` → @fulldev/button
  - **Keep as wrapper** to preserve loading prop enhancement
  - Add backward-compat loading={bool} prop
  ```astro
  ---
  import { Button as FulldevButton } from '@fulldev/ui';
  const { loading = false, variant = 'default', size = 'default', ...props } = Astro.props;
  ---
  <FulldevButton 
    data-loading={loading}
    class:list={[
      props.class,
      loading && 'opacity-50 cursor-not-allowed'
    ]}
    disabled={loading || props.disabled}
    {...props}
  >
    {loading && <Spinner />}
    <slot />
  </FulldevButton>
  ```
  - Test in **17 files** (admin pages, business pages, forms)

### Card Family Migration

- [x] T-023: Migrate Card family → @fulldev/card
  - Card.astro, CardHeader.astro, CardTitle.astro, CardContent.astro, CardDescription.astro, CardFooter.astro
  - Direct swap, API should match
  - Test in **11 files**

### Image Utils Extraction

- [x] T-027: Create `src/lib/ui/image-utils.ts`
  ```typescript
  import { getMediaUrl } from '@/lib/media';
  
  export function resolveEntityImage(
    thumbnail: string | null,
    profileImageId: string | null,
    imageIds: string[] = []
  ): string | null {
    if (thumbnail) return getMediaUrl(thumbnail);
    if (profileImageId) return getMediaUrl(profileImageId);
    if (imageIds.length > 0) return getMediaUrl(imageIds[0]);
    return null;
  }
  
  export function resolveListingImage(
    thumbnail: string | null,
    profileImageId: string | null,
    imageIds: string[] = []
  ): string | null {
    // Same pattern for listings
  }
  ```

### Business Card Refactoring

- [x] T-028: Refactor `src/components/business/BusinessCard.astro`
  - Use `buildEntityHref()` from card-helpers.ts
  - Use `resolveEntityImage()` from image-utils.ts
  - Use `ORG_TYPE_COLORS` from card-colors.ts
  - Component becomes **presentation only**
  - Test in all usage files

### Listing Card Refactoring

- [x] T-029: Refactor `src/components/business/ListingCard.astro`
  - Use `buildListingHref()` from card-helpers.ts
  - Use `resolveListingImage()` from image-utils.ts
  - Use `LISTING_TYPE_COLORS` from card-colors.ts
  - Component becomes **presentation only**
  - Test in all usage files

### Product Card Refactoring

- [x] T-030: Refactor `src/components/business/ProductCard.astro`
  - Use `buildProductHref()` from card-helpers.ts
  - Use `resolveEntityImage()` from image-utils.ts
  - Use `PRODUCT_TYPE_COLORS` from card-colors.ts
  - Component becomes **presentation only**
  - Test in all usage files

### Business Header Card Refactoring

- [x] T-031: Refactor `src/components/business/BusinessHeaderCard.astro`
  - Use `ENTITY_TYPE_COLORS` from card-colors.ts
  - Contact info helpers (if needed)
  - Component becomes **presentation only**
  - Test in all usage files

## Verification

### Build Test
```bash
pnpm build  # Must exit 0
```

### Visual Regression (Critical)
```bash
# Comprehensive visual comparison
node screenshot.cjs --dir baseline --pages all
pnpm build && npx wrangler deploy
node screenshot.cjs --dir current --pages all
node compare-screenshots.cjs --baseline baseline --current current --threshold 0.05

# If diff > 5%, investigate immediately
```

### Component-Specific Tests

```bash
# Button tests
for file in $(grep -rl "import.*Button" src/pages); do
  node test-button-integration.cjs "$file"
done

# Card tests
for file in $(grep -rl "Card\." src/pages src/components); do
  node test-card-integration.cjs "$file"
done
```

### E2E Tests (Full)
```bash
node e2e-test.cjs  # All 14 pages must pass
```

## Files to Modify

| File | Action |
|------|--------|
| src/components/ui/Button.astro | REPLACE with wrapper |
| src/components/ui/Card.astro | REPLACE with @fulldev |
| src/components/ui/CardHeader.astro | REPLACE with @fulldev |
| src/components/ui/CardTitle.astro | REPLACE with @fulldev |
| src/components/ui/CardContent.astro | REPLACE with @fulldev |
| src/components/ui/CardDescription.astro | REPLACE with @fulldev |
| src/components/ui/CardFooter.astro | REPLACE with @fulldev |
| src/lib/ui/image-utils.ts | NEW |
| src/components/business/BusinessCard.astro | REFACTOR |
| src/components/business/ListingCard.astro | REFACTOR |
| src/components/business/ProductCard.astro | REFACTOR |
| src/components/business/BusinessHeaderCard.astro | REFACTOR |
| ~17 admin pages | TEST Button migration |
| ~11 pages with Card | TEST Card migration |

## Rollback

```bash
git checkout 0105-ui-migration-batch-1
npx wrangler deploy --env production
```

## Acceptance Criteria

- [x] `pnpm build` exits 0
- [x] Visual diff < 5% (critical for high-impact components)
- [x] Button works in all 17 files (including loading state)
- [x] Card family works in all 11 files
- [x] BusinessCard renders correctly with extracted helpers
- [x] ListingCard renders correctly with extracted helpers
- [x] ProductCard renders correctly with extracted helpers
- [x] BusinessHeaderCard renders correctly
- [x] E2E tests pass (14/14 pages)

## Estimated Reduction

- **Files deleted**: 7
- **LoC removed**: ~450
- **Domain logic extracted**: ~200 lines to lib/
- **Maintenance improvement**: Color configs centralized, URL builders centralized
