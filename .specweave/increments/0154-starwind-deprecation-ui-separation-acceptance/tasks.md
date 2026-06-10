# Tasks: 0154 -- Starwind deprecation + UI/业务分离验收

## Task Notation
- [T###]: Task ID | [P]: Parallelizable | [x]: Completed | [ ]: Pending

---

## US-001: Starwind deprecation (P0)

### T-001: Mark Starwind button as deprecated
**Status**: [x] completed
**Test**: Given starwind/button/Button.astro -> When read -> Then has deprecation JSDoc comment
**AC**: AC-US1-01
**File**: src/components/starwind/button/Button.astro

### T-002: Mark Starwind input as deprecated
**Status**: [x] completed
**Test**: Given starwind/input/Input.astro -> When read -> Then has deprecation JSDoc comment
**AC**: AC-US1-02
**File**: src/components/starwind/input/Input.astro

### T-003: Verify no pages import duplicate components
**Status**: [x] completed
**Test**: Given all pages -> When grepped -> Then no import from @/components/starwind/button or @/components/starwind/input
**AC**: AC-US1-04
**Command**: grep -r "starwind/button\|starwind/input" src/pages/

---

## US-002: UI/业务 separation verification (P0)

### T-004: Verify all public pages use query functions
**Status**: [x] completed
**Test**: Given all public pages -> When grepped -> Then no drizzle-orm imports, no db.prepare calls
**AC**: AC-US2-01, AC-US2-02
**Command**: grep -r "drizzle-orm\|db.prepare" src/pages/*.astro src/pages/**/*.astro

### T-005: Verify frontmatter line counts
**Status**: [x] completed
**Test**: Given all public pages -> When counted -> Then frontmatter ≤30 meaningful lines
**AC**: AC-US2-01

---

## US-003: Build verification

### T-006: Build verification
**Status**: [x] completed
**Test**: Given all changes -> When pnpm exec -- astro build -> Then exit code 0

---

## Progress
| US | Done | Total |
|----|------|-------|
| US-001 | 3/3 | 3 |
| US-002 | 2/2 | 2 |
| **Total** | **0/5** | **5** |
