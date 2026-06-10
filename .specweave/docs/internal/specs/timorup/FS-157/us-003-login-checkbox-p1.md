---
id: US-003
feature: FS-157
title: "Login 页面 checkbox 组件化（P1）"
status: completed
priority: P0
created: 2026-06-09T00:00:00.000Z
tldr: "raw `<input type='checkbox'>` 替换为 Fulldev `<Checkbox>`."
project: TimorUp
---

# US-003: Login 页面 checkbox 组件化（P1）

**Feature**: [FS-157](./FEATURE.md)

raw `<input type="checkbox">` 替换为 Fulldev `<Checkbox>`

**Acceptance Criteria**：

---

## Acceptance Criteria

- [x] **AC-US3-01**: `src/pages/login.astro` 使用 `<Checkbox>` 替代 raw `<input>`
- [x] **AC-US3-02**: `pnpm build` exits 0

---

## Implementation

**Increment**: [0157-complete-ui-business-separation](../../../../../increments/0157-complete-ui-business-separation/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

- [x] **T-007**: 替换 login.astro checkbox
- [x] **T-009**: Build 验证
