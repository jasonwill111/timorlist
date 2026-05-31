---
id: US-002
feature: FS-099
title: "ListingCard Component Enhancement"
status: not_started
priority: P1
created: 2026-05-31
tldr: "**As a** frontend developer."
project: TimorUp
---

# US-002: ListingCard Component Enhancement

**Feature**: [FS-099](./FEATURE.md)

**As a** frontend developer
**I want** ListingCard.astro to accept `profileImageId` prop
**So that** it can display the listing's primary image from media API

---

## Acceptance Criteria

- [ ] **AC-US2-01**: Given ListingCard receives `profileImageId` prop, when no thumbnail is provided, then it renders image from `/api/media/{profileImageId}`
- [ ] **AC-US2-02**: Given ListingCard renders thumbnail, then it uses the standard `aspect-square` container matching BusinessCard design

---

## Implementation

**Increment**: [0099-unified-card-rendering](../../../../../increments/0099-unified-card-rendering/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

- [ ] **T-002**: Enhance ListingCard.astro with profileImageId
