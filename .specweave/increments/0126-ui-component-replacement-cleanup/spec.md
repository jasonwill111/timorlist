# Spec — Increment 0126: UI Component Replacement & Dead Code Cleanup

**Parent**: 0103 (shadcn-style migration foundation)
**Created**: 2026-06-07
**Approach**: Audit-first, atomic commits, single final verification

---

## Overview

0103 completed the **library** migration. 0126 closes the **adoption** gap: eliminates dead code, migrates live legacy components to use `src/components/ui/*` primitives, finalizes UI/UX vs business code separation.

Audit findings (2026-06-07):
- **6 dead template components** (577 LoC) — zero references
- **2 dead UI components** (ListingBanner, ListingHeader) — zero references
- **3 live UI components** using raw Tailwind (Header 292 LoC, Footer 77 LoC, OptimizedImage 90 LoC)
- **3 live form components** not composing ui/ library (AuthCard 45 LoC, FormMessage 49 LoC, PasswordInput 68 LoC)

---

## Problem Statement

The migration to `@data-slot` (shadcn-style) is complete at the **library level** but adoption is inconsistent. Two parallel component philosophies coexist:
- New: `src/components/ui/*` (shadcn-style with variant APIs)
- Old: raw Tailwind utility soup + raw HTML in legacy components

Future developers don't know which to extend. Maintenance burden is doubled. Dead code bloats builds.

---

## Goals

1. **Delete 8 dead files** (zero risk — verified no references)
2. **Migrate 6 live legacy components** to use `src/components/ui/*` primitives
3. **Verify build stability** after every migration
4. **No visual regression** on public pages
5. **Atomic commits** — one component per commit for safe rollback

---

## User Stories

### US-001: Remove Dead Code (P1)

**As a** maintainer
**I want** 8 unreferenced components deleted
**So that** the project contains only used components

**Scope**:
- `src/components/faqs-1.astro`
- `src/components/features-1.astro`
- `src/components/footer-1.astro`
- `src/components/header-1.astro`
- `src/components/hero-1.astro`
- `src/components/pricing-1.astro`
- `src/components/ListingBanner.astro`
- `src/components/ListingHeader.astro`

**AC**:
- [ ] AC-US1-01: All 8 files deleted in single commit
- [ ] AC-US1-02: `grep -rn "faqs-1\|features-1\|footer-1\|header-1\|hero-1\|pricing-1\|ListingBanner\|ListingHeader" src/` returns 0 matches
- [ ] AC-US1-03: `pnpm build` exits 0

---

### US-002: Audit Live Legacy Components (P1)

**As a** developer
**I want** a written migration map for each legacy component
**So that** migration work is predictable and reviewable

**Scope**:
- Read Header.astro (292 LoC)
- Read Footer.astro (77 LoC)
- Read OptimizedImage.astro (90 LoC)
- Read AuthCard.astro (45 LoC)
- Read FormMessage.astro (49 LoC)
- Read PasswordInput.astro (68 LoC)

**AC**:
- [ ] AC-US2-01: For each component, identify: which ui/ primitive replaces which raw HTML/Tailwind cluster
- [ ] AC-US2-02: For each component, list missing ui/ primitives (if any) that would need to be created OUTSIDE 0126
- [ ] AC-US2-03: Audit report saved at `.specweave/increments/0126-ui-component-replacement-cleanup/reports/audit.md`
- [ ] AC-US2-04: Audit is the **only** 0126 work before US-003 — no code changes in this phase

---

### US-003: Migrate Header.astro (P2, HIGH RISK)

**As a** developer
**I want** Header.astro to compose `ui/*` primitives
**So that** header changes use a single API

**Pre-condition**: US-002 audit complete, missing primitives decided

**AC**:
- [ ] AC-US3-01: Header.astro imports at least 3 different primitives from `src/components/ui/*`
- [ ] AC-US3-02: Raw HTML elements (`<button>`, `<img>`, raw divs) replaced with ui/ components where ui/ has equivalent
- [ ] AC-US3-03: `pnpm build` exits 0
- [ ] AC-US3-04: Visual smoke test: header renders on `/`, `/businesses`, `/login` (3 screenshots, no regression)

