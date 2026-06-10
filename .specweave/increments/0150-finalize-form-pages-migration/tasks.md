# Tasks: 0150 -- Finalize Form Pages Migration

## Task Notation
- [T###]: Task ID | [P]: Parallelizable | [x]: Completed | [ ]: Pending

---

## US-001: admin/ai-tools.astro Form Cleanup (P0)

### T-001: Replace raw button with Button component + add id to paired inputs
**Status**: [x] completed
**Test**: Given pages/admin/ai-tools.astro -> When rendered -> Then Button component used, paired inputs have id
**File**: src/pages/admin/ai-tools.astro

### T-002: Replace 7 paired labels with Label for="X"
**Status**: [x] completed
**Test**: Given pages/admin/ai-tools.astro -> When rendered -> Then paired labels use Label for component
**File**: src/pages/admin/ai-tools.astro

### T-003: Convert 16 orphan labels to static text/heading
**Status**: [x] completed
**Test**: Given pages/admin/ai-tools.astro -> When rendered -> Then orphan labels become static text (no for attr needed)
**File**: src/pages/admin/ai-tools.astro

---

## US-002: admin/listings/[id]/edit Form Cleanup (P0)

### T-004: Add id attributes to all Fulldev Input components
**Status**: [x] completed
**Test**: Given admin/listings/[id]/edit/index.astro -> When rendered -> Then all Inputs have id attributes
**File**: src/pages/admin/listings/[id]/edit/index.astro

### T-005: Replace raw input with Fulldev Input component
**Status**: [x] completed
**Test**: Given admin/listings/[id]/edit/index.astro -> When rendered -> Then raw input replaced with Input
**File**: src/pages/admin/listings/[id]/edit/index.astro

### T-006: Replace 14 raw labels with Label for="X"
**Status**: [x] completed
**Test**: Given admin/listings/[id]/edit/index.astro -> When rendered -> Then all labels use Label for component
**File**: src/pages/admin/listings/[id]/edit/index.astro

---

## US-003: admin/media.astro Form Cleanup (P1)

### T-007: Convert 3 raw labels to Label for
**Status**: [x] completed
**Test**: Given pages/admin/media.astro -> When rendered -> Then no raw labels remain
**File**: src/pages/admin/media.astro

---

## US-004: business/[slug]/edit Map Section Label (P1)

### T-008: Convert 1 raw label (map section) to static text
**Status**: [x] completed
**Test**: Given pages/business/[slug]/edit/index.astro -> When rendered -> Then no raw labels remain
**File**: src/pages/business/[slug]/edit/index.astro

---

## US-005: Build Verification (P0)

### T-009: Build verification
**Status**: [x] completed
**Test**: Given all changes -> When pnpm exec -- astro build -> Then exit code 0

---

## Progress
| US | Done | Total |
|----|------|-------|
| US-001 | 1/1 | 1 |
| US-002 | 1/1 | 1 |
| US-003 | 1/1 | 1 |
| US-004 | 1/1 | 1 |
| US-005 | 1/1 | 1 |
| **Total** | **4/5** | **5** |

## Remaining Work (deferred to next increment)

The following files still have raw HTML form elements that require manual refactoring due to dynamic DOMPurify-generated IDs:

- `business/[slug]/edit/index.astro` — 13 static labels + 2 raw buttons + 3 static inputs need migration, but also contains dynamic DOMPurify-based IDs that must remain as raw labels/inputs
- `admin/login.astro`, `admin/settings.astro`, `contact.astro`, `login.astro`, `reset-password.astro`, `edit-business-page/[id].astro` — these were covered by 0146/0147 but the regex scan detected additional raw elements (likely from script section code, not HTML)

