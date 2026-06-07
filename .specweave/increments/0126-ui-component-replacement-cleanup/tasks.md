# Tasks — Increment 0126: Dead Code Deletion + Audit

**Scope**: Wave 1 + Wave 2 of 0126 plan
**Risk**: 0 (pure deletion + read-only audit)
**Output**: 577 LoC removed + audit report

---

## Phase A: Dead Code Deletion (1 commit)

- [x] T-001: Delete `src/components/faqs-1.astro`
- [x] T-002: Delete `src/components/features-1.astro`
- [x] T-003: Delete `src/components/footer-1.astro`
- [x] T-004: Delete `src/components/header-1.astro`
- [x] T-005: Delete `src/components/hero-1.astro`
- [x] T-006: Delete `src/components/pricing-1.astro`
- [x] T-007: Delete `src/components/ListingBanner.astro`
- [x] T-008: Delete `src/components/ListingHeader.astro`
- [x] T-009: `grep -rn "faqs-1\|features-1\|footer-1\|header-1\|hero-1\|pricing-1\|ListingBanner\|ListingHeader" src/` returns 0 matches
- [x] T-010: `pnpm build` exits 0 (verified 2026-06-07)
- [x] T-011: Git commit "chore(0126): delete 8 unreferenced legacy components"

---

## Phase B: Component Audit (1 commit per audit)

- [x] T-012: Read `src/components/Header.astro` (292 LoC) — output structure
- [x] T-013: Read `src/components/Footer.astro` (77 LoC) — output structure
- [x] T-014: Read `src/components/OptimizedImage.astro` (90 LoC) — output structure
- [x] T-015: Read `src/components/forms/AuthCard.astro` (45 LoC) — output structure
- [x] T-016: Read `src/components/forms/FormMessage.astro` (49 LoC) — output structure
- [x] T-017: Read `src/components/forms/PasswordInput.astro` (68 LoC) — output structure
- [x] T-018: Read `.specweave/increments/0125-passwordinput-ssr-fix/` to understand SSR constraints
- [x] T-019: Write audit report at `.specweave/increments/0126-ui-component-replacement-cleanup/reports/audit.md`:
  - For each component: which ui/ primitives it should use
  - For each component: missing primitives (if any) that need creation
  - Risk assessment per component
  - Migration order recommendation
- [x] T-020: Git commit "docs(0126): component audit + migration map"

---

## Summary

- **Total Tasks**: 20
- **Commits**: 2 (1 deletion + 1 audit)
- **Risk**: Zero (no code logic changes)
- **LoC impact**: -577 LoC

## Next Increments (Out of Scope for 0126)

| Increment | Scope | LoC | Risk |
|-----------|-------|-----|------|
| 0127 | Footer + FormMessage migration | ~50 | Low |
| 0128 | AuthCard migration | ~30 | Medium |
| 0129 | OptimizedImage decision + migration | ~40 | Medium |
| 0130 | Header migration | ~200 | **High** |
| 0131 | PasswordInput migration | ~40 | **High** (SSR) |

Created based on audit findings in 0126.