---

### US-004: Migrate Footer.astro (P2, LOW RISK)

**AC**:
- [ ] AC-US4-01: Footer.astro imports from `src/components/ui/*`
- [ ] AC-US4-02: `pnpm build` exits 0
- [ ] AC-US4-03: Footer renders identically on `/`, `/businesses`

---

### US-005: Migrate OptimizedImage.astro (P2, MEDIUM RISK)

**AC**:
- [ ] AC-US5-01: Decision: keep at root or move to `ui/image/`. Document in audit report.
- [ ] AC-US5-02: Component is consistent with ui/ library conventions
- [ ] AC-US5-03: `pnpm build` exits 0
- [ ] AC-US5-04: `/products-services/[slug]` image renders correctly

---

### US-006: Migrate AuthCard.astro (P2, MEDIUM RISK)

**AC**:
- [ ] AC-US6-01: AuthCard composes Card primitives from `ui/card`
- [ ] AC-US6-02: `pnpm build` exits 0
- [ ] AC-US6-03: `/login`, `/register`, `/forgot-password` render identically (3 screenshots)

---

### US-007: Migrate FormMessage.astro (P2, LOW RISK)

**AC**:
- [ ] AC-US7-01: FormMessage composes Alert from `ui/alert`
- [ ] AC-US7-02: Error variant uses destructive styling
- [ ] AC-US7-03: `pnpm build` exits 0
- [ ] AC-US7-04: Login error displays in red

---

### US-008: Migrate PasswordInput.astro (P2, HIGH RISK — SSR)

**Pre-condition**: Read increment 0125 spec/tasks to preserve SSR fix

**AC**:
- [ ] AC-US8-01: PasswordInput composes Input + Button from `ui/*`
- [ ] AC-US8-02: Show/hide password toggle still works
- [ ] AC-US8-03: SSR fix from 0125 preserved (no regression)
- [ ] AC-US8-04: `pnpm build` exits 0
- [ ] AC-US8-05: Visual smoke test: password input on `/login`, `/register`

---

### US-009: Final Verification (P0)

**AC**:
- [ ] AC-US9-01: `pnpm build` exits 0
- [ ] AC-US9-02: `grep -rn "style=\"position\|style=\"display: flex\|style=\"z-index" src/components/Header.astro src/components/Footer.astro` returns 0 matches
- [ ] AC-US9-03: `grep -rn "faqs-1\|features-1\|footer-1\|header-1\|hero-1\|pricing-1\|ListingBanner\|ListingHeader" src/` returns 0 matches
- [ ] AC-US9-04: 9 screenshots saved: homepage, businesses, listings, products, login, register, forgot-password, product detail, public-sector
- [ ] AC-US9-05: All `tasks.md` checkboxes updated to `[x]`

---

## Non-Goals (Out of Scope)

- Creating new ui/ primitives (do in separate increment if audit reveals gaps)
- Refactoring business/ cards (done in 0103)
- Refactoring islands/ data layer (done in 0103)
- Adding new design variants
- New pages or features

---

## Risks & Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Header migration breaks site header | Medium | High | Git checkpoint before; visual smoke test on 3 pages |
| PasswordInput SSR regression | Medium | High | Read 0125 spec verbatim; preserve all SSR fixes |
| Missing ui/ primitive blocks migration | High | Low | Audit in US-002 catches it; defer to new increment |
| Visual regression on auth pages | Low | Medium | Playwright screenshot before/after |
| Build fails on incremental commit | Low | Medium | Run `pnpm build` after every component change |

---

## Rollback

Each US = one commit. If US-003 (Header) breaks:
```
git revert <commit-sha>
```
Single component restored. No cross-component coupling.

---

## Definition of Done

- 8 dead files deleted
- 6 live legacy components migrated to ui/ library
- 0 inline `style="position:..."` in Header/Footer
- `pnpm build` exits 0
- 9 public pages render with no visual regression
- 14 atomic commits (1 per task in tasks.md)
