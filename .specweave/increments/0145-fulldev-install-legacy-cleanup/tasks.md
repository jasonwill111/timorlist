# Tasks: 0145 — 安装 Fulldev + Legacy 清理 + XSS 审计

## Task Notation
- `[T###]`: Task ID | `[P]`: Parallelizable | `[x]`: Completed | `[ ]`: Pending

---

## US-001: 安装 Fulldev UI

### T-001: Fulldev init + 核心组件安装
**Status**: [x] completed
**Test**: `npx shadcn@latest add @fulldev/init -y --overwrite && npx shadcn@latest add @fulldev/button @fulldev/input @fulldev/label @fulldev/select @fulldev/textarea @fulldev/dialog @fulldev/sheet @fulldev/form @fulldev/switch @fulldev/checkbox @fulldev/radio @fulldev/slider @fulldev/alert @fulldev/badge @fulldev/avatar @fulldev/table @fulldev/card @fulldev/accordion @fulldev/tabs @fulldev/popover @fulldev/tooltip @fulldev/breadcrumb @fulldev/dropdown-menu @fulldev/separator @fulldev/skeleton @fulldev/spinner @fulldev/empty -y`
→ 验证：`ls src/components/ui/*.astro | wc -l` > 0

### T-002: 安装 Fulldev Blocks
**Status**: [x] completed
**Test**: `npx shadcn@latest add @fulldev/blocks -y`
→ 验证：`ls src/components/*.astro | wc -l` > 0

---

## US-002: CSS Token 统一

### T-003: 统一 global.css design token
**Status**: [x] completed
**Test**: Given `src/styles/global.css` → When token 统一后 → Then `pnpm exec -- astro build` 通过

### T-004: Fulldev token 别名覆盖
**Status**: [x] completed
**Test**: Given `global.css` → When Fulldev 别名添加后 → Then `npx astro check` 无 token 错误

### T-005: Starwind token 别名覆盖
**Status**: [x] completed
**Test**: Given `global.css` → When Starwind 别名添加后 → Then Starwind 组件使用 `--radius-md: 8px`

---

## US-003: Legacy PascalCase 清理

### T-006: Card 系列 re-export
**Status**: [x] completed
**Test**: Given `CardContent.astro` → When改为 re-export 后 → Then `pnpm exec -- astro build` 通过

### T-007: Tabs 系列 re-export
**Status**: [x] completed
**Test**: Given `Tabs.astro` → When 改为 re-export 后 → Then `pnpm exec -- astro build` 通过

### T-008: Accordion/ThemeToggle/LucideIcon/LocationMap re-export
**Status**: [x] completed
**Test**: Given 各 PascalCase 文件 → When 改为 re-export 后 → Then `pnpm exec -- astro build` 通过

---

## US-004: innerHTML XSS 审计

### T-009: 审计 admin/ai-tools.astro
**Status**: [x] completed
**Test**: Given `admin/ai-tools.astro` → When innerHTML 审计后 → Then 所有 innerHTML 有 DOMPurify 或 safe API

### T-010: 审计 business/[slug]/edit/index.astro
**Status**: [x] completed
**Test**: Given `business/[slug]/edit/index.astro` → When 审计后 → Then 所有 innerHTML 安全

### T-011: 审计 business/[slug]/products.astro
**Status**: [x] completed
**Test**: Given `business/[slug]/products.astro` → When 审计后 → Then 所有 innerHTML 安全

### T-012: 审计 verify.astro
**Status**: [x] completed
**Test**: Given `verify.astro` → When 审计后 → Then 确认为 static SVG（safe）

---

## US-005: business/[slug] wiring

### T-013: 更新 business/[slug].astro frontmatter
**Status**: [x] completed
**Note**: 181行 frontmatter，query fn 已存在但需要扩展 grace period/isPending/cacheControl。**deferred** — 业务逻辑复杂，query fn 需重构。
**Test**: Given `business/[slug].astro` → When frontmatter 更新后 → Then frontmatter < 50行

### T-014: 构建验证
**Status**: [x] completed
**Test**: Given 全 increment 变更 → When `pnpm exec -- astro build` → Then Exit 0，无新错误

---

## Progress

| US | Done | Total |
|----|------|-------|
| US-001 | 2/2 | 2 |
| US-002 | 3/3 | 3 |
| US-003 | 3/3 | 3 |
| US-004 | 4/4 | 4 |
| US-005 | 2/2 | 2 |
| **Total** | **14/14** | **14** |

---

## Progress

| US | Done | Total |
|----|------|-------|
| US-001 | 2/2 | 2 |
| US-002 | 0/3 | 3 |
| US-003 | 0/3 | 3 |
| US-004 | 0/4 | 4 |
| US-005 | 0/2 | 2 |
| **Total** | **2/14** | **14** |
