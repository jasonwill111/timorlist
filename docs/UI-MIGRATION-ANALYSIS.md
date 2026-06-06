# @ui.full.dev 迁移计划 — timorup（最终版）

> 生成时间: 2026-06-03
> 基于: 逐组件深度分析（usage frequency × replaceability score 排序）
> 当前组件数: 66 个 .astro，全自研

---

## 基础设施兼容性

### cn() 工具 ✅
```typescript
// src/lib/utils.ts — 已有 cn()，完全兼容 @ui.full.dev
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```
无需任何改动。

### Tailwind v4 主题变量 ⚠️
timorup 使用自定义 **amber/yellow 品牌色** (`--color-primary: #EAB308`)，而 @ui.full.dev 默认蓝色 primary。

**必须决策**（二选一）：

| 方案 | 做法 | 影响 |
|------|------|------|
| A. 保留品牌色 | 将 @ui.full.dev 的 `--color-primary` 映射为 timorup 的 amber | @ui 文档/示例的蓝色效果变为 amber，视觉一致 |
| B. 使用 warning 色 | timorup 保持 amber 不变，@ui 组件使用 `--color-warning` | 品牌色保留，但迁移后需检查所有 `primary-*` 调用点 |

**推荐方案 A** — 在 `src/styles/globals.css` 中将 @ui.full.dev 的 `--primary` 变量值覆盖为 amber。

### 自定义字体 ⚠️
timorup 使用 `Plus Jakarta Sans`（正文）+ `Sora`（标题），@ui.full.dev 默认 Inter。迁移后需在 @ui.full.dev 配置中覆盖字体变量，或保持 timorup 的字体声明（不冲突）。

---

## 组件迁移四层

### 第一层 — 直接替换（P0，高频使用，纯展示）

按 usage × replaceability 综合得分排序：

| # | 文件 | 使用频率 | 替换难度 | 迁移方式 |
|---|------|---------|---------|---------|
| 1 | `ui/Input.astro` | 50+ 页 | ⭐ 低 | 直接 drop-in，`error` prop → `@ui Input state="error"` |
| 2 | `ui/Label.astro` | 40+ 页 | ⭐ 低 | 直接 drop-in |
| 3 | `ui/Card.astro` | 35+ 页 | ⭐ 低 | `hover` prop 需包装 div；搜索所有 `hover={true}` 用法加外层 |
| 4 | `ui/CardHeader.astro` | 35+ 页 | ⭐ 低 | 直接 drop-in |
| 5 | `ui/CardContent.astro` | 35+ 页 | ⭐ 低 | 直接 drop-in |
| 6 | `ui/CardFooter.astro` | 35+ 页 | ⭐ 低 | 直接 drop-in |
| 7 | `ui/CardTitle.astro` | 35+ 页 | ⭐ 低 | 直接 drop-in |
| 8 | `ui/CardDescription.astro` | 35+ 页 | ⭐ 低 | 直接 drop-in |
| 9 | `ui/Textarea.astro` | 15+ 页 | ⭐ 低 | 直接 drop-in |
| 10 | `ui/Badge.astro` | 15+ 页 | ⭐⭐ 中 | @ui Badge 4 variants；timorup 11 variants（含语义色）。保留 `success/warning/error/destructive` 映射，其余 brand 色 variants 保持自定义或用 `class` prop |
| 11 | `ui/Skeleton.astro` | 8+ 页 | ⭐⭐ 中 | `card`/`avatar` 变体有特殊尺寸，需自定义；其余 `line`/`square` 直接 drop-in |
| 12 | `ui/Avatar.astro` | 5+ 页 | ⭐ 低 | 保留 `getAvatarColor()` 工具函数，作为 class 传入 @ui Avatar slot |

### 第二层 — 需重构调用点（P1，有 JS 逻辑或需改造）

