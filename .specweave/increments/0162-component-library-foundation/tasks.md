# Tasks: 0162 — Component Library Foundation

---

## US-001: 删除 starwind 废弃组件

### T-001: 删除 starwind/button
**Satisfies ACs**: AC-0162-US1-01, AC-0162-US1-03
**Status**: [x] completed
**Test**: Given `src/components/starwind/button/` → When directory listed → Then not found
**Files**: `src/components/starwind/button/` (deleted)
**Commit**: 1d303ae1

### T-002: 删除 starwind/input
**Satisfies ACs**: AC-0162-US1-02, AC-0162-US1-03
**Status**: [x] completed
**Test**: Given `src/components/starwind/input/` → When directory listed → Then not found
**Files**: `src/components/starwind/input/` (deleted)
**Commit**: 8b4f6ded (confirmed deleted prior to this increment)

---

## US-002: starwind/pagination 迁移到 fulldev buttonVariants

### T-003: 更新 PaginationLink.astro
**Satisfies ACs**: AC-0162-US2-01, AC-0162-US2-04
**Status**: [x] completed
**Test**: Given `PaginationLink.astro` → When build → Then no import errors
**Files**: `src/components/starwind/pagination/PaginationLink.astro`
**Change**: `import { ButtonVariants } from "@/components/starwind/button"` → `import { buttonVariants } from "@/components/fulldev/button"`
**Commit**: 1d303ae1

### T-004: 更新 PaginationNext.astro
**Satisfies ACs**: AC-0162-US2-02, AC-0162-US2-04
**Status**: [x] completed
**Test**: Given `PaginationNext.astro` → When build → Then no import errors
**Files**: `src/components/starwind/pagination/PaginationNext.astro`
**Change**: Uses `buttonVariants` from fulldev instead of starwind button
**Commit**: 1d303ae1

### T-005: 更新 PaginationPrevious.astro
**Satisfies ACs**: AC-0162-US2-03, AC-0162-US2-04
**Status**: [x] completed
**Test**: Given `PaginationPrevious.astro` → When build → Then no import errors
**Files**: `src/components/starwind/pagination/PaginationPrevious.astro`
**Change**: Uses `buttonVariants` from fulldev instead of starwind button
**Commit**: 1d303ae1

---

## US-003: starwind/color-picker 迁移到 fulldev 组件

### T-006: 更新 ColorPicker.astro imports
**Satisfies ACs**: AC-0162-US3-01, AC-0162-US3-02, AC-0162-US3-03
**Status**: [x] completed
**Test**: Given `ColorPicker.astro` → When build → Then no import errors
**Files**: `src/components/starwind/color-picker/ColorPicker.astro`
**Change**: `import { Button } from "@/components/starwind/button"` → fulldev; `import { Input } from "@/components/starwind/input"` → fulldev
**Commit**: 1d303ae1

---

## US-004: 更新 component-standards.md 文档

### T-007: 重写 component-standards.md v2.0
**Satisfies ACs**: AC-0162-US4-01, AC-0162-US4-02, AC-0162-US4-03
**Status**: [x] completed
**Test**: Given `docs/internal/design-system/component-standards.md` → When file read → Then paths correct and 13 starwind components listed
**Files**: `docs/internal/design-system/component-standards.md`
**Change**: Full rewrite — actual paths, 13 active starwind components, deleted components section
**Commit**: 1d303ae1

---

## Verification

### T-008: Build verification
**Satisfies ACs**: AC-0162-US1-03, AC-0162-US2-04, AC-0162-US3-03
**Status**: [x] completed
**Test**: Given project → When `pnpm build` run → Then Vite build success ("vite ✓ built in 1m39s")
**Command**: `pnpm build`
**Result**: Pass — Vite build successful, no errors introduced by these changes
