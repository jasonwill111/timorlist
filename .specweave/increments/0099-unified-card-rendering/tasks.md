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
**Status**: [x] completed
**Test**: Given BusinessCard with profileImageId → When no thumbnail → Then renders `/api/media/{profileImageId}`

### T-002: Enhance ListingCard.astro with profileImageId
**Status**: [x] completed
**Test**: Given ListingCard with profileImageId → When no thumbnail → Then renders `/api/media/{profileImageId}`

## Phase 2: Container Width Standardization

### T-003: Update Header.astro container width
**Status**: [x] completed
**Test**: Given Header.astro → When desktop viewport → Then uses `max-w-7xl`

### T-004: Update Footer.astro container width
**Status**: [x] completed
**Test**: Given Footer.astro → When any viewport → Then uses `max-w-7xl`

## Phase 3: Page Refactoring

### T-005: Refactor /businesses page to use BusinessCard
**Status**: [x] completed
**Test**: Given /businesses page → When businesses exist → Then each renders via BusinessCard component

### T-006: Refactor /non-profits page to use BusinessCard
**Status**: [x] completed
**Test**: Given /non-profits page → When non-profits exist → Then each renders via BusinessCard

### T-007: Refactor /public-sectors page to use BusinessCard
**Status**: [x] completed
**Test**: Given /public-sectors page → When public sectors exist → Then each renders via BusinessCard

### T-008: Refactor /listings island to use ListingCard
**Status**: [x] completed
**Test**: Given /listings page → When listings exist → Then each renders via ListingCard

## Phase 4: Verification

### T-009: Verify build passes
**Status**: [x] completed
**Test**: Given all changes → When `pnpm build` → Then no errors

### T-010: Verify no inline card markup remains
**Status**: [x] completed
**Test**: Given grep for `<a class="group">` → Then no results in list pages

### T-011: Verify card components used
**Status**: [x] completed
**Test**: Given grep for `<BusinessCard` and `<ListingCard` → Then found in all 4 list pages

## Summary

| Task | Description | Status |
|------|-------------|--------|
| T-001 | BusinessCard props | ✅ completed |
| T-002 | ListingCard props | ✅ completed |
| T-003 | Header width | ✅ completed |
| T-004 | Footer width | ✅ completed |
| T-005 | /businesses refactor | ✅ completed |
| T-006 | /non-profits refactor | ✅ completed |
| T-007 | /public-sectors refactor | ✅ completed |
| T-008 | /listings refactor | ✅ completed |
| T-009 | Build verify | ✅ completed |
| T-010 | Inline markup check | ✅ completed |
| T-011 | Component usage check | ✅ completed |