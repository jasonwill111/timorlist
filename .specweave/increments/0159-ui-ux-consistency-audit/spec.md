---
increment: 0159-ui-ux-consistency-audit
title: UI/UX 风格一致性审查 + Admin Islands 评估
type: feature
priority: P1
status: completed
created: 2026-06-09T00:00:00.000Z
structure: user-stories
test_mode: TDD
coverage_target: 80
---

# Feature: UI/UX 风格一致性审查 + Admin Islands 评估

## Overview

审查58个页面的UI/UX风格一致性,建立设计规范;评估admin islands是否需要拆分重构。

本 increment 是**审计/评估类工作**——产出可执行报告与建议文档,而不是直接修改组件代码。后续 0160+ increment 将基于本 increment 的报告实施实际重构。

## Goals

1. 量化当前 58 个页面的 UI 一致性差距
2. 识别 admin islands 的代码复杂度与拆分候选
3. 输出可执行的重构建议(不直接实施)
4. 为后续 increment 0160+ 提供基线数据

## Non-Goals

- 不直接修改任何 .astro/.tsx 组件文件
- 不重写 Fulldev UI 组件库
- 不改动数据库 schema 或后端逻辑
- 不部署或发布任何代码变更

---

## User Stories

### US-001: UI 一致性审查
**Project**: timorup

**As a** developer
**I want** 所有 58 个页面 UI 风格一致
**So that** 用户体验统一,品牌形象专业

**Acceptance Criteria**:
- [x] **AC-0159-US1-01**: 所有页面使用相同 CSS 变量(--primary, --muted, --border, --foreground, --background),输出 `ui-ux-audit-report.md` 列出违规页面与具体行号
- [x] **AC-0159-US1-02**: 所有按钮使用 Fulldev Button 组件,统一 variants(primary/secondary/ghost/destructive),报告统计违规实例数
- [x] **AC-0159-US1-03**: 所有表单输入使用 Fulldev Input/Select/Textarea 组件,报告统计 `<input>`/`<select>`/`<textarea>` 直接使用次数
- [x] **AC-0159-US1-04**: 间距使用 Tailwind spacing scale(4px 基准),无硬编码 px 值,报告列出所有 `style=".*px"` 违规位置
- [x] **AC-0159-US1-05**: 暗色模式支持(`dark:` 前缀)覆盖所有自定义颜色,报告列出缺失 `dark:` 变体的颜色类

### US-002: Admin Islands 可维护性评估
**Project**: timorup

**As a** developer
**I want** admin islands 文件行数合理
**So that** 代码可读性和可维护性达标

**Acceptance Criteria**:
- [x] **AC-0159-US2-01**: `ProductsIsland.astro` (829行) 有拆分建议文档,包含职责边界、依赖关系、推荐拆分方案
- [x] **AC-0159-US2-02**: `ServicePackagesIsland.astro` (549行) 有拆分建议文档
- [x] **AC-0159-US2-03**: 其他 6 个 >300 行的 islands(预期包含 UpdatesIsland、TeamMembersIsland、CategoriesIsland 等)有评估报告,标注是否需要拆分及理由
- [x] **AC-0159-US2-04**: 12 个 islands 全部输出 LOC、cyclomatic complexity(估算)、职责数量、依赖组件数 4 项指标对比表

### US-003: 一致性基线数据收集
**Project**: timorup

**As a** developer
**I want** 一份当前 UI 状态的量化基线
**So that** 后续重构 increment 可以衡量进度

**Acceptance Criteria**:
- [x] **AC-0159-US3-01**: 扫描 `src/pages/` 与 `src/components/`,输出 `ui-baseline-metrics.json` 包含:页面总数、自定义颜色 token 数、Tailwind 硬编码 px 实例数、缺少 `dark:` 变体的类数
- [x] **AC-0159-US3-02**: 基线数据用于在 PR 中作为 "before" 对照,后续 increment 0160+ 引用此基线

---

## Deliverables

| 文件 | 位置 | 说明 |
|------|------|------|
| `spec.md` | `.specweave/increments/0159-ui-ux-consistency-audit/` | 本文档 |
| `ui-consistency-report.md` | `.specweave/increments/0159-ui-ux-consistency-audit/reports/` | UI 一致性违规清单 |
| `island-split-recommendations.md` | `.specweave/increments/0159-ui-ux-consistency-audit/reports/` | Admin islands 拆分建议 |
| `ui-baseline-metrics.json` | `.specweave/increments/0159-ui-ux-consistency-audit/reports/` | 量化基线数据 |
| `plan.md` | 同 increment 根目录 | 技术方案(由 Architect 产出) |
| `tasks.md` | 同 increment 根目录 | 实施任务(由 Planner 产出) |

## Success Criteria

1. 3 份报告文件全部生成且内容可执行
2. 违规清单包含具体文件路径与行号
3. Admin islands 拆分建议标注优先级(P0/P1/P2)
4. 基线 JSON 字段完整,可被后续 increment 解析

## Out of Scope

- 任何 .astro/.tsx 组件的实际代码修改
- 任何 CSS 文件或 Tailwind config 变更
- 任何数据库迁移
- 任何部署操作

## Dependencies

- `src/pages/` 与 `src/components/` 目录结构稳定
- Fulldev UI 组件库文档可访问(用于识别 variants)
- GitNexus 索引最新(用于 symbol-level 影响分析)
