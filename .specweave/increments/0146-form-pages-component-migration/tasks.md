# Tasks: 0146 -- Form Pages Component Migration

## Task Notation
- [T###]: Task ID | [P]: Parallelizable | [x]: Completed | [ ]: Pending

---

## US-001: admin/ai-tools.astro Form Migration (P0)

### T-001: Replace raw button with Button component
**Status**: [x] completed
**Test**: Given pages/admin/ai-tools.astro -> When page renders -> Then all buttons are Button components
**File**: src/pages/admin/ai-tools.astro

### T-002: Replace raw input with Input component
**Status**: [x] completed
**Test**: Given pages/admin/ai-tools.astro -> When page renders -> Then all inputs are Input components
**File**: src/pages/admin/ai-tools.astro

### T-003: Replace raw select/textarea/label
**Status**: [x] completed
**Test**: Given pages/admin/ai-tools.astro -> When page renders -> Then all selects/textarea/labels are Fulldev components
**File**: src/pages/admin/ai-tools.astro

---

## US-002: admin/listings/[id]/edit Migration (P0)

### T-004: Replace raw form controls with Fulldev components
**Status**: [x] completed
**Test**: Given pages/admin/listings/[id]/edit/index.astro -> When form renders -> Then all controls are Fulldev
**File**: src/pages/admin/listings/[id]/edit/index.astro

---

## US-003: business/[slug]/edit Migration (P1)

### T-005: Replace raw form controls
**Status**: [x] completed
**Test**: Given pages/business/[slug]/edit/index.astro -> When form renders -> Then all controls are Fulldev
**File**: src/pages/business/[slug]/edit/index.astro

---

## US-004: business/[slug]/product Migration (P1)

### T-006: Replace raw form controls in new/edit pages
**Status**: [x] completed
**Test**: Given product pages -> When forms render -> Then all controls are Fulldev
**File**: src/pages/business/[slug]/product/new/index.astro, src/pages/business/[slug]/product/[id]/edit/index.astro

---

## US-005: edit-business-page/[id] Migration (P1)

### T-007: Replace raw form controls
**Status**: [x] completed
**Test**: Given pages/edit-business-page/[id].astro -> When form renders -> Then all controls are Fulldev
**File**: src/pages/edit-business-page/[id].astro

---

## US-006: Build + Function Verification (P0)

### T-008: Build verification
**Status**: [x] completed
**Test**: Given all changes -> When pnpm exec -- astro build -> Then exit code 0

---

## Progress
| US | Done | Total |
|----|------|-------|
| US-001 | 0/3 | 3 |
| US-002 | 0/1 | 1 |
| US-003 | 0/1 | 1 |
| US-004 | 0/1 | 1 |
| US-005 | 0/1 | 1 |
| US-006 | 0/1 | 1 |
| **Total** | **0/8** | **8** |
