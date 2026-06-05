# Tasks — Increment 0112: UI/Business Separation Audit + Final Cleanup

## Phase 1: Page Script Audit

- [ ] T-101: Grep `src/pages/**/*.astro` for `from .*@/lib/db`
- [ ] T-102: Grep `src/pages/**/*.astro` for `from .*drizzle-orm`
- [ ] T-103: List each violation with file:line reference
- [ ] T-104: Classify each: (a) needs refactor, (b) acceptable, (c) documented exception
- [ ] T-105: Refactor (a) cases to use server actions

## Phase 2: Business Component Audit

- [ ] T-201: Grep `src/components/business/` for `from .*@/lib/db`
- [ ] T-202: Grep `src/components/business/` for `from .*drizzle-orm`
- [ ] T-203: Grep `src/components/business/` for `from .*astro:actions`
- [ ] T-204: Document any exceptions with rationale

## Phase 3: Client-Side escapeHtml Status

- [ ] T-301: Grep all `<script>` blocks in .astro files for inline `escapeHtml`
- [ ] T-302: Classify each: inline script vs. compiled bundle
- [ ] T-303: Document technical constraints
- [ ] T-304: Consolidate compiled bundle cases where feasible

## Phase 4: Final Duplicate Code Audit

- [ ] T-401: Grep `src/pages/api/` for `function jsonResponse`
- [ ] T-402: Grep `src/lib/*.ts` for `function escapeHtml` (excluding intentional wrappers)
- [ ] T-403: Grep for `getDb|getEnv` duplicates
- [ ] T-404: Verify all imports use canonical paths
- [ ] T-405: Document any remaining issues

## Phase 5: Performance Verification

- [ ] T-501: Record current `dist/` size
- [ ] T-502: Compare to pre-migration baseline (commit 3ac551d3 dist size)
- [ ] T-503: Verify no new build warnings
- [ ] T-504: Report findings

## Phase 6: Final State Report

- [ ] T-601: Write `docs/INCREMENT-0107-0112-SUMMARY.md` with:
  - Total components migrated
  - Total pages migrated
  - Total API routes consolidated
  - Lines of code reduction
  - Build size change
  - Remaining technical debt
- [ ] T-602: Update `docs/FULL-STACK-MIGRATION-ANALYSIS.md` with final state

## Phase 7: Final Verification

- [ ] T-701: `pnpm build` exits 0
- [ ] T-702: Visual regression: visit 10 public pages via obscura MCP
- [ ] T-703: Curl smoke test: 20 endpoints all return expected
- [ ] T-704: wrangler deploy to production
- [ ] T-705: Post-deploy: monitor error logs for 24h

## Completion Criteria

- [ ] Zero page `<script>` direct db imports (or all exceptions documented)
- [ ] Zero business component db imports
- [ ] Zero remaining duplicate utility functions
- [ ] All builds pass
- [ ] All public pages return 200
- [ ] Final state report published
- [ ] Production deployment successful
