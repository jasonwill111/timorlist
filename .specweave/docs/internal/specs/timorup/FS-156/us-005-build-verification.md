---
id: US-005
feature: FS-156
title: "Build verification"
status: completed
priority: P0
created: 2026-06-08T00:00:00.000Z
tldr: "**As a** developer."
project: timorup
---

# US-005: Build verification

**Feature**: [FS-156](./FEATURE.md)

**As a** developer
**I want** all changes to pass `astro build`
**So that** refactoring does not break the project

---

## Acceptance Criteria

- [x] **AC-US5-01**: `pnpm exec -- astro build` exits with code 0
- [x] **AC-US5-02**: No page file imports from `@/db/schema` directly (grep check = 0)
- [x] **AC-US5-03**: All existing query functions in `src/lib/db/queries/` remain intact

---

## Implementation

**Increment**: [0156-data-layer-extraction](../../../../../increments/0156-data-layer-extraction/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

- [x] **T-009**: Final build verification + grep checks
