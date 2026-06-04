---
increment: 0105-ui-migration-batch-1
title: "UI Component Migration - Batch 1 (Safe Components)"
type: refactor
priority: P1
status: pending
created: 2026-06-04
project: TimorUp
parent: 0103-fulldev-migration-refactor
dependsOn: ["0103-security-fixes", "0104-lib-consolidation"]
---

# Increment 0105: UI Component Migration - Batch 1

## Overview

Replace safe UI components with @fulldev equivalents. These components have **low blast radius** (used in 2-3 files) and **no API changes**.

**Risk Level**: LOW  
**UI Impact**: Visual equivalence verified  
**Files Affected**: ~10

## Prerequisites

- [ ] @fulldev/init installed (from 0103)
- [ ] Components installed: badge, skeleton, textarea, label, native-select, avatar

## Components to Migrate

| Component | Files | Usage | Risk |
|-----------|-------|-------|------|
| Badge.astro | 3 | Status badges, category labels | LOW |
| Skeleton.astro | 2 | Loading states | LOW |
| Textarea.astro | 3 | Form inputs | LOW |
| Label.astro | 3 | Form labels | LOW |
| Select.astro | 3 | Dropdowns (wrapper needed) | LOW |
| Avatar.astro | 1 | User avatars | LOW |

## Tasks (8)

### Installation

- [ ] T-018a: `npx shadcn@latest add @fulldev/badge @fulldev/skeleton @fulldev/textarea @fulldev/label @fulldev/native-select @fulldev/avatar -y`

### Component Migration

- [ ] T-019a: Migrate `src/components/ui/Badge.astro` → @fulldev/badge
  - Compare variant maps (must match exactly)
  - Test in 3 usage files

- [ ] T-020a: Migrate `src/components/ui/Textarea.astro` → @fulldev/textarea
  - Compare props API (rows, disabled, etc.)
  - Test in 3 usage files

- [ ] T-021a: Migrate `src/components/ui/Label.astro` → @fulldev/label
  - Direct swap, API should match
  - Test in 3 usage files

- [ ] T-022a: Migrate `src/components/ui/Select.astro` → @fulldev/native-select
  - Create wrapper component for `options` prop (fulldev uses children)
  - Test in 3 usage files

- [ ] T-024a: Migrate `src/components/ui/Avatar.astro` → @fulldev/avatar
  - Compare fallback behavior (initials, image, icon)
  - Test in 1 usage file

### Domain Logic Extraction (Foundation)

- [ ] T-025: Create `src/lib/ui/card-colors.ts`
  ```typescript
  export const ORG_TYPE_COLORS = { ... };  // From BusinessCard
  export const LISTING_TYPE_COLORS = { ... };  // From ListingCard
  export const PRODUCT_TYPE_COLORS = { ... };  // From ProductCard
  export const ENTITY_TYPE_COLORS = { ... };
  ```

- [ ] T-026: Create `src/lib/ui/card-helpers.ts`
  ```typescript
  export function buildEntityHref(slug: string, entityType: EntityType): string { ... }
  export function buildListingHref(slug: string): string { ... }
  export function buildProductHref(businessSlug: string, productSlug: string): string { ... }
  ```

## Wrapper Component Strategy (Select)

```astro
<!-- src/components/ui/Select.astro (wrapper) -->
---
import { Select as FulldevSelect } from '@fulldev/ui';
const { options = [], ...props } = Astro.props;
---
<FulldevSelect {...props}>
  {options.map(opt => <option value={opt.value}>{opt.label}</option>)}
</FulldevSelect>
```

## Verification

### Build Test
```bash
pnpm build  # Must exit 0
```

### Visual Regression
```bash
# Before migration: capture baseline
node screenshot.cjs --dir baseline

# After migration: capture current
node screenshot.cjs --dir current

# Compare
node compare-screenshots.cjs --baseline baseline --current current --threshold 0.05
```

### Functional Tests
```bash
node e2e-test.cjs  # All 14 pages should pass

# Specific component tests
node test-badge.cjs
node test-textarea.cjs
node test-select.cjs
node test-avatar.cjs
```

## Files to Modify

| File | Action |
|------|--------|
| src/components/ui/Badge.astro | REPLACE with @fulldev |
| src/components/ui/Textarea.astro | REPLACE with @fulldev |
| src/components/ui/Label.astro | REPLACE with @fulldev |
| src/components/ui/Select.astro | REPLACE with wrapper |
| src/components/ui/Avatar.astro | REPLACE with @fulldev |
| src/lib/ui/card-colors.ts | NEW |
| src/lib/ui/card-helpers.ts | NEW |

## Files to Delete

- src/components/ui/Badge.astro (custom - replaced)
- src/components/ui/Textarea.astro (custom - replaced)
- src/components/ui/Label.astro (custom - replaced)
- src/components/ui/Select.astro (custom - replaced with wrapper)
- src/components/ui/Avatar.astro (custom - replaced)

## Rollback

```bash
git checkout 0104-lib-consolidation
npx wrangler deploy --env production
```

## Acceptance Criteria

- [ ] `pnpm build` exits 0
- [ ] Visual diff < 5% (verified with screenshot comparison)
- [ ] Badge displays all variants correctly
- [ ] Textarea rows, disabled, readonly work
- [ ] Label for/id associations work
- [ ] Select options render correctly
- [ ] Avatar image/initials/fallback work
- [ ] E2E tests pass (14/14 pages)

## Estimated Reduction

- **Files deleted**: 5
- **LoC removed**: ~300
- **Maintenance improvement**: All variants in one config file