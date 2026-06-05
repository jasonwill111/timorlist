---
increment: 0112-ui-business-separation-audit
title: "UI/Business Separation Audit + Final Cleanup"
type: refactor
priority: P1
status: pending
created: 2026-06-04
structure: user-stories
test_mode: manual-e2e
coverage_target: 0
project: TimorUp
production: https://timorup.jasonwill.workers.dev
epic: 0103-fulldev-migration-refactor
---

# Refactor: UI/Business Separation Audit + Final Cleanup

## Overview

After completing all UI migration increments (0108-0111), the final separation audit ensures no UI component or page has hidden business logic dependencies. This increment performs the audit, fixes violations, and produces a final state report.

## User Stories

### US-1: Architecture Auditor — Page Script Audit

**As an** architecture auditor
**I want** to know which page `<script>` tags directly import db/queries
**So that** UI/business separation violations are visible

**Acceptance Criteria:**
- [ ] Audit complete: list every page with `<script>` importing `@/lib/db` or `drizzle-orm`
- [ ] For each violation, classify as: (a) needs refactor, (b) acceptable, (c) documented exception
- [ ] Refactor (a) cases to use server actions instead
- [ ] `pnpm build` exits 0
- [ ] No new violations introduced

### US-2: Architecture Auditor — Business Component Audit

**As an** architecture auditor
**I want** to verify `src/components/business/*.astro` have no db imports
**So that** UI/business separation is maintained

**Acceptance Criteria:**
- [ ] Grep audit: zero `from .*@/lib/db` in `src/components/business/`
- [ ] Zero `from .*drizzle-orm` in `src/components/business/`
- [ ] Zero `from .*astro:actions` in `src/components/business/` (data should come from props)
- [ ] Document any exceptions with rationale

### US-3: Frontend Developer — Client-Side escapeHtml Status

**As a** frontend developer
**I want** to understand the status of client-side escapeHtml duplication
**So that** we know what's been consolidated and what hasn't

**Acceptance Criteria:**
- [ ] Audit complete: list every inline `escapeHtml` in `<script>` blocks
- [ ] Identify which are in:
  - (a) Inline scripts in .astro files (cannot easily share via module)
  - (b) Compiled client bundles (can be consolidated)
- [ ] Document technical constraints preventing full consolidation
- [ ] Consolidate (b) cases where feasible

### US-4: Code Reviewer — Final Duplicate Code Audit

**As a** code reviewer
**I want** to verify no remaining duplicate utility functions
**So that** the codebase is clean

**Acceptance Criteria:**
- [ ] Zero duplicate `function jsonResponse` in `src/pages/api/`
- [ ] Zero duplicate `function escapeHtml` in `src/lib/*.ts` (excluding intentional wrappers)
- [ ] Zero duplicate `getDb`/`getEnv` wrappers
- [ ] All imports use canonical paths (`@/lib/api-helpers`, `@/lib/sanitize`, etc.)

### US-5: Performance Engineer — Build Size Verification

**As a** performance engineer
**I want** to verify the build hasn't regressed
**So that** the migration didn't bloat the bundle

**Acceptance Criteria:**
- [ ] Record pre-migration build size (dist/)
- [ ] Record post-migration build size
- [ ] Size change < 20% (allow for legitimate increases from new components)
- [ ] No new warnings in build output

## Out of Scope

- New features
- Performance optimization beyond verification
- Documentation of every public API (separate task)

## Dependencies

- All previous increments (0107-0111) complete

## Risk

**Low**: This is an audit + minor fixes, not a major refactor.
