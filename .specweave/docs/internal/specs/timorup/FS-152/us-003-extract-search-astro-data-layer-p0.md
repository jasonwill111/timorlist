---
id: US-003
feature: FS-152
title: "Extract search.astro data layer (P0)"
status: completed
priority: P0
created: 2026-06-08T00:00:00.000Z
tldr: "**As a** developer."
project: timorup
---

# US-003: Extract search.astro data layer (P0)

**Feature**: [FS-152](./FEATURE.md)

**As a** developer
**I want** search.astro DB queries extracted to query functions
**So that** search logic is reusable and testable

---

## Acceptance Criteria

- [x] **AC-US3-01**: `getCategoriesForSearch()` -> returns { id, name } map
- [x] **AC-US3-02**: `searchBusinesses(query: string, page: number, limit: number)` -> returns { results, total, totalPages }
- [x] **AC-US3-03**: search.astro frontmatter reduced from ~95 lines to <= 40 lines
- [x] **AC-US3-04**: Build passes (`pnpm exec -- astro build` exit 0)

---

## Implementation

**Increment**: [0152-extract-account-dashboard-search-data-layer](../../../../../increments/0152-extract-account-dashboard-search-data-layer/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

- [x] **T-005**: Implement `getCategoriesForSearch()` and `searchBusinesses(query, page, limit)`
- [x] **T-006**: Wire search.astro to use query functions
