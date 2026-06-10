# Tasks: Admin Security + Island Migration

## Task Notation
- `**Status**: [x] completed | [x] completed
- Model hints: haiku (simple/trivial), sonnet (default), opus (complex)

---

### T-001: Fix listing edit redirect bug
**AC**: AC-US3-01 | **Status**: [x] completed | **Model**: haiku
**Test**: Given admin listing edit page with non-existent ID → When page loads → Then redirect goes to `/admin/listings` (not `/admin/listingss`)
**Files**: `pages/admin/listings/[id]/edit/index.astro`

---

### T-002: Create DashboardIsland component
**AC**: AC-US2-01, AC-US2-02, AC-US2-03 | **Status**: [x] completed | **Model**: sonnet
**Test**: Given `/admin` page → When page loads → Then dashboard renders via island with no innerHTML
**Files**: `components/islands/admin/DashboardIsland.astro` (new), `pages/admin/index.astro` (rewrite)
**Dependencies**: T-001

---

### T-003: Fix XSS in admin/index.astro
**AC**: AC-US1-01 | **Status**: [x] completed | **Model**: sonnet
**Test**: Given XSS payload `<script>alert(1)</script>` in API month name → When dashboard renders → Then script does NOT execute
**Files**: `pages/admin/index.astro`
**Dependencies**: T-002 (island migration)

---

### T-004: Fix XSS in business/products.astro
**AC**: AC-US1-02 | **Status**: [x] completed | **Model**: sonnet
**Test**: Given XSS payload `<img src=x onerror=alert(1)>` in product title → When product grid renders → Then alert does NOT fire
**Files**: `pages/business/[slug]/products.astro`

---

### T-005: Fix XSS in business/edit.astro
**AC**: AC-US1-03 | **Status**: [x] completed | **Model**: sonnet
**Test**: Given malicious URL `javascript:alert(1)` in media src → When gallery renders → Then URL is sanitized
**Files**: `pages/business/[slug]/edit/index.astro`

---

### T-006: Verify product/new and product/[id]/edit are safe
**AC**: AC-US1-04, AC-US1-05 | **Status**: [x] completed | **Model**: haiku
**Test**: Given pages accessed → When rendered → Then no innerHTML without DOMPurify
**Files**: `pages/business/[slug]/product/new/index.astro`, `pages/business/[slug]/product/[id]/edit/index.astro`

---

### T-007: Fix CarouselBanner inline style
**AC**: AC-US5-01 | **Status**: [x] completed | **Model**: haiku
**Test**: Given CarouselBanner renders → When inspected → Then zero inline `style=` attributes
**Files**: `src/components/ui/CarouselBanner.astro`

---

### T-008: Re-export legacy PascalCase components
**AC**: AC-US4-01, AC-US4-02, AC-US4-03 | **Status**: [x] completed | **Model**: haiku
**Test**: Given import from PascalCase path → When build runs → Then resolves correctly with zero duplicate symbols
**Files**: `src/components/ui/Button.astro`, `Card.astro`, `CardContent.astro`, `CardDescription.astro`, `CardHeader.astro`, `CardTitle.astro`, `Input.astro`, `Select.astro`, `Textarea.astro`, `Label.astro`, `Accordion.astro`

---

### T-009: Full build verification
**AC**: All | **Status**: [x] completed | **Model**: haiku
**Test**: Given all changes applied → When `pnpm exec -- astro build` runs → Then exit 0, zero errors
**Dependencies**: T-001 through T-008