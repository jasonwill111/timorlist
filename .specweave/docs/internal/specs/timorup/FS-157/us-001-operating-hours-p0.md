---
id: US-001
feature: FS-157
title: "Operating Hours 表格组件化（P0）"
status: completed
priority: P0
created: 2026-06-09T00:00:00.000Z
tldr: "inline HTML 字符串生成（~80行），混合 DOM 操作逻辑."
project: TimorUp
---

# US-001: Operating Hours 表格组件化（P0）

**Feature**: [FS-157](./FEATURE.md)

inline HTML 字符串生成（~80行），混合 DOM 操作逻辑

**Acceptance Criteria**：

---

## Acceptance Criteria

- [x] **AC-US1-01**: `src/components/islands/business/OperatingHoursIsland.astro` 创建
- [x] **AC-US1-02**: 接收 `days: DaySchedule[]` prop，Astro 模板渲染（非 template literal）
- [x] **AC-US1-03**: `src/pages/business/[slug]/edit/index.astro` 替换为 `<OperatingHoursIsland days={parsedDays} />`
- [x] **AC-US1-04**: `pnpm build` exits 0

---

## Implementation

**Increment**: [0157-complete-ui-business-separation](../../../../../increments/0157-complete-ui-business-separation/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

- [x] **T-002**: 创建 OperatingHoursIsland
- [x] **T-003**: 替换 business/edit operating hours section
- [x] **T-009**: Build 验证
