---
id: US-003
feature: FS-099
title: "Business List Page Refactoring"
status: completed
priority: P1
created: 2026-05-31T00:00:00.000Z
tldr: "**As a** visitor."
project: TimorUp
---

# US-003: Business List Page Refactoring

**Feature**: [FS-099](./FEATURE.md)

**As a** visitor
**I want** the /businesses page to use BusinessCard component
**So that** business listings are rendered consistently with other pages

---

## Acceptance Criteria

- [x] **AC-US3-01**: Given /businesses page loads, when businesses exist, then each business renders via `<BusinessCard />` component
- [x] **AC-US3-02**: Given /businesses page, when a BusinessCard is clicked, then navigation goes to `/business/{slug}`
- [x] **AC-US3-03**: Given /businesses page passes `profileImageId`, `views`, `likes`, `ratingAverage`, `ratingCount`, `address` props, then BusinessCard displays all values correctly

---

## Implementation

**Increment**: [0099-unified-card-rendering](../../../../../increments/0099-unified-card-rendering/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

_No tasks defined for this user story_
