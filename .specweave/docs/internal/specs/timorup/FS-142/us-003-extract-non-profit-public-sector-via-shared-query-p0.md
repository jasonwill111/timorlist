---
id: US-003
feature: FS-142
title: "Extract Non-Profit + Public Sector via Shared Query (P0)"
status: completed
priority: P1
created: 2026-06-07T00:00:00.000Z
tldr: "**As a** developer."
project: timorup
---

# US-003: Extract Non-Profit + Public Sector via Shared Query (P0)

**Feature**: [FS-142](./FEATURE.md)

**As a** developer
**I want** non-profit and public-sector pages to share a query function
**So that** duplicate logic is eliminated

---

## Acceptance Criteria

- [x] **AC-US3-01**: `src/lib/db/queries/getEntityBySlug.ts` 存在（shared，entityType 参数化）
- [x] **AC-US3-02**: `pages/non-profit/[slug].astro` 调用 `getEntityBySlug(..., 'non-profit')`
- [x] **AC-US3-03**: `pages/public-sector/[slug].astro` 调用 `getEntityBySlug(..., 'public-sector')`
- [x] **AC-US3-04**: 两个页面 frontmatter 各 < 30行（non-profit: 98→22行，public-sector: 98→22行）

---

## Implementation

**Increment**: [0142-slug-pages-query-extraction](../../../../../increments/0142-slug-pages-query-extraction/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

_No tasks defined for this user story_