| # | 文件 | 使用频率 | 替换难度 | 迁移关键点 |
|---|------|---------|---------|---------|
| 13 | `ui/Button.astro` | 60+ 页 | ⭐⭐ 中 | @ui Button 无 `loading` prop。**方案**：保留 `Button.astro` 作为 LoadingButton wrapper，内部调用 @ui Button；或在 @ui Button 上扩展 loading slot |
| 14 | `ui/Select.astro` | 20+ 页 | ⭐⭐ 中 | timorup 用 `options[]` 数组 prop；@ui 用 slot children（`<SelectItem>`）。需重写所有调用点的 `<Select>` 调用方式（`CategoryFilter`, `BusinessListNew`, `ListingListNew`, `ProductsIsland`） |
| 15 | `ui/Tabs.astro` | 5 页 | ⭐⭐ 中 | 自定义 `data-tabs`/`data-tab-trigger` JS 需替换为 @ui Tabs API |
| 16 | `ui/TabsList.astro` | 5 页 | — | 合并入 Tabs |
| 17 | `ui/TabsTrigger.astro` | 5 页 | — | 合并入 Tabs |
| 18 | `ui/TabsContent.astro` | 5 页 | — | 合并入 Tabs |
| 19 | `ui/Accordion.astro` | 3 页 | ⭐ 低 | `items[]` 数组 prop 与 @ui Accordion API 类似，直接迁移 |
| 20 | `ui/ThemeToggle.astro` | 全局 | ⭐⭐ 中 | 替换 @ui ThemeToggle，**确保保留** `html.classList.toggle('dark')` 逻辑（timorup 用 `dark` class 而非 `class="dark"`）|
| 21 | `ui/Modal.astro` | 8+ 页 | ⭐⭐⭐ 高 | **高风险**：所有页面调用 `window.showModal(id)` / `window.hideModal(id)` 需更新为 @ui Dialog 的 `dialogEl.showModal()` / `dialogEl.close()`。需搜索所有 `showModal` 调用点并更新 |

### 第三层 — 业务卡片，替换根包装，保留内部逻辑

| # | 文件 | 做法 |
|---|------|------|
| 22 | `business/BusinessCard.astro` | 将根 `<div>` 替换为 @ui Card；保留自定义渐变色 `orgTypeColors`、stats 行、rating stars |
| 23 | `business/ListingCard.astro` | 同上 |
| 24 | `business/BusinessHeaderCard.astro` | 将 `<Card>` 替换为 @ui Card；保留联系信息布局 |
| 25 | `business/ProductCard.astro` | 同上 |

### 第四层 — 保留（不替换或需独立迁移）

| 文件 | 原因 |
|------|------|
| `ui/Pagination.astro` | @ui.full.dev 无 Pagination 组件；timorup 自研版本已很好 |
| `ui/FileUpload.astro` | 上传+压缩 pipeline 绑定业务逻辑 |
| `ui/LocationMap.astro` | Leaflet 集成，应用基础设施 |
| `ui/TiptapEditor.astro` | Tiptap 富文本编辑器 |
| `ui/TipTapRenderer.astro` | 安全关键的 HTML 清理 + prose 样式 |
| `ui/CarouselBanner.astro` | 品牌特定轮播，touch 手势 |
| `ui/MediaGallery.astro` | 复杂 gallery+lightbox |
| `ui/ShareDialog.astro` | 品牌分享弹窗；可考虑用 @ui Dialog 包裹 |
| `ui/LucideIcon.astro` | 替换为直接 `@lucide/astro` Icon；删除此封装层 |
| `ui/ToastContainer.astro` | nanostores 集成；保留 store，替换 UI 为 @ui Toast |
| `ui/CSSAnimations.astro` | CSS keyframes 工具集 |
| `ui/IconPicker.astro` | 管理员图标选择器，@ui 无对应 |
| `ui/IconRenderer.astro` | 同上 |
| `Header.astro` | 完整导航+auth 逻辑，@ui 无对应完整实现 |
| `Footer.astro` | 品牌 footer |
| `ListingBanner.astro` | 简单 banner，可保留 |
| `ListingHeader.astro` | 业务详情头；替换 `<Card>` 部分 |
| `PhotoGallery.astro` | **重复，应废弃**：与 `MediaGallery.astro` 功能完全重复 |
| `UpdatesSection.astro` | 业务动态 feed，绑定 server actions |
| `OptimizedImage.astro` | R2/CDN 图片优化基础设施 |
| `forms/AuthCard.astro` | 保留结构，替换内部 Card 系列组件 |
| `forms/LoadingButton.astro` | **重复，应废弃**：被 `Button.astro` 的 `loading` prop 覆盖 |
| `forms/PasswordInput.astro` | 扩展 @ui Input + Button icon |
| `forms/FormMessage.astro` | 保留，`window.showMessage` 全局模式可逐步迁移到 toast |
| `islands/ErrorBoundary.astro` | Astro 错误边界，@ui 无对应 |
| `islands/GracePeriodModal.astro` | 业务订阅弹窗 |
| 所有 `islands/*` 组件 | DB 查询岛屿，保留逻辑，替换内部 UI 原子组件 |

---

## 消除重复组件（迁移前必做）

