# Tasks: 0161 — 构建阻塞修复 + Auth Actions TypeScript

---

## US-001: 构建阻塞修复

### T-001:移除 @flue/runtime init import
**Satisfies ACs**: AC-0161-US1-01, AC-0161-US1-02
**Status**: [ ] pending
**Test**: Given `src/lib/ai/flue-bridge.ts` → When build run → Then no "init is not exported" error
**Files**: `src/lib/ai/flue-bridge.ts`

### T-002: 消除 @cloudflare/workers-types警告
**Satisfies ACs**: AC-0161-US1-03
**Status**: [ ] pending
**Test**: Given build output → When build run → Then no "uninstall @cloudflare/workers-types" warning
**Files**: `wrangler.jsonc`, `package.json`

---

## US-002: Auth Actions TypeScript

### T-003: 修复 signIn.ts rate limit API
**Satisfies ACs**: AC-0161-US2-01
**Status**: [ ] pending
**Test**: Given `npx tsc --noEmit` → When check `src/actions/auth/signIn.ts` → Then 0 HIGH errors
**Files**: `src/actions/auth/signIn.ts`

### T-004: 修复 signUp.ts rate limit API
**Satisfies ACs**: AC-0161-US2-02
**Status**: [ ] pending
**Test**: Given `npx tsc --noEmit` → When check `src/actions/auth/signUp.ts` → Then 0 HIGH errors
**Files**: `src/actions/auth/signUp.ts`

### T-005: 修复 forgotPassword.ts rate limit API
**Satisfies ACs**: AC-0161-US2-03
**Status**: [ ] pending
**Test**: Given `npx tsc --noEmit` → When check `src/actions/auth/forgotPassword.ts` → Then 0 HIGH errors
**Files**: `src/actions/auth/forgotPassword.ts`

### T-006: 修复 light-auth.ts Env.DB/SESSION
**Satisfies ACs**: AC-0161-US2-04
**Status**: [ ] pending
**Test**: Given `npx tsc --noEmit` → When check `src/actions/auth/light-auth.ts` → Then 0 HIGH errors
**Files**: `src/actions/auth/light-auth.ts`

### T-007: 修复 signOut.ts Env.SESSION
**Satisfies ACs**: AC-0161-US2-05
**Status**: [ ] pending
**Test**: Given `npx tsc --noEmit` → When check `src/actions/auth/signOut.ts` → Then 0 HIGH errors
**Files**: `src/actions/auth/signOut.ts`

### T-008: 修复 resetPassword.ts 参数数量
**Satisfies ACs**: AC-0161-US2-06
**Status**: [ ] pending
**Test**: Given `npx tsc --noEmit` → When check `src/actions/auth/resetPassword.ts` → Then 0 HIGH errors
**Files**: `src/actions/auth/resetPassword.ts`

### T-009: 修复 verifyEmail.ts 参数数量
**Satisfies ACs**: AC-0161-US2-07
**Status**: [ ] pending
**Test**: Given `npx tsc --noEmit` → When check `src/actions/auth/verifyEmail.ts` → Then 0 HIGH errors
**Files**: `src/actions/auth/verifyEmail.ts`

---

## US-003: Admin Actions TypeScript

### T-010: 修复 businesses.ts insert ownerId
**Satisfies ACs**: AC-0161-US3-01
**Status**: [ ] pending
**Test**: Given `npx tsc --noEmit` → When check `src/actions/admin/businesses.ts` → Then 0 HIGH errors
**Files**: `src/actions/admin/businesses.ts`

### T-011: 修复 servicePackagesAdmin.ts
**Satisfies ACs**: AC-0161-US3-02
**Status**: [ ] pending
**Test**: Given `npx tsc --noEmit` → When check `src/actions/admin/servicePackagesAdmin.ts` → Then 0 HIGH errors
**Files**: `src/actions/admin/servicePackagesAdmin.ts`

### T-012: 修复 listings.ts exactOptionalPropertyTypes
**Satisfies ACs**: AC-0161-US3-03
**Status**: [ ] pending
**Test**: Given `npx tsc --noEmit` → When check `src/actions/admin/listings.ts` → Then 0 HIGH errors
**Files**: `src/actions/admin/listings.ts`

### T-013: 修复 admin/auth/login.ts role 类型
**Satisfies ACs**: AC-0161-US3-04
**Status**: [ ] pending
**Test**: Given `npx tsc --noEmit` → When check `src/actions/admin/auth/login.ts` → Then 0 HIGH errors
**Files**: `src/actions/admin/auth/login.ts`

---

## US-004: Media Upload

### T-014: 修复 upload.ts FormData hash→has
**Satisfies ACs**: AC-0161-US4-01
**Status**: [ ] pending
**Test**: Given `npx tsc --noEmit` → When check `src/actions/media/upload.ts` → Then 0 HIGH errors
**Files**: `src/actions/media/upload.ts`

---

## Verification

### T-015: Build + TypeScript verification
**Satisfies ACs**: AC-0161-US1-01, AC-0161-US2-01, AC-0161-US2-02, AC-0161-US2-03, AC-0161-US2-04, AC-0161-US2-05, AC-0161-US2-06, AC-0161-US2-07, AC-0161-US3-01, AC-0161-US3-02, AC-0161-US3-03, AC-0161-US3-04, AC-0161-US4-01
**Status**: [ ] pending
**Test**: Given project → When `pnpm exec -- astro build` + `npx tsc --noEmit` run → Then build exit 0 and HIGH TS errors in actions/ = 0