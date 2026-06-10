---
id: US-003
feature: FS-145
title: "Legacy PascalCase 清理 (P1)"
status: completed
priority: P1
created: 2026-06-07T00:00:00.000Z
tldr: "**As a** developer."
project: TimorUp
---

# US-003: Legacy PascalCase 清理 (P1)

**Feature**: [FS-145](./FEATURE.md)

**As a** developer
**I want** 清理无引用的旧 shadcn-astro 组件
**So that** 避免与 Fulldev 冲突，保持目录整洁

---

## Acceptance Criteria

- [x] **AC-US3-01**: 删除 15个无页面引用的 legacy PascalCase 组件
- [x] **AC-US3-02**: 更新 5个引用文件的 import 路径
- [x] **AC-US3-03**: `pnpm exec -- astro build` 构建成功

---

## Implementation

**Increment**: [0145-fulldev-install-legacy-cleanup](../../../../../increments/0145-fulldev-install-legacy-cleanup/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

_No tasks defined for this user story_
