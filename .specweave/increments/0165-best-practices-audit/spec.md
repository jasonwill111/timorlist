---
increment: 0165
title: "Best Practices Audit — 安全 + Tech Stack 全面修复"
type: audit + refactor
priority: P0
status: completed
created: 2026-06-09
structure: user-stories
test_mode: test-after
coverage_target: 100
---

# Feature: Best Practices Audit — 安全 + Tech Stack 全面修复

## Overview

对 TimorUp 项目进行深度 best practices review，覆盖 Astro 6、better-auth 1.6、Tailwind v4、TypeScript 6、Cloudflare Workers 安全。修复发现的所有 High/Critical 问题。

## User Stories

### US-001: Middleware 安全 Headers 强化
**Project**: TimorUp

**As a** security reviewer
**I want** middleware 包含完整的 Cloudflare Workers 安全 headers
**So that** 防御 Spectre/协议降级/资源盗用攻击

**Acceptance Criteria**:
- [x] **AC-0165-US1-01**: 添加 `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`
- [x] **AC-0165-US1-02**: 添加 `Cross-Origin-Opener-Policy: same-origin`
- [x] **AC-0165-US1-03**: 添加 `Cross-Origin-Resource-Policy: same-origin`
- [x] **AC-0165-US1-04**: 移除 `X-XSS-Protection`（已废弃）
- [x] **AC-0165-US1-05**: 移除 `X-Frame-Options`（CSP `frame-ancestors 'none'` 已覆盖）
- [x] **AC-0165-US1-06**: 移除 `Pragma`/`Expires`（Cache-Control 已足够）
- [x] **AC-0165-US1-07**: 收紧 CSP `img-src`（`data:` + R2 bucket + site domain，无 `https:` `blob:` 宽泛匹配）

### US-002: 移除重复 CSRF 保护
**Project**: TimorUp

**As a** developer
**I want** 自定义 CSRF middleware 被移除
**So that** 不与 better-auth 双重验证导致误报

**Acceptance Criteria**:
- [x] **AC-0165-US2-01**: 删除 middleware 中的 origin 验证循环（better-auth `trustedOrigins` 已处理）
- [x] **AC-0165-US2-02**: Vite build 通过

### US-003: better-auth 配置修正
**Project**: TimorUp

**As a** developer
**I want** auth.ts 使用 idiom better-auth 1.6 配置
**So that** 符合框架预期行为

**Acceptance Criteria**:
- [x] **AC-0165-US3-01**: `withCloudflare()` 使用单个 config 对象（不是两个参数）
- [x] **AC-0165-US3-02**: 移除 `database: undefined`（better-auth 1.6 省略此 key）
- [x] **AC-0165-US3-03**: 移除 `secure: import.meta.env.PROD`（better-auth 从 baseURL 协议自动推导）
- [x] **AC-0165-US3-04**: Vite build 通过

### US-004: 移除 signIn 双重 rate limiting
**Project**: TimorUp

**As a** developer
**I want** signIn action 不重复 rate limiting
**So that** better-auth 内置规则生效，避免冲突

**Acceptance Criteria**:
- [x] **AC-0165-US4-01**: 删除 `signIn.ts` 中的 `checkRateLimit()` 调用
- [x] **AC-0165-US4-02**: 保留 better-auth `rateLimit` 内置配置（`sign-in/email`: 5次/60s）

### US-005: Layout 添加 ViewTransitions
**Project**: TimorUp

**As a** user
**I want** 页面间 SPA 导航
**So that** 减少全页面刷新，改善体验

**Acceptance Criteria**:
- [x] **AC-0165-US5-01**: `Layout.astro` 添加 `<ViewTransitions />`
- [x] **AC-0165-US5-02**: `AdminLayout.astro` 添加 `<ViewTransitions />`
- [x] **AC-0165-US5-03**: Astro 6 内置组件，无需 import 声明

### US-006: Tailwind 设计系统一致性
**Project**: TimorUp

**As a** developer
**I want** 所有组件使用设计 token 而非硬编码颜色
**So that** 主题一致性

**Acceptance Criteria**:
- [x] **AC-0165-US6-01**: `Header.astro` logout 按钮 `text-red-500` → `text-destructive`

---

## Full Audit Results

### ✅ 已通过 / 无需修改
| 分类 | 项目 | 状态 |
|---|---|---|
| Tailwind v4 | `@import "tailwindcss"` 语法 | ✅ PASS |
| Tailwind v4 | `@tailwindcss/vite` 插件配置 | ✅ PASS |
| Tailwind v4 | CSS variables + `@theme {}` 设计 token | ✅ PASS |
| TypeScript | `tsconfig.json` strict mode + 额外 hardening | ✅ PASS |
| TypeScript | Zod 3/4 patterns 兼容 | ✅ PASS |
| TypeScript | Path aliases `@/*` 正确配置 | ✅ PASS |
| better-auth | `d1Native` Kysely D1 原生驱动 | ✅ PASS |
| better-auth | `kv: env.SESSION` 原生消费 | ✅ PASS |
| better-auth | Session cookie `httpOnly + sameSite: strict` | ✅ PASS |
| better-auth | `geolocationTracking: false` + `autoDetectIpAddress: false` | ✅ PASS |
| Astro 6 | SSR `output: 'server'` + Cloudflare adapter | ✅ PASS |
| Astro 6 | Vite SSR external 配置 | ✅ PASS |
| Astro 6 | `@astrojs/cloudflare` 13.6.1（最新） | ✅ PASS |
| Astro 6 | `astro` 6.4.4（最新） | ✅ PASS |
| Cloudflare | `compatibility_flags` nodejs_compat_v2 | ✅ PASS |
| Cloudflare | R2 bucket `MEDIA_BUCKET` 配置 | ✅ PASS |

### ⚠️ 低优先级（未来处理）
| 项目 | 原因 | 建议 |
|---|---|---|
| `window as any` casts | Astro island script 中绕过 TS strict | 长期技术债务，批量修复成本高 |
| `as any` in action calls | 13+ occurrences across island files | 同上 |
| `text-red-500` 其他位置 | 仅 Header logout button | 已修复主引用 |
| Admin island SSR 同步 await | `getAdminStats()` + `getAdminOrders()` 同步阻塞 | 未来用 `server:defer` |
| CSP `nonce` 迁移 | Astro 7+ 支持 nonce-based CSP | 跟踪未来升级 |

---

## Dependencies

- 无（audit 结果，独立完成）

---

## Notes

- `ViewTransitions` 是 Astro 6 内置组件，在 `.astro` 文件中无需 import，直接使用 `<ViewTransitions />`
- `better-auth 1.6+` 的 `withCloudflare()` 只接受一个 config 对象，内部合并平台默认值
- Cloudflare Workers `HSTS` header 在边缘强制 HTTPS，降级攻击防护必需
- CSP `img-src` 从 `'self' data: https: blob:'` 收紧到 `'self' data: https://pub-timorup... https://timorup.com`，防止 data: URL XSS 载荷
