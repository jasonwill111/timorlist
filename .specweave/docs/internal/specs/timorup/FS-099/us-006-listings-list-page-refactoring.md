---
id: US-006
feature: FS-099
title: "Listings List Page Refactoring"
status: completed
priority: P1
created: 2026-05-31T00:00:00.000Z
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

- [x] **AC-US6-01**: Given /listings page loads, when listings exist, then each listing renders via `<ListingCard />` component
- [x] **AC-US6-02**: Given /listings page, when a ListingCard is clicked, then navigation goes to `/listing/{slug}`
- [x] **AC-US6-03**: Given /listings page passes `profileImageId`, `price`, `listingType`, `location`, `likes`, `views` props, then ListingCard displays all values correctly

---

## Implementation

**Increment**: [0099-unified-card-rendering](../../../../../increments/0099-unified-card-rendering/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

_No tasks defined for this user story_
