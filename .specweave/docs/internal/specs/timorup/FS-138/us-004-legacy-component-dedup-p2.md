---
id: US-004
feature: FS-138
title: "Legacy Component Dedup (P2)"
status: completed
priority: P1
created: 2026-06-07T00:00:00.000Z
tldr: "**As a** developer."
project: timorup
---

# US-004: Legacy Component Dedup (P2)

**Feature**: [FS-138](./FEATURE.md)

**As a** developer
**I want** duplicate PascalCase component files to be replaced with re-exports
**So that** no duplicate implementations exist

---

## Acceptance Criteria

- [x] **AC-US4-01**: `CardContent.astro`, `CardDescription.astro`, `CardHeader.astro`, `CardTitle.astro` → re-export
- [x] **AC-US4-02**: `Input.astro`, `Select.astro`, `Textarea.astro`, `Label.astro` → re-export
- [x] **AC-US4-03**: `Button.astro`, `Card.astro`, `Accordion.astro` → re-export

---

## Implementation

**Increment**: [0138-security-island-migration](../../../../../increments/0138-security-island-migration/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

- [x] **T-008**: Re-export legacy PascalCase components
