---
id: US-005
feature: FS-099
title: "Public Sector List Page Refactoring"
status: completed
priority: P1
created: 2026-05-31T00:00:00.000Z
tldr: "**As a** visitor."
project: TimorUp
---

# US-005: Public Sector List Page Refactoring

**Feature**: [FS-099](./FEATURE.md)

**As a** visitor
**I want** the /public-sectors page to use BusinessCard component with publicSector mode
**So that** public sector listings are rendered consistently

---

## Acceptance Criteria

- [x] **AC-US5-01**: Given /public-sectors page loads, when public sectors exist, then each renders via `<BusinessCard entityType="publicsector" />`
- [x] **AC-US5-02**: Given /public-sectors page, when a BusinessCard is clicked, then navigation goes to `/public-sector/{slug}`
- [x] **AC-US5-03**: Given /public-sectors page, when entityType="publicsector", then BusinessCard renders category badge with blue color scheme

---

## Implementation

**Increment**: [0099-unified-card-rendering](../../../../../increments/0099-unified-card-rendering/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

_No tasks defined for this user story_
