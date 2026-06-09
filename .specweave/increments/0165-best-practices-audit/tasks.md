# Tasks: 0165 — Best Practices Audit + Security Fixes

---

## US-001: Middleware 安全 Headers 强化

### T-001: 重写 middleware.ts
**Satisfies ACs**: AC-0165-US1-01 ~ AC-0165-US1-07
**Status**: [x] completed
**Test**: Given `src/middleware.ts` → When file read → Then HSTS + COOP + CORP present, X-XSS-Protection absent
**Files**: `src/middleware.ts`
**Commit**: 2e25f0d5

---

## US-002: 移除重复 CSRF 保护

### T-002: 删除 CSRF origin 验证循环
**Satisfies ACs**: AC-0165-US2-01, AC-0165-US2-02
**Status**: [x] completed
**Test**: Given `src/middleware.ts` → When grep for mutationMethods/CSRF → Then 0 matches
**Files**: `src/middleware.ts`
**Commit**: 2e25f0d5

---

## US-003: better-auth 配置修正

### T-003: 修复 withCloudflare 参数结构
**Satisfies ACs**: AC-0165-US3-01, AC-0165-US3-02, AC-0165-US3-03, AC-0165-US3-04
**Status**: [x] completed
**Test**: Given `src/lib/auth.ts` → When build → Then exit 0
**Files**: `src/lib/auth.ts`
**Commit**: 2e25f0d5

---

## US-004: 移除 auth actions 双重 rate limiting

### T-004: 删除 signIn checkRateLimit
**Satisfies ACs**: AC-0165-US4-01
**Status**: [x] completed
**Files**: `src/actions/auth/signIn.ts`
**Commit**: 2e25f0d5

### T-005: 删除 signUp checkRateLimit
**Satisfies ACs**: AC-0165-US4-01
**Status**: [x] completed
**Files**: `src/actions/auth/signUp.ts`
**Commit**: (pending — part of follow-up commit)

### T-006: signOut secure hardcode → import.meta.env.PROD
**Satisfies ACs**: (build correctness)
**Status**: [x] completed
**Files**: `src/actions/auth/signOut.ts`
**Commit**: (pending — part of follow-up commit)

---

## US-005: Layout 添加 ViewTransitions

### T-007: 添加 ViewTransitions 到 Layout.astro
**Satisfies ACs**: AC-0165-US5-01
**Status**: [x] completed
**Files**: `src/layouts/Layout.astro`
**Commit**: 2e25f0d5

### T-008: 添加 ViewTransitions 到 AdminLayout.astro
**Satisfies ACs**: AC-0165-US5-02
**Status**: [x] completed
**Files**: `src/layouts/AdminLayout.astro`
**Commit**: 2e25f0d5

---

## US-006: Tailwind 设计系统一致性

### T-009: 修复 logout 按钮颜色 token
**Satisfies ACs**: AC-0165-US6-01
**Status**: [x] completed
**Files**: `src/components/Header.astro`
**Commit**: 2e25f0d5

---

## US-007: tsconfig.json 清理

### T-010: 移除 @cloudflare/workers-types
**Satisfies ACs**: (wrangler types generated at build time)
**Status**: [x] completed
**Files**: `tsconfig.json`
**Commit**: (pending — part of follow-up commit)

---

## Verification

### T-011: Full build verification
**Status**: [x] completed
**Command**: `pnpm build`
**Result**: Pass — "vite ✓ built in 3m 36s", exit 0
