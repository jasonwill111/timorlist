---
id: US-002
feature: FS-157
title: "Admin Island 列表行组件化（P0）"
status: completed
priority: P0
created: 2026-06-09T00:00:00.000Z
tldr: "5 个 admin islands 用 template literal 动态生成 toggle/delete 按钮行."
project: TimorUp
---

# US-002: Admin Island 列表行组件化（P0）

**Feature**: [FS-157](./FEATURE.md)

5 个 admin islands 用 template literal 动态生成 toggle/delete 按钮行

**Acceptance Criteria**：

---

## Acceptance Criteria

- [x] **AC-US2-01**: `src/components/ui/admin/AdminListRow.astro` 创建，接收 `id`, `name`, `status` props
- [x] **AC-US2-02**: ListingsIsland/ProductsIsland/BlogsIsland 中的 template literal 行生成 → Astro map 渲染
- [x] **AC-US2-03**: 所有 admin islands 使用 `<Button>` 替代 raw `<button>`
- [x] **AC-US2-04**: `pnpm build` exits 0

---

## Implementation

**Increment**: [0157-complete-ui-business-separation](../../../../../increments/0157-complete-ui-business-separation/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

- [x] **T-004**: 创建 AdminListRow 组件
- [x] **T-005**: 替换 ListingsIsland 动态行
- [x] **T-006**: 替换 ProductsIsland/BlogsIsland 动态行
- [x] **T-009**: Build 验证
