---
id: FS-099
title: "Unified Card Rendering + Container Width Standardization"
type: feature
status: completed
priority: P1
created: 2026-05-31T00:00:00.000Z
lastUpdated: 2026-05-31T11:40:00.000Z
tldr: "Standardized card rendering across all entity list pages using reusable components. All 4 list pages (businesses, non-profits, public-sectors, listings) now use BusinessCard/ListingCard components with consistent styling."
complexity: high
stakeholder_relevant: true
---

# Unified Card Rendering + Container Width Standardization

## TL;DR

**What**: Standardized card rendering across all entity list pages (businesses, non-profits, public-sectors, listings) using reusable BusinessCard/ListingCard components. Header/Footer containers changed from `max-w-6xl` to `max-w-7xl`.

**Why**: Inconsistent card rendering with inline `<a class="group">` markup instead of reusable components. Same card structure repeated 4+ times across pages.

**Status**: ✅ completed | **Priority**: P1
**User Stories**: 8 | **AC Coverage**: 100%

## Overview

### Problem Statement

1. **Inconsistent card rendering**: Each list page used inline markup instead of reusable components
2. **Duplicated code**: Same card structure repeated 4+ times
3. **Component underutilization**: BusinessCard.astro and ListingCard.astro existed but weren't used
4. **Inconsistent container widths**: Header/Footer used `max-w-6xl`, should be `max-w-7xl`

### Solution

- Replaced inline card markup with reusable `BusinessCard.astro` and `ListingCard.astro` components
- Added missing props (`profileImageId`, `views`, `entityType`) to existing card components
- Standardized all content containers to `max-w-7xl`

## Implementation History

| Increment | Status | Completion Date |
|-----------|--------|----------------|
| [0099-unified-card-rendering](../../../../../increments/0099-unified-card-rendering/spec.md) | ✅ completed | 2026-05-31 |

## User Stories

- [US-001: BusinessCard Component Enhancement](./us-001-businesscard-component-enhancement.md) ✅
- [US-002: ListingCard Component Enhancement](./us-002-listingcard-component-enhancement.md) ✅
- [US-003: Business List Page Refactoring](./us-003-business-list-page-refactoring.md) ✅
- [US-004: Non-Profit List Page Refactoring](./us-004-non-profit-list-page-refactoring.md) ✅
- [US-005: Public Sector List Page Refactoring](./us-005-public-sector-list-page-refactoring.md) ✅
- [US-006: Listings List Page Refactoring](./us-006-listings-list-page-refactoring.md) ✅
- [US-007: Header Container Width Standardization](./us-007-header-container-width-standardization.md) ✅
- [US-008: Footer Container Width Standardization](./us-008-footer-container-width-standardization.md) ✅

## Technical Details

### Files Modified

| File | Change |
|------|--------|
| `src/components/business/BusinessCard.astro` | Added `profileImageId`, `views`, `entityType` props |
| `src/components/business/ListingCard.astro` | Added `profileImageId` prop |
| `src/pages/businesses/index.astro` | Uses BusinessCard component |
| `src/pages/non-profits/index.astro` | Uses BusinessCard component |
| `src/pages/public-sectors/index.astro` | Uses BusinessCard component |
| `src/pages/listings/index.astro` | Uses ListingCard component (converted from Server Island) |
| `src/components/Header.astro` | Changed `max-w-6xl` → `max-w-7xl` |
| `src/components/Footer.astro` | Changed `max-w-6xl` → `max-w-7xl` |

### Component Props

**BusinessCard**:
- `title`, `slug`, `category`, `profileImageId`, `rating`, `likes`, `reviews`, `views`, `location`, `entityType`

**ListingCard**:
- `title`, `slug`, `price`, `listingType`, `location`, `imageIds`, `likes`, `views`, `profileImageId`

## Verification

- ✅ Build passes with `pnpm build`
- ✅ No inline card markup `<a class="group">` remains in list pages
- ✅ All 4 list pages use card components (verified via grep)
- ✅ Header/Footer use `max-w-7xl` (verified via grep)
- ✅ 100% Playwright tests passing