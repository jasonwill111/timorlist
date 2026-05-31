---
increment: 0099-unified-card-rendering
title: "Unified Card Rendering + Container Width Standardization"
type: feature
priority: P1
status: active
created: 2026-05-31
structure: user-stories
test_mode: TDD
coverage_target: 80
---

# Feature: Unified Card Rendering + Container Width Standardization

## Overview

Standardize card rendering across all entity list pages by refactoring inline card markup into reusable components. Additionally, standardize all content container widths to `max-w-7xl` (except banners).

## Problem Statement

1. **Inconsistent card rendering**: Each list page (`/businesses`, `/non-profits`, `/public-sectors`, `/listings`) uses inline `<a class="group">` markup instead of reusable card components
2. **Duplicated code**: Same card structure repeated 4+ times across pages
3. **Component underutilization**: `BusinessCard.astro` and `ListingCard.astro` exist in `src/components/business/` but are not used by list pages
4. **Inconsistent container widths**: Header/Footer use `max-w-6xl`, should be `max-w-7xl`

## Goals

- Replace inline card markup with reusable `BusinessCard.astro`, `NonProfitCard.astro`, `PublicSectorCard.astro`, and `ListingCard.astro` components
- Add missing props to existing card components (`profileImageId`, `views`, `entityType`)
- Standardize all content containers to `max-w-7xl`

## User Stories

### US-001: BusinessCard Component Enhancement
**Project**: TimorUp
**As a** frontend developer
**I want** BusinessCard.astro to accept `profileImageId`, `views`, and `entityType` props
**So that** I can replace inline business cards with a consistent component

**Acceptance Criteria**:
- [ ] **AC-US1-01**: Given BusinessCard receives `profileImageId` prop, when no thumbnail is provided, then it renders image from `/api/media/{profileImageId}`
- [ ] **AC-US1-02**: Given BusinessCard receives `views` prop, when `views > 0`, then it displays views count with eye icon
- [ ] **AC-US1-03**: Given BusinessCard receives `entityType` prop with value `'nonprofit'|'publicsector'`, then it renders correct href path (`/non-profit/{slug}` or `/public-sector/{slug}`)

---

### US-002: ListingCard Component Enhancement
**Project**: TimorUp
**As a** frontend developer
**I want** ListingCard.astro to accept `profileImageId` prop
**So that** it can display the listing's primary image from media API

**Acceptance Criteria**:
- [ ] **AC-US2-01**: Given ListingCard receives `profileImageId` prop, when no thumbnail is provided, then it renders image from `/api/media/{profileImageId}`
- [ ] **AC-US2-02**: Given ListingCard renders thumbnail, then it uses the standard `aspect-square` container matching BusinessCard design

---

### US-003: Business List Page Refactoring
**Project**: TimorUp
**As a** visitor
**I want** the /businesses page to use BusinessCard component
**So that** business listings are rendered consistently with other pages

**Acceptance Criteria**:
- [ ] **AC-US3-01**: Given /businesses page loads, when businesses exist, then each business renders via `<BusinessCard />` component
- [ ] **AC-US3-02**: Given /businesses page, when a BusinessCard is clicked, then navigation goes to `/business/{slug}`
- [ ] **AC-US3-03**: Given /businesses page passes `profileImageId`, `views`, `likes`, `ratingAverage`, `ratingCount`, `address` props, then BusinessCard displays all values correctly

---

### US-004: Non-Profit List Page Refactoring
**Project**: TimorUp
**As a** visitor
**I want** the /non-profits page to use BusinessCard component with nonprofit mode
**So that** non-profit listings are rendered consistently

**Acceptance Criteria**:
- [ ] **AC-US4-01**: Given /non-profits page loads, when non-profits exist, then each non-profit renders via `<BusinessCard entityType="nonprofit" />`
- [ ] **AC-US4-02**: Given /non-profits page, when a BusinessCard is clicked, then navigation goes to `/non-profit/{slug}`
- [ ] **AC-US4-03**: Given /non-profits page, when entityType="nonprofit", then BusinessCard renders category badge with rose color scheme

---

### US-005: Public Sector List Page Refactoring
**Project**: TimorUp
**As a** visitor
**I want** the /public-sectors page to use BusinessCard component with publicSector mode
**So that** public sector listings are rendered consistently

