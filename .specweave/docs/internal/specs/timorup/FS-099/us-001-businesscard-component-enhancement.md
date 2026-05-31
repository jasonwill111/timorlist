---
id: US-001
feature: FS-099
title: "BusinessCard Component Enhancement"
status: not_started
priority: P1
created: 2026-05-31
tldr: "**As a** frontend developer."
project: TimorUp
---

# US-001: BusinessCard Component Enhancement

**Feature**: [FS-099](./FEATURE.md)

**As a** frontend developer
**I want** BusinessCard.astro to accept `profileImageId`, `views`, and `entityType` props
**So that** I can replace inline business cards with a consistent component

---

## Acceptance Criteria

- [ ] **AC-US1-01**: Given BusinessCard receives `profileImageId` prop, when no thumbnail is provided, then it renders image from `/api/media/{profileImageId}`
- [ ] **AC-US1-02**: Given BusinessCard receives `views` prop, when `views > 0`, then it displays views count with eye icon
- [ ] **AC-US1-03**: Given BusinessCard receives `entityType` prop with value `'nonprofit'|'publicsector'`, then it renders correct href path (`/non-profit/{slug}` or `/public-sector/{slug}`)

---

## Implementation

**Increment**: [0099-unified-card-rendering](../../../../../increments/0099-unified-card-rendering/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

- [ ] **T-001**: Enhance BusinessCard.astro with new props
