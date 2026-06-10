---
id: US-001
feature: FS-151
title: "Create business-detail query module (P0)"
status: completed
priority: P0
created: 2026-06-08T00:00:00.000Z
tldr: "**As a** developer."
project: timorup
---

# US-001: Create business-detail query module (P0)

**Feature**: [FS-151](./FEATURE.md)

**As a** developer
**I want** all business detail page queries in a single module
**So that** the page file is clean and queries are reusable

---

## Acceptance Criteria

- [x] **AC-US1-01**: Create `src/lib/db/queries/business-detail.ts` with typed interfaces
- [x] **AC-US1-02**: Implement `getBusinessBySlug(slug: string)` → returns business record or null
- [x] **AC-US1-03**: Implement `getBusinessCategory(categoryId: string)` → returns category or null
- [x] **AC-US1-04**: Implement `getBusinessReviews(businessId: string)` → returns ReviewRecord[]
- [x] **AC-US1-05**: Implement `getBusinessGallery(businessId: string)` → returns GalleryImage[]
- [x] **AC-US1-06**: Implement `getBusinessUpdates(businessId: string)` → returns UpdateRecord[] (limit 4)
- [x] **AC-US1-07**: Implement `isBusinessOwner(sessionToken: string, businessId: string)` → returns boolean

---

## Implementation

**Increment**: [0151-extract-business-detail-data-layer](../../../../../increments/0151-extract-business-detail-data-layer/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

- [x] **T-001**: Create `src/lib/db/queries/business-detail.ts` with interfaces
- [x] **T-002**: Implement `getBusinessBySlug`
- [x] **T-003**: Implement `getBusinessCategory`
- [x] **T-004**: Implement `getBusinessReviews`
- [x] **T-005**: Implement `getBusinessGallery` and `getBusinessUpdates`
- [x] **T-006**: Implement `isBusinessOwner`
