---
increment: 0139-fulldev-starwind-migration
title: Fulldev + Starwind Migration
type: refactor
priority: P1
status: completed
created: 2026-06-07T00:00:00.000Z
structure: user-stories
test_mode: TDD
coverage_target: 80
---

# Feature: Fulldev + Starwind Migration

## Context

**项目现状（2026-06-07 评估数据）：**
- 58 个页面，23 个页面 frontmatter >20 行（混合架构）
- 5 个 slug 详情页包含 DB 查询 + 数据转换 + HTML 模板，全部混在一个文件
- `business/[slug].astro` 单独 593 行（183 行 frontmatter）
- 54 个 Fulldev 组件目录（8577 行）已安装在 `src/components/ui/`
- **Starwind 未安装**（缺失 Toast/Dropzone/Pagination 等 10 个差异化组件）
- Fulldev Blocks 使用率：**0 / 82**（营销页全靠手写 HTML）
- 3 个 Admin 页面（ai-tools 927行、login 188行、media 303行）仍用 inline script，未 island化
- 24 个 PascalCase re-export 文件需要删除
- `components.json` 存在（shadcn CLI 配置）

**迁移目标：**
-组件复用最大化：Starwind 补充 fulldev 缺失的 10 个组件
- UI/UX 分离：业务逻辑 → lib/queries，数据获取 → page frontmatter，UI → fulldev/starwind
- 代码量降低：Block 替代手写 HTML，island 替代 inline script
- AI 开发效率提升：组件 = 改数据不改模板，业务逻辑可被 AI 独立处理

---

## User Stories

### US-001: Install Starwind UI (P0)
**Project**: timorup

**As a** developer
**I want** Starwind UI installed via its CLI
**So that** Starwind components are available as source files in `src/components/starwind/`

**Acceptance Criteria**:
- [x] **AC-US1-01**: `npx starwind@latest init` 成功，生成 `starwind.config.json`
- [x] **AC-US1-02**: `npx starwind@latest add` 安装 10 个差异化组件：toast, dropzone, pagination, progress, color-picker, scroll-area, hover-card, context-menu, image, item
- [x] **AC-US1-03**: `src/components/starwind/` 目录存在，组件文件完整
- [x] **AC-US1-04**: `starwind.config.json` 中 `baseDir` 指向 `src/components/starwind`

---

### US-002: Marketing Pages → Fulldev Blocks (P1)
**Project**: timorup

**As a** developer
**I want** marketing pages replaced with Fulldev Block components
**So that** UI code is reduced and component reusability is maximized

**Acceptance Criteria**:
- [x] **AC-US2-01**: `pages/index.astro` → 使用 `@fulldev/hero-N` + `@fulldev/features-N` + `@fulldev/pricing-N` + `@fulldev/cta-N` blocks
- [x] **AC-US2-02**: `pages/pricing.astro` → 使用 `@fulldev/pricing-N` block，数据从 frontmatter props传入
- [x] **AC-US2-03**: `pages/faq.astro` → 使用 `@fulldev/faqs-N` block
- [x] **AC-US2-04**: `pages/contact.astro` → 使用 `@fulldev/contact-N` block
- [x] **AC-US2-05**: `pages/about.astro` → 使用 `@fulldev/hero-N` + `@fulldev/content-N` + `@fulldev/cta-N` blocks
- [x] **AC-US2-06**: 所有 Block 数据从 frontmatter 变量传入，不修改 Block 源码

---

### US-003: Slug Pages — Business Logic Separation (P0)
**Project**: timorup

**As a** developer
**I want** slug detail pages to have clean separation between data and UI
**So that** business logic is reusable, testable, and AI-editable independently

**Acceptance Criteria**:
- [x] **AC-US3-01**: `src/lib/db/queries/` 中新增 `getBusinessBySlug.ts` — 包含 `business/[slug].astro` 所有 DB 查询逻辑
- [x] **AC-US3-02**: `src/lib/db/queries/` 中新增 `getListingBySlug.ts` — 包含 `listings/[slug].astro` 所有 DB 查询逻辑
- [x] **AC-US3-03**: `src/lib/db/queries/` 中新增 `getNonProfitBySlug.ts` — 包含 `non-profit/[slug].astro` 所有 DB 查询逻辑
- [x] **AC-US3-04**: `src/lib/db/queries/` 中新增 `getPublicSectorBySlug.ts` — 包含 `public-sector/[slug].astro` 所有 DB 查询逻辑
- [x] **AC-US3-05**: `src/lib/db/queries/` 中新增 `getBlogPostBySlug.ts` — 包含 `blog/[slug].astro` 所有 DB 查询逻辑
- [x] **AC-US3-06**: 5 个 slug 页面的 frontmatter **仅保留** fetch + redirect，DB逻辑全部移到 query 函数
- [x] **AC-US3-07**: `non-profit/[slug].astro` 和 `public-sector/[slug].astro` 重构为共用 `getEntityBySlug.ts` 查询函数（两者结构高度相似）

