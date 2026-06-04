# Tasks — Increment 0103: Full-Stack Migration to @fulldev + Separation of Concerns

**Analysis Report**: `docs/FULL-STACK-MIGRATION-ANALYSIS.md`
**Goal**: Reduce codebase by 1,500+ LoC while improving maintainability 60-70%

---

## Phase 1: Foundation (Week 1-2)

### Security Fixes (CRITICAL)

- [ ] T-001: `src/pages/api/admin/skus/index.ts` — Add admin auth check (NO auth currently)
- [ ] T-002: `src/pages/api/products/index.ts` POST — Remove client-controlled isAdmin bypass
- [ ] T-003: `src/pages/api/products/[id].ts` PUT/DELETE — Remove client-controlled isAdmin bypass

### @fulldev Installation

- [ ] T-004: Run `npx shadcn@latest add @fulldev/init -y --overwrite` — Install Fulldev UI
- [ ] T-005: `npx shadcn@latest add @fulldev/button @fulldev/input @fulldev/badge @fulldev/label @fulldev/textarea @fulldev/avatar @fulldev/skeleton @fulldev/select @fulldev/native-select -y`
- [ ] T-006: `npx shadcn@latest add @fulldev/card -y` — Card family (Card, CardHeader, CardTitle, etc)

### Lib Consolidation

- [ ] T-007: Create `src/lib/result.ts` — Consolidate Result types from type-utils.ts, queries/result.ts, action-helpers.ts
- [ ] T-008: Create `src/lib/sanitize.ts` — Consolidate escapeHtml, sanitizeForAttribute, sanitizeForInnerHtml
- [ ] T-009: Create `src/lib/env.ts` — Consolidate getDb, getAuth, getKV, getMinimaxApiKey
- [ ] T-010: Delete duplicate Result from `src/lib/type-utils.ts` and `src/lib/queries/result.ts`
- [ ] T-011: Update all imports to use new canonical locations

### Component Deprecation

- [ ] T-012: Delete `src/components/forms/LoadingButton.astro` — Replace usages with `<Button loading={true}>`
- [ ] T-013: Update `src/pages/forgot-password.astro` — Use Button with loading prop
- [ ] T-014: Update `src/pages/reset-password.astro` — Use Button with loading prop

### Phase 1 Verification

- [ ] T-015: Security fixes verified with curl tests
- [ ] T-016: @fulldev components work in test pages
- [ ] T-017: `pnpm build` exits 0

---

## Phase 2: Component Migration (Week 3-4)

### UI Component Replacement

- [ ] T-018: Migrate `src/components/ui/Button.astro` → @fulldev/button (17 files use this)
- [ ] T-019: Migrate `src/components/ui/Input.astro` → @fulldev/input (5 files use this)
- [ ] T-020: Migrate `src/components/ui/Badge.astro` → @fulldev/badge (3 files use this)
- [ ] T-021: Migrate `src/components/ui/Textarea.astro` → @fulldev/textarea
- [ ] T-022: Migrate `src/components/ui/Select.astro` → @fulldev/native-select (create wrapper for options prop)
- [ ] T-023: Migrate Card family → @fulldev/card (Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter)
- [ ] T-024: Migrate `src/components/ui/Avatar.astro` → @fulldev/avatar

### Domain Logic Extraction

- [ ] T-025: Create `src/lib/ui/card-colors.ts` — Extract ORG_TYPE_COLORS, LISTING_TYPE_COLORS, PRODUCT_TYPE_COLORS, ENTITY_TYPE_COLORS
- [ ] T-026: Create `src/lib/ui/card-helpers.ts` — Extract buildEntityHref, buildListingHref, buildProductHref
- [ ] T-027: Create `src/lib/ui/image-utils.ts` — Extract resolveEntityImage (thumbnail > profileImageId > imageIds)
- [ ] T-028: Refactor `src/components/business/BusinessCard.astro` — Use extracted libs
- [ ] T-029: Refactor `src/components/business/ListingCard.astro` — Use extracted libs
- [ ] T-030: Refactor `src/components/business/ProductCard.astro` — Use extracted libs
- [ ] T-031: Refactor `src/components/business/BusinessHeaderCard.astro` — Use extracted libs

### Phase 2 Verification

