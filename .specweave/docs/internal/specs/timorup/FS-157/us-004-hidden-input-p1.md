---
id: US-004
feature: FS-157
title: "Hidden Input 统一封装（P1）"
status: completed
priority: P0
created: 2026-06-09T00:00:00.000Z
tldr: "多处 `<input type='hidden'>` 分散在 pages 中."
project: TimorUp
---

# US-004: Hidden Input 统一封装（P1）

**Feature**: [FS-157](./FEATURE.md)

多处 `<input type="hidden">` 分散在 pages 中

**Acceptance Criteria**：

---

## Acceptance Criteria

- [x] **AC-US4-01**: `src/components/ui/HiddenField.astro` 创建，接收 `name`, `value` props
- [x] **AC-US4-02**: business/edit、business/product pages 的 hidden inputs 替换为 `<HiddenField>`
- [x] **AC-US4-03**: `pnpm build` exits 0

---

## Implementation

**Increment**: [0157-complete-ui-business-separation](../../../../../increments/0157-complete-ui-business-separation/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

- [x] **T-001**: 创建 HiddenField 组件
- [x] **T-008**: 替换 business pages hidden inputs
- [x] **T-009**: Build 验证
