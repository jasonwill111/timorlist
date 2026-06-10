---
id: US-003
feature: FS-139
title: "Slug Pages — Business Logic Separation (P0)"
status: completed
priority: P1
created: 2026-06-07T00:00:00.000Z
tldr: "**As a** developer."
project: timorup
---

# US-003: Slug Pages — Business Logic Separation (P0)

**Feature**: [FS-139](./FEATURE.md)

**As a** developer
**I want** slug detail pages to have clean separation between data and UI
**So that** business logic is reusable, testable, and AI-editable independently

---

## Acceptance Criteria

- [x] **AC-US3-01**: `src/lib/db/queries/` 中新增 `getBusinessBySlug.ts` — 包含 `business/[slug].astro` 所有 DB 查询逻辑
- [x] **AC-US3-02**: `src/lib/db/queries/` 中新增 `getListingBySlug.ts` — 包含 `listings/[slug].astro` 所有 DB 查询逻辑
- [x] **AC-US3-03**: `src/lib/db/queries/` 中新增 `getNonProfitBySlug.ts` — 包含 `non-profit/[slug].astro` 所有 DB 查询逻辑
- [x] **AC-US3-04**: `src/lib/db/queries/` 中新增 `getPublicSectorBySlug.ts` — 包含 `public-sector/[slug].astro` 所有 DB 查询逻辑
- [x] **AC-US3-05**: `src/lib/db/queries/` 中新增 `getBlogPostBySlug.ts` — 包含 `blog/[slug].astro` 所有 DB 查询逻辑
- [x] **AC-US3-06**: 5 个 slug 页面的 frontmatter **仅保留** fetch + redirect，DB逻辑全部移到 query 函数
- [x] **AC-US3-07**: `non-profit/[slug].astro` 和 `public-sector/[slug].astro` 重构为共用 `getEntityBySlug.ts` 查询函数（两者结构高度相似）

---

## Implementation

**Increment**: [0139-fulldev-starwind-migration](../../../../../increments/0139-fulldev-starwind-migration/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

- [x] **T-008**: Extract business/[slug] queries
- [x] **T-009**: Extract listings/[slug] queries
- [x] **T-010**: Extract non-profit/[slug] queries
- [x] **T-011**: Extract public-sector/[slug] queries
- [x] **T-012**: Extract blog/[slug] queries
