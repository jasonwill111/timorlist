---
increment: 0140-starwind-install
title: Starwind UI Installation
type: refactor
priority: P0
status: completed
created: 2026-06-07T00:00:00.000Z
structure: user-stories
test_mode: TDD
coverage_target: 80
---

# Feature: Starwind UI Installation

## Context

项目当前缺少 Starwind 组件库。Fulldev UI 覆盖55 个组件，但缺少 10 个差异化组件：Toast/Dropzone/Pagination/Progress/Color Picker/Scroll Area/Hover Card/Context Menu/Image/Item。项目目前用 Tailwind 硬拼这些组件。

Starwind UI 是 Astro 原生组件库，零 runtime，source 文件归你，通过 `npx starwind@latest` CLI 安装到 `src/components/starwind/`。

---

## User Stories

### US-001: Initialize Starwind CLI (P0)
**Project**: timorup

**As a** developer
**I want** Starwind CLI initialized in the project
**So that** components can be installed via starwind commands

**Acceptance Criteria**:
- [x] **AC-US1-01**: `starwind.config.json` 存在，配置 `baseDir: "src/components/starwind"`
- [x] **AC-US1-02**: `npx starwind@latest --version` 输出正常
- [x] **AC-US1-03**: `src/components/starwind/` 目录存在

---

### US-002: Install Starwind Differential Components (P0)
**Project**: timorup

**As a** developer
**I want** 10 Starwind components installed that fulldev does not have
**So that** those components are available as source files

**Acceptance Criteria**:
- [x] **AC-US2-01**: `toast` 组件存在于 `src/components/starwind/toast/`
- [x] **AC-US2-02**: `dropzone` 组件存在于 `src/components/starwind/dropzone/`
- [x] **AC-US2-03**: `pagination` 组件存在于 `src/components/starwind/pagination/`
- [x] **AC-US2-04**: `progress` 组件存在于 `src/components/starwind/progress/`
- [x] **AC-US2-05**: `color-picker` 组件存在于 `src/components/starwind/color-picker/`
- [x] **AC-US2-06**: `scroll-area` 组件存在于 `src/components/starwind/scroll-area/`
- [x] **AC-US2-07**: `hover-card` 组件存在于 `src/components/starwind/hover-card/`
- [x] **AC-US2-08**: `context-menu` 组件存在于 `src/components/starwind/context-menu/`
- [x] **AC-US2-09**: `image` 组件存在于 `src/components/starwind/image/`
- [x] **AC-US2-10**: `item` 组件存在于 `src/components/starwind/item/`
- [x] **AC-US2-11**: `pnpm exec -- astro build` 退出码 0

---

## Out of Scope

- 不安装与 fulldev 重叠的组件（button/card/dialog/sidebar/table 等已由 fulldev 提供）
- 不修改任何现有页面
- 不修改 `globals.css`

## Dependencies

无。

## Success Criteria

- `src/components/starwind/` 存在且包含 10 个组件目录
- `starwind.config.json` 配置正确
- 构建通过
