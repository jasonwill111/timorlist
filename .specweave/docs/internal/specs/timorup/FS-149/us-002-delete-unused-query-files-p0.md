---
id: US-002
feature: FS-149
title: "Delete unused query files (P0)"
status: completed
priority: P2
created: 2026-06-07T00:00:00.000Z
tldr: "**As a** developer."
project: timorup
---

# US-002: Delete unused query files (P0)

**Feature**: [FS-149](./FEATURE.md)

**As a** developer
**I want** Unused query files deleted from lib/db/queries/
**So that** Project is clean, no dead code

---

## Acceptance Criteria

- [x] **AC-US2-01**: All confirmed unused query files deleted
- [x] **AC-US2-02**: No remaining references to deleted files in codebase
- [x] **AC-US2-03**: pnpm exec -- astro build exit code 0 (verifies no broken imports)

---

## Implementation

**Increment**: [0149-remaining-data-layer-query-cleanup](../../../../../increments/0149-remaining-data-layer-query-cleanup/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

_No tasks defined for this user story_
