---
increment: 0145-fulldev-install-legacy-cleanup
title: 安装 Fulldev + Legacy 清理 + XSS 审计
type: refactor
priority: P1
status: completed
created: 2026-06-07T00:00:00.000Z
structure: user-stories
test_mode: TDD
coverage_target: 80
---

# Feature: 安装 Fulldev + Legacy 清理 + XSS 审计

## Overview

Fulldev UI 安装 + CSS token 统一 + 15个 Legacy PascalCase 清理 + innerHTML XSS 审计

## User Stories

### US-001: 安装 Fulldev UI (P0)
**Project**: TimorUp

**As a** developer
**I want** Fulldev UI组件库安装到项目
**So that** 项目可以使用官方维护的 Astro 原生组件

**Acceptance Criteria**:
- [x] **AC-US1-01**: `src/components/ui/` 包含 Fulldev 核心组件（button, input, label, select, textarea, dialog, sheet, form, switch, checkbox, slider, alert, badge, avatar, table, card 等16个）
- [x] **AC-US1-02**: `src/components/` 包含 Fulldev Blocks（hero, cta, features, pricing, faqs, reviews, header, footer, contact, banner, sidebar 等102个整页模板）
- [x] **AC-US1-03**: `pnpm exec -- astro build` 构建成功，退出码 0

### US-002: CSS Token 统一 (P0)
**Project**: TimorUp

**As a** developer
**I want** Fulldev 和 Starwind 共用统一 design token
**So that** 两库视觉风格一致，无冲突

**Acceptance Criteria**:
- [x] **AC-US2-01**: `src/styles/global.css` 定义 `--primary`, `--radius`, `--color-*` 等设计 token
- [x] **AC-US2-02**: Fulldev 组件通过 CSS 变量使用 global.css token
- [x] **AC-US2-03**: Starwind 组件通过 CSS 变量使用 global.css token

### US-003: Legacy PascalCase 清理 (P1)
**Project**: TimorUp

**As a** developer
**I want** 清理无引用的旧 shadcn-astro 组件
**So that** 避免与 Fulldev 冲突，保持目录整洁

**Acceptance Criteria**:
- [x] **AC-US3-01**: 删除 15个无页面引用的 legacy PascalCase 组件
- [x] **AC-US3-02**: 更新 5个引用文件的 import 路径
- [x] **AC-US3-03**: `pnpm exec -- astro build` 构建成功

### US-004: innerHTML XSS 审计 (P1)
**Project**: TimorUp

**As a** developer
**I want** 确认所有 innerHTML 使用安全的 API
**So that** 防止 XSS 攻击

**Acceptance Criteria**:
- [x] **AC-US4-01**: `admin/ai-tools.astro` 所有 innerHTML 使用 textContent（safe）
- [x] **AC-US4-02**: `business/[slug]/edit/index.astro` 所有 innerHTML 使用 DOMPurify.sanitize
- [x] **AC-US4-03**: `business/[slug]/products.astro` 所有 innerHTML 使用 DOMPurify.sanitize
- [x] **AC-US4-04**: `verify.astro` 使用静态 SVG path（safe）

### US-005: 构建验证 (P0)
**Project**: TimorUp

**As a** developer
**I want** 全量构建通过
**So that** 确保所有变更不破坏现有功能

**Acceptance Criteria**:
- [x] **AC-US5-01**: `pnpm exec -- astro build` 全量构建成功，退出码 0
- [x] **AC-US5-02**: 无新增 TypeScript 或 Vite 错误

## Success Criteria

- Fulldev 组件库安装完成（78 + 102 文件）
- 构建通过
- Legacy组件清理完成
- XSS 审计通过
- CSS token 统一

## Out of Scope

- 组件迁移到页面（后续 increment）
- business/[slug].astro frontmatter 重构（deferred）
