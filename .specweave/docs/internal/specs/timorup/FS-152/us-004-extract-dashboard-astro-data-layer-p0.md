---
id: US-004
feature: FS-152
title: "Extract dashboard.astro data layer (P0)"
status: completed
priority: P0
created: 2026-06-08T00:00:00.000Z
tldr: "**As a** developer."
project: timorup
---

# US-004: Extract dashboard.astro data layer (P0)

**Feature**: [FS-152](./FEATURE.md)

**As a** developer
**I want** dashboard.astro auth extracted to shared function
**So that** it's consistent with account page

---

## Acceptance Criteria

- [x] **AC-US4-01**: dashboard.astro uses shared `resolveUserFromCookie`
- [x] **AC-US4-02**: Dashboard frontmatter reduced to <= 20 lines
- [x] **AC-US4-03**: Build passes (`pnpm exec -- astro build` exit 0)

---

## Implementation

**Increment**: [0152-extract-account-dashboard-search-data-layer](../../../../../increments/0152-extract-account-dashboard-search-data-layer/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

- [x] **T-007**: Wire dashboard.astro to use resolveUserFromCookie
