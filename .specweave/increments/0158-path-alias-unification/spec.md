---
increment: 0158-path-alias-unification
title: 路径别名统一 + 组件分工规范建立
type: feature
priority: P1
status: completed
created: 2026-06-09T00:00:00.000Z
structure: user-stories
test_mode: TDD
coverage_target: 80
---

# Feature: 路径别名统一 + 组件分工规范建立

## Overview

项目中存在两处需要治理的一致性问题：

1. **路径别名拼写不一致**：11 个文件中出现 30 处 `@components/` 引用，缺少前导 `/`，应为 `@/components/`（与 vite `resolve.alias` 中 `@` → `src/` 的配置对齐）。虽然当前 Astro/Vite 在大多数场景下容错解析通过，但 TypeScript 严格路径解析、IDE 跳转、以及未来 alias 严格化时会产生隐性失败。
2. **组件库职责边界缺失**：Fulldev 与 Starwind 两套组件库存在功能重叠（button、input、select、textarea、label、Card、Badge 等），但项目内没有正式文档规定"何时用哪套"。这导致新代码混用两套库，UI 一致性受损，且 Starwind 正在 deprecate 过程中（参见 0154）。

本 increment 解决两件事：
- **US-001**：把所有 `@components/` 替换为 `@/components/`，并把 admin/media.astro 的 inline 分页迁移到 Starwind `Pagination` 组件（属于本任务中需要保留的 Starwind 组件）。
- **US-002**：在 `docs/internal/design-system/` 下落档一份 `component-standards.md`，明确 Fulldev 优先组件、Starwind 独有组件，以及已被 deprecate 的 Starwind 组件清单，作为后续所有新代码与重构工作的判据。

## User Stories

### US-001: 路径别名统一
**Project**: TimorUp

**As a** developer
**I want** 所有 `@components/` 引用都写成 `@/components/`
**So that** 代码符合 vite alias 配置规范，TypeScript 路径解析正确

**Scope**:
- 涉及 11 个文件、30 处 `@components/` → `@/components/` 替换
- 文件分布范围：`src/pages/` 与 `src/components/islands/`
- 同时把 `admin/media.astro` 中分页区块从 inline `<a>` 列表迁移到 Starwind `Pagination` 组件

**Acceptance Criteria**:
- [x] **AC-0158-US1-01**: `grep -r "@components/" src/pages/ src/components/islands/` 返回 0 结果（`@/components/` 不计入此匹配)
- [x] **AC-0158-US1-02**: 所有修复文件通过 `pnpm exec -- tsc --noEmit` 无路径解析相关错误（允许存在与本 increment 范围无关的既有错误，但不得新增）
- [x] **AC-0158-US1-03**: `src/pages/admin/media.astro` 中分页区块改用 Starwind `Pagination` 组件，源文件不再包含 inline 风格的分页 `<a>` 节点链
- [x] **AC-0158-US1-04**: 替换过程以最小 diff 完成（按文件/按字符串），不在本次任务中重命名组件、调整 import 顺序以外的格式

**Test Plan (per AC)**:
- **AC-0158-US1-01**: 终端执行 `grep -rn "@components/" src/pages/ src/components/islands/` → 期望空输出；并执行 `grep -rn "@/components/" src/pages/ src/components/islands/ | wc -l` → 期望至少 30 行（与既有计数持平或更多）
- **AC-0158-US1-02**: 终端执行 `pnpm exec -- tsc --noEmit 2>&1 | grep -E "Cannot find module|@components"` → 期望空输出（与路径别名相关）
- **AC-0158-US1-03**: 视觉/结构双重检查：阅读 `admin/media.astro` 源码确认存在 `<Pagination>`（Starwind）用法，源中不再有连续分页 `<a>` 块；可选 Playwright 渲染 `/admin/media` 截图核对分页控件外观
- **AC-0158-US1-04**: `git diff --stat` 显示出文件改动只涉及目标行，diff 范围合理

---

### US-002: 组件分工规范建立
**Project**: TimorUp

**As a** developer
**I want** 组件库选择有明确规范文档
**So that** 新代码不会混用 Fulldev 和 Starwind 重叠组件

**Scope**:
- 文档落档位置：`docs/internal/design-system/component-standards.md`
- 内容覆盖：Fulldev 优先组件清单、Starwind 独有组件清单、Starwind 中 deprecated 组件清单
- 与既有 increment 0154（Starwind deprecation 接受标准）保持术语一致

