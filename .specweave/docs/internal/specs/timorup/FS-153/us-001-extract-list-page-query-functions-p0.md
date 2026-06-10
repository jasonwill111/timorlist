---
id: US-001
feature: FS-153
title: "Extract list page query functions (P0)"
status: completed
priority: P1
created: 2026-06-08T00:00:00.000Z
tldr: "**As a** developer."
project: timorup
---

# US-001: Extract list page query functions (P0)

**Feature**: [FS-153](./FEATURE.md)

**As a** developer
**I want** query functions for all 6 remaining list pages
**So that** wiring them up is a mechanical replacement

---

## Acceptance Criteria

- [x] **AC-US1-01**: `src/lib/db/queries/public-sectors.ts` with `getPublicSectors(query, page, limit)`
- [x] **AC-US1-02**: `src/lib/db/queries/non-profits.ts` with `getNonProfits(query, page, limit)`
- [x] **AC-US1-03**: `src/lib/db/queries/businesses-listing.ts` with `getBusinessListing(query, parentCat, childCat, page, limit)`
- [x] **AC-US1-04**: `src/lib/db/queries/blog-listing.ts` with `getBlogPostsPage(query, page, limit)`
- [x] **AC-US1-05**: `src/lib/db/queries/media-listing.ts` with `getMediaFilterList(entityType, category, entityId)`
- [x] **AC-US1-06**: `src/lib/db/queries/listings-listing.ts` with `getListings(query, category, page, limit)`

---

## Implementation

**Increment**: [0153-extract-remaining-pages-data-layer](../../../../../increments/0153-extract-remaining-pages-data-layer/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

- [x] **T-001**: Create `src/lib/db/queries/businesses-listing.ts` (getBusinessListing)
- [x] **T-002**: Create query functions for public-sectors, non-profits, blog
- [x] **T-003**: Create media-listing.ts and listings-listing.ts
