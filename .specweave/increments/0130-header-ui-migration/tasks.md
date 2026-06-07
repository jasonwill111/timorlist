# Tasks — Increment 0130: Header Avatar Migration (Reduced Scope)

**Note**: Original 0130 plan included full Header migration (dropdowns, mobile menu, avatar).
**Reduced to** desktop avatar only because:
- DropdownMenu changes from hover to click (UX break)
- Mobile menu has working custom logic (data-action)
- updateAuthState injects dynamic HTML (cannot use Astro components)

## Phase A: Desktop Avatar Migrate

- [x] T-001: Import `Avatar`, `AvatarFallback` from ui/avatar
- [x] T-002: Replace raw `<span class="text-white text-sm font-medium">?</span>` with `<Avatar><AvatarFallback>...</AvatarFallback></Avatar>`
- [x] T-003: Preserve button click behavior for dropdown
- [x] T-004: `pnpm build` exits 0
- [x] T-005: Visual smoke test: header avatar displays

## Out of Scope (deferred)

- Nav dropdowns (hover-based) — would change UX if migrated to DropdownMenu (click-based)
- Mobile menu (data-action script) — works correctly
- `updateAuthState` dynamic HTML — same pattern as before
- Full Header rewrite — needs dedicated design review

## Definition of Done

- [x] Desktop avatar uses ui/Avatar
- [x] `pnpm build` exit 0
- [x] No visual regression
