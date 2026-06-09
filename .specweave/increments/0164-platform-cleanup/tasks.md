# Tasks: 0164 — Platform Cleanup

---

## US-001: 删除 auth-kv-store.ts 死代码

### T-001: 删除 auth-kv-store.ts
**Satisfies ACs**: AC-0164-US1-01, AC-0164-US1-02, AC-0164-US1-03
**Status**: [x] completed
**Test**: Given `src/lib/auth-kv-store.ts` → When file listed → Then not found; `rg 'auth-kv-store' src/` returns 0 matches
**Files**: `src/lib/auth-kv-store.ts` (deleted)
**Commit**: b4f1f148

### T-002: 验证无引用
**Satisfies ACs**: AC-0164-US1-02
**Status**: [x] completed
**Test**: Given `rg 'auth-kv-store' src/` → When search → Then 0 matches
**Command**: `rg 'auth-kv-store' src/`
**Result**: 0 matches
**Commit**: b4f1f148

---

## US-002: 修复 imageService 配置

### T-003: 更新 imageService 为 cloudflare-binding
**Satisfies ACs**: AC-0164-US2-01, AC-0164-US2-02
**Status**: [x] completed
**Test**: Given `astro.config.mjs` → When file read → Then `imageService: 'cloudflare-binding'`
**Files**: `astro.config.mjs`
**Commit**: b4f1f148

---

## Verification

### T-004: Build verification
**Satisfies ACs**: AC-0164-US1-03, AC-0164-US2-02
**Status**: [x] completed
**Test**: Given project → When `pnpm build` run → Then exit 0
**Command**: `pnpm build`
**Result**: Pass — "vite ✓ built in 42.42s", no errors introduced
