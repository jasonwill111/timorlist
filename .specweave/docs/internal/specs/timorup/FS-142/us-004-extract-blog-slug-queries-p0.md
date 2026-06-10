---
id: US-004
feature: FS-142
title: "Extract Blog Slug Queries (P0)"
status: completed
priority: P1
created: 2026-06-07T00:00:00.000Z
tldr: "**As a** developer."
project: timorup
---

# US-004: Extract Blog Slug Queries (P0)

**Feature**: [FS-142](./FEATURE.md)

**As a** developer
**I want** `blog/[slug].astro` DB queries in a query function

---

## Acceptance Criteria

- [x] **AC-US4-01**: `src/lib/db/queries/getBlogPostBySlug.ts` 存在
- [x] **AC-US4-02**: `pages/blog/[slug].astro` frontmatter < 30行（81→26行）
- [x] **AC-US4-03**: 页面构建通过（TypeScript 编译无新错误）

---

## Implementation

**Increment**: [0142-slug-pages-query-extraction](../../../../../increments/0142-slug-pages-query-extraction/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

_No tasks defined for this user story_
