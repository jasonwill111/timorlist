---
increment: 0160-admin-islands-refactor
title: "Admin Islands 重构 — Products + ServicePackages 拆分"
type: refactor
priority: P0
status: planned
created: 2026-06-09
structure: user-stories
test_mode: TDD
coverage_target: 80
---

# Feature: Admin Islands 重构 — Products + ServicePackages 拆分

## Overview

`ProductsIsland.astro`（828 行）和 `ServicePackagesIsland.astro`（548 行）违反单一职责原则，各自承担多种职责（列表、过滤、CRUD 表单、模态框）。两者行数远超 300 行可维护性阈值，需拆分为单一职责子组件。

## User Stories

### US-001: ProductsIsland 拆分
**Project**: TimorUp

**As a** developer
**I want** ProductsIsland 拆分为多个单一职责子组件
**So that** 每个组件不超过 300 行，职责清晰，可独立测试和维护

**Acceptance Criteria**:
- [x] **AC-0160-US1-01**: `ProductsTableIsland.astro` 存在， ≤300 行，仅负责 SKU 列表渲染、过滤（按 business/type）、分页 UI
- [x] **AC-0160-US1-02**: `ProductsFormIsland.astro` 存在， ≤300 行，仅负责 Create/Edit 表单、TipTap 编辑器、图片上传
- [x] **AC-0160-US1-03**: 原 `ProductsIsland.astro` 保留作为组合层，行数 ≤150 行，仅组合子组件 + 状态管理（modal open/close）
- [x] **AC-0160-US1-04**: 拆分后 `src/pages/admin/products.astro` 功能不变（CRUD、过滤正常）
- [x] **AC-0160-US1-05**: 行数验证：`wc -l` ProductsTableIsland ≤300，`wc -l` ProductsFormIsland ≤300

### US-002: ServicePackagesIsland 拆分
**Project**: TimorUp

**As a** developer
**I want** ServicePackagesIsland 拆分为多个单一职责子组件
**So that** 每个组件不超过 300 行，职责清晰

**Acceptance Criteria**:
- [x] **AC-0160-US2-01**: `ServicePackagesTableIsland.astro` 存在， ≤300 行，仅负责套餐列表渲染（Table 组件）、统计卡片
- [x] **AC-0160-US2-02**: `ServicePackagesFormIsland.astro` 存在， ≤300 行，仅负责 Create/Edit 套餐表单
- [x] **AC-0160-US2-03**: 原 `ServicePackagesIsland.astro` 保留作为组合层， ≤150 行
- [x] **AC-0160-US2-04**: 拆分后 `src/pages/admin/service-packages.astro` 功能不变
- [x] **AC-0160-US2-05**: 行数验证：`wc -l` ServicePackagesTableIsland ≤300，`wc -l` ServicePackagesFormIsland ≤300

## Functional Requirements

### FR-001: ProductsIsland 拆分架构

原始 828 行 → 3 个文件：

| 文件 | 行数上限 | 职责 |
|------|---------|------|
| `ProductsTableIsland.astro` | 300 | Page Header、Search、Filters、SKU 列表（map 渲染）、行内 Edit/Delete 按钮、空状态 |
| `ProductsFormIsland.astro` | 300 | Modal 外层、SKU 表单（Business/Titile/Type/Price/Specs）、TipTap 编辑器、图片上传、Actions |
| `ProductsIsland.astro` | 150 | 组合层：接收 props、渲染两个子组件、事件监听、modal open/close 状态 |

### FR-002: ServicePackagesIsland 拆分架构

原始 548 行 → 3 个文件：

| 文件 | 行数上限 | 职责 |
|------|---------|------|
| `ServicePackagesTableIsland.astro` | 300 | Page Header、Important Notice、Stats Cards、Plans Table、行内 Actions |
| `ServicePackagesFormIsland.astro` | 300 | Modal、套餐表单（name/slug/type/variants JSON editor） |
| `ServicePackagesIsland.astro` | 150 | 组合层：接收 props、渲染两个子组件、事件监听 |

### FR-003: 零功能破坏原则

拆分过程**不改变任何业务逻辑**：
- URL 参数处理不变
- API 调用不变
- 事件派发方式不变（CustomEvent 模式）
- props 接口不变
- 页面只需替换 import 的组件名（从旧 island 改为新组合 island）

### FR-004: 跨 Island 通信

使用原生 CustomEvent，不引入 nanostores/Zustand 等状态库：

```javascript
// ProductsTableIsland — 点击编辑
document.dispatchEvent(new CustomEvent('open-sku-modal', {
  detail: { mode: 'edit', skuId: id }
}));

// ProductsIsland — 父监听，透传给 Form
document.addEventListener('open-sku-modal', (e) => {
  formIsland.dataset.editSkuId = e.detail.skuId;
  modalOpen = true;
});
```

## Out of Scope

- 不修改 `src/pages/admin/products.astro` 和 `service-packages.astro` 以外的任何文件
- 不修改 Drizzle schema
- 不修改 query 函数
- 不添加新功能，只做重构
- 不修改 `ProductsIsland.astro` 的 JS 逻辑（CRUD、编辑、删除逻辑不变，只移动位置）

## Risks

| 风险 | 缓解 |
|------|------|
| 拆分后事件通信失效 | 保持原有的 CustomEvent 模式，不引入新通信机制 |
| 组件间 props drilling 过深 | 父组件保留组合层，props 只穿透一层 |
| 功能回归 | 拆分前后页面功能完全一致（无业务逻辑变更） |

## Dependencies

- 0159（UI/UX 审计）：本 increment 依据 0159 的评估结论执行
