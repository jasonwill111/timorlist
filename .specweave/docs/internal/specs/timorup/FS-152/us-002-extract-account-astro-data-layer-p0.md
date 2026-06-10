---
id: US-002
feature: FS-152
title: "Extract account.astro data layer (P0)"
status: completed
priority: P0
created: 2026-06-08T00:00:00.000Z
tldr: "**As a** developer."
project: timorup
---

# US-002: Extract account.astro data layer (P0)

**Feature**: [FS-152](./FEATURE.md)

**As a** developer
**I want** account.astro DB queries extracted to query functions
**So that** the page file is clean and focused on UI

---

## Acceptance Criteria

- [x] **AC-US2-01**: `getUserPages(userId: string)` -> returns user's businesses with entityType
- [x] **AC-US2-02**: `getUserSubscription(businessId: string)` -> returns subscription info or null
- [x] **AC-US2-03**: account.astro frontmatter reduced from ~100 lines to <= 40 lines
- [x] **AC-US2-04**: Build passes (`pnpm exec -- astro build` exit 0)

---

## Implementation

**Increment**: [0152-extract-account-dashboard-search-data-layer](../../../../../increments/0152-extract-account-dashboard-search-data-layer/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

- [x] **T-002**: Implement `getUserPages(userId: string)`
- [x] **T-003**: Implement `getUserSubscription(businessId: string)`
- [x] **T-004**: Wire account.astro to use query functions
