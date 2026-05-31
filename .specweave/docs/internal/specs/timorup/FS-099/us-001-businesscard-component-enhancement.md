---
id: US-001
feature: FS-099
title: "BusinessCard Component Enhancement"
status: completed
priority: P1
created: 2026-05-31T00:00:00.000Z
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

- [x] **AC-US1-01**: Given BusinessCard receives `profileImageId` prop, when no thumbnail is provided, then it renders image from `/api/media/{profileImageId}`
- [x] **AC-US1-02**: Given BusinessCard receives `views` prop, when `views > 0`, then it displays views count with eye icon
- [x] **AC-US1-03**: Given BusinessCard receives `entityType` prop with value `'nonprofit'|'publicsector'`, then it renders correct href path (`/non-profit/{slug}` or `/public-sector/{slug}`)

---

## Implementation

**Increment**: [0099-unified-card-rendering](../../../../../increments/0099-unified-card-rendering/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

_No tasks defined for this user story_
