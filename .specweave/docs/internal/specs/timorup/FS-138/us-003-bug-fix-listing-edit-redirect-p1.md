---
id: US-003
feature: FS-138
title: "Bug Fix — Listing Edit Redirect (P1)"
status: completed
priority: P1
created: 2026-06-07T00:00:00.000Z
tldr: "**As a** admin."
project: timorup
---

# US-003: Bug Fix — Listing Edit Redirect (P1)

**Feature**: [FS-138](./FEATURE.md)

**As a** admin
**I want** the listing edit page to redirect to the correct URL
**So that** I can navigate back to listings without 404

---

## Acceptance Criteria

- [x] **AC-US3-01**: `pages/admin/listings/[id]/edit/index.astro` — 所有 `/admin/listingss` → `/admin/listings`

---

## Implementation

**Increment**: [0138-security-island-migration](../../../../../increments/0138-security-island-migration/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

- [x] **T-001**: Fix listing edit redirect bug
