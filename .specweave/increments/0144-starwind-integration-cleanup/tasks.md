# Tasks: 0144 -- Starwind Integration + Dual Library Coordination

## Task Notation
- [T###]: Task ID | [P]: Parallelizable | [x]: Completed | [ ]: Pending

---

## US-001: PascalCase Legacy Cleanup (0145 inherited) (P0)

### T-001: PascalCase files already deleted by 0145
**Status**: [x] completed
**Note**: 0145 deleted 15 PascalCase files and fixed 5 import files

---

## US-002: Starwind Toast in Auth Flows (P1)

### T-002: Mount Toaster in Layout
**Status**: [x] completed
**Test**: Given src/layouts/Layout.astro -> When <Toaster> mounted -> Then toast() calls work
**File**: src/layouts/Layout.astro

### T-003: Add toast to login.astro success/error
**Status**: [x] completed
**Test**: Given pages/login.astro -> When login success -> Then toast.success() fires
**File**: src/pages/login.astro

### T-004: Add toast to register.astro success/error
**Status**: [x] completed
**Test**: Given pages/register.astro -> When register success -> Then toast.success() fires
**File**: src/pages/register.astro

---

## US-003: Starwind Pagination in List Pages (P1)

### T-005: Integrate pagination in blog/index.astro
**Status**: [x] completed
**Test**: Given pages/blog/index.astro -> When page loads -> Then Pagination component renders
**File**: src/pages/blog/index.astro

### T-006: Integrate pagination in listings/index.astro
**Status**: [x] completed
**Test**: Given pages/listings/index.astro -> When page loads -> Then Pagination component renders
**File**: src/pages/listings/index.astro

---

## US-004: Starwind Progress in admin/ai-tools (P1)

### T-007: Replace inline progress with Starwind Progress
**Status**: [x] completed
**Test**: Given pages/admin/ai-tools.astro -> When AI generation runs -> Then Progress bar animates
**File**: src/pages/admin/ai-tools.astro

---

## US-005: Starwind Dropzone in admin/media (P1)

### T-008: Replace raw file input with Starwind Dropzone
**Status**: [x] completed
**Test**: Given components/islands/admin/MediaIsland.astro -> When user drags files -> Then Dropzone handles upload
**File**: src/pages/admin/media.astro
**Note**: MediaIsland.astro did not exist; implemented directly in admin/media.astro

---

## US-006: Dual Library CSS No Conflict + Build (P0)

### T-009: Verify no duplicate library imports in same file
**Status**: [x] completed
**Test**: Given all .astro files -> When grep for fulldev+starwind same-file imports -> Then 0 conflicts

### T-010: Build verification
**Status**: [x] completed
**Test**: Given all changes -> When pnpm exec -- astro build -> Then exit code 0

---

## Progress
| US | Done | Total |
|----|------|-------|
| US-001 | 1/1 | 1 |
| US-002 | 3/3 | 3 |
| US-003 | 2/2 | 2 |
| US-004 | 1/1 | 1 |
| US-005 | 1/1 | 1 |
| US-006 | 2/2 | 2 |
| **Total** | **10/10** | **10** |
