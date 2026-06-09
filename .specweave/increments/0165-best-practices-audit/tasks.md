# Tasks: 0165 — Best Practices Audit + Security Fixes

---

## US-001: Middleware 安全 Headers 强化

### T-001: 重写 middleware.ts
**Satisfies ACs**: AC-0165-US1-01 ~ AC-0165-US1-07
**Status**: [x] completed
**Test**: Given `src/middleware.ts` → When file read → Then HSTS + COOP + CORP present, X-XSS-Protection absent, img-src tightened
**Files**: `src/middleware.ts`
**Commit**: (pending — part of this increment)

### T-002: 验证 CSP img-src 收紧
**Satisfies ACs**: AC-0165-US1-07
**Status**: [x] completed
**Test**: Given `middleware.ts` → When CSP header inspected → Then img-src excludes `https:` and `blob:`
**Files**: `src/middleware.ts`
**Commit**: (pending)

### T-003: 验证旧 headers 移除
**Satisfies ACs**: AC-0165-US1-04, AC-0165-US1-05, AC-0165-US1-06
**Status**: [x] completed
**Test**: Given `middleware.ts` → When grep for X-XSS-Protection/X-Frame-Options/Pragma → Then 0 matches
**Files**: `src/middleware.ts`
**Commit**: (pending)

---

## US-002: 移除重复 CSRF 保护

### T-004: 删除 CSRF origin 验证循环
**Satisfies ACs**: AC-0165-US2-01, AC-0165-US2-02
**Status**: [x] completed
**Test**: Given `src/middleware.ts` → When origin validation block searched → Then not found; `rg 'mutationMethods\|CSRF\|isTrusted' src/middleware.ts` returns 0
**Files**: `src/middleware.ts`
**Commit**: (pending)

---

## US-003: better-auth 配置修正

### T-005: 修复 withCloudflare 参数结构
**Satisfies ACs**: AC-0165-US3-01, AC-0165-US3-02, AC-0165-US3-03, AC-0165-US3-04
**Status**: [x] completed
**Test**: Given `src/lib/auth.ts` → When build → Then exit 0; `withCloudflare()` called with single config object
**Files**: `src/lib/auth.ts`
**Commit**: (pending)

---

## US-004: 移除 signIn 双重 rate limiting

### T-006: 删除 checkRateLimit 调用
**Satisfies ACs**: AC-0165-US4-01, AC-0165-US4-02
**Status**: [x] completed
**Test**: Given `src/actions/auth/signIn.ts` → When `rg 'checkRateLimit' src/actions/auth/signIn.ts` → Then 0 matches
**Files**: `src/actions/auth/signIn.ts`
**Commit**: (pending)

---

## US-005: Layout 添加 ViewTransitions

### T-007: 添加 ViewTransitions 到 Layout.astro
**Satisfies ACs**: AC-0165-US5-01, AC-0165-US5-03
**Status**: [x] completed
**Test**: Given `src/layouts/Layout.astro` → When grep 'ViewTransitions' → Then `<ViewTransitions />` found in head
**Files**: `src/layouts/Layout.astro`
**Commit**: (pending)

### T-008: 添加 ViewTransitions 到 AdminLayout.astro
**Satisfies ACs**: AC-0165-US5-02, AC-0165-US5-03
**Status**: [x] completed
**Test**: Given `src/layouts/AdminLayout.astro` → When grep 'ViewTransitions' → Then `<ViewTransitions />` found in head
**Files**: `src/layouts/AdminLayout.astro`
**Commit**: (pending)

---

## US-006: Tailwind 设计系统一致性

### T-009: 修复 logout 按钮颜色 token
**Satisfies ACs**: AC-0165-US6-01
**Status**: [x] completed
**Test**: Given `src/components/Header.astro` → When line 131 grep 'text-red-500' → Then 0 matches
**Files**: `src/components/Header.astro`
**Commit**: (pending)

---

## Verification

### T-010: Full build verification
**Satisfies ACs**: AC-0165-US2-02, AC-0165-US3-04, AC-0165-US4-02
**Status**: [x] completed
**Test**: Given project → When `pnpm build` run → Then "vite ✓ built in 3m 32s", exit 0
**Command**: `pnpm build`
**Result**: Pass — "vite ✓ built in 3m 32s", no errors