**Acceptance Criteria**:
- [x] **AC-0158-US2-01**: 文件 `docs/internal/design-system/component-standards.md` 存在且非空（至少 1 KB / 30 行以上有效内容）
- [x] **AC-0158-US2-02**: 文档明确列出 Fulldev 优先组件：`button`、`input`、`textarea`、`select`、`label`、`Card`、`Badge`（以及同类重叠组件）
- [x] **AC-0158-US2-03**: 文档明确列出 Starwind 独有组件：`pagination`、`Dropzone`、`progress`、`color-picker`、`context-menu`、`dropdown`、`scroll-area`（Fulldev 中无等价实现的组件）
- [x] **AC-0158-US2-04**: 文档标记 Starwind 中 `button`、`input` 为 deprecated，新代码统一使用 Fulldev 对应组件；并附迁移建议（替换映射表）
- [x] **AC-0158-US2-05**: 文档对"何时该选 Fulldev 何时该选 Starwind"给出可操作的判定流程（如：Fulldev 有 → 用 Fulldev；Fulldev 无 → Starwind 独有组件；Starwind 独有也无 → 自建）

**Test Plan (per AC)**:
- **AC-0158-US2-01**: 终端执行 `test -s "docs/internal/design-system/component-standards.md" && wc -l "docs/internal/design-system/component-standards.md"` → 文件存在且行数 ≥ 30
- **AC-0158-US2-02**: 在文档内容中检索每个组件名（`button`、`input`、`textarea`、`select`、`label`、`Card`、`Badge`）→ 期望每项至少出现一次并位于 Fulldev 章节
- **AC-0158-US2-03**: 同上，对 Starwind 独有组件清单中每一项做存在性断言
- **AC-0158-US2-04**: 在文档中检索 `deprecated` 字样，期望 Starwind `button`、`input` 出现在 deprecated 列表中，且附有替代方案说明
- **AC-0158-US2-05**: 文档存在显式的"决策流程"或等价章节，读者可按步骤判定

---

## Functional Requirements

### FR-001: 路径别名修正
所有形如 `from "@components/..."` 或 `import "@components/..."` 的字符串必须改写为 `from "@/components/..."` / `import "@/components/..."`。规则：
- 匹配锚点：完整 token `@components/`（前导 `@` 无 `/`）
- 替换为：`@/components/`
- 范围：仅 `src/pages/` 与 `src/components/islands/`
- 不修改 vite/tsconfig 中 alias 定义本身

### FR-002: admin/media 分页组件化
`src/pages/admin/media.astro` 中分页区块改用 Starwind `Pagination` 组件：
- 移除 inline `<a>` 节点链
- 引入 Starwind `Pagination` import
- 维持现有分页参数与 URL 行为（page 查询参数、总数等）

### FR-003: 组件分工规范文档
新建 `docs/internal/design-system/component-standards.md`，结构要求：
1. 概述（与 0154 一致口径）
2. Fulldev 优先组件清单（含用途简述）
3. Starwind 独有组件清单（含用途简述）
4. Starwind deprecated 组件清单 + 迁移映射表
5. 决策流程（"新代码选哪套"的可操作步骤）
6. 交叉引用：链接到 0154、0159 增量说明

## Success Criteria

- 路径别名问题彻底根除：`grep -r "@components/"` 在 `src/pages/` 与 `src/components/islands/` 下为 0 命中
- 全项目 `tsc --noEmit` 不出现新增的路径解析错误
- 规范文档可作为后续 PR 评审的判据被引用
- admin/media 页面分页交互不回归（视觉与功能一致）

## Out of Scope

- 不重写现有组件、不调整组件 API
- 不在本次任务中执行更大规模的 Starwind deprecation 迁移（已在 0154 中处理）
- 不修改 vite `tsconfig.json` 的 `paths` 配置
- 不动 `admin/media.astro` 之外的 admin 页面（本次只迁移分页区块）
- 不调整 import 顺序以外的格式（避免与 lint 规则冲突）

## Risks

| 风险 | 缓解 |
|------|------|
| 大量散落的 `@components/` 替换可能误改字符串字面量 | 用 `grep` 精确匹配 import/from 语句后逐文件 Edit；修改前后立即跑 `tsc --noEmit` 验证 |
| Starwind `Pagination` 组件 API 与 admin/media 当前分页交互不匹配 | 实现前先查 `node_modules/starwind`（或源码）确认 props；如不匹配，回退到合适的 Starwind 组件并在 PR 中说明 |
| 规范文档与未来其他 increment（0159 一致性审计等）口径冲突 | 文档草稿时对照 0154、0159 的描述做交叉引用；明确 "Fulldev 优先" 的判定边界 |
| `docs/internal/design-system/` 目录不存在 | Write 前先 `mkdir -p` |

## Dependencies

- 既有 increment **0154**（Starwind deprecation acceptance）：规范文档需与 0154 结论一致
- 既有 increment **0159**（UI/UX 一致性审计）：是后续执行/验证规范落地的消费者，但本 increment 不强依赖 0159 完成

## Definition of Done

- [ ] US-001 全部 AC 通过（含 `tsc --noEmit` 与 `grep` 双重验证）
- [ ] US-002 全部 AC 通过（文档存在且内容完整）
- [ ] `pnpm exec -- tsc --noEmit` 在全项目范围不出现新增路径解析错误
- [ ] `git diff` 仅触及目标文件（11 个 `@components/` 引用修复文件 + `admin/media.astro` + 新增的规范文档）