- [ ] T-032: All UI components migrated and working
- [ ] T-033: Business cards render correctly with extracted logic
- [ ] T-034: `pnpm build` exits 0

---

## Phase 3: Backend Consolidation (Week 5-6)

### Action Layer Fixes

- [ ] T-035: Create `src/lib/rating.ts` — Extract rating recalculation (used in reviews/create.ts and admin/reviews.ts)
- [ ] T-036: Fix DUPE-1: adBanners — Consolidate to single CRUD path (banners/create.ts, admin/heroes.ts, admin/servicePackagesAdmin.ts → one canonical)
- [ ] T-037: Fix DUPE-2: servicePackages — Delete re-export (admin/servicePackages.ts)
- [ ] T-038: Fix DUPE-3: Auth logic — Consolidate light-auth.ts with signIn.ts
- [ ] T-039: Fix DUPE-4: Rating recalc — Update to use lib/rating.ts
- [ ] T-040: Fix DUPE-5: Listings split — Merge admin/listings.ts + admin/listing.ts
- [ ] T-041: Fix DUPE-6: setRole split — Merge admin/users/setRole.ts into admin/users/index.ts

### Lib Utilities Creation

- [ ] T-042: Create `src/lib/api-helpers.ts` — jsonResponse, errorResponse, getErrorMessage
- [ ] T-043: Create `src/lib/api-cache.ts` — cacheResponse helpers (used in 6+ API files)
- [ ] T-044: Create `src/lib/api-middleware.ts` — Rate limit helpers
- [ ] T-045: Update API endpoints to use new lib helpers

### Additional Consolidations

- [ ] T-046: Delete duplicate escapeHtml from `src/lib/modal.ts` and `src/lib/utils.ts`
- [ ] T-047: Merge type-guards.ts into type-utils.ts
- [ ] T-048: Delete re-export shim `src/lib/constants.ts` — update imports to canonical modules

### Phase 3 Verification

- [ ] T-049: No duplicate functions found in lib/
- [ ] T-050: Actions use consolidated helpers
- [ ] T-051: `pnpm build` exits 0

---

## Phase 4: Advanced Migration (Week 7-8)

### DB Query Templating

- [ ] T-052: Create `src/lib/db/queries/entity.ts` — Generic entity queries (getById, getBySlug, getByOwner, slugExists)
- [ ] T-053: Apply to businesses, non_profits, public_sectors
- [ ] T-054: Create `src/lib/db/queries/business-entity.ts` — Handle business entity triplet

### Form Components

- [ ] T-055: Create `src/components/forms/FormField.astro` — Label + Input + Error composition
- [ ] T-056: Update login.astro, register.astro, forgot-password.astro, reset-password.astro to use FormField

### Modal Migration (HIGH EFFORT)

- [ ] T-057: Install @fulldev/dialog: `npx shadcn@latest add @fulldev/dialog -y`
- [ ] T-058: Refactor Modal.astro → @fulldev/dialog compound pattern
- [ ] T-059: Update all 15+ usage sites from window.showModal/hideModal to reactive state
- [ ] T-060: Test all modal interactions

### Component Cleanup

- [ ] T-061: Migrate Tabs → @fulldev/tabs (evaluate if needed - current implementation works)
- [ ] T-062: Audit islands for @fulldev/blocks replacement
- [ ] T-063: Delete HTML string generators from lib/ (badges.ts, skeleton.ts, modal.ts, select.ts, icons.ts, avatar.ts)

### Final Audit

- [ ] T-064: Final duplicate code audit across entire codebase
- [ ] T-065: Final build check: `pnpm build` exits 0
- [ ] T-066: Final E2E test: All pages render correctly

---

## Summary

- **Total Tasks**: 66
- **Estimated LoC Reduction**: 1,500+
- **Security Issues Fixed**: 3
- **Component Duplications Eliminated**: 15+
- **Action Duplications Fixed**: 7

## Completion Criteria

- [ ] All 66 tasks completed
- [ ] Build passes: `pnpm build` exits 0
- [ ] Security fixes verified
- [ ] UI components migrated
- [ ] Domain logic extracted
- [ ] Lib utilities consolidated
- [ ] Actions consolidated
- [ ] DB queries templated
- [ ] Modal migrated
- [ ] E2E tests pass