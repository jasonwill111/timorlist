---
increment: 0141-marketing-blocks
title: Marketing Pages to Fulldev Blocks
type: refactor
priority: P1
status: completed
created: 2026-06-07T00:00:00.000Z
structure: user-stories
test_mode: TDD
coverage_target: 80
---

# Feature: Marketing Pages to Fulldev Blocks

## Context

当前 5 个营销页面分析后结论：
- `index.astro`（116行）→已是 island 模式，内容在 HomepageContent island，无需改造
- `pricing.astro`（23行）→ 已是 island 模式，内容在 PricingCards island，无需改造
- `contact.astro`（177行）→ 表单有 inline script 复杂逻辑，保持现状

**需要改造的页面：**
- `pages/about.astro`（125行）→ 使用 content-1 block替代静态 content section
- `pages/faq.astro`（119行）→ 使用 faqs-1 block 替代手写 FAQ section

---

## User Stories

### US-001: Replace About Page with Fulldev Block (P1)
**Project**: timorup

**As a** developer
**I want** about page to use Fulldev content block
**So that** static content section is data-driven

**Acceptance Criteria**:
- [D] **AC-US1-01**: `pages/about.astro` 使用 `@/components/content-1` block — **DEFERRED**: content-1 requires `ImageMetadata` from `src/assets/`, currently empty. Add image assets first.
- [D] **AC-US1-02**: 页面行数减少 >30%（125行 →<88行）— **DEFERRED**: same as AC-US1-01

---

### US-002: Replace FAQ Page with Fulldev Block (P1)
**Project**: timorup

**As a** developer
**I want** FAQ page to use Fulldev block
**So that** FAQ section is data-driven and SEO structured data preserved

**Acceptance Criteria**:
- [x] **AC-US2-01**: `pages/faq.astro` 使用 `@/components/faqs-1` block
- [x] **AC-US2-02**: JSON-LD FAQ structured data 保留（schema.org FAQPage）
- [x] **AC-US2-03**: FAQ 数据从 frontmatter props 传入

---

### US-003: Build Verification (P0)
**Project**: timorup

**As a** developer
**I want** full build to pass after block replacement

**Acceptance Criteria**:
- [x] **AC-US3-01**: `pnpm exec -- astro build` 退出码 0

---

## Out of Scope

- `pages/index.astro`（已是 island 模式，内容在 HomepageContent island）
- `pages/pricing.astro`（已是 island 模式，内容在 PricingCards island）
- `pages/contact.astro`（有复杂表单逻辑，保持现状）
- `pages/about.astro`（content-1 block 需要 `ImageMetadata`，当前 `src/assets/` 无图片；包含多个独立 section 不适合单一 block）

## Dependencies

- Increment 0140（Starwind 安装）已完成

## Success Criteria

- faq.astro 行数 119行 → 68行（−43%）
- JSON-LD FAQ schema 保留
- 构建通过
