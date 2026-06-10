---
id: US-001
feature: FS-156
title: "Extract admin/media data layer"
status: completed
priority: P0
created: 2026-06-08T00:00:00.000Z
tldr: "**As a** developer."
project: timorup
---

# US-001: Extract admin/media data layer

**Feature**: [FS-156](./FEATURE.md)

**As a** developer
**I want** admin/media.astro to import data from a query function
**So that** frontmatter contains no drizzle-orm imports and no raw SQL

---

## Acceptance Criteria

- [x] **AC-US1-01**: admin/media.astro frontmatter has zero imports from `@/db/schema` or `drizzle-orm`
- [x] **AC-US1-02**: admin/media.astro imports from `getMediaList` in `src/lib/db/queries/media-listing.ts`
- [x] **AC-US1-03**: admin/media.astro imports `MediaIsland` exactly once (was added in this increment, not deduplicated)
- [x] **AC-US1-04**: `getMediaList` returns `{ items, total, totalPages, totalSizeMB, entityTypes, categories }` — same shape as current inline logic

---

## Implementation

**Increment**: [0156-data-layer-extraction](../../../../../increments/0156-data-layer-extraction/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

- [x] **T-001**: Fix admin/media duplicate import + drizzle cleanup
