---
id: US-006
feature: FS-099
title: "Listings List Page Refactoring"
status: not_started
priority: P1
created: 2026-05-31
tldr: "**As a** visitor."
project: TimorUp
---

# US-006: Listings List Page Refactoring

**Feature**: [FS-099](./FEATURE.md)

**As a** visitor
**I want** the /listings page to use ListingCard component
**So that** classified ad listings are rendered consistently

---

## Acceptance Criteria

- [ ] **AC-US6-01**: Given /listings page loads, when listings exist, then each listing renders via `<ListingCard />` component
- [ ] **AC-US6-02**: Given /listings page, when a ListingCard is clicked, then navigation goes to `/listing/{slug}`
- [ ] **AC-US6-03**: Given /listings page passes `profileImageId`, `price`, `listingType`, `location`, `likes`, `views` props, then ListingCard displays all values correctly

---

## Implementation

**Increment**: [0099-unified-card-rendering](../../../../../increments/0099-unified-card-rendering/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

- [ ] **T-008**: Refactor /listings island to use ListingCard
