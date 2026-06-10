---
id: US-006
feature: FS-144
title: "双库 CSS 无冲突 + 构建验证 (P0)"
status: completed
priority: P1
created: 2026-06-07T00:00:00.000Z
tldr: "**As a** developer."
project: timorup
---

# US-006: 双库 CSS 无冲突 + 构建验证 (P0)

**Feature**: [FS-144](./FEATURE.md)

**As a** developer
**I want** Fulldev + Starwind 双库 CSS 无冲突，构建通过
**So that** 两库按钮/弹窗/动效视觉完全一致

---

## Acceptance Criteria

- [x] **AC-US6-01**: `global.css` 定义 `--primary`, `--radius`, `--color-*` token，两库均引用
- [x] **AC-US6-02**: 页面中无同时 import Fulldev + Starwind 同名组件（Button/Select 等）
- [x] **AC-US6-03**: `pnpm exec -- astro build` 退出码 0，无新增错误

---

## Implementation

**Increment**: [0144-starwind-integration-cleanup](../../../../../increments/0144-starwind-integration-cleanup/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

_No tasks defined for this user story_
