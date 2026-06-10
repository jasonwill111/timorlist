# Plan: Fulldev + Starwind Migration

## Overview

通过3 个维度重构，实现 Astro 原生组件最大化复用 + UI/UX 与业务代码完全分离：

1. **Starwind 安装** — 补充 fulldev 缺失的 10 个差异化组件
2. **Block 替换** — 营销页从手写 HTML → Fulldev Block（改数据不改模板）
3. **架构分离** — slug 页面 DB逻辑 → lib/queries，admin 页面 inline script → island

## Architecture

### Target Component Structure
```
src/
├── components/
│   ├── ui/ ← Fulldev 组件（54 dirs, source-owned）
│   │   ├── button/, card/, dialog/, ...
│   │   └── blocks/ ← Fulldev Blocks（新增）
│   ├── starwind/              ← Starwind 组件（新增，10 个差异化组件）
│   ├── islands/               ← 交互组件（已有13 个 + 新增 4 个）
│   │   └── admin/ ← Admin islands
│   ├── business/              ← 业务卡片（保留）
│   └── forms/                  ← 表单组件（保留）
├── lib/
│   └── db/
│       └── queries/           ← 业务查询函数（新增 6 个）
│           ├── getBusinessBySlug.ts
│           ├── getListingBySlug.ts
│           ├── getNonProfitBySlug.ts
│           ├── getPublicSectorBySlug.ts
│           ├── getBlogPostBySlug.ts
│           └── getEntityBySlug.ts  ← 非营利/公共部门共用
└── pages/
    ├── index.astro            ← Block替换（~116行 → ~60行）
    ├── business/[slug].astro ← 查询分离（~593行 → ~200行）
    ├── admin/
    │   ├── login.astro        ← Island 迁移
    │   ├── media.astro ← Island 迁移
    │   └── ai-tools.astro ← Island 迁移
    └── ...
```

### Data Flow: Before vs After

**Before**（slug页面）：
```
Astro frontmatter:
  await getDb()         ← DB 连接
  db.select(...) ← 查询
  .map(...).filter(...) ← 数据转换
  { business, products } ← 组装数据
  return Astro.redirect ← 重定向
---
HTML template (300+ lines, inline styles, hardcoded grid)
```

**After**（slug 页面）：
```
Astro frontmatter:
  import { getBusinessBySlug } from "@/lib/db/queries"
  const { business, products } = await getBusinessBySlug(slug)
  if (!business) return Astro.redirect("/404")
---
HTML template: 纯 import fulldev/starwind 组件 + 数据注入
```

**Before**（admin 页面）：
```
Astro frontmatter: fetch data
HTML template: inline<script> with innerHTML, classList manipulation
```

**After**（admin 页面）：
```
Astro frontmatter: fetch data, pass as props to Island
HTML template: <XxxIsland data={...} />
Island script: textContent/classList/value (no innerHTML)
```

## Technical Decisions

### ADR-1: Query Function Granularity
**Decision**: 每个 slug 页面对应一个 query 文件，`non-profit` 和 `public-sector` 共用一个 `getEntityBySlug`（两者 schema 几乎相同）
**Rationale**: 避免过度抽象。先按页面分离，后续发现共性再提取。
**Risk**: 6 个新文件 = 维护负担。Mitigation：这些函数可以被 E2E 测试覆盖。

### ADR-2: Starwind Component Selection
**Decision**: 安装 10 个 fulldev 没有的组件：toast, dropzone, pagination, progress, color-picker, scroll-area, hover-card, context-menu, image, item
**Rationale**: 这 10 个是项目目前用 Tailwind 硬拼的组件，也是 fulldev 明确缺失的。
**Not installing**: button, card, dialog, sidebar 等（与 fulldev 重叠，安装了是浪费且增加维护成本）

### ADR-3: Block vs Atomic Component for Marketing Pages
**Decision**: 优先用 Block（数据驱动的整页模板），而非原子组件拼接
**Rationale**: Block = 改 props 数据不改模板，AI 开发效率最高。手写 grid + h1+h2 每次改版要动多个文件。
**Risk**: Block 源码量大（单个 Hero block ~200行）。Mitigation：source 文件归你，修改前先 git commit。

### ADR-4: Island Migration Priority
**Decision**: 先迁移 inline script 最严重的3 个页面（ai-tools 927行、login 188行、media 303行）
**Rationale**: 这些页面的 inline script 是最大的 XSS 风险源和代码复杂度来源。
**Not migrating**: admin/index（已迁移），其他 admin页面（已有 islands）

## Risks & Mitigations

| Risk | Severity | Mitigation |
|---|---|---|
| Block 升级覆盖本地修改 | Medium | 升级前 git commit，每次只升级一个组件 |
| query 函数与页面逻辑不一致 | High | 每个 query 函数配套 E2E 测试（Given page loads → data correct）|
| Starwind 动效与现有 CSS 变量冲突 | Low | `starwind.config.json` 的 theme 配置独立，不改 `globals.css` 已有变量 |
| 删除 PascalCase 文件导致断链 import | High | 先 grep 全部引用，批量替换后再删除 |
| Slug 页面重构引入 regression | High | `sw:grill` 验证 + E2E smoke test |
| Block 源码不适合当前设计 | Medium | 先用 `--dry-run` 查看 Block 效果，不满意不安装 |

## Testing Strategy

1. **US-003 query 函数**：每个 query 函数一个集成测试（mock DB，返回预期数据 shape）
2. **US-004 island**：Given admin page loads → Then island renders with correct data, no innerHTML
3. **US-007验证**：全量 `astro build` + `playwright test`

## Implementation Phases

### Phase 1: Setup（US-001）
- `npx starwind@latest init`
- `npx starwind@latest add` 10 个组件

### Phase 2: Block + Query（US-002, US-003）
- 营销页 → Block（5 个页面）
- Slug 页面查询分离（5+1 个 query 文件）

### Phase 3: Island（US-004）
- 4 个 admin 页面 → island

### Phase 4: Cleanup（US-005, US-006）
- 删除 PascalCase 文件 + components.json
- Starwind 组件集成到页面

### Phase 5: Verification（US-007）
- 构建 + E2E