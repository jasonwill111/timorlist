# Spec — Increment 0127: Footer Polish + FormMessage Migrate

**Parent**: 0126 audit
**Risk**: LOW
**Scope**: 2 components, ~50 LoC

## Goal

1. **Footer.astro**: Use `<Separator>` for the bottom bar divider, keep all custom layout (already minimal)
2. **FormMessage.astro**: Migrate raw `<div>` to `<Alert>` from `src/components/ui/alert`, preserve `window.__formMessage` show/hide API

## Non-Goals

- Restructuring footer layout
- Changing copy
- Visual redesign

## User Story

### US-001: Migrate FormMessage to ui/Alert (P1)

**AC**:
- [ ] FormMessage imports `Alert`, `AlertDescription` from `ui/alert`
- [ ] Outer wrapper keeps `id` (preserves `window.__formMessage` API)
- [ ] `type="error"` → `<Alert variant="destructive">`
- [ ] `type="success"` → `<Alert>` (default) + custom green styling
- [ ] `pnpm build` exits 0
- [ ] Login error displays in red
- [ ] Login success displays in green

### US-002: Footer Polish (P3)

**AC**:
- [ ] Footer bottom bar uses `<Separator>` (or keeps `border-t` if Separator doesn't fit)
- [ ] `pnpm build` exits 0
- [ ] Footer renders identically

## Risk

LOW. Both changes are additive. show/hide API is preserved via outer wrapper.

## Rollback

Single commit. `git revert` restores.
