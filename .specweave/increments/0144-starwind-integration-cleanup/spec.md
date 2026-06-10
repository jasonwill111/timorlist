---
increment: 0144-starwind-integration-cleanup
title: Starwind集成 + 双库风格协调
type: refactor
priority: P1
status: completed
created: 2026-06-07T00:00:00.000Z
structure: user-stories
test_mode: test-after
coverage_target: 80
---

# Feature: Starwind 集成 + 双库风格协调

## Overview

Fulldev（`src/components/ui/`）和 Starwind（`src/components/starwind/`）双库共存。0145 已删除旧 shadcn-astro PascalCase 文件。0144 聚焦：Starwind 差异化组件（Toast/Pagination/Progress/Dropzone/ScrollArea）首次集成到实际页面 + 双库 CSS token 协调。

## User Stories

### US-001: 删除 PascalCase Legacy 文件（0145 继承）(P0)
**Project**: timorup

**As a** developer
**I want** 旧 shadcn-astro PascalCase 文件已删除
**So that** 只保留 Fulldev 和 Starwind 子目录组件

**Acceptance Criteria**:
- [x] **AC-US1-01**: `components.json` 删除（0145 已完成）
- [x] **AC-US1-02**: 15 个 PascalCase 文件删除（0145 已完成）
- [x] **AC-US1-03**: 5 个引用文件 import 已更新（0145 已完成）

---

### US-002: Starwind Toast 在 Auth 流程使用 (P1)
**Project**: timorup

**As a** developer
**I want** 登录/注册成功或失败时显示 Starwind Toast 提示
**So that** 用户获得即时操作反馈

**Acceptance Criteria**:
- [x] **AC-US2-01**: `src/components/starwind/toast/` 存在且 `<Toaster>` 在 Layout 中挂载
- [x] **AC-US2-02**: `pages/login.astro` 登录成功后 `toast.success('Login successful')`
- [x] **AC-US2-03**: `pages/login.astro` 登录失败后 `toast.error(message)` 显示错误
- [x] **AC-US2-04**: `pages/register.astro` 注册成功后 `toast.success('Account created')`

---

### US-003: Starwind Pagination 在列表页使用 (P1)
**Project**: timorup

**As a** developer
**I want** blog/listings 等列表页使用 Starwind Pagination
**So that** 分页器样式与设计系统一致（Fulldev 无 Pagination）

**Acceptance Criteria**:
- [x] **AC-US3-01**: `pages/blog/index.astro` 使用 `@/components/starwind/pagination`
- [x] **AC-US3-02**: `pages/listings/index.astro` 使用 `@/components/starwind/pagination`
- [x] **AC-US3-03**: 分页切换（首页/末页/跳转）正常工作

---

### US-004: Starwind Progress 在 admin/ai-tools 使用 (P1)
**Project**: timorup

**As a** developer
**I want** AI 生成进度显示使用 Starwind Progress
**So that** 进度条样式与设计系统一致

**Acceptance Criteria**:
- [x] **AC-US4-01**: `pages/admin/ai-tools.astro` 使用 `<Progress>` 组件
- [x] **AC-US4-02**: AI 生成进度实时更新（0-100%）
- [x] **AC-US4-03**: 进度条动画流畅，无闪烁

---

### US-005: Starwind Dropzone 在 admin/media 使用 (P1)
**Project**: timorup

**As a** developer
**I want** admin 媒体上传使用 Starwind Dropzone
**So that** 拖拽上传/多文件预览/进度条完整

**Acceptance Criteria**:
- [x] **AC-US5-01**: `src/components/starwind/dropzone/` 存在且可 import
- [x] **AC-US5-02**: `components/islands/admin/MediaIsland.astro` 使用 `<Dropzone>`
- [x] **AC-US5-03**: 文件拖拽上传、多文件预览正常

---

### US-006: 双库 CSS 无冲突 + 构建验证 (P0)
**Project**: timorup

**As a** developer
**I want** Fulldev + Starwind 双库 CSS 无冲突，构建通过
**So that** 两库按钮/弹窗/动效视觉完全一致

**Acceptance Criteria**:
- [x] **AC-US6-01**: `global.css` 定义 `--primary`, `--radius`, `--color-*` token，两库均引用
- [x] **AC-US6-02**: 页面中无同时 import Fulldev + Starwind 同名组件（Button/Select 等）
- [x] **AC-US6-03**: `pnpm exec -- astro build` 退出码 0，无新增错误

---

## Success Criteria

- Starwind Toast → login/register 成功/失败提示
- Starwind Pagination → blog/listings
- Starwind Progress → admin/ai-tools
- Starwind Dropzone → admin/media
- 双库无同名组件混用
- 构建通过

## Out of Scope

- Starwind 组件源码修改
- Starwind 在非 admin/login/register 页面使用
- Fulldev 已有组件（Button/Dialog/Select）替换为 Starwind
