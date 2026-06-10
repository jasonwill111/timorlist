---
id: US-5
feature: FS-107
title: "Edge Caching"
status: not_started
priority: P1
created: 2026-06-04T00:00:00.000Z
tldr: "- [ ] Public GET endpoints use cachedJsonResponse with 'API' preset."
project: TimorUp
---

# US-5: Edge Caching

**Feature**: [FS-107](./FEATURE.md)

- [ ] Public GET endpoints use cachedJsonResponse with 'API' preset
- [ ] Cache-Control: public, s-maxage=60, stale-while-revalidate=30

## Risk
Medium: API changes can break consumers. Mitigation: backwards-compatible response shapes.

---

## Acceptance Criteria

No acceptance criteria defined.

---

## Implementation

**Increment**: [0107-api-consolidation](../../../../../increments/0107-api-consolidation/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

_No tasks defined for this user story_
