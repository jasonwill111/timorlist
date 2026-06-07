# Tasks — Increment 0127: Footer + FormMessage

## Phase A: FormMessage Migration (Priority 1)

- [x] T-001: Read `src/components/ui/alert/alert.astro` and `alert-description.astro` to confirm API
- [x] T-002: Read `src/pages/login.astro` to understand `window.__formMessage` usage
- [x] T-003: Read `src/pages/register.astro` to understand FormMessage usage
- [x] T-004: Refactor `src/components/forms/FormMessage.astro` to compose Alert primitives
- [x] T-005: Preserve `window.__formMessage.show/hide` API
- [x] T-006: `pnpm build` exits 0 (verified 2026-06-07)
- [x] T-007: Visual smoke test: login error + success

## Phase B: Footer Polish (Priority 3)

- [x] T-008: Add `<Separator>` import in Footer.astro
- [x] T-009: Replace `border-t` with `<Separator />` in Footer bottom bar
- [x] T-010: `pnpm build` exits 0 (verified 2026-06-07)
- [x] T-011: Footer renders identically

## Summary

- Total Tasks: 11
- Risk: LOW
- Commits: 1 (single combined commit for 0127)

## Definition of Done

- [x] FormMessage uses ui/Alert primitives
- [x] Footer uses Separator
- [x] `pnpm build` exit 0
- [x] window.__formMessage API preserved
- [x] No visual regression
