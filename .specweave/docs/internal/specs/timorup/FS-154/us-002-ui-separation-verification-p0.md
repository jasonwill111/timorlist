---
id: US-002
feature: FS-154
title: "UI/业务 separation verification (P0)"
status: completed
priority: P1
created: 2026-06-08T00:00:00.000Z
tldr: "**As a** developer."
project: timorup
---

# US-002: UI/业务 separation verification (P0)

**Feature**: [FS-154](./FEATURE.md)

**As a** developer
**I want** automated verification that UI/业务 separation is complete
**So that** we have a clear acceptance standard

---

## Acceptance Criteria

- [x] **AC-US2-01**: All public pages frontmatter ≤30 meaningful lines
- [x] **AC-US2-02**: No page imports `drizzle-orm` or uses `db.prepare()`
- [x] **AC-US2-03**: All DB queries in `src/lib/db/queries/`

---

## Implementation

**Increment**: [0154-starwind-deprecation-ui-separation-acceptance](../../../../../increments/0154-starwind-deprecation-ui-separation-acceptance/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

- [x] **T-004**: Verify all public pages use query functions
- [x] **T-005**: Verify frontmatter line counts
