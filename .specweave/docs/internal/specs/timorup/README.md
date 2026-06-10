# TimorLink - Specifications

Feature specifications for **TimorLink**.

## Core Architecture

- [Entity Tables Migration](entity-tables-migration.md) �?4 separate entity tables, independent APIs, UI/UX updates (2026-05-11)

## Features

Features are organized by ID: `FS-XXX/`

Each feature folder contains:
- `FEATURE.md` - Feature overview and implementation history
- `us-XXX-*.md` - User story files

## Creating Features

Features are automatically created when you sync increments:

```bash
sw:sync-docs
```

Or sync a specific increment:

```bash
sw:sync-docs 0001
```

## Active Features

- [FS-042: Listing Schema & Plans](FS-042/FEATURE.md)
- [FS-043: Listing Frontend Routes](FS-043/FEATURE.md)
- [FS-044: Listing Admin Pages](FS-044/FEATURE.md)
- [FS-045: Header and Pricing Updates](FS-045/FEATURE.md)
- [FS-046: Account Page Updates](FS-046/FEATURE.md)
- [FS-047: Entity Detail Pages](FS-047/FEATURE.md)
- [FS-049: Admin Auth Cookie + Middleware](FS-049/FEATURE.md)
- [FS-050: Rate Limiter KV Storage](FS-050/FEATURE.md)
- [FS-051: Better Auth KV Session Cache](FS-051/FEATURE.md)
- [FS-052: REST API Cleanup](FS-052/FEATURE.md)
- [FS-053: Motion Animations Enhancement](FS-053/FEATURE.md)
- [FS-054: Mobile-First Responsive Design](FS-054/FEATURE.md)
- [FS-055: Price Fields Format Unification](FS-055/FEATURE.md)
- [FS-056: Homepage Redesign Tabs](FS-056/FEATURE.md)
- [FS-057: Astro Server Islands Optimization](FS-057/FEATURE.md)
- [FS-058: Code Quality Cleanup P0](FS-058/FEATURE.md)
- [FS-059: Performance Optimization - 0059](FS-059/FEATURE.md)
- [FS-066: TypeScript Type Errors Fix](FS-066/FEATURE.md)
- [FS-069: Feature: Refactor Product Config Module](FS-069/FEATURE.md)
- [FS-070: Feature: Migrate REST APIs to Server Actions](FS-070/FEATURE.md)
- [FS-071: Lucide Icons & Motion Animation Integration](FS-071/FEATURE.md)
- [FS-072: Feature: Form Validation & State Enhancement](FS-072/FEATURE.md)
- [FS-073: Feature: Loading States & Color Contrast Fix](FS-073/FEATURE.md)
- [FS-084: Production Readiness Fixes](FS-084/FEATURE.md)
- [FS-067: D1 Database Schema Fix](FS-067/FEATURE.md)
- [FS-068: Admin UI Fix](FS-068/FEATURE.md)
- [FS-078: UI/UX Optimization](FS-078/FEATURE.md)
- [FS-099: Unified Card Rendering + Container Width Standardization](FS-099/FEATURE.md)
- [FS-140: Starwind UI Installation](FS-140/FEATURE.md)
- [FS-141: Marketing Pages to Fulldev Blocks](FS-141/FEATURE.md)
- [FS-142: Slug Pages — Business Logic Extraction](FS-142/FEATURE.md)
- [FS-145: 安装 Fulldev + Legacy 清理 + XSS 审计](FS-145/FEATURE.md)
- [FS-144: Starwind集成 + 双库风格协调](FS-144/FEATURE.md)
- [FS-147: Remaining pages component migration -- auth/dashboard/contact/search](FS-147/FEATURE.md)
- [FS-149: Query cleanup -- delete unused query files](FS-149/FEATURE.md)
- [FS-146: Form pages component migration -- Fulldev replaces raw HTML](FS-146/FEATURE.md)
- [FS-148: List pages data layer extraction -- frontmatter queries to lib/db/queries](FS-148/FEATURE.md)
- [FS-150: Finalize Form Pages Migration](FS-150/FEATURE.md)
- [FS-151: Extract business/[slug].astro data layer](FS-151/FEATURE.md)
- [FS-152: Extract account + dashboard + search data layer](FS-152/FEATURE.md)
- [FS-153: Extract remaining pages data layer](FS-153/FEATURE.md)
- [FS-154: Starwind deprecation + UI/业务分离验收](FS-154/FEATURE.md)
- [FS-107: API Layer Consolidation](FS-107/FEATURE.md)
- [FS-138: Admin Security + Island Migration](FS-138/FEATURE.md)
- [FS-104: Lib Consolidation - Foundation Layer](FS-104/FEATURE.md)
- [FS-105: UI Component Migration - Batch 1 (Safe Components)](FS-105/FEATURE.md)
- [FS-106: UI Component Migration - Batch 2 (High Impact Components)](FS-106/FEATURE.md)
- [FS-139: Fulldev + Starwind Migration](FS-139/FEATURE.md)
- [FS-156: Data Layer Extraction — Query Functions](FS-156/FEATURE.md)
- [FS-155: Flue Framework Migration - Replace Direct API Calls](FS-155/FEATURE.md)
- [FS-108: UI Component Library Hardening](FS-108/FEATURE.md)
- [FS-109: Auth Forms Migration to FormField](FS-109/FEATURE.md)
- [FS-110: Admin Pages UI Component Migration](FS-110/FEATURE.md)
- [FS-111: Business + Public Pages UI Component Migration](FS-111/FEATURE.md)
- [FS-112: UI/Business Separation Audit + Final Cleanup](FS-112/FEATURE.md)
- [FS-137: Admin innerHTML Migration to Astro Components](FS-137/FEATURE.md)
- [FS-143: Admin Pages — Island Migration](FS-143/FEATURE.md)
- [FS-157: Complete UI/Business Separation — Astro Native Components](FS-157/FEATURE.md)
- [FS-158: 路径别名统一 + 组件分工规范建立](FS-158/FEATURE.md)
- [FS-159: UI/UX 风格一致性审查 + Admin Islands 评估](FS-159/FEATURE.md)

---

Last updated: 2026-05-31

