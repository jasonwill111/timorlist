---
increment: 0164
title: "Platform Cleanup — 死代码删除 + Cloudflare 优化"
type: refactor
priority: P1
status: completed
created: 2026-06-09
structure: user-stories
test_mode: test-after
coverage_target: 100
---

# Feature: Platform Cleanup — 死代码删除 + Cloudflare 优化

## Overview

清理死代码和错误配置，使平台配置与 Cloudflare Workers 最佳实践对齐。

## User Stories

### US-001: 删除 auth-kv-store.ts 死代码
**Project**: TimorUp

**As a** developer
**I want** `src/lib/auth-kv-store.ts` 被删除
**So that** 不维护未使用的代码

**Acceptance Criteria**:
- [x] **AC-0164-US1-01**: `src/lib/auth-kv-store.ts` 已删除
- [x] **AC-0164-US1-02**: 无任何 import 引用 `auth-kv-store`
- [x] **AC-0164-US1-03**: Vite build 通过

### US-002: 修复 imageService 配置
**Project**: TimorUp

**As a** developer
**I want** `imageService` 改为 `cloudflare-binding`
**So that** 利用 Cloudflare 原生图片优化

**Acceptance Criteria**:
- [x] **AC-0164-US2-01**: `astro.config.mjs` 中 `imageService` 为 `'cloudflare-binding'`
- [x] **AC-0164-US2-02**: Vite build 通过

---

## Islands Security Audit (Full)

| 目录 | 文件数 | XSS 安全 |
|---|---|---|
| `src/components/islands/` (简单 island) | 5 | ✅ 全部通过 |
| `src/components/islands/admin/` | 13 | ✅ 全部通过 |

**admin islands 详细审计结果：**
- AIToolsIsland → `DOMPurify.sanitize()` ✅
- MediaIsland → 无 innerHTML ✅
- UsersIsland → `escapeHtml()` + `textContent` ✅
- SettingsIsland → `.value` 安全 DOM 写入 ✅
- LoginIsland → `.textContent` 错误消息 ✅
- OrdersIsland → 无 innerHTML ✅
- AdminListActions → 无 script block ✅
- DashboardIsland → `sanitize()` ✅
- ProductsFormIsland → `escapeHtml()` + 静态 builder ✅
- ProductsTableIsland → `escapeHtml()` ✅
- ReviewsIsland → DOM API ✅ (0123 已修复)
- ListingsIsland → DOM API ✅ (0123 已修复)
- BusinessesIsland → 无 innerHTML ✅

---

## Server Islands Status

- **当前状态**: admin 页面中无 `server:defer` 或 `server:poll` 使用
- **建议**: 适用于 admin/media（大数据列表）、admin/dashboard（聚合统计）— 留待未来 increment

---

## Out of Scope

- Server Islands 采用（留待未来 increment）
- nanostores 连接（无 React island，架构不适配）
- 非 admin island 审计（已通过）

---

## Dependencies

- 0163-islands-xss-refactor（先完成 islands 安全审计）

---

## Notes

- `auth-kv-store.ts` 是 Better Auth 1.4 的 `secondaryStorage` 适配器，Better Auth 1.6+ 已原生消费 `env.SESSION`，此文件从未被任何地方 import
- `imageService: 'cloudflare-binding'` 启用 Cloudflare 图片变换 API（`?width=&quality=&format=`），已在 `src/lib/media.ts` 中使用
