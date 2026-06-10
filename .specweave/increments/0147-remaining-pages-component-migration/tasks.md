# Tasks: 0147 -- Remaining Pages Component Migration

## Task Notation
- [T###]: Task ID | [P]: Parallelizable | [x]: Completed | [ ]: Pending

---

## US-001: Auth Pages Component Migration (P1)

### T-001: Migrate login.astro to Fulldev components
**Status**: [x] completed
**Test**: Given pages/login.astro -> When page renders -> Then Button/Input/Label are Fulldev components
**File**: src/pages/login.astro

### T-002: Migrate register.astro to Fulldev components
**Status**: [x] completed
**Test**: Given pages/register.astro -> When page renders -> Then all form controls are Fulldev
**File**: src/pages/register.astro

### T-003: Migrate forgot-password.astro and reset-password.astro
**Status**: [x] completed
**Test**: Given auth pages -> When pages render -> Then all form controls are Fulldev
**File**: src/pages/forgot-password.astro, src/pages/reset-password.astro

---

## US-002: Account Dashboard Migration (P1)

### T-004: Migrate account.astro to Fulldev components
**Status**: [x] completed
**Test**: Given pages/account.astro -> When page renders -> Then Button/Card/Table are Fulldev
**File**: src/pages/account.astro

---

## US-003: Contact Page Migration (P2)

### T-005: Migrate contact.astro to Fulldev components
**Status**: [x] completed
**Test**: Given pages/contact.astro -> When page renders -> Then Form/Input/Textarea/Button are Fulldev
**File**: src/pages/contact.astro

---

## US-004: Search Page Migration (P2)

### T-006: Migrate search.astro to Fulldev components
**Status**: [x] completed
**Test**: Given pages/search.astro -> When page renders -> Then Input/Button/Card are Fulldev
**File**: src/pages/search.astro

---

## US-005: Homepage Hero Block (P2)

### T-007: Replace homepage hero with Fulldev block
**Status**: [x] completed
**Test**: Given pages/index.astro -> When homepage loads -> Then hero section uses Fulldev hero-* block
**File**: src/pages/index.astro

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
