# Master Plan: Fulldev + Starwind 集成 (Increment 0115-0121)

**Date**: 2026-06-05
**Branch**: `feat/lib-integration`
**Total Increments**: 7
**Total Estimated Time**: 25-34 hours (3-4 weeks part-time)
**Goal**: 组件复用率从 30% 提升到 90%+

---

## 0. 战略概述

### 0.1 核心原则（来自文档 AD-AN 节）

1. **三层防御策略**（缺一不可）：
   - Layer 1: 物理隔离（文件结构）
   - Layer 2: 设计 Token 层（CSS 变量）
   - Layer 3: 组件 API 抽象层（应用层）

2. **每个 increment 必须可独立部署和回滚**

3. **先建地基（Token），再装库，最后替换**

4. **永不直接编辑库源文件**（`src/components/ui/` 和 `src/components/starwind/` 视为只读）

### 0.2 增量顺序（依赖图）

```
0115 (Foundation) ← 基础：设计 Token + 库安装
   ↓
0116 (Fulldev) ← 安装 Fulldev，替换基础组件
   ↓
0117 (Starwind) ← 安装 Starwind，添加差异化组件
   ↓
0118 (Blocks) ← 采用 Block 模板，重建营销页
   ↓
0119 (DOM API) ← 重构 JS 模板为 DOM API（高风险）
   ↓
0120 (Wrapper) ← 统一组件 API（应用层抽象）
   ↓
0121 (Polish) ← 一致性检查 + Playwright 视觉回归
```

---

## Increment 0115: 设计 Token 基础（Layer 2）

### 范围
- 统一 CSS 变量单一来源
- 安装 Fulldev + Starwind 基础文件（不替换任何现有组件）
- 验证两库能并存

### 任务
1. 备份 `src/styles/globals.css`
2. 重新设计 CSS 变量结构（@theme + @layer base）
3. 保留 Plus Jakarta Sans + Sora 字体（不切换为 Inter）
4. 安装 Fulldev（仅 init + base tokens，不安装组件）
5. 安装 Starwind（仅 init + base tokens，不安装组件）
6. 验证 build + 视觉对比

### 文件变更
- `src/styles/globals.css` （主要变更）
- `package.json` （新增依赖）
- `components.json` （shadcn CLI 配置）
- `astro.config.mjs` （可能微调）

### 验收
- `pnpm build` 通过
- 视觉无任何变化
- 22 个生产页面返回 200

### 风险与时间
- **风险**: LOW（纯添加，不替换）
- **时间**: 1.5-2 小时

### Commit
```
docs: design token layer + library initialization
```

---

## Increment 0116: Fulldev 完整安装 + 基础组件替换

### 范围
- 安装 Fulldev 全部 55 个组件
- 替换手写的 12 个基础组件
- 保留手写的 Modal（避免破坏现有功能）
- 保留手写的 EmptyState（业务特定）

### 任务
1. **Phase A — 安装组件**（30 分钟）
   - `npx shadcn@latest add @fulldev/components`（55 组件）
   - 验证组件文件全部就位
   - 验证 build 仍通过

2. **Phase B — 基础组件替换**（3-4 小时）
   - 替换 `Button.astro` → Fulldev Button
     - 验证 Button props 兼容性
     - 测试所有 67 个 Button 使用点
   - 替换 `Input.astro` → Fulldev Input
     - 验证 type 全部支持
   - 替换 `Select.astro` → Fulldev Select
   - 替换 `Textarea.astro` → Fulldev Textarea
   - 替换 `Card.astro` → Fulldev Card
   - 替换 `Badge.astro` → Fulldev Badge
   - 替换 `Avatar.astro` → Fulldev Avatar
   - 替换 `Label.astro` → Fulldev Label

3. **Phase C — 保留手写**（决策）
   - `Modal.astro`（太复杂）
   - `EmptyState.astro`（业务特定）
   - `ToastContainer.astro`（待 Starwind Toast）
   - `Tabs.astro`（与 Fulldev Tabs 行为差异）
   - `Accordion.astro`（faq.astro 已在用）

