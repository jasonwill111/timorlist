---
increment: 0161-build-fix-actions-ts
title: "构建阻塞修复 + Auth Actions TypeScript"
type: feature
priority: P0
status: in-progress
created: 2026-06-09
structure: user-stories
test_mode: test-after
coverage_target: 100
---

# Feature: 构建阻塞修复 + Auth Actions TypeScript

## Overview

项目构建失败（`astro build` exit 1），原因：
1. `@flue/runtime` API错用 — 不存在 `init` 函数
2. Auth actions 中 `checkAuthRateLimit()` 返回类型错用（`.allowed` / `.resetIn` 属性不存在）
3. `Env.DB` / `Env.SESSION` 在 `light-auth.ts` 中缺失
4. Drizzle insert 缺 `ownerId`
5. `exactOptionalPropertyTypes` 类型严格性冲突
6. Media upload FormData `.hash` 应为 `.has`

**目标**：`pnpm exec -- astro build` exit 0，`npx tsc --noEmit` HIGH 错误归零。

---

## User Stories

### US-001: 构建阻塞修复
**Project**: TimorUp

**As a** developer
**I want** `astro build` 能够成功完成
**So that** 项目可以部署到 Cloudflare Workers

**Acceptance Criteria**:
- [ ] **AC-0161-US1-01**: `pnpm exec -- astro build` exit 0，无 ERROR 输出
- [ ] **AC-0161-US1-02**: `@flue/runtime` 错误移除（`src/lib/ai/flue-bridge.ts`）
- [ ] **AC-0161-US1-03**: `@cloudflare/workers-types` 警告消除

### US-002: Auth Actions TypeScript 修复
**Project**: TimorUp

**As a** developer
**I want** auth actions 无 TypeScript HIGH 错误
**So that** 类型安全且可维护

**Acceptance Criteria**:
- [ ] **AC-0161-US2-01**: `src/actions/auth/signIn.ts` — `checkAuthRateLimit()` 返回类型正确
- [ ] **AC-0161-US2-02**: `src/actions/auth/signUp.ts` — 同上
- [ ] **AC-0161-US2-03**: `src/actions/auth/forgotPassword.ts` — 同上
- [ ] **AC-0161-US2-04**: `src/actions/auth/light-auth.ts` — `Env.DB` / `Env.SESSION` 绑定正确
- [ ] **AC-0161-US2-05**: `src/actions/auth/signOut.ts` — `Env.SESSION` 绑定正确
- [ ] **AC-0161-US2-06**: `src/actions/auth/resetPassword.ts` — 参数数量正确
- [ ] **AC-0161-US2-07**: `src/actions/auth/verifyEmail.ts` — 参数数量正确

### US-003: Admin Actions TypeScript 修复
**Project**: TimorUp

**As a** developer
**I want** admin actions 无 HIGH 错误
**So that** 数据操作类型安全

**Acceptance Criteria**:
- [ ] **AC-0161-US3-01**: `src/actions/admin/businesses.ts` — insert 缺 `ownerId` 已补
- [ ] **AC-0161-US3-02**: `src/actions/admin/servicePackagesAdmin.ts` — 缺字段 + 类型错误
- [ ] **AC-0161-US3-03**: `src/actions/admin/listings.ts` — `exactOptionalPropertyTypes` 类型调整
- [ ] **AC-0161-US3-04**: `src/actions/admin/auth/login.ts` — role 类型匹配

### US-004: Media Upload TypeScript 修复
**Project**: TimorUp

**As a** developer
**I want** media upload action 无类型错误
**So that** 文件上传功能类型安全

**Acceptance Criteria**:
- [ ] **AC-0161-US4-01**: `src/actions/media/upload.ts` — FormData `.hash` → `.has` 修正

---

## Out of Scope

- 不修改 `@flue/runtime` 的实际 AI 功能（只移除阻塞 build 的 import）
- 不修 MEDIUM/LOW 级别 TS 错误（留待 0167）
- 不修改 islands 或 pages 文件
- 不修 `src/actions/account/index.ts`（独立问题，留待 0162）

---

## Dependencies

- 无（独立 P0 修复任务）