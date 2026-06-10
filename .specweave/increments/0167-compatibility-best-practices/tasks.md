---
increment: 0167
title: "Platform Best Practices — compatibility_date + Astro 6 features + auth API fix"
status: completed
priority: P0
created: 2026-06-10
---

## Tasks

### Phase: Platform Config

- [x] **T-0167-01**: 更新 `wrangler.jsonc` `compatibility_date` → `2026-06-09`，移除冗余 flags
- [x] **T-0167-02**: 添加 `observability.logs.enabled` + `observability.tracing.enabled` 到 `wrangler.jsonc`
- [x] **T-0167-03**: 添加 `experimental.queuedRendering` + `security.*` 选项到 `astro.config.mjs`
- [x] **T-0167-04**: 修复 `src/lib/auth.ts` `withCloudflare()` 双参数 API
- [x] **T-0167-05**: 添加 `advanced.ipAddress.ipAddressHeaders` + `backgroundTasks.handler`
- [x] **T-0167-06**: 验证 Astro build 通过（`✓ Complete in 3m 30s`，astro@6.4.5 + @astrojs/cloudflare@13.7.0 + @tailwindcss/vite@4.3.0）
### Phase: Documentation

- [x] **T-0167-07**: 创建 `.specweave/increments/0167-compatibility-best-practices/spec.md`
- [x] **T-0167-08**: 提交所有变更

---

## Verification

```bash
pnpm astro build  # ✓ built in 2m 44s
```

## Test Plan

Given the platform nature of these changes (wrangler config + Astro config + auth.ts):
- **Build verification**: `pnpm astro build` passes without errors
- **wrangler types**: Generated correctly with `compatibility_date: 2026-06-09`
- **Server prerendering**: Static routes (`/404.html`, `/about`, `/faq`, `/privacy`, `/terms`) rendered without error