---
increment: 0163
title: "Islands XSS 安全重构 — ListingsIsland + ReviewsIsland"
type: security-fix
priority: P0
status: completed
created: 2026-06-09
structure: user-stories
test_mode: test-after
coverage_target: 100
---

# Feature: Islands XSS 安全重构

## Overview

审计并修复 islands 组件中的 innerHTML XSS 漏洞。扫描所有 15 个简单 island 和 13 个 admin island，发现 2 个 XSS 漏洞并修复。

## User Stories

### US-001: 修复 ListingsIsland XSS 漏洞
**Project**: TimorUp

**As a** user
**I want** admin 看到的 listing 列表不包含恶意脚本
**So that** 免受 XSS 攻击

**Acceptance Criteria**:
- [x] **AC-0163-US1-01**: `ListingsIsland` 的 `listing.title` / `listing.slug` / `listing.price` 不再直接注入 innerHTML
- [x] **AC-0163-US1-02**: 新增 `escapeHtml()` helper 用于 slug href
- [x] **AC-0163-US1-03**: `tbody.innerHTML = ''` → `tbody.textContent = ''`（安全清空）
- [x] **AC-0163-US1-04**: innerHTML forEach 循环 → for-of + DOM API

### US-002: 修复 ReviewsIsland XSS 漏洞
**Project**: TimorUp

**As a** user
**I want** admin 看到的评论列表不包含恶意脚本
**So that** 免受 XSS 攻击

**Acceptance Criteria**:
- [x] **AC-0163-US2-01**: `ReviewsIsland` 的 `review.comment` / `review.userName` / `review.userEmail` 不再直接注入 innerHTML
- [x] **AC-0163-US2-02**: 空状态 `container.innerHTML = '...'` → `textContent` 安全替代

---

## Full islands innerHTML Security Audit

| Island | innerHTML 用途 | 风险评估 | 状态 |
|---|---|---|---|
| AIToolsIsland#240 | `DOMPurify.sanitize(content)` | ✅ SAFE | 无需修改 |
| DashboardIsland#263 | `sanitize(bars)` | ✅ SAFE | 无需修改 |
| DashboardIsland#307 | `sanitize(svgContent)` | ✅ SAFE | 无需修改 |
| DashboardIsland#319 | 静态文本 | ✅ SAFE | 无需修改 |
| ProductsFormIsland#133 | `escapeHtml(b.label)` | ✅ SAFE | 无需修改 |
| ProductsFormIsland#138 | 静态 HTML builder | ✅ SAFE | 无需修改 |
| ProductsFormIsland#148 | 静态 HTML builder | ✅ SAFE | 无需修改 |
| ProductsFormIsland#233 | `''` 空字符串 | ✅ SAFE | 无需修改 |
| ProductsTableIsland#138 | `escapeHtml(b.label)` | ✅ SAFE | 无需修改 |
| AdBannersIsland#64 | 静态 `📷` emoji | ✅ SAFE | 无需修改 |
| **ListingsIsland#245** | `listing.title` 直接注入 | ❌ **XSS** | ✅ 已修复 |
| **ReviewsIsland#233** | `review.comment/userName` 直接注入 | ❌ **XSS** | ✅ 已修复 |
| **ReviewsIsland#191** | 空状态 innerHTML | ⚠️ LOW（静态文本） | ✅ 已优化 |

---

## Out of Scope

- 不修改 14 个已通过的简单 island（frontmatter 已经是纯数据获取）
- 不修改非 island 文件
- 不添加新的 nanostores 连接

---

## Dependencies

- 0162-component-library-foundation（基础组件库完成）

---

## Notes

- `escapeHtml()` 在 ListingsIsland 中用于 `listing.slug` href，其余字段使用 `textContent`
- ReviewsIsland 的星星评分（`★` 字符）使用 innerHTML 因为无用户数据注入
- 静态文本的空状态使用 `document.createElement('p')` + `textContent` 而非 innerHTML
