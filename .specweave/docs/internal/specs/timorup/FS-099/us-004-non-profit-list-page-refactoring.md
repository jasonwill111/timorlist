---
id: US-004
feature: FS-099
title: "Non-Profit List Page Refactoring"
status: completed
priority: P1
created: 2026-05-31T00:00:00.000Z
tldr: "**As a** visitor."
project: TimorUp
---

# US-004: Non-Profit List Page Refactoring

**Feature**: [FS-099](./FEATURE.md)

**As a** visitor
**I want** the /non-profits page to use BusinessCard component with nonprofit mode
**So that** non-profit listings are rendered consistently

---

## Acceptance Criteria

- [x] **AC-US4-01**: Given /non-profits page loads, when non-profits exist, then each non-profit renders via `<BusinessCard entityType="nonprofit" />`
- [x] **AC-US4-02**: Given /non-profits page, when a BusinessCard is clicked, then navigation goes to `/non-profit/{slug}`
- [x] **AC-US4-03**: Given /non-profits page, when entityType="nonprofit", then BusinessCard renders category badge with rose color scheme

---

## Implementation

**Increment**: [0099-unified-card-rendering](../../../../../increments/0099-unified-card-rendering/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

_No tasks defined for this user story_
