---
id: US-001
feature: FS-154
title: "Starwind deprecation (P0)"
status: completed
priority: P1
created: 2026-06-08T00:00:00.000Z
tldr: "**As a** developer."
project: timorup
---

# US-001: Starwind deprecation (P0)

**Feature**: [FS-154](./FEATURE.md)

**As a** developer
**I want** Starwind duplicate components marked deprecated
**So that** new code uses Fulldev exclusively

---

## Acceptance Criteria

- [x] **AC-US1-01**: `components/starwind/button/` marked deprecated with JSDoc comment
- [x] **AC-US1-02**: `components/starwind/input/` marked deprecated with JSDoc comment
- [x] **AC-US1-03**: `components/starwind/select/` **KEPT** (743 lines of custom logic)
- [x] **AC-US1-04**: No pages import duplicate Starwind button/input/components (only Fulldev)

---

## Implementation

**Increment**: [0154-starwind-deprecation-ui-separation-acceptance](../../../../../increments/0154-starwind-deprecation-ui-separation-acceptance/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

- [x] **T-001**: Mark Starwind button as deprecated
- [x] **T-002**: Mark Starwind input as deprecated
- [x] **T-003**: Verify no pages import duplicate components
