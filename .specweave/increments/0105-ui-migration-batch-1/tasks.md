# Tasks — Increment 0105: UI Migration Batch 1 (Safe Components)

**Risk Level**: LOW | **UI Impact**: Visual equivalence verified | **Duration**: 2-3 days

---

## Phase 1: Installation

- [x] T-018a: `npx shadcn@latest add @fulldev/badge @fulldev/skeleton @fulldev/textarea @fulldev/label @fulldev/native-select @fulldev/avatar -y`

## Phase 2: Component Migration

- [x] T-019a: Migrate `src/components/ui/Badge.astro` → @fulldev/badge (3 files use this)
- [x] T-020a: Migrate `src/components/ui/Textarea.astro` → @fulldev/textarea (3 files use this)
- [x] T-021a: Migrate `src/components/ui/Label.astro` → @fulldev/label (3 files use this)
- [x] T-022a: Migrate `src/components/ui/Select.astro` → @fulldev/native-select (create wrapper for options prop)
- [x] T-024a: Migrate `src/components/ui/Avatar.astro` → @fulldev/avatar (1 file uses this)

## Phase 3: Domain Logic Foundation

- [x] T-025: Create `src/lib/ui/card-colors.ts` — ORG_TYPE_COLORS, LISTING_TYPE_COLORS, PRODUCT_TYPE_COLORS, ENTITY_TYPE_COLORS
- [x] T-026: Create `src/lib/ui/card-helpers.ts` — buildEntityHref, buildListingHref, buildProductHref

## Verification

- [x] T-027: `pnpm build` exits 0
- [x] T-028: Visual regression test (diff < 5%)
- [x] T-029: E2E tests pass (14/14 pages)

## Summary

- **Tasks**: 8
- **Components migrated**: 6 (Badge, Textarea, Label, Select, Avatar + domain foundation)
- **Files deleted**: 5
- **Estimated LoC reduction**: ~300