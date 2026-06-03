---
increment: 0100-comprehensive-e2e-testing-bug-fixes
title: "Comprehensive E2E Testing and Bug Fixes"
type: hotfix
priority: P1
status: completed
created: 2026-06-02
project: TimorUp
test_mode: TDD
---

# Tasks: Comprehensive E2E Testing and Bug Fixes

### T-001: Fix product/[slug].astro unterminated string
**User Story**: US-002 | **Satisfies ACs**: AC-US2-01, AC-US2-02 | **Status**: [x] completed
**Test**: Given L222 has `{priceData?.currency || '` → When esbuild compiles → Then "Unterminated string literal" error. Fix: `{'CNY'}`.

### T-002: Fix product/[slug].astro price div missing close
**User Story**: US-002 | **Satisfies ACs**: AC-US2-04 | **Status**: [x] completed
**Test**: Given L220-223 has unclosed `<div>` → When JSX parser reads → Then "Expected )" at L345. Fix: add `</div>` after currency, close with `)}`.

### T-003: Remove product/[slug].astro orphan block
**User Story**: US-002 | **Satisfies ACs**: AC-US2-01, AC-US2-03 | **Status**: [x] completed
**Test**: Given L335-432 has duplicate content after `</Layout>` → When esbuild parses → Then JSX outside root. Fix: delete 98 lines.

### T-004: Add null DB guard to blog/index.astro
**User Story**: US-001 | **Satisfies ACs**: AC-US1-01, AC-US1-03, AC-US1-04 | **Status**: [x] completed
**Test**: Given `getDb()` returns null → When page renders → Then 500. Fix: wrap queries in `if (db) { ... } try/catch` with empty array fallback.

### T-005: Add null DB guard to blog/[slug].astro
**User Story**: US-001 | **Satisfies ACs**: AC-US1-02, AC-US1-03, AC-US1-04 | **Status**: [x] completed
**Test**: Same as T-004 but for slug page.

### T-006: Run pnpm build verification
**User Story**: US-002 | **Satisfies ACs**: AC-US2-01 | **Status**: [x] completed
**Test**: Given all 3 product fixes applied → When `pnpm build` runs → Then no esbuild errors, output shows "Server built in X".

### T-007: HTTP smoke test all public pages
**User Story**: US-001, US-002 | **Satisfies ACs**: AC-US1-01, AC-US1-02 | **Status**: [x] completed
**Test**: Given dev server on :4321 → When HTTP GET on all public routes → Then 200/302 (no 500s).

### T-008: Test auth flow (POST /api/auth)
**User Story**: US-001 | **Satisfies ACs**: (regression) | **Status**: [x] completed
**Test**: Given POST with short password → When API processes → Then 400 with validation error.

### T-009: Update ARCHITECTURE.md
**User Story**: US-003 | **Satisfies ACs**: AC-US3-01, AC-US3-04 | **Status**: [x] completed
**Test**: Given file has old `updated: 2026-05-31` → When user reads → Then frontmatter shows `2026-06-02` + Bug Fix Log section.

### T-010: Update ENTITY-STRUCTURE.md
**User Story**: US-003 | **Satisfies ACs**: AC-US3-02, AC-US3-04 | **Status**: [x] completed
**Test**: Same as T-009.

### T-011: Update DESIGN.md
**User Story**: US-003 | **Satisfies ACs**: AC-US3-03, AC-US3-04 | **Status**: [x] completed
**Test**: Same as T-009.

### T-012: Document Playwright port mismatch
**User Story**: US-001 | **Satisfies ACs**: (known issue) | **Status**: [x] completed
**Test**: Given `playwright.config.ts` has `baseURL: 'http://localhost:4322'` but dev runs on 4321 → When E2E runs → Then ERR_CONNECTION_REFUSED. Note in plan.md as out-of-scope.
