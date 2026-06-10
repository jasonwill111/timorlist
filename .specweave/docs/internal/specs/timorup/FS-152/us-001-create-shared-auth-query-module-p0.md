---
id: US-001
feature: FS-152
title: "Create shared auth query module (P0)"
status: completed
priority: P0
created: 2026-06-08T00:00:00.000Z
tldr: "**As a** developer."
project: timorup
---

# US-001: Create shared auth query module (P0)

**Feature**: [FS-152](./FEATURE.md)

**As a** developer
**I want** session -> user resolution in a single reusable function
**So that** account and dashboard share the same auth pattern

---

## Acceptance Criteria

- [x] **AC-US1-01**: Create `src/lib/db/queries/auth.ts` with `resolveUserFromCookie(cookieHeader: string)` returning user or null
- [x] **AC-US1-02**: Handles raw SQL session lookup + expiration check (ms vs seconds)
- [x] **AC-US1-03**: Both account and dashboard use the shared function

---

## Implementation

**Increment**: [0152-extract-account-dashboard-search-data-layer](../../../../../increments/0152-extract-account-dashboard-search-data-layer/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

- [x] **T-001**: Create `src/lib/db/queries/auth.ts` with `resolveUserFromCookie`
