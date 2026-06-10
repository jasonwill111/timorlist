---
id: US-002
feature: FS-142
title: "Extract Listing Slug Queries (P0)"
status: in_progress
priority: P1
created: 2026-06-07T00:00:00.000Z
tldr: "**As a** developer."
project: timorup
---

# US-002: Extract Listing Slug Queries (P0)

**Feature**: [FS-142](./FEATURE.md)

**As a** developer
**I want** `listings/[slug].astro` DB queries in a query function

---

## Acceptance Criteria

- [x] **AC-US2-01**: `src/lib/db/queries/getListingBySlug.ts` 存在
- [ ] **AC-US2-02**: `pages/listings/[slug].astro` frontmatter < 30行（重构后 51 行，超出阈值；重构 + wiring 完成，但 JSON/schema逻辑仍在页面）
- [x] **AC-US2-03**: 页面 TypeScript 编译通过

---

## Implementation

**Increment**: [0142-slug-pages-query-extraction](../../../../../increments/0142-slug-pages-query-extraction/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

_No tasks defined for this user story_
