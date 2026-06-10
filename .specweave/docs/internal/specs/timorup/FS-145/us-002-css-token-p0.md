---
id: US-002
feature: FS-145
title: "CSS Token 统一 (P0)"
status: completed
priority: P1
created: 2026-06-07T00:00:00.000Z
tldr: "**As a** developer."
project: TimorUp
---

# US-002: CSS Token 统一 (P0)

**Feature**: [FS-145](./FEATURE.md)

**As a** developer
**I want** Fulldev 和 Starwind 共用统一 design token
**So that** 两库视觉风格一致，无冲突

---

## Acceptance Criteria

- [x] **AC-US2-01**: `src/styles/global.css` 定义 `--primary`, `--radius`, `--color-*` 等设计 token
- [x] **AC-US2-02**: Fulldev 组件通过 CSS 变量使用 global.css token
- [x] **AC-US2-03**: Starwind 组件通过 CSS 变量使用 global.css token

---

## Implementation

**Increment**: [0145-fulldev-install-legacy-cleanup](../../../../../increments/0145-fulldev-install-legacy-cleanup/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

_No tasks defined for this user story_