**Acceptance Criteria**:
- [ ] **AC-US5-01**: Given /public-sectors page loads, when public sectors exist, then each renders via `<BusinessCard entityType="publicsector" />`
- [ ] **AC-US5-02**: Given /public-sectors page, when a BusinessCard is clicked, then navigation goes to `/public-sector/{slug}`
- [ ] **AC-US5-03**: Given /public-sectors page, when entityType="publicsector", then BusinessCard renders category badge with blue color scheme

---

### US-006: Listings List Page Refactoring
**Project**: TimorUp
**As a** visitor
**I want** the /listings page to use ListingCard component
**So that** classified ad listings are rendered consistently

**Acceptance Criteria**:
- [ ] **AC-US6-01**: Given /listings page loads, when listings exist, then each listing renders via `<ListingCard />` component
- [ ] **AC-US6-02**: Given /listings page, when a ListingCard is clicked, then navigation goes to `/listing/{slug}`
- [ ] **AC-US6-03**: Given /listings page passes `profileImageId`, `price`, `listingType`, `location`, `likes`, `views` props, then ListingCard displays all values correctly

---

### US-007: Header Container Width Standardization
**Project**: TimorUp
**As a** visitor
**I want** the header to use max-w-7xl container
**So that** navigation is aligned with content width

**Acceptance Criteria**:
- [ ] **AC-US7-01**: Given Header.astro, when desktop viewport, then header container uses `max-w-7xl` instead of `max-w-6xl`
- [ ] **AC-US7-02**: Given Header.astro mobile menu, when mobile menu is open, then menu container also uses `max-w-7xl`

---

### US-008: Footer Container Width Standardization
**Project**: TimorUp
**As a** visitor
**I want** the footer to use max-w-7xl container
**So that** footer content is aligned with other content areas

**Acceptance Criteria**:
- [ ] **AC-US8-01**: Given Footer.astro, when any viewport, then footer container uses `max-w-7xl` instead of `max-w-6xl`

---

## Functional Requirements

### FR-001: Card Component Interface Standardization
All card components must support:
- `profileImageId?: string | null` - Media API image ID
- `thumbnail?: string | null` - Direct URL (fallback for legacy)
- `title: string` - Card title
- `slug: string` - URL slug for navigation
- `location?: string` - Address/location text
- `likes?: number` - Like count
- `views?: number` - View count

### FR-002: Container Width Standard
- **Content containers**: `max-w-7xl` (exception: banners keep their own widths)
- **Header/Footer containers**: `max-w-7xl` (changed from `max-w-6xl`)

### FR-003: Navigation URL Patterns
| Entity Type | List URL | Detail URL |
|------------|----------|------------|
| Business | /businesses | /business/{slug} |
| Non-Profit | /non-profits | /non-profit/{slug} |
| Public Sector | /public-sectors | /public-sector/{slug} |
| Listing | /listings | /listing/{slug} |

---

## Out of Scope

- Card component visual redesign (keep current design)
- Adding new card animations or interactions
- Admin list pages (not part of this increment)
- Detail page card components

---

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| No profileImageId, no thumbnail | Display initial letter placeholder |
| Views/likes are 0 or null | Hide the stat display |
| Very long title | Truncate with ellipsis (line-clamp-2) |
| No location data | Hide location row entirely |
| Missing pagination on refactored pages | Keep existing pagination logic |

---

## Risks

| Risk | Probability | Impact | Severity | Mitigation |
|------|-------------|--------|----------|------------|
| Breaking existing card styling | Low | Medium | Low | Compare before/after screenshots |
| Navigation links incorrect | Medium | High | Medium | Test each entity type detail link |
| Missing props causing runtime errors | Low | Medium | Low | Verify all required props passed |

---

## Success Metrics

- All 4 list pages use card components (verified via grep for `<BusinessCard` / `<ListingCard`)
- Header/Footer use `max-w-7xl` (verified via grep)
- No inline card markup `<a class="group">` remains in list pages
- BusinessCard accepts all 3 new props
- ListingCard accepts profileImageId prop

---

## Dependencies

- Existing `BusinessCard.astro` component at `src/components/business/`
- Existing `ListingCard.astro` component at `src/components/business/`
- Media API endpoint `/api/media/{id}` (already exists)