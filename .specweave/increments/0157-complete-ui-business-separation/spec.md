---
increment: 0157-complete-ui-business-separation
title: Complete UI/Business Separation — Astro Native Components
type: refactor
priority: P0
status: completed
created: 2026-06-09T00:00:00.000Z
structure: user-stories
test_mode: test-after
project: timorup
---

## Context

用户目标：所有组件迁移到 Astro 原生组件，组件复用最大化，UI/UX 组件和业务逻辑代码完全分离。

**已达标 ✅**：
- 数据层：0 个 `@/db/schema` imports in pages
- 数据层：0 个 `db.prepare()` calls in pages
- 组件库：Fulldev 66 组件（button/input/select/textarea/label/dialog）

**待完成 ❌**：

### US-001: Operating Hours 表格组件化（P0）
inline HTML 字符串生成（~80行），混合 DOM 操作逻辑

**Acceptance Criteria**：
- [x] **AC-US1-01**: `src/components/islands/business/OperatingHoursIsland.astro` 创建
- [x] **AC-US1-02**: 接收 `days: DaySchedule[]` prop，Astro 模板渲染（非 template literal）
- [x] **AC-US1-03**: `src/pages/business/[slug]/edit/index.astro` 替换为 `<OperatingHoursIsland days={parsedDays} />`
- [x] **AC-US1-04**: `pnpm build` exits 0

### US-002: Admin Island 列表行组件化（P0）
5 个 admin islands 用 template literal 动态生成 toggle/delete 按钮行

**Acceptance Criteria**：
- [x] **AC-US2-01**: `src/components/ui/admin/AdminListRow.astro` 创建，接收 `id`, `name`, `status` props
- [x] **AC-US2-02**: ListingsIsland/ProductsIsland/BlogsIsland 中的 template literal 行生成 → Astro map 渲染
- [x] **AC-US2-03**: 所有 admin islands 使用 `<Button>` 替代 raw `<button>`
- [x] **AC-US2-04**: `pnpm build` exits 0

### US-003: Login 页面 checkbox 组件化（P1）
raw `<input type="checkbox">` 替换为 Fulldev `<Checkbox>`

**Acceptance Criteria**：
- [x] **AC-US3-01**: `src/pages/login.astro` 使用 `<Checkbox>` 替代 raw `<input>`
- [x] **AC-US3-02**: `pnpm build` exits 0

### US-004: Hidden Input 统一封装（P1）
多处 `<input type="hidden">` 分散在 pages 中

**Acceptance Criteria**：
- [x] **AC-US4-01**: `src/components/ui/HiddenField.astro` 创建，接收 `name`, `value` props
- [x] **AC-US4-02**: business/edit、business/product pages 的 hidden inputs 替换为 `<HiddenField>`
- [x] **AC-US4-03**: `pnpm build` exits 0

### US-005: 验收测试（P0）
数据层已清零，再次确认

**Acceptance Criteria**：
- [x] **AC-US5-01**: `grep -r "from '@/db/schema'" src/pages/ | wc -l` = 0
- [x] **AC-US5-02**: `grep -r "db.prepare" src/pages/ | wc -l` = 0
- [x] **AC-US5-03**: `grep -r "innerHTML" src/pages/ | wc -l` = 0
- [x] **AC-US5-04**: `pnpm exec -- astro build` exits 0