4. **Phase D — 验证**
   - 20 个生产页面测试
   - Playwright 截图对比
   - 视觉回归检查

### 文件变更（预计 50+ 文件）
- `src/components/ui/*` 大量新增（Fulldev 文件）
- `src/components/Button.astro` 删除
- `src/components/Input.astro` 删除
- `src/components/Select.astro` 删除
- `src/components/Textarea.astro` 删除
- `src/components/Card.astro` 删除
- `src/components/Badge.astro` 删除
- `src/components/Avatar.astro` 删除
- `src/components/Label.astro` 删除
- 业务页面：import 路径更新

### 验收
- 32 → 87 个 UI 组件（19 手写 + 68 Fulldev）
- 组件复用率 30% → 60%
- `pnpm build` 通过
- 20 个页面 200
- 视觉对比无回归

### 风险与时间
- **风险**: MEDIUM（替换组件可能破坏样式）
- **时间**: 4-6 小时

### Commits
```
install: fulldev ui 55 components
refactor: replace Button with fulldev
refactor: replace Input with fulldev
refactor: replace Select with fulldev
...
```

---

## Increment 0117: Starwind 差异化组件

### 范围
- 安装 Starwind 全部 51 个组件
- 用 Starwind 替换 ToastContainer 和 FileUpload
- 添加 Dropzone、Pagination、Progress
- 保留手写组件作为 fallback

### 任务
1. **Phase A — 安装**（20 分钟）
   - `npx starwind@latest init`
   - `npx starwind@latest add toast dropzone pagination progress`
   - 验证组件就位

2. **Phase B — Toast 迁移**（1 小时）
   - 替换 `ToastContainer.astro` → Starwind Toast
   - 重写 11 个 toast 调用点
   - 验证 success/error/info 全部工作

3. **Phase C — Dropzone 迁移**（1.5 小时）
   - 替换 9 个文件上传位置
   - admin/media, business/products, business/[slug]/edit
   - 验证拖拽上传 + 进度条

4. **Phase D — Pagination 迁移**（1.5 小时）
   - 替换 11 个分页实现
   - 统一 API：page, totalPages, onPageChange
   - 测试所有列表页

5. **Phase E — Progress 添加**（30 分钟）
   - admin/ai-tools（AI 生成进度）
   - 视频上传（未来）

### 文件变更（预计 30+ 文件）
- `src/components/starwind/*` 大量新增
- `src/components/ui/ToastContainer.astro` 删除
- 11 个 toast 调用点修改
- 9 个 file upload 修改
- 11 个分页实现修改

### 验收
- 32 → 138 个 UI 组件（19 手写 + 68 Fulldev + 51 Starwind）
- 组件复用率 60% → 80%
- 11 个 toast 通知统一
- 9 个 file upload 统一
- 11 个分页统一

### 风险与时间
- **风险**: MEDIUM（Starwind Toast 与现有逻辑可能不兼容）
- **时间**: 4-6 小时

### Commits
```
install: starwind ui critical features
refactor: migrate to starwind toast
refactor: migrate to starwind dropzone
refactor: migrate to starwind pagination
refactor: add progress to ai-tools
```

---

## Increment 0118: Fulldev Block 模板采用

### 范围
- 采用 Block 模板重建营销页
- 不修改 admin 页面（业务特定）
- 数据驱动的 Block 调用模式

### 任务
1. **Phase A — 主页重建**（1.5 小时）
   - 当前 `index.astro` 改为 Block 调用
   - Hero1 + Features2 + Pricing1 + FAQs1 + Reviews2 + CTA1
   - 数据从 JSON 读取

2. **Phase B — About 页面**（30 分钟）
   - Hero2 + Content2 + Team

3. **Phase C — FAQ 页面**（30 分钟）
   - FAQs2 Block（已有 Accordion，但 Block 数据驱动更好）

4. **Phase D — Listings 页面头部**（30 分钟）
   - 头部改用 Hero1（带搜索）