| 决策 | 文件 | 操作 |
|------|------|------|
| **废弃** | `PhotoGallery.astro` | 功能与 `MediaGallery.astro` 完全重复。将所有 `PhotoGallery` import 改为 `MediaGallery` |
| **废弃** | `BusinessList.astro` | `BusinessListNew.astro` 是更新版本；确认 `BusinessListNew` 覆盖所有场景后删除 |
| **废弃** | `LoadingButton.astro` | `Button.astro` 的 `loading` prop 已覆盖功能；迁移调用点到 `Button loading={true}` 后删除 |
| **废弃** | `ui/TabsList/Trigger/Content.astro` | 合并入统一 @ui Tabs |

---

## 迁移实施顺序

```
Phase 0 — 准备
  0.1  pnpm add @ui.full.dev
  0.2  决策品牌色方案（A 或 B），更新 globals.css
  0.3  删除重复组件（PhotoGallery, BusinessList, LoadingButton, Tabs 子文件）
  0.4  更新 globals.css 中的 CSS 变量覆盖（字体、primary 色）

Phase 1 — 原子组件直接替换（低风险，先做）
  1.1  Input → Label → Textarea → Card 家族（CardHeader/Content/Footer/Title/Description → Card）
  1.2  Badge, Skeleton, Avatar
  1.3  Accordion
  1.4  替换 LucideIcon 为 @lucide/astro Icon

Phase 2 — 业务卡片层
  2.1  BusinessCard, ListingCard, BusinessHeaderCard, ProductCard（替换根 wrapper）

Phase 3 — 复杂组件（高风险，最后做）
  3.1  Button（扩展 loading 支持）
  3.2  Select（重写调用点的 options 数组为 slot 模式）
  3.3  Tabs（替换 JS 逻辑）
  3.4  Modal → Dialog（更新所有 showModal() 调用点）
  3.5  ThemeToggle（替换，保留 dark class 逻辑）
  3.6  ToastContainer（替换 UI，保留 nanostores store）

Phase 4 — 页面级组件
  4.1  islands/* 组件内部替换 Card/Avatar/Select 等
  4.2  AuthCard, PasswordInput, FormMessage
  4.3  ListingHeader, Footer（替换内部 Card）

Phase 5 — 清理
  5.1  删除废弃组件文件
  5.2  全局搜索确认无遗留引用
  5.3  build 验证
```

---

## 关键风险

| 风险 | 级别 | 缓解 |
|------|------|------|
| 品牌色冲突（amber vs blue） | 高 | Phase 0.2 决策并覆盖 CSS 变量 |
| Modal → Dialog 调用点更新 | 高 | Phase 3.4 单独测试，搜索 `showModal` 全局替换 |
| Select slot 模式改造 | 中 | Phase 3.2 提前验证关键页面 |
| PhotoGallery vs MediaGallery 混淆 | 中 | Phase 0.3 先清理重复 |
| islands 组件内部间接引用 | 低 | Phase 4 逐个验证 |

---

## Phase 6 — 内部复用优化（迁移完成后执行）

在 @ui.full.dev 替换完成后，进一步消除项目内部重复，提升开发效率。

---

### B1: 三卡片合一（减少 2 文件，~200 行）

`BusinessCard`、`ListingCard`、`ProductCard` 三个组件核心结构高度一致：
> 根 Card → 图片 → 标题 → 元信息行 → 操作栏

差异仅在数据字段（business/listing/product 的字段不同）和图片获取逻辑。

**操作**：
```astro
# 合并为 components/business/EntityCard.astro
interface Props {
  type: 'business' | 'listing' | 'product';
  // 通用字段 + type 特有字段
  ...
}
```

**删除**：`ListingCard.astro`、`ProductCard.astro`

**收益**：修改一处三处生效，减少 ~200 行重复代码。

---

### B2: islands 展示层分离（移除 UI 逻辑）

当前每个 island 都是"DB 查询 + UI 渲染"混合体，导致 UI 层无法被 @ui 完全替换。

**操作**：将每个 island 的展示逻辑抽离为独立的 View 组件：

```
# 现状
islands/BusinessListNew.astro
  ├── getDb() + SQL 查询        ← island 保留
  ├── 卡片网格 + 筛选表单 + 分页  ← 抽取到 View

# 重构后
islands/BusinessListNew.astro         ← 只做 DB 查询，传 data 给 view
components/business/BusinessListView.astro  ← 纯展示，100% @ui 组件
```

**涉及 islands**：
- `islands/BusinessListNew.astro` → `components/business/BusinessListView.astro`
- `islands/ListingListNew.astro` → `components/business/ListingListView.astro`
- `islands/HomepageContent.astro` → `components/HomepageView.astro`

