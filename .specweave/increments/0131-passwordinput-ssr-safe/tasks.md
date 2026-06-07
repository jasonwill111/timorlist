# Tasks — Increment 0131: PasswordInput Label + LucideIcon

- [x] T-001: Read 0125 spec to understand SSR fix context
- [x] T-002: Verify Label component exists in ui/label
- [x] T-003: Verify LucideIcon supports Eye + EyeOff names
- [x] T-004: Add `id` prop to LucideIcon (needed for toggle script)
- [x] T-005: Migrate PasswordInput.astro to use Label + LucideIcon
- [x] T-006: Preserve `define:vars` script (per-component scope)
- [x] T-007: `pnpm build` exits 0
- [x] T-008: Visual smoke test: password input on /login, /register

## Definition of Done
- [x] PasswordInput uses Label + LucideIcon
- [x] SSR-safe (all imports in single frontmatter)
- [x] `pnpm build` exit 0
- [x] Show/hide toggle still works
- [x] No regression from 0125 SSR fix