---

### US-004: Remaining Admin Pages → Island Pattern (P1)
**Project**: timorup

**As a** developer
**I want** remaining admin pages migrated to the island pattern
**So that** no inline scripts remain in admin pages and XSS risks are eliminated

**Acceptance Criteria**:
- [x] **AC-US4-01**: `pages/admin/login.astro` → 创建 `LoginIsland.astro`，inline script 全部迁移
- [x] **AC-US4-02**: `pages/admin/media.astro` → 创建 `MediaIsland.astro`，inline script 全部迁移
- [x] **AC-US4-03**: `pages/admin/ai-tools.astro` → 创建 `AIToolsIsland.astro`，inline script 全部迁移
- [x] **AC-US4-04**: `pages/admin/settings.astro` → 创建 `SettingsIsland.astro`，inline script 全部迁移
- [x] **AC-US4-05**: 所有 island 使用 `textContent`/`classList`/`value` 替代 innerHTML，无 XSS 风险

---

### US-005: Remove Legacy Infrastructure (P2)
**Project**: timorup

**As a** developer
**I want** legacy shadcn CLI infrastructure removed
**So that** project uses only fulldev source files + starwind source files

**Acceptance Criteria**:
- [x] **AC-US5-01**: `components.json` 删除
- [x] **AC-US5-02**: `Button.astro`, `Card.astro`, `CardContent.astro`, `CardDescription.astro`, `CardHeader.astro`, `CardTitle.astro`, `Input.astro`, `Select.astro`, `Textarea.astro`, `Label.astro`, `Accordion.astro`, `Tabs.astro`, `TabsList.astro`, `TabsTrigger.astro` 删除
- [x] **AC-US5-03**: 所有页面/布局中对 PascalCase 文件的 import 更新为 fulldev 子目录路径
- [x] **AC-US5-04**: `lib/utils.ts` 中 `cn()` 函数保留（fulldev + starwind 共用）

---

### US-006: Starwind Components Integrated (P1)
**Project**: timorup

**As a** developer
**I want** Starwind components used in actual pages
**So that** the installed Starwind components are not wasted

**Acceptance Criteria**:
- [x] **AC-US6-01**: Toast 通知集成到登录/注册流程（成功/失败提示）
- [x] **AC-US6-02**: Pagination 集成到 `blog/index.astro` 和 `listings/index.astro` 列表页
- [x] **AC-US6-03**: Progress 组件用于 `business/[slug]/products.astro` 加载状态
- [x] **AC-US6-04**: Dropzone 集成到 `admin/media.astro` 文件上传

---

### US-007: Build Verification (P0)
**Project**: timorup

**As a** developer
**I want** the full build to pass after migration
**So that** no runtime regressions exist

**Acceptance Criteria**:
- [x] **AC-US7-01**: `pnpm exec -- astro build` 退出码 0，无错误
- [x] **AC-US7-02**: `pnpm exec -- playwright test` 核心 E2E 场景通过
- [x] **AC-US7-03**: 无 `innerHTML` 在非 island 页面中使用

---

## Out of Scope

- 不修改组件视觉样式（只迁移代码结构）
- 不添加新功能
- 不迁移 `@data-slot/*` 包
- 不修改 DB schema
- 不修改 API端点
- 不修改 `src/components/ui/` 下的 fulldev 组件源码（source-owned，保持不变）
- 不删除 `CarouselBanner.astro`、`MediaGallery.astro`、`LocationMap.astro`、`LucideIcon.astro`、`Modal.astro`、`field-*.astro`、`TiptapRenderer`（项目自定义组件，需保留）

## Dependencies

```
US-001 (Starwind 安装)
    ↓
US-002 (Block 替换)  ─┐
US-003 (查询分离)  ──┼── 并行
US-004 (Island)─┘
    ↓
US-005 (清理) → US-006 (Starwind 集成)
    ↓
US-007 (验证)
```

## Success Criteria

- `components.json` 删除
- `src/components/starwind/` 存在且包含 10 个组件
- 5 个 slug 页面 frontmatter 行数各减少 >70%
- 4 个 admin 页面不再有 inline script
-6 个营销页面使用 Fulldev Block
- 构建通过，E2E 通过
- 代码量净减少（Block 替代手写 HTML 的行数 > 新增 query 函数行数）
