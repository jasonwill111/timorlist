---
id: US-001
feature: FS-145
title: "安装 Fulldev UI (P0)"
status: completed
priority: P1
created: 2026-06-07T00:00:00.000Z
tldr: "**As a** developer."
project: TimorUp
---

# US-001: 安装 Fulldev UI (P0)

**Feature**: [FS-145](./FEATURE.md)

**As a** developer
**I want** Fulldev UI组件库安装到项目
**So that** 项目可以使用官方维护的 Astro 原生组件

---

## Acceptance Criteria

- [x] **AC-US1-01**: `src/components/ui/` 包含 Fulldev 核心组件（button, input, label, select, textarea, dialog, sheet, form, switch, checkbox, slider, alert, badge, avatar, table, card 等16个）
- [x] **AC-US1-02**: `src/components/` 包含 Fulldev Blocks（hero, cta, features, pricing, faqs, reviews, header, footer, contact, banner, sidebar 等102个整页模板）
- [x] **AC-US1-03**: `pnpm exec -- astro build` 构建成功，退出码 0

---

## Implementation

**Increment**: [0145-fulldev-install-legacy-cleanup](../../../../../increments/0145-fulldev-install-legacy-cleanup/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

_No tasks defined for this user story_
