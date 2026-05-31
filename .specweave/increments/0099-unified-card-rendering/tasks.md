---
name: 0099-unified-card-rendering
description: Unified card rendering + container width standardization
metadata:
  type: feature
  created: 2026-05-31
---

# Tasks: Unified Card Rendering + Container Width Standardization

## Phase 1: Component Enhancements

### T-001: Enhance BusinessCard.astro with new props
**Status**: [ ] pending
**Test**: Given BusinessCard with profileImageId → When no thumbnail → Then renders `/api/media/{profileImageId}`

**Implementation**:
1. Add `profileImageId?: string | null` to Props interface
2. Add `views?: number` to Props interface
3. Add `entityType?: 'business' | 'nonprofit' | 'publicsector'` to Props interface
4. Implement image resolution: `thumbnail || (profileImageId ? \`/api/media/${profileImageId}\` : null)`
5. Add views display with eye icon (similar to likes display)
6. Update href logic based on entityType

**Files**: `src/components/business/BusinessCard.astro`
**AC**: AC-US1-01, AC-US1-02, AC-US1-03

---

### T-002: Enhance ListingCard.astro with profileImageId
**Status**: [ ] pending
**Test**: Given ListingCard with profileImageId → When no thumbnail → Then renders `/api/media/{profileImageId}`

**Implementation**:
1. Add `profileImageId?: string | null` to Props interface
2. Update image resolution to check profileImageId first

**Files**: `src/components/business/ListingCard.astro`
**AC**: AC-US2-01, AC-US2-02

---

## Phase 2: Container Width Standardization

### T-003: Update Header.astro container width
**Status**: [ ] pending
**Test**: Given Header.astro → When desktop viewport → Then uses `max-w-7xl`

**Implementation**:
1. Change line 16: `container max-w-6xl` → `container max-w-7xl`
2. Change line 133: `container max-w-6xl` → `container max-w-7xl`

**Files**: `src/components/Header.astro`
**AC**: AC-US7-01, AC-US7-02

---

### T-004: Update Footer.astro container width
**Status**: [ ] pending
**Test**: Given Footer.astro → When any viewport → Then uses `max-w-7xl`

**Implementation**:
1. Change line 8: `container max-w-6xl` → `container max-w-7xl`

**Files**: `src/components/Footer.astro`
**AC**: AC-US8-01

---

## Phase 3: Page Refactoring

### T-005: Refactor /businesses page to use BusinessCard
**Status**: [ ] pending
**Test**: Given /businesses page → When businesses exist → Then each renders via BusinessCard component

**Implementation**:
1. Import BusinessCard component
2. Replace inline `<a class="group">` card markup with `<BusinessCard entityType="business" />`
3. Map data props: title, slug, category, profileImageId, rating, likes, reviews, location, views

**Files**: `src/pages/businesses/index.astro`
**AC**: AC-US3-01, AC-US3-02, AC-US3-03

---

### T-006: Refactor /non-profits page to use BusinessCard
**Status**: [ ] pending
**Test**: Given /non-profits page → When non-profits exist → Then each renders via BusinessCard entityType="nonprofit"

**Implementation**:
1. Import BusinessCard component
2. Replace inline card markup with `<BusinessCard entityType="nonprofit" />`
3. Add `max-w-7xl` container wrapper

**Files**: `src/pages/non-profits/index.astro`
**AC**: AC-US4-01, AC-US4-02, AC-US4-03

---

### T-007: Refactor /public-sectors page to use BusinessCard
**Status**: [ ] pending
**Test**: Given /public-sectors page → When public sectors exist → Then each renders via BusinessCard entityType="publicsector"

**Implementation**:
1. Import BusinessCard component
2. Replace inline card markup with `<BusinessCard entityType="publicsector" />`
3. Add `max-w-7xl` container wrapper

**Files**: `src/pages/public-sectors/index.astro`
**AC**: AC-US5-01, AC-US5-02, AC-US5-03

---

### T-008: Refactor /listings island to use ListingCard
**Status**: [ ] pending
**Test**: Given /listings page → When listings exist → Then each renders via ListingCard component

**Implementation**:
1. Import ListingCard component
2. Replace inline card markup with `<ListingCard />`
3. Map data props: title, slug, price, listingType, condition, location, profileImageId, likes, views

**Files**: `src/components/islands/ListingListNew.astro`
**AC**: AC-US6-01, AC-US6-02, AC-US6-03

---

## Phase 4: Verification

### T-009: Verify build passes
**Status**: [ ] pending
**Test**: Given all changes → When `pnpm build` → Then no errors

---

### T-010: Verify no inline card markup remains
**Status**: [ ] pending
**Test**: Given grep for `<a class="group">` → Then no results in list pages

---

### T-011: Verify card components used
**Status**: [ ] pending
**Test**: Given grep for `<BusinessCard` and `<ListingCard` → Then found in all 4 list pages

---

## Summary

| Task | Description | Status |
|------|-------------|--------|
| T-001 | BusinessCard props | pending |
| T-002 | ListingCard props | pending |
| T-003 | Header width | pending |
| T-004 | Footer width | pending |
| T-005 | /businesses refactor | pending |
| T-006 | /non-profits refactor | pending |
| T-007 | /public-sectors refactor | pending |
| T-008 | /listings refactor | pending |
| T-009 | Build verify | pending |
| T-010 | Inline markup check | pending |
| T-011 | Component usage check | pending |