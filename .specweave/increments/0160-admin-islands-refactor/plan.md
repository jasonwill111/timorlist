# Plan: Admin Islands 重构 — Products + ServicePackages 拆分

## Design

### 整体策略

两个超大 island 采用相同的拆分模式：**提取职责 → 组合层保留**。不引入新状态管理库，保持 Astro island 间通信的 CustomEvent 模式。

### 1. ProductsIsland 拆分

**原始行数**：828 行（ProductData 接口、SKUs 列表渲染、modal 表单、TipTap、CRUD 脚本）

**拆分方案**：

```
ProductsTableIsland.astro  (~230L)
├── Page Header (保留)
├── Search + Filters UI (保留 Input/Select)
├── SKUs 列表 (map 渲染每行)
├── 行内 Edit/Delete 按钮 (派发 CustomEvent)
└── 空状态 UI

ProductsFormIsland.astro   (~260L)
├── Modal 外层结构 (固定)
├── SKU 表单 (Business select, Title, Type, Price, Specs)
├── TipTap 编辑器初始化
├── 图片上传 UI + 逻辑
├── Actions (保存/取消)
└── 表单 JS (createSKU, updateSKU, 验证)

ProductsIsland.astro       (~150L, 保留，改为组合层)
├── 接收父 props (products, businessOptions)
├── 渲染 ProductsTableIsland + ProductsFormIsland
├── 事件监听 (edit-sku, delete-sku, open-modal, close-modal)
└── 管理 modal 状态 (open/close)
```

**JS 移动规则**：
- `createSKU()` / `updateSKU()` / `deleteSKU()` → `ProductsFormIsland.astro`
- `handleSkuImageUpload()` / TipTap init → `ProductsFormIsland.astro`
- 行内事件监听（`data-action`）→ `ProductsTableIsland.astro` 派发事件
- 父组件监听所有事件，协调 modal 状态

**Props 接口**：
```typescript
// ProductsTableIsland.astro — 接收数据 + 派发事件
interface Props { products: ProductData[]; businessOptions: BusinessOption[]; }

// ProductsFormIsland.astro — 接收数据 + 预填编辑数据
interface Props { products: ProductData[]; businessOptions: BusinessOption[]; editSkuId?: string; }
```

### 2. ServicePackagesIsland 拆分

**原始行数**：548 行

**拆分方案**：

```
ServicePackagesTableIsland.astro  (~270L)
├── Page Header
├── Important Notice (保留)
├── Stats Cards (3 个数字卡片)
├── Plans Table (Fulldev Table 组件)
└── 行内 Actions (派发事件)

ServicePackagesFormIsland.astro   (~220L)
├── Modal 结构
├── 套餐表单 (name, slug, type, variants JSON editor)
├── Variant 编辑器 (动态增删)
└── Actions

ServicePackagesIsland.astro       (~100L, 保留，组合层)
├── Props 透传
├── 组合两个子组件
└── 事件监听 + modal 状态
```

### 3. 跨 Island 通信

Astro island 间使用 CustomEvent，不引入状态库：

```javascript
// ProductsTableIsland — 点击编辑
document.dispatchEvent(new CustomEvent('open-sku-modal', {
  detail: { mode: 'edit', skuId: id }
}));

// ProductsIsland — 父组件监听，透传给 Form
document.addEventListener('open-sku-modal', (e) => {
  formIsland.dataset.editSkuId = e.detail.skuId;
  modalOpen = true;
});
```

### 4. 命名约定

新组件命名体现职责，放在同一目录：
- `ProductsTableIsland.astro`（表格列表）
- `ProductsFormIsland.astro`（表单）
- `ServicePackagesTableIsland.astro`
- `ServicePackagesFormIsland.astro`

## Rationale

**为什么不合并为两个页面？**
Admin products/service-packages 页面已存在，组合 island 模式保持了页面层不变（无需改 routing）。

**为什么不引入 nanostores/Zustand？**
本项目 island 通信简单（open/close modal + 选中的 SKU ID），CustomEvent 足够。引入状态管理库增加复杂度。

**为什么保留原 island 作为组合层？**
避免修改 `products.astro`/`service-packages.astro` 的 import —— 只需更新 `ProductsIsland.astro` 内部的子组件 import，页面层代码零改动。