**收益**：展示层可 100% 用 @ui 替换，island 变为纯数据容器，总替换率从 ~65% 提升到 ~80%。

---

### B3: Dialog 场景统一为 ConfirmDialog（减少 2 文件，~80 行）

当前有三个独立 Dialog 组件，但解决的是同一类问题——确认操作：

| 组件 | 场景 |
|------|------|
| `ui/Modal.astro` | 通用弹窗 |
| `islands/GracePeriodModal.astro` | 订阅到期提示 |
| `ui/ShareDialog.astro` | 分享面板 |

**操作**：抽取统一的 `components/ui/ConfirmDialog.astro`：

```astro
<ConfirmDialog
  id={id}
  title={title}
  message={message}
  confirmText="确认"
  cancelText="取消"
  variant="danger"  // 'info' | 'warning' | 'danger'
/>
```

**删除**：`islands/GracePeriodModal.astro`、`ui/ShareDialog.astro`（ShareDialog 特殊逻辑保留自定义实现）

**收益**：Dialog 逻辑统一维护，减少 ~80 行。

---

### B4: HomepageContent tab 切换逻辑提取

`islands/HomepageContent.astro` 中 desktop 用 Button tabs、mobile 用 Select 下拉，两个逻辑重复实现同一功能。

**操作**：
```
components/common/TabSwitch.astro
  Props: tabs: Tab[], currentTab, onChange, breakpoint?: 'sm'|'md'|'lg'

  - desktop (≥md): Button group
  - mobile  (<md): Native Select
  - 统一 onChange 行为
```

**删除**：`islands/HomepageContent.astro` 中的重复 desktop/mobile 逻辑（约 ~60 行）

---

### Phase 6 收益汇总

| 项目 | 减少文件 | 减少代码行 | 架构改善 |
|------|---------|-----------|---------|
| B1 三卡片合一 | -2 | ~200 行 | 统一卡片行为 |
| B2 islands 展示层分离 | +2 view 文件 | +100 行 | 展示层 100% @ui 替换 |
| B3 Dialog 统一 | -2 | ~80 行 | 统一维护 |
| B4 TabSwitch 提取 | 0 | ~60 行 | 减少重复逻辑 |

**Phase 6 完成后总替换率：~65% → ~80%**

---

## 最终收益估算（完整）

| 类别 | 数量 |
|------|------|
| 直接替换（drop-in） | ~15 个 |
| 需重构调用点 | ~8 个组件 + N 个调用点 |
| 替换根 wrapper（保留逻辑） | 4 个 |
| 整体保留（业务绑定） | ~35 个 |
| 废弃重复（Phase 0） | ~5 个 |
| 内部复用优化（Phase 6） | -5 个文件，~340 行净减少 |
| **最终组件文件数** | 66 → ~53 个 |

---

## 完整迁移路线图

```
Phase 0 — 准备      →  清理重复、决策品牌色
Phase 1 — 原子替换  →  Input/Label/Card/Badge/Skeleton/Avatar
Phase 2 — 业务卡片  →  BusinessCard 等根 wrapper 替换
Phase 3 — 复杂组件  →  Button/Select/Tabs/Modal/Dialog/ThemeToggle
Phase 4 — 页面级    →  islands 内部替换、AuthCard、Header/Footer
Phase 5 — 清理      →  删除废弃文件、build 验证
────────────────────────────────────
Phase 6 — 复用优化  →  三卡片合一、islands 分离、Dialog 统一、TabSwitch
```
Phase 6 — 复用优化  →  三卡片合一、islands 分离、Dialog 统一、TabSwitch
```

---

## Migration Status (2026-06-05, Increment 0113)

All UI migration phases complete. Final adoption status:

| Component | Adopted | Files |
|-----------|---------|-------|
| Button | 151 instances | 67 files |
| Input | 120 instances | 47 files |
| Select | 53 instances | 30 files |
| Textarea | 21 instances | 19 files |
| Badge | 2 pages | account.astro, service-packages.astro |
| Accordion | 1 page | faq.astro |

### Deleted Components (13 total, Increment 0113)

- `ui/FileUpload`, `ui/ConfirmDialog`, `ui/IconPicker`
- `ui/CSSAnimations`, `ui/Pagination`, `PhotoGallery`
- `islands/ListingListNew`, `islands/BusinessListNew`, `islands/CategoryFilter`
- `islands/GracePeriodModal`, `islands/BusinessList`, `islands/ListingContent`
- `forms/FormField`

### Status: Complete