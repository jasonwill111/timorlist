---
id: US-002
feature: FS-156
title: "Extract admin/listings data layer"
status: completed
priority: P0
created: 2026-06-08T00:00:00.000Z
tldr: "**As a** developer."
project: timorup
---

# US-002: Extract admin/listings data layer

**Feature**: [FS-156](./FEATURE.md)

**As a** developer
**I want** admin/listings/new and admin/listings/[id]/edit to import data from query functions
**So that** frontmatter contains no db.prepare() calls or drizzle-orm imports

---

## Acceptance Criteria

- [x] **AC-US2-01**: admin/listings/new.astro frontmatter has zero imports from `@/db/schema` or `drizzle-orm`
- [x] **AC-US2-02**: admin/listings/new.astro imports from `getListingCategories` in `src/lib/db/queries/listings.ts`
- [x] **AC-US2-03**: admin/listings/[id]/edit.astro frontmatter has zero imports from `@/db/schema` or `drizzle-orm`
- [x] **AC-US2-04**: admin/listings/[id]/edit.astro imports `getAllListingCategories` from `src/lib/db/queries/listings.ts` and `getListingById` from `src/lib/db/queries/admin-listings.ts`

---

## Implementation

**Increment**: [0156-data-layer-extraction](../../../../../increments/0156-data-layer-extraction/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

- [x] **T-002**: Create listings.ts query functions
- [x] **T-003**: Wire admin/listings/new.astro to query functions
- [x] **T-004**: Wire admin/listings/[id]/edit.astro to query functions
