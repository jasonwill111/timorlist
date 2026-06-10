---
increment: 0167
title: "Platform Best Practices — compatibility_date + Astro 6 features + auth API fix"
type: refactor
priority: P0
status: completed
created: 2026-06-10
structure: user-stories
test_mode: test-after
coverage_target: 100
---

# Feature: Platform Best Practices — compatibility_date + Astro 6 features + auth API fix

在官方文档核对后，对 `wrangler.jsonc`、`astro.config.mjs`、`src/lib/auth.ts` 进行 5 项修复，全部 build 验证通过（`✓ Complete in 3m 30s`，astro@6.4.5 + @astrojs/cloudflare@13.7.0）。

## User Stories

### US-001: 更新 compatibility_date 到今日最新
**Project**: TimorUp

**As a** platform engineer
**I want** `compatibility_date` 设为最新日期
**So that** 获得最新运行时特性、bug 修复、安全补丁

**Acceptance Criteria**:
- [x] **AC-0167-US1-01**: `wrangler.jsonc` `compatibility_date` 更新到 `2026-06-09`
- [x] **AC-0167-US1-02**: 移除 `nodejs_compat_v2` 和 `nodejs_compat_populate_process_env` 标志（`nodejs_compat` 足够，新日期默认启用 v2）

### US-002: 启用 Cloudflare Workers 自动追踪
**Project**: TimorUp

**As a** developer
**I want** Worker 请求链路可在 Cloudflare Dashboard 查看
**So that** 调试跨 Worker 请求流（service bindings / Durable Objects）

**Acceptance Criteria**:
- [x] **AC-0167-US2-01**: `wrangler.jsonc` 添加 `observability.logs.enabled` + `observability.tracing.enabled`

### US-003: 添加 Astro 6 security 选项
**Project**: TimorUp

**As a** security reviewer
**I want** Astro 6 安全选项全部配置
**So that** 防御 Host header injection 和请求体放大攻击

**Acceptance Criteria**:
- [x] **AC-0167-US3-01**: `astro.config.mjs` 添加 `security.allowedDomains`（防 `X-Forwarded-Host` 注入）
- [x] **AC-0167-US3-02**: 添加 `security.actionBodySizeLimit: 2 * 1024 * 1024`（2MB）
- [x] **AC-0167-US3-03**: 添加 `security.serverIslandBodySizeLimit: 2 * 1024 * 1024`

### US-004: 启用 Astro 6 experimental queuedRendering
**Project**: TimorUp

**As a** platform engineer
**I want** 使用 Astro 6 新渲染引擎（未来默认）
**So that** 更内存高效的深度优先队列渲染

**Acceptance Criteria**:
- [x] **AC-0167-US4-01**: `astro.config.mjs` 添加 `experimental.queuedRendering.enabled: true`
- [x] **AC-0167-US4-02**: `poolSize: 2000`

### US-005: 修复 withCloudflare API 调用
**Project**: TimorUp

**As a** developer
**I want** `withCloudflare()` 使用正确的两参数 API
**So that** build 不报语法错误

- [x] **AC-0167-US5-01**: `withCloudflare(cloudflareOptions, betterAuthOptions)` 双参数调用
- [x] **AC-0167-US5-02**: Cloudflare 选项（`d1Native`, `kv`, `geolocationTracking`, `autoDetectIpAddress`）在第一个参数
- [x] **AC-0167-US5-03**: Better Auth 选项（`baseURL`, `emailAndPassword`, `session`, `trustedOrigins` 等）在第二个参数
- [x] **AC-0167-US5-04**: Astro Vite build 通过（`✓ Complete in 3m 30s`，astro@6.4.5 + @astrojs/cloudflare@13.7.0 + @tailwindcss/vite@4.3.0）

### US-006: 配置 better-auth IP 提取和后台任务
**Project**: TimorUp

**As a** developer
**I want** better-auth 原生使用 `cf-connecting-ip` 头提取 IP
**So that** 非关键操作（清理/邮件/rate limit）使用 `waitUntil` 后台执行

**Acceptance Criteria**:
- [x] **AC-0167-US6-01**: `advanced.ipAddress.ipAddressHeaders: ['cf-connecting-ip']`
- [x] **AC-0167-US6-02**: `advanced.backgroundTasks.handler` 使用 `ctx.waitUntil()` 挂载非阻塞任务
- [x] **AC-0167-US6-03**: 移除 API 路由中的手写 `getClientIP()` 函数（better-auth 原生处理）

---

## Dependencies

- 依赖 `0165-best-practices-audit`（中间件安全头已完成）

---

## Notes

- `withCloudflare(cloudflareOptions, betterAuthOptions)` 是正确 API 签名，0165 spec 中的描述（单参数合并）有误，已在本 increment 修正
- wrangler 4.x 对 `observability.tracing` 有 warning 但不阻止 build（字段尚未完全支持旧版 wrangler）
- `experimental.queuedRendering` 是 Astro 6 未来默认渲染器，当前为实验性

---

## External References

- [Cloudflare Workers Best Practices (2026-02-15)](https://developers.cloudflare.com/workers/best-practices/workers-best-practices/)
- [Astro 6 Experimental: queuedRendering](https://docs.astro.build/en/reference/experimental-flags/queued-rendering/)
- [Astro 6 security.allowedDomains](https://docs.astro.build/en/reference/configuration-reference/#securityalloweddomains)
- [better-auth backgroundTasks](https://better-auth.com/docs/reference/options#backgroundtasks)