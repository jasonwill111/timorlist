---
increment: 0112-ui-business-separation-audit
title: "UI/Business Separation Audit + Final Cleanup"
type: refactor
priority: P1
status: pending
created: 2026-06-04
structure: user-stories
test_mode: manual-e2e
project: TimorUp
production: https://timorup.jasonwill.workers.dev
---

# Refactor: UI/Business Separation Audit + Final Cleanup

## User Stories

### US-1: Page Script Audit
- [ ] Grep src/pages/**/*.astro for from .*@/lib/db
- [ ] Grep src/pages/**/*.astro for from .*drizzle-orm
- [ ] Classify each violation
- [ ] Refactor (a) cases to use server actions

### US-2: Business Component Audit
- [ ] Grep src/components/business/ for from .*@/lib/db
- [ ] Grep src/components/business/ for from .*drizzle-orm
- [ ] Grep src/components/business/ for from .*astro:actions
- [ ] Document exceptions

### US-3: Client-Side escapeHtml Status
- [ ] Grep all <script> for inline escapeHtml
- [ ] Classify: inline vs compiled bundle
- [ ] Document technical constraints

### US-4: Final Duplicate Code Audit
- [ ] Zero duplicate function jsonResponse in src/pages/api/
- [ ] Zero duplicate function escapeHtml in src/lib/*.ts
- [ ] All imports use canonical paths

### US-5: Performance Verification
- [ ] Record current dist/ size
- [ ] Compare to pre-migration baseline
- [ ] Verify no new build warnings

### US-6: Final State Report
- [ ] Write docs/INCREMENT-0107-0112-SUMMARY.md
- [ ] Update docs/FULL-STACK-MIGRATION-ANALYSIS.md

## Risk
Low: audit + minor fixes.
