---
increment: 0151-extract-business-detail-data-layer
title: 'Extract business/[slug].astro data layer'
type: refactor
priority: P0
status: completed
created: 2026-06-08T00:00:00.000Z
structure: user-stories
test_mode: test-after
coverage_target: 80
---

# Feature: Extract business/[slug].astro data layer

## Overview

Extract ~180 lines of frontmatter DB query logic from business/[slug].astro into query functions in `src/lib/db/queries/`. This is the largest page in the project and the primary target for UI/业务 separation.

**Target**: frontmatter ≤ 30 lines of meaningful code (imports + wiring only). All DB queries → `src/lib/db/queries/business-detail.ts`.

## User Stories

### US-001: Create business-detail query module (P0)

**Project**: timorup

**As a** developer
**I want** all business detail page queries in a single module
**So that** the page file is clean and queries are reusable

**Acceptance Criteria**:
- [x] **AC-US1-01**: Create `src/lib/db/queries/business-detail.ts` with typed interfaces
- [x] **AC-US1-02**: Implement `getBusinessBySlug(slug: string)` → returns business record or null
- [x] **AC-US1-03**: Implement `getBusinessCategory(categoryId: string)` → returns category or null
- [x] **AC-US1-04**: Implement `getBusinessReviews(businessId: string)` → returns ReviewRecord[]
- [x] **AC-US1-05**: Implement `getBusinessGallery(businessId: string)` → returns GalleryImage[]
- [x] **AC-US1-06**: Implement `getBusinessUpdates(businessId: string)` → returns UpdateRecord[] (limit 4)
- [x] **AC-US1-07**: Implement `isBusinessOwner(sessionToken: string, businessId: string)` → returns boolean

### US-002: Wire query functions into business/[slug].astro (P0)

**Project**: timorup

**As a** developer
**I want** business/[slug].astro imports query functions instead of raw DB queries
**So that** the page is clean and follows the separation pattern

**Acceptance Criteria**:
- [x] **AC-US2-01**: All `db.select().from(...).where(...)` removed from frontmatter
- [x] **AC-US2-02**: Page imports from `@/lib/db/queries/business-detail`
- [x] **AC-US2-03**: frontmatter reduces to ≤ 30 lines of meaningful code
- [x] **AC-US2-04**: Page renders identically (same data, same banners, same UI)
- [x] **AC-US2-05**: Build passes (`pnpm exec -- astro build` exit 0)

## Out of Scope

- Subscription logic (`getSubscriptionDashboard`) — stays in page (complex grace period math)
- Owner check via session — refactor to `isBusinessOwner` function, but the cookie parsing stays in-page for now

## Dependencies

- None
