---
id: US-007
feature: FS-099
title: "Header Container Width Standardization"
status: not_started
priority: P1
created: 2026-05-31
tldr: "**As a** visitor."
project: TimorUp
---

# US-007: Header Container Width Standardization

**Feature**: [FS-099](./FEATURE.md)

**As a** visitor
**I want** the header to use max-w-7xl container
**So that** navigation is aligned with content width

---

## Acceptance Criteria

- [ ] **AC-US7-01**: Given Header.astro, when desktop viewport, then header container uses `max-w-7xl` instead of `max-w-6xl`
- [ ] **AC-US7-02**: Given Header.astro mobile menu, when mobile menu is open, then menu container also uses `max-w-7xl`

---

## Implementation

**Increment**: [0099-unified-card-rendering](../../../../../increments/0099-unified-card-rendering/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

- [ ] **T-003**: Update Header.astro container width
