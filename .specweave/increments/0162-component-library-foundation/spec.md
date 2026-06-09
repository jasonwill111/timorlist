---
increment: 0162
title: "Component Library Foundation — fulldev/starwind 统一"
type: refactor
priority: P0
status: completed
created: 2026-06-09
structure: user-stories
test_mode: test-after
coverage_target: 100
---

# Feature: Component Library Foundation — fulldev/starwind 统一

## Overview

建立统一的 fulldev + starwind 组件库架构基础。删除 starwind 中已废弃的 button/input 组件，将所有内部引用迁移到 fulldev，并更新文档。

## User Stories

### US-001: 删除 starwind 废弃组件
**Project**: TimorUp

**As a** developer
**I want** starwind 中已标记 @deprecated 的 button 和 input 组件被删除
**So that** 不再维护重复代码，避免混淆

**Acceptance Criteria**:
- [x] **AC-0162-US1-01**: `src/components/starwind/button/` 已删除（源码注释已标记 @deprecated）
- [x] **AC-0162-US1-02**: `src/components/starwind/input/` 已删除（源码注释已标记 @deprecated）
- [x] **AC-0162-US1-03**: Vite build 通过（`pnpm build` exit 0）

### US-002: starwind/pagination 迁移到 fulldev buttonVariants
**Project**: TimorUp

**As a** developer
**I want** starwind/pagination 的按钮样式使用 fulldev/button 的 buttonVariants
**So that** 样式统一，维护成本降低

**Acceptance Criteria**:
- [x] **AC-0162-US2-01**: `PaginationLink.astro` 从 `@/components/starwind/button` 改为 `@/components/fulldev/button`
- [x] **AC-0162-US2-02**: `PaginationNext.astro` 使用 fulldev `buttonVariants`
- [x] **AC-0162-US2-03**: `PaginationPrevious.astro` 使用 fulldev `buttonVariants`
- [x] **AC-0162-US2-04**: Vite build 通过

### US-003: starwind/color-picker 迁移到 fulldev 组件
**Project**: TimorUp

**As a** developer
**I want** starwind/color-picker 使用 fulldev 的 Button 和 Input
**So that** 组件统一，样式一致

**Acceptance Criteria**:
- [x] **AC-0162-US3-01**: `ColorPicker.astro` 从 `@/components/starwind/button` 改为 `@/components/fulldev/button`
- [x] **AC-0162-US3-02**: `ColorPicker.astro` 从 `@/components/starwind/input` 改为 `@/components/fulldev/input`
- [x] **AC-0162-US3-03**: Vite build 通过

### US-004: 更新 component-standards.md 文档
**Project**: TimorUp

**As a** developer
**I want** `docs/internal/design-system/component-standards.md` 反映实际组件路径
**So that** 团队有准确的组件使用参考

**Acceptance Criteria**:
- [x] **AC-0162-US4-01**: 文档中的 fulldev 路径为 `@/components/fulldev/*`（不是 `@/components/ui/*`）
- [x] **AC-0162-US4-02**: 文档列出 13 个保留的 starwind 组件（pagination/dropzone/color-picker 等）
- [x] **AC-0162-US4-03**: 文档明确标记 button/input 为已删除

---

## Out of Scope

- 不修改任何业务页面（pages/）的组件 import 路径
- 不删除 starwind 其他组件
- 不创建 custom wrapper 层（留给未来 increment）

---

## Dependencies

- 无（基础架构任务，独立完成）

---

## Notes

- `starwind/button` 和 `starwind/input` 的 @deprecated 注释已在源码中存在，说明之前已决定废弃
- 两个库的样式系统共用同一套 CSS variables（Tailwind v4），无需额外主题配置
- starwind/pagination 和 color-picker 仅在 starwind 内部使用，业务代码不直接依赖它们
