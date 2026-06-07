# Component Audit — Increment 0126

**Date**: 2026-06-07
**Audited**: 6 legacy components + 1 dead code sweep
**Goal**: Migration map for 0127-0131

---

## UI Library Primitives Available (verified)

✅ `Button` — `src/components/ui/button`
✅ `Input` — `src/components/ui/input`
✅ `Label` — `src/components/ui/label`
✅ `Card` + family — `src/components/ui/card`
✅ `Alert` + family — `src/components/ui/alert`
✅ `Separator` — `src/components/ui/separator`
✅ `Skeleton` — `src/components/ui/skeleton`
✅ `Avatar` — `src/components/ui/avatar`
✅ `DropdownMenu` — `src/components/ui/dropdown-menu`
✅ `Sheet` — `src/components/ui/sheet`
✅ `NavigationMenu` — `src/components/ui/navigation-menu`
✅ `ThemeToggle` — `src/components/ui/ThemeToggle.astro`
✅ `LucideIcon` — `src/components/ui/LucideIcon.astro`

**No new primitives needed.** All migrations can proceed.

---

## Component Migration Map

### Footer.astro (77 LoC, LOW risk)

**Currently uses**:
- Raw `<footer>` + grid layout
- 4-column grid with `md:grid-cols-4`
- Hardcoded social links
- Copyright + Privacy/Terms

**Migration targets**:
- Brand block: keep as is (custom brand styling)
- Section headings: keep as `<h3>` (no equivalent in ui/)
- Link lists: keep as `<ul>` (no equivalent in ui/)
- Bottom bar separator: `border-t` → `<Separator />` (optional, low value)
- Social icons: use `<LucideIcon>` (already used)

**Effort**: LOW — already minimal raw HTML. **Skip migration or do minimal polish only.**

**Recommendation**: 0127 covers Footer with **light polish** (use Separator, keep rest).

---

### FormMessage.astro (49 LoC, LOW risk)

**Currently uses**:
- Raw `<div>` with conditional Tailwind classes
- `bg-green-50/...text-green-700` for success
- `bg-red-50/...text-red-700` for error
- Inline script for `window.__formMessage` show/hide API

**Migration targets**:
- Container → `<Alert variant={type === 'error' ? 'destructive' : 'default'}>`
- Inner content → `<AlertDescription><slot /></AlertDescription>`

**Script risk**: `window.__formMessage` is consumed by login.astro/register.astro. Must preserve API. Astro will inline `<script>` in scoped Astro way, but we need it to run on page load.

**Effort**: LOW-MEDIUM

**Recommendation**: 0127 — migrate to Alert, preserve `window.__formMessage` API.

---

### AuthCard.astro (45 LoC, MEDIUM risk)

**Currently uses**:
- ✅ Already imports Card family from `@/components/ui/card`
- Container wrapper `<div class="container py-12"><div class="max-w-md mx-auto">`
- Custom text-amber-600 for footer link

**Migration targets**:
- Already 80% migrated. Only:
  - Custom amber color → `<Button variant="link">` (semantic)
  - Maybe wrap in container using `<Container>` if exists (it doesn't, keep raw)

**Effort**: MINIMAL — already done.

**Recommendation**: 0128 — **polish only** (use Button variant="link" for footer link).

---

### OptimizedImage.astro (90 LoC, MEDIUM risk)

**Currently uses**:
- R2 URL transformation
- srcset generation for responsive images
- Lazy loading + async decoding
- Inline `<style>` block

**Migration targets**:
- Could be moved to `ui/image/` but it's domain-specific (R2-aware)
- Could compose with `<Skeleton>` for loading state
- Currently no fallback on error

**Decision**: KEEP AT ROOT. It is domain-specific (R2-aware). Add error handling using `onerror` attribute with Skeleton fallback.

**Effort**: MEDIUM — add error handling, optional Skeleton integration.

**Recommendation**: 0129 — add error handling, integrate Skeleton for loading state. Keep at root.

---

### Header.astro (292 LoC, HIGH risk)

**Currently uses**:
- ✅ `Button` from ui/button
- ✅ `ThemeToggle`, `LucideIcon`
- ❌ Custom dropdown (div + group-hover) — should use `DropdownMenu` from `ui/dropdown-menu`
- ❌ Custom mobile menu (hidden in initial scan) — should use `Sheet` from `ui/sheet`
- ❌ User avatar with `<img>` — should use `Avatar` from `ui/avatar`

**Migration targets**:
- Desktop dropdowns (Business, etc.) → `<DropdownMenu>` from ui/dropdown-menu
- Mobile menu → `<Sheet>` from ui/sheet
- User profile image → `<Avatar>` from ui/avatar
- Navigation links → could use `<NavigationMenu>` from ui/navigation-menu

**Risk**: HIGH — Header is on every page. Any visual breakage affects entire site.

**Effort**: HIGH — need careful incremental migration (one section at a time).

**Recommendation**: 0130 — full migration, commit per section (logo, desktop nav, mobile nav, user dropdown).

---

### PasswordInput.astro (68 LoC, HIGH risk — SSR)

**Currently uses**:
- ✅ `Input` from ui/input
- ✅ `Button` from ui/button
- Raw `<label>` (could use `Label` from ui/label)
- SVG eye icons (could use `LucideIcon` for Eye/EyeOff)
- `define:vars` script for toggle behavior

**Migration targets**:
- `<label>` → `<Label>` from ui/label
- SVG icons → `<LucideIcon name="Eye" />` + `<LucideIcon name="EyeOff" />`
- Preserve SSR fix from 0125 (script using `define:vars` to scope per-component)

**Risk**: HIGH — SSR-specific. 0125 was an SSR fix; must preserve verbatim.

**Effort**: MEDIUM — mostly icon replacement, careful with script behavior.

**Recommendation**: 0131 — read 0125 spec first, then migrate.

---

## Migration Sequence (Final)

| Order | Increment | Component | Risk | LoC Touched |
|-------|-----------|-----------|------|-------------|
| 1 | 0126 | (done) Dead code delete + this audit | 0 | -577 |
| 2 | 0127 | Footer polish + FormMessage migrate | Low | ~50 |
| 3 | 0128 | AuthCard polish | Low | ~15 |
| 4 | 0129 | OptimizedImage add error handling | Medium | ~30 |
| 5 | 0130 | Header migrate (split into 4 commits) | **High** | ~150 |
| 6 | 0131 | PasswordInput SSR-safe migrate | **High** | ~30 |

**Total LoC touched** (increments 0127-0131): ~275 LoC rewritten
**Total LoC removed** (increment 0126): 577 LoC
**Net**: -302 LoC

---

## Increments to Create

1. `0127-footer-formmessage` — Footer polish + FormMessage migrate
2. `0128-authcard-polish` — AuthCard use Button variant="link"
3. `0129-optimizedimage-hardening` — Add error handling
4. `0130-header-ui-migration` — Header migrate to DropdownMenu/Sheet/Avatar
5. `0131-passwordinput-ssr-safe-migration` — PasswordInput migrate preserving SSR fix

---

## Out of Scope (deferred)

- Adding new visual designs
- Creating new pages
- Backend changes
- Database schema changes
- New ui/ primitives (not needed — all primitives exist)
