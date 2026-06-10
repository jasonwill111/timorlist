---
id: US-1
feature: FS-107
title: "Eliminate Duplicate jsonResponse"
status: not_started
priority: P1
created: 2026-06-04T00:00:00.000Z
tldr: "- [ ] src/pages/api/admin/skus/index.ts imports jsonResponse from @/lib/api-helpers."
project: TimorUp
---

# US-1: Eliminate Duplicate jsonResponse

**Feature**: [FS-107](./FEATURE.md)

- [ ] src/pages/api/admin/skus/index.ts imports jsonResponse from @/lib/api-helpers
- [ ] src/pages/api/products/index.ts imports jsonResponse from @/lib/api-helpers
- [ ] src/pages/api/products/[id].ts imports jsonResponse from @/lib/api-helpers
- [ ] Zero inline `function jsonResponse` in src/pages/api/
- [ ] pnpm build exits 0

---

## Acceptance Criteria

No acceptance criteria defined.

---

## Implementation

**Increment**: [0107-api-consolidation](../../../../../increments/0107-api-consolidation/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

_No tasks defined for this user story_