5. **Phase E — Contact 页面**（30 分钟）
   - Contact1 Block

6. **Phase F — Pricing 页面**（30 分钟）
   - Pricing1 + Comparison1 + FAQs2

### 文件变更（预计 10+ 文件）
- `src/data/site.json`（新增）
- `src/data/features.json`（新增）
- `src/data/pricing.json`（新增）
- `src/data/reviews.json`（新增）
- `src/pages/index.astro`（重写）
- `src/pages/about.astro`（部分重写）
- `src/pages/faq.astro`（重写）
- `src/pages/pricing.astro`（新增/重写）

### 验收
- 营销页用 Block 模板
- 业务页（admin, business/[slug]）保持原样
- `pnpm build` 通过
- 视觉对比 OK

### 风险与时间
- **风险**: MEDIUM（Block 模板可能与现有设计不一致）
- **时间**: 4-6 小时

### Commits
```
feat: home page with fulldev blocks
feat: about page with fulldev blocks
feat: faq page with fulldev accordion
feat: pricing page with fulldev block
```

---

## Increment 0119: UI/Business 完全分离（DOM API 重构）

### 范围
- 重构剩余 22 个 native button + 47 个 native input（在 JS 模板字符串中）
- 消除 62 个 innerHTML 模式
- 实现真正"组件化"

### 任务
1. **Phase A — 分析**（30 分钟）
   - 确认所有 innerHTML 位置
   - 评估风险（每个页面单独评估）

2. **Phase B — 重构最复杂的页面**（3-4 小时）
   - admin/products.astro（14 个元素）
     - 改 createElement + appendChild
     - 改事件委托（已有 data-action）
   - admin/listings/index.astro（动态行）
   - business/[slug]/edit/index.astro（time inputs）

3. **Phase C — 重构中等页面**（2-3 小时）
   - businesses, non-profits, public-sectors
   - users, service-packages, ad-banners

4. **Phase D — Header mobile menu**（30 分钟）
   - 已部分重构（Increment 0113），验证完整

5. **Phase E — 验证**
   - 20 个页面测试
   - admin CRUD 全部测试
   - business 编辑全部测试

### 文件变更（预计 15+ 文件）
- `src/pages/admin/products.astro`（最大改动）
- `src/pages/admin/listings/index.astro`
- `src/pages/admin/businesses.astro`
- `src/pages/admin/non-profits.astro`
- `src/pages/admin/public-sectors.astro`
- `src/pages/admin/users.astro`
- `src/pages/admin/service-packages.astro`
- `src/pages/admin/ad-banners.astro`
- `src/pages/business/[slug]/edit/index.astro`
- `src/components/Header.astro`
- 其他

### 验收
- 22 个 native button → 0（全部组件化）
- 47 个 native input → 0（全部组件化）
- 62 个 innerHTML → 0
- `pnpm build` 通过
- 全部 admin CRUD 工作
- 全部 business 编辑工作

### 风险与时间
- **风险**: HIGH（破坏功能的风险高）
- **时间**: 6-8 小时

### Commits
```
refactor: convert admin/products innerHTML to DOM API
refactor: convert admin/listings innerHTML to DOM API
refactor: convert business/edit time inputs to DOM API
refactor: convert business/[slug] dynamic forms
```

---

## Increment 0120: 组件 API Wrapper 层（Layer 3）

### 范围
- 建立项目统一组件 API
- 在 `src/components/custom/` 下建 wrapper
- 业务代码统一用 `@/components/custom/*`

### 任务
1. **Phase A — Button wrapper**（30 分钟）
   ```astro
   // src/components/custom/Button.astro
   import { Button as FulldevButton } from "@/components/ui/button";
   // 统一 API：variant/size/href/type
   ```

2. **Phase B — Notify wrapper**（30 分钟）
   ```ts
   // src/components/custom/notify.ts
   import { toast as starwindToast } from "@/components/starwind/toast";
   export const notify = {
     success: (msg) => starwindToast.success(msg),
     error: (msg) => starwindToast.error(msg),
   };
   ```

