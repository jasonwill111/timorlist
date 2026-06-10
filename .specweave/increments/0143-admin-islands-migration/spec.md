---
increment: 0143-admin-islands-migration
title: Admin Pages — Island Migration
type: refactor
priority: P1
status: completed
created: 2026-06-07T00:00:00.000Z
structure: user-stories
test_mode: TDD
coverage_target: 80
---

# Feature: Admin Pages — Island Migration

## Context

4 个 Admin 页面仍有大量 inline script，未迁移到 island 模式。这些页面是最大的 XSS 风险源：

| 页面 | 文件行数 | 问题 |
|---|---|---|
| `admin/ai-tools.astro` | 927行 | inline script + 复杂逻辑 |
| `admin/login.astro` | 188行 | 登录表单 inline script |
| `admin/media.astro` | 303行 | 媒体管理 inline script |
| `admin/settings.astro` | 94行 | 设置表单 inline script |

**已迁移的 Admin 页面（无需处理）：** admin/index + 12 个 admin islands。

---

## User Stories

### US-001: Migrate Admin Login to Island (P1)
**Project**: timorup

**As a** developer
**I want** admin login page to use LoginIsland
**So that** login form logic is in an island with safe DOM API

**Acceptance Criteria**:
- [x] **AC-US1-01**: `components/islands/admin/LoginIsland.astro` 存在
- [x] **AC-US1-02**: `pages/admin/login.astro` 简化为 island 引用 + 数据获取
- [x] **AC-US1-03**: island script 使用 `textContent`/`value` 替代 innerHTML
- [x] **AC-US1-04**: 登录功能（表单提交、错误提示）正常工作

---

### US-002: Migrate Admin Media to Island (P1)
**Project**: timorup

**As a** developer
**I want** admin media page to use MediaIsland

**Acceptance Criteria**:
- [x] **AC-US2-01**: `components/islands/admin/MediaIsland.astro` 存在
- [x] **AC-US2-02**: `pages/admin/media.astro` 简化为 island 引用 + 数据获取
- [x] **AC-US2-03**: island script 使用 `textContent`/`classList` 替代 innerHTML
- [x] **AC-US2-04**: 媒体上传/删除功能正常工作

---

### US-003: Migrate Admin AI Tools to Island (P1)
**Project**: timorup

**As a** developer
**I want** admin AI tools page to use AIToolsIsland
**So that** 927-line page is split into a clean island component

**Acceptance Criteria**:
- [x] **AC-US3-01**: `components/islands/admin/AIToolsIsland.astro` 存在
- [x] **AC-US3-02**: `pages/admin/ai-tools.astro` 简化为 island 引用 + 数据获取
- [x] **AC-US3-03**: island script 使用 `textContent`/`classList` 替代 innerHTML
- [x] **AC-US3-04**: AI tools 面板功能正常工作

---

### US-004: Migrate Admin Settings to Island (P1)
**Project**: timorup

**As a** developer
**I want** admin settings page to use SettingsIsland

**Acceptance Criteria**:
- [x] **AC-US4-01**: `components/islands/admin/SettingsIsland.astro` 存在
- [x] **AC-US4-02**: `pages/admin/settings.astro` 简化为 island 引用 + 数据获取
- [x] **AC-US4-03**: island script 使用 `textContent`/`value` 替代 innerHTML
- [x] **AC-US4-04**: 设置保存功能正常工作

---

### US-005: Build Verification (P0)
**Project**: timorup

**As a** developer
**I want** full build to pass after migration

**Acceptance Criteria**:
- [x] **AC-US5-01**: `pnpm exec -- astro build` 退出码 0
- [x] **AC-US5-02**: `pnpm exec -- playwright test e2e/admin.spec.ts` 通过

---

## Out of Scope

- 不修改已有的 admin islands
- 不迁移 `admin/index.astro`（已完成）

## Dependencies

- Increment 0140（Starwind 安装）应先完成（MediaIsland 需要 starwind dropzone）

## Success Criteria

- 4 个 admin 页面全部简化为 island 引用
- 所有 island script 无 innerHTML
- 构建通过
- E2E 通过
