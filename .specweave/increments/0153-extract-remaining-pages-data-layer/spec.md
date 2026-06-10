---
increment: 0153-extract-remaining-pages-data-layer
title: Extract remaining pages data layer
type: refactor
priority: P1
status: completed
created: 2026-06-08T00:00:00.000Z
structure: user-stories
test_mode: test-after
coverage_target: 80
---

# Feature: Extract remaining pages data layer

## Overview

Extract DB query logic from 6 remaining list pages into query functions. All use getRawDb() with raw SQL.

**Pages:**
- public-sectors/index (207 lines)
- non-profits/index (206 lines)
- businesses/index (204 lines)
- blog/index (297 lines)
- admin/media (330 lines)
- listings/index (208 lines)

**Already created but not wired (from earlier increments):**
- getProductBySlug.ts
- getBlogPosts.ts (if exists)
- getNonProfits.ts
- getPublicSectors.ts
- getBusinesses.ts

## User Stories

### US-001: Extract list page query functions (P0)

**Project**: timorup

**As a** developer
**I want** query functions for all 6 remaining list pages
**So that** wiring them up is a mechanical replacement

**Acceptance Criteria**:
- [x] **AC-US1-01**: `src/lib/db/queries/public-sectors.ts` with `getPublicSectors(query, page, limit)`
- [x] **AC-US1-02**: `src/lib/db/queries/non-profits.ts` with `getNonProfits(query, page, limit)`
- [x] **AC-US1-03**: `src/lib/db/queries/businesses-listing.ts` with `getBusinessListing(query, parentCat, childCat, page, limit)`
- [x] **AC-US1-04**: `src/lib/db/queries/blog-listing.ts` with `getBlogPostsPage(query, page, limit)`
- [x] **AC-US1-05**: `src/lib/db/queries/media-listing.ts` with `getMediaFilterList(entityType, category, entityId)`
- [x] **AC-US1-06**: `src/lib/db/queries/listings-listing.ts` with `getListings(query, category, page, limit)`

### US-002: Wire pages to query functions (P1)

**Project**: timorup

**As a** developer
**I want** all 6 pages wired to query functions
**So that** all frontmatter DB queries are eliminated

**Acceptance Criteria**:
- [x] **AC-US2-01**: All 6 pages use query functions instead of raw SQL
- [x] **AC-US2-02**: Build passes (`pnpm exec -- astro build` exit 0)
- [x] **AC-US2-03**: No `db.prepare(` calls remain in page files

## Out of Scope

- Product/[slug] detail page data layer (handled in 0148)
- Query function unit tests (out of scope for refactoring)

## Dependencies

- None
