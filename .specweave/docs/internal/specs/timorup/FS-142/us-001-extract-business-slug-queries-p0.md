---
id: US-001
feature: FS-142
title: "Extract Business Slug Queries (P0)"
status: in_progress
priority: P1
created: 2026-06-07T00:00:00.000Z
tldr: "**As a** developer."
project: timorup
---

# US-001: Extract Business Slug Queries (P0)

**Feature**: [FS-142](./FEATURE.md)

**As a** developer
**I want** `business/[slug].astro` DB queries in a query function
**So that** business logic is reusable and testable

---

## Acceptance Criteria

- [x] **AC-US1-01**: `src/lib/db/queries/getBusinessBySlug.ts` 存在，包含所有 DB 查询逻辑
- [ ] **AC-US1-02**: `pages/business/[slug].astro` frontmatter < 30行 — **deferred**（query fn extracted, wiring to be completed separately）
- [x] **AC-US1-03**: query 函数类型安全，TypeScript 编译通过
- [ ] **AC-US1-04**: `pages/business/[slug].astro` 使用 `getBusinessBySlug()` — **deferred**

---

## Implementation

**Increment**: [0142-slug-pages-query-extraction](../../../../../increments/0142-slug-pages-query-extraction/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

_No tasks defined for this user story_
