---
id: US-003
feature: FS-099
title: "Business List Page Refactoring"
status: not_started
priority: P1
created: 2026-05-31
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

- [ ] **AC-US3-01**: Given /businesses page loads, when businesses exist, then each business renders via `<BusinessCard />` component
- [ ] **AC-US3-02**: Given /businesses page, when a BusinessCard is clicked, then navigation goes to `/business/{slug}`
- [ ] **AC-US3-03**: Given /businesses page passes `profileImageId`, `views`, `likes`, `ratingAverage`, `ratingCount`, `address` props, then BusinessCard displays all values correctly

---

## Implementation

**Increment**: [0099-unified-card-rendering](../../../../../increments/0099-unified-card-rendering/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

- [ ] **T-005**: Refactor /businesses page to use BusinessCard
