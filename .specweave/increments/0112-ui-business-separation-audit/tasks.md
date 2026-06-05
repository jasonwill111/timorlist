# Tasks — Increment 0112: UI/Business Separation Audit + Final Cleanup

## Phase 1: Page Script Audit
- [ ] T-101: Grep src/pages for from .*@/lib/db
- [ ] T-102: Grep src/pages for from .*drizzle-orm
- [ ] T-103: Classify each violation
- [ ] T-104: Refactor cases needing refactor

## Phase 2: Business Component Audit
- [ ] T-201: Grep business components for db imports
- [ ] T-202: Document exceptions

## Phase 3: Client-Side escapeHtml
- [ ] T-301: Grep all <script> for inline escapeHtml
- [ ] T-302: Classify inline vs bundle
- [ ] T-303: Document technical constraints

## Phase 4: Final Duplicate Audit
- [ ] T-401: Grep for function jsonResponse
- [ ] T-402: Grep for function escapeHtml
- [ ] T-403: Verify all imports use canonical paths

## Phase 5: Performance
- [ ] T-501: Record dist/ size
- [ ] T-502: Compare to baseline
- [ ] T-503: Verify no new warnings

## Phase 6: Final Report
- [ ] T-601: Write docs/INCREMENT-0107-0112-SUMMARY.md
- [ ] T-602: Update docs/FULL-STACK-MIGRATION-ANALYSIS.md

## Phase 7: Final Verification
- [ ] T-701: pnpm build exits 0
- [ ] T-702: Visual regression test 10 public pages
- [ ] T-703: Curl smoke test 20 endpoints
- [ ] T-704: wrangler deploy
- [ ] T-705: Monitor error logs 24h