3. **Phase C — ActionBar wrapper**（30 分钟）
   - mobile-first 底部/顶部切换

4. **Phase D — 业务代码迁移**（1.5 小时）
   - 替换所有 import 路径
   - 验证 build

### 文件变更（预计 20+ 文件）
- `src/components/custom/Button.astro`（新增）
- `src/components/custom/notify.ts`（新增）
- `src/components/custom/ActionBar.astro`（新增）
- 业务页面：import 路径更新

### 验收
- 业务代码统一用 `@/components/custom/*`
- 库升级不影响业务代码
- `pnpm build` 通过

### 风险与时间
- **风险**: LOW（不修改库，只加 wrapper）
- **时间**: 2-3 小时

### Commits
```
feat: custom Button wrapper
feat: custom notify wrapper
refactor: migrate business code to custom wrappers
```

---

## Increment 0121: 一致性检查 + 视觉回归

### 范围
- 运行 10 项一致性检查（文档 AJ 节）
- 添加 Playwright 视觉回归测试
- 修复任何不一致

### 任务
1. **Phase A — 一致性检查**（1 小时）
   - 圆角：8px 统一
   - 颜色：Fulldev + Starwind 都读同一份 token
   - 字体：Plus Jakarta Sans + Sora
   - 动效：250ms ± 50ms
   - 暗色模式：所有元素一致
   - 焦点环：颜色/宽度一致

2. **Phase B — Playwright 视觉回归**（1 小时）
   - 5 个代表性页面 baseline 截图
   - CI 集成（可选）

3. **Phase C — 修复**（1 小时）
   - 任何发现的不一致

### 验收
- 10/10 一致性检查通过
- 视觉回归 baseline 建立

### 风险与时间
- **风险**: LOW
- **时间**: 2-3 小时

### Commits
```
test: playwright visual regression
polish: consistency fixes
```

---

## 总览

| Increment | 主题 | 风险 | 时间 | 状态 |
|-----------|------|------|------|------|
| 0115 | 设计 Token 基础 | LOW | 1.5-2h | 待开始 |
| 0116 | Fulldev 安装 + 替换 | MEDIUM | 4-6h | 待开始 |
| 0117 | Starwind 差异化 | MEDIUM | 4-6h | 待开始 |
| 0118 | Block 模板 | MEDIUM | 4-6h | 待开始 |
| 0119 | DOM API 重构 | **HIGH** | 6-8h | 待开始 |
| 0120 | Wrapper 层 | LOW | 2-3h | 待开始 |
| 0121 | 一致性 + 测试 | LOW | 2-3h | 待开始 |
| **总计** | **7 个 increments** | - | **25-34h** | - |

## 预期收益

| 指标 | Before | After |
|------|--------|-------|
| 组件复用率 | 30% | **90%+** |
| UI 组件总数 | 32 | **138+** |
| Native `<button>` 残留 | 22 | **0** |
| Native `<input>` 残留 | 47 | **0** |
| innerHTML 模板字符串 | 62 | **0** |
| 代码量 | 100% | **~30%** (基于文档 tradeABC 真实数据) |
| 首屏 JS | 100% | **~5%** |
| 库升级安全性 | LOW | **HIGH**（wrapper 层） |

## 风险缓解

1. **每个 increment 单独分支**
2. **每个 increment 单独测试 + 部署 + 验证**
3. **每 phase build 验证**
4. **每 phase 视觉对比**
5. **最终 Playwright 视觉回归**

## 决策点

是否要：
- A. **完整执行 7 个 increments**（~30 小时）
- B. **跳过 0119（DOM API 重构）**（~22 小时，降低风险）
- C. **只执行 0115-0117**（~12 小时，达到 80% 复用率）

**我的推荐**: **B 方案**（跳过 0119 高风险重构）
- 原因：0119 的 22+47 个 native 元素在 JS 模板字符串内
- 这些是"已知架构限制"，不是"未完成"
- Block 替换后，新页面将用 Block 模板，不会再有此问题
- 跳过 0119 不影响核心目标

**你选哪个？**