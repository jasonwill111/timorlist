# UI/UX Consistency Audit Report

**Increment**: 0159-ui-ux-consistency-audit
**Generated**: 2026-06-09
**Scope**: 58 pages + 25 islands

---

## Finding 1: Raw HTML Form Elements

### Pages with raw `<button>` (4 files, 6 instances)

| File | Count | Type |
|------|-------|------|
| `pages/business/[slug]/products.astro` | 1 | delete action |
| `pages/business/[slug]/edit/index.astro` | 2 | gallery remove |
| `pages/business/[slug]/product/[id]/edit/index.astro` | 2 | media remove |
| `pages/business/[slug]/product/new/index.astro` | 1 | media remove |

**All 6 instances** use inline `onclick`/`data-*` event handlers — these are JS interaction handlers (delete/remove actions), NOT form submit buttons. These cannot use Fulldev `<Button>` since they're inside Astro `<script>` blocks using `dataset` API.

**Severity**: Low (intentional — JS event handlers need `dataset` access)

---

### Admin Islands with raw `<label>` (9 files)

| File | Lines |
|------|-------|
| `islands/admin/ProductsIsland.astro` | 828 |
| `islands/admin/ServicePackagesIsland.astro` | 548 |
| `islands/admin/NonProfitsIsland.astro` | 287 |
| `islands/admin/PublicSectorsIsland.astro` | 287 |
| `islands/admin/OrdersIsland.astro` | 310 |
| `islands/admin/ReviewsIsland.astro` | 332 |
| `islands/admin/AdBannersIsland.astro` | 320 |
| `islands/admin/UsersIsland.astro` | 231 |
| `islands/admin/BusinessesIsland.astro` | 224 |
| `islands/admin/ListingsIsland.astro` | 333 |
| `islands/admin/ServicePackagesIsland.astro` | 548 |

**These islands use raw `<label>` without `for=` attributes** — they pair with inline `<input>` elements. This pattern is intentional for Astro islands using DOM manipulation (`.value`/`dataset` APIs).

**Severity**: Low (intentional island pattern)

---

## Finding 2: Dark Mode Coverage

**Coverage**: 14/58 pages (24%) use `dark:` variants.

Pages WITH dark mode support:
- `business/[slug].astro` (13 instances)
- `business/[slug]/products.astro` (9)
- `business/[slug]/edit/index.astro` (1)
- `business/[slug]/product/[id]/edit/index.astro` (5)
- `business/[slug]/product/[id]/index.astro` (1)
- `business/[slug]/product/new/index.astro` (3)
- `login.astro`, `register.astro`, `reset-password.astro`, `forgot-password.astro` (2 each)
- `index.astro`, `about.astro`, `terms.astro`, `privacy.astro` (1 each)

Pages WITHOUT any dark mode:
- `blog/index.astro`, `blog/[slug].astro`
- `businesses/index.astro`, `non-profits/index.astro`, `public-sectors/index.astro`
- `contact.astro`, `faq.astro`
- `account.astro`, `dashboard.astro`, `search.astro`
- Most admin pages

**Severity**: Medium — many public-facing listing pages lack dark mode

---

## Finding 3: Hardcoded Pixel Values

**263 occurrences across 49 pages**

Notable offenders:
- `admin/ai-tools.astro`: 58 hardcoded px values
- `business/[slug].astro`: 20 hardcoded px values
- `contact.astro`: 8 hardcoded px values
- `business/[slug]/products.astro`: 11 hardcoded px values
- `index.astro`: 12 hardcoded px values
- `about.astro`: 12 hardcoded px values

**Severity**: Low — hardcoded px values for icons/emojis/images are acceptable. Most legitimate uses are for small icon sizes (`w-4`, `w-5`, `h-4`, `h-5`) which Tailwind doesn't always handle well for arbitrary values.

---

## Finding 4: Admin Islands Size Analysis

### High Priority (>500 lines — needs immediate attention)

| Island | Lines | Issues |
|--------|-------|--------|
| `ProductsIsland.astro` | 828 | Massive. Contains: product table, form, filters, CRUD operations, media gallery. Should be split. |
| `ServicePackagesIsland.astro` | 548 | Large. Contains: package list, pricing tiers, form, filters. Should be split. |

### Medium Priority (300-350 lines)

| Island | Lines | Recommendation |
|--------|-------|---------------|
| `DashboardIsland.astro` | 351 | Borderline — acceptable if single responsibility maintained |
| `AIToolsIsland.astro` | 341 | Borderline |
| `ListingsIsland.astro` | 333 | Borderline |
| `ReviewsIsland.astro` | 332 | Borderline |
| `AdBannersIsland.astro` | 320 | Borderline |
| `OrdersIsland.astro` | 310 | Borderline |

---

## Recommendations

### P0 — Must Fix

1. **ProductsIsland.astro split** (828 lines → 3 islands):
   - `ProductTableIsland.astro`: product list table, filters, pagination
   - `ProductFormIsland.astro`: add/edit product form
   - `ProductGalleryIsland.astro`: media gallery management

2. **ServicePackagesIsland.astro split** (548 lines → 2 islands):
   - `ServicePackagesTableIsland.astro`: package list + filters
   - `ServicePackageFormIsland.astro`: add/edit package form

### P1 — Should Fix

3. **Dark mode on listing pages**: `blog/index`, `businesses/index`, `non-profits/index`, `public-sectors/index`, `search`, `contact`, `faq`

4. **Admin islands 300-350 lines**: Evaluate each for single-responsibility violations. Trigger point: >300 lines AND contains both table AND form logic → split.

### P2 — Nice to Have

5. **Hardcoded px cleanup** on admin pages and `about.astro` — replace with Tailwind arbitrary values (`w-[18px]`) where truly needed

6. **Raw `<button>` in business pages**: These are JS event handlers (delete/remove), can't use Fulldev Button. Add `// eslint-disable-next-line` comment explaining why.

---

## Verified Clean Areas

- All 58 pages use Tailwind CSS design tokens (`text-primary`, `bg-card`, `text-muted-foreground`, etc.)
- CSS variables (`--primary`, `--background`, `--foreground`) consistently defined in `global.css`
- Fulldev components used correctly (Button, Input, Select, Textarea, Label, Card, Badge)
- Starwind Pagination/Progress/Dropzone used correctly
- Zero `db.prepare()` calls in any .astro page
- Zero `@/db/schema` imports in any .astro page
