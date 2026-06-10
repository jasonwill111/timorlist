---
increment: 0142-slug-pages-query-extraction
title: Slug Pages — Business Logic Extraction
type: refactor
priority: P1
status: completed
created: 2026-06-07T00:00:00.000Z
structure: user-stories
test_mode: TDD
coverage_target: 80
---

# Feature: Slug Pages — Business Logic Extraction (4/5 Wired)

## Context

5 个 slug 详情页包含 DB 查询 + 数据转换 + HTML 模板，全部混在一个文件。**本 increment 完成 4/5 页面 wiring；`business/[slug].astro` 待后续完成（query fn 已提取）。**

| 页面 |原始 frontmatter | 重构后 | 状态 |
|---|---|---|---|
| `blog/[slug].astro` | 81行 | 28行 | ✅ 已完成 |
| `listings/[slug].astro` | 116行 | 51行 | ✅ 已完成 |
| `non-profit/[slug].astro` | 98行 | 24行 | ✅ 已完成 |
| `public-sector/[slug].astro` | 98行 | 24行 | ✅ 已完成 |
| `business/[slug].astro` | 183行 | 183行 | ⏳ deferred — query fn 已提取，wiring 待下次 |

**目标：** 业务逻辑（DB 查询 + 数据转换）→ `src/lib/db/queries/`，页面仅保留 fetch + redirect。

**新增共享工具：** `buildWhatsAppLink()` 和 `formatUnixTimestamp()` 加入 `src/lib/utils.ts`

---

## User Stories

### US-001: Extract Business Slug Queries (P0)
**Project**: timorup

**As a** developer
**I want** `business/[slug].astro` DB queries in a query function
**So that** business logic is reusable and testable

**Acceptance Criteria**:
- [x] **AC-US1-01**: `src/lib/db/queries/getBusinessBySlug.ts` 存在，包含所有 DB 查询逻辑
- [ ] **AC-US1-02**: `pages/business/[slug].astro` frontmatter < 30行 — **deferred**（query fn extracted, wiring to be completed separately）
- [x] **AC-US1-03**: query 函数类型安全，TypeScript 编译通过
- [ ] **AC-US1-04**: `pages/business/[slug].astro` 使用 `getBusinessBySlug()` — **deferred**

---

### US-002: Extract Listing Slug Queries (P0)
**Project**: timorup

**As a** developer
**I want** `listings/[slug].astro` DB queries in a query function

**Acceptance Criteria**:
- [x] **AC-US2-01**: `src/lib/db/queries/getListingBySlug.ts` 存在
- [ ] **AC-US2-02**: `pages/listings/[slug].astro` frontmatter < 30行（重构后 51 行，超出阈值；重构 + wiring 完成，但 JSON/schema逻辑仍在页面）
- [x] **AC-US2-03**: 页面 TypeScript 编译通过

---

### US-003: Extract Non-Profit + Public Sector via Shared Query (P0)
**Project**: timorup

**As a** developer
**I want** non-profit and public-sector pages to share a query function
**So that** duplicate logic is eliminated

**Acceptance Criteria**:
- [x] **AC-US3-01**: `src/lib/db/queries/getEntityBySlug.ts` 存在（shared，entityType 参数化）
- [x] **AC-US3-02**: `pages/non-profit/[slug].astro` 调用 `getEntityBySlug(..., 'non-profit')`
- [x] **AC-US3-03**: `pages/public-sector/[slug].astro` 调用 `getEntityBySlug(..., 'public-sector')`
- [x] **AC-US3-04**: 两个页面 frontmatter 各 < 30行（non-profit: 98→22行，public-sector: 98→22行）

---

### US-004: Extract Blog Slug Queries (P0)
**Project**: timorup

**As a** developer
**I want** `blog/[slug].astro` DB queries in a query function

**Acceptance Criteria**:
- [x] **AC-US4-01**: `src/lib/db/queries/getBlogPostBySlug.ts` 存在
- [x] **AC-US4-02**: `pages/blog/[slug].astro` frontmatter < 30行（81→26行）
- [x] **AC-US4-03**: 页面构建通过（TypeScript 编译无新错误）

---

### US-005: Build Verification (P0)
**Project**: timorup

**As a** developer
**I want** full build to pass after extraction

**Acceptance Criteria**:
- [x] **AC-US5-01**: TypeScript 编译通过，无新错误（4 query files + 4 wired pages clean）
- [x] **AC-US5-02**: 4/5 slug pages wired（blog/listings/non-profit/public-sector）；business/[slug] query fn extracted, wiring deferred

---

## Out of Scope

- 不修改 HTML 模板结构
- 不添加新功能
- 不修改 DB schema

## Dependencies

- Increment 0140（Starwind 安装）应先完成

## Success Criteria

- 4 个 query 文件存在且类型安全（business query fn 已提取，wiring deferred）
- 4 个 slug 页面 frontmatter 缩减（blog 81→28, listings 116→51, non-profit 98→24, public-sector 98→24）
- 构建通过，无新 TypeScript 错误
- 新增共享工具函数：`buildWhatsAppLink()`、`formatUnixTimestamp()`
- `business/[slug].astro` wiring 待后续 increment 完成
