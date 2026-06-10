---
id: US-002
feature: FS-151
title: "Wire query functions into business/[slug].astro (P0)"
status: completed
priority: P0
created: 2026-06-08T00:00:00.000Z
tldr: "**As a** developer."
project: timorup
---

# US-002: Wire query functions into business/[slug].astro (P0)

**Feature**: [FS-151](./FEATURE.md)

**As a** developer
**I want** business/[slug].astro imports query functions instead of raw DB queries
**So that** the page is clean and follows the separation pattern

---

## Acceptance Criteria

- [x] **AC-US2-01**: All `db.select().from(...).where(...)` removed from frontmatter
- [x] **AC-US2-02**: Page imports from `@/lib/db/queries/business-detail`
- [x] **AC-US2-03**: frontmatter reduces to ≤ 30 lines of meaningful code
- [x] **AC-US2-04**: Page renders identically (same data, same banners, same UI)
- [x] **AC-US2-05**: Build passes (`pnpm exec -- astro build` exit 0)

---

## Implementation

**Increment**: [0151-extract-business-detail-data-layer](../../../../../increments/0151-extract-business-detail-data-layer/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

- [x] **T-007**: Replace DB queries in frontmatter with query function calls
- [x] **T-008**: Verify frontmatter ≤ 30 lines of meaningful code
