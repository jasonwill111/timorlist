---
increment: 0152-extract-account-dashboard-search-data-layer
title: Extract account + dashboard + search data layer
type: refactor
priority: P0
status: completed
created: 2026-06-08T00:00:00.000Z
structure: user-stories
test_mode: test-after
coverage_target: 80
---

# Feature: Extract account + dashboard + search data layer

## Overview

Extract DB query logic from 3 pages: account.astro, dashboard.astro, search.astro into query functions. These pages use getRawDb() with raw SQL queries.

## User Stories

### US-001: Create shared auth query module (P0)

**Project**: timorup

**As a** developer
**I want** session -> user resolution in a single reusable function
**So that** account and dashboard share the same auth pattern

**Acceptance Criteria**:
- [x] **AC-US1-01**: Create `src/lib/db/queries/auth.ts` with `resolveUserFromCookie(cookieHeader: string)` returning user or null
- [x] **AC-US1-02**: Handles raw SQL session lookup + expiration check (ms vs seconds)
- [x] **AC-US1-03**: Both account and dashboard use the shared function

### US-002: Extract account.astro data layer (P0)

**Project**: timorup

**As a** developer
**I want** account.astro DB queries extracted to query functions
**So that** the page file is clean and focused on UI

**Acceptance Criteria**:
- [x] **AC-US2-01**: `getUserPages(userId: string)` -> returns user's businesses with entityType
- [x] **AC-US2-02**: `getUserSubscription(businessId: string)` -> returns subscription info or null
- [x] **AC-US2-03**: account.astro frontmatter reduced from ~100 lines to <= 40 lines
- [x] **AC-US2-04**: Build passes (`pnpm exec -- astro build` exit 0)

### US-003: Extract search.astro data layer (P0)

**Project**: timorup

**As a** developer
**I want** search.astro DB queries extracted to query functions
**So that** search logic is reusable and testable

**Acceptance Criteria**:
- [x] **AC-US3-01**: `getCategoriesForSearch()` -> returns { id, name } map
- [x] **AC-US3-02**: `searchBusinesses(query: string, page: number, limit: number)` -> returns { results, total, totalPages }
- [x] **AC-US3-03**: search.astro frontmatter reduced from ~95 lines to <= 40 lines
- [x] **AC-US3-04**: Build passes (`pnpm exec -- astro build` exit 0)

### US-004: Extract dashboard.astro data layer (P0)

**Project**: timorup

**As a** developer
**I want** dashboard.astro auth extracted to shared function
**So that** it's consistent with account page

**Acceptance Criteria**:
- [x] **AC-US4-01**: dashboard.astro uses shared `resolveUserFromCookie`
- [x] **AC-US4-02**: Dashboard frontmatter reduced to <= 20 lines
- [x] **AC-US4-03**: Build passes (`pnpm exec -- astro build` exit 0)

## Out of Scope

- Account page business reviews (there are none currently)
- Dashboard statistics (it's a simple welcome page)

## Dependencies

- None
