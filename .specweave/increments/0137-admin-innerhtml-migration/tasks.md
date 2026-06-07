# Tasks: Admin innerHTML Migration to Astro Components

## Task Notation

- `[T###]`: Task ID
- `[P]`: Parallelizable (can run in parallel with same-complexity tasks)
- `[ ]`: Not started
- `[x]`: Completed
- Model: haiku (simple), opus (complex/architectural)

## Phase 1: Foundation

### T-001: Fix duplicate import in products.astro (haiku)
**AC**: AC-US4-01 (build fix)
**Description**: Fix duplicate `Button` import in `src/pages/admin/products.astro` (lines 4 and 7 both import Button)
**Implementation**:
- Remove duplicate import on line 7
- Keep single `import { Button } from '@components/ui/button';`
**Test**: `pnpm exec -- astro build` succeeds
**Status**: [ ] not started

### T-002: Audit all admin pages for innerHTML patterns (haiku)
**AC**: AC-US4-02
**Description**: Run comprehensive grep to map all innerHTML usages across all 13 admin pages before migration
**Implementation**:
- `grep -n "\.innerHTML" src/pages/admin/*.astro` → capture line numbers per file
- `grep -n "innerHTML\s*=" src/pages/admin/*.astro` → capture assignments
- Document each innerHTML usage: file, line, what it renders (list items, modal, etc.)
**Test**: List of all 47 innerHTML occurrences documented
**Status**: [ ] not started

## Phase 2: Simple Pages (Low innerHTML count)

### T-003: Migrate ad-banners.astro (haiku)
**AC**: AC-US1-01, AC-US1-02, AC-US1-03, AC-US1-04, AC-US2-01, AC-US2-02, AC-US2-03, AC-US2-04, AC-US3-01, AC-US3-02, AC-US3-03, AC-US3-04
**Description**: Migrate ad-banners admin page from innerHTML to island component
**Files to create/modify**:
- Create `src/lib/db/queries/admin/ad-banners.ts` — query function for heroes list
- Create `src/components/islands/admin/AdBannersIsland.astro` — island with list rendering + modal
- Modify `src/pages/admin/ad-banners.astro` — server-side fetch, pass props to island
**Test Plan**:
- Given admin user visits /admin/ad-banners
- When page loads
- Then hero list renders via island component (not innerHTML)
- And create/edit modal opens on button click
- And form submits via astro:actions
**Dependencies**: T-001
**Status**: [ ] not started

### T-004: Migrate ai-tools.astro (haiku)
**AC**: AC-US1-01, AC-US1-02, AC-US1-03, AC-US1-04, AC-US2-01, AC-US2-02, AC-US2-03, AC-US2-04, AC-US3-01, AC-US3-02, AC-US3-03, AC-US3-04
**Files**: `src/lib/db/queries/admin/ai-tools.ts`, `src/components/islands/admin/AiToolsIsland.astro`, `src/pages/admin/ai-tools.astro`
**Test Plan**:
- Given admin user visits /admin/ai-tools
- When page loads
- Then AI tools list renders via island component
**Dependencies**: T-002
**Status**: [ ] not started

### T-005: Migrate service-packages.astro (haiku)
**AC**: AC-US1-01, AC-US1-02, AC-US1-03, AC-US1-04, AC-US2-01, AC-US2-02, AC-US2-03, AC-US2-04, AC-US3-01, AC-US3-02, AC-US3-03, AC-US3-04
**Files**: `src/lib/db/queries/admin/service-packages.ts`, `src/components/islands/admin/ServicePackagesIsland.astro`, `src/pages/admin/service-packages.astro`
**Test Plan**:
- Given admin user visits /admin/service-packages
- When page loads
- Then service packages list renders via island component
**Dependencies**: T-002
**Status**: [ ] not started

### T-006: Migrate reviews.astro (haiku)
**AC**: AC-US1-01, AC-US1-02, AC-US1-03, AC-US1-04, AC-US2-01, AC-US2-02, AC-US2-03, AC-US2-04, AC-US3-01, AC-US3-02, AC-US3-03, AC-US3-04
**Files**: `src/lib/db/queries/admin/reviews.ts`, `src/components/islands/admin/ReviewsIsland.astro`, `src/pages/admin/reviews.astro`
**Test Plan**:
- Given admin user visits /admin/reviews
- When page loads
- Then reviews list renders via island component
**Dependencies**: T-002
**Status**: [ ] not started

### T-007: Migrate orders.astro (haiku)
**AC**: AC-US1-01, AC-US1-02, AC-US1-03, AC-US1-04, AC-US2-01, AC-US2-02, AC-US2-03, AC-US2-04, AC-US3-01, AC-US3-02, AC-US3-03, AC-US3-04
**Files**: `src/lib/db/queries/admin/orders.ts`, `src/components/islands/admin/OrdersIsland.astro`, `src/pages/admin/orders.astro`
**Test Plan**:
- Given admin user visits /admin/orders
- When page loads
- Then orders list renders via island component
**Dependencies**: T-002
**Status**: [ ] not started

## Phase 3: Medium Pages

### T-008: Migrate users.astro (haiku)
**AC**: AC-US1-01, AC-US1-02, AC-US1-03, AC-US1-04, AC-US2-01, AC-US2-02, AC-US2-03, AC-US2-04, AC-US3-01, AC-US3-02, AC-US3-03, AC-US3-04
**Files**: `src/lib/db/queries/admin/users.ts`, `src/components/islands/admin/UsersIsland.astro`, `src/pages/admin/users.astro`
**Test Plan**:
- Given admin user visits /admin/users
- When page loads
- Then users list renders via island component with pagination
**Dependencies**: T-002
**Status**: [ ] not started

### T-009: Migrate businesses.astro (haiku)
**AC**: AC-US1-01, AC-US1-02, AC-US1-03, AC-US1-04, AC-US2-01, AC-US2-02, AC-US2-03, AC-US2-04, AC-US3-01, AC-US3-02, AC-US3-03, AC-US3-04
**Files**: `src/lib/db/queries/admin/businesses.ts`, `src/components/islands/admin/BusinessesIsland.astro`, `src/pages/admin/businesses.astro`
**Test Plan**:
- Given admin user visits /admin/businesses
- When page loads
- Then businesses list renders via island component
**Dependencies**: T-002
**Status**: [ ] not started

### T-010: Migrate blogs.astro (haiku)
**AC**: AC-US1-01, AC-US1-02, AC-US1-03, AC-US1-04, AC-US2-01, AC-US2-02, AC-US2-03, AC-US2-04, AC-US3-01, AC-US3-02, AC-US3-03, AC-US3-04
**Files**: `src/lib/db/queries/admin/blogs.ts`, `src/components/islands/admin/BlogsIsland.astro`, `src/pages/admin/blogs.astro`
**Test Plan**:
- Given admin user visits /admin/blogs
- When page loads
- Then blog posts list renders via island component
**Dependencies**: T-002
**Status**: [ ] not started

## Phase 4: High-Complexity Pages

### T-011: Migrate non-profits.astro (opus)
**AC**: AC-US1-01, AC-US1-02, AC-US1-03, AC-US1-04, AC-US2-01, AC-US2-02, AC-US2-03, AC-US2-04, AC-US3-01, AC-US3-02, AC-US3-03, AC-US3-04
**Description**: Complex page with TipTap editor, about/updates textareas (innerHTML), and multiple entity types
**Files**: `src/lib/db/queries/admin/non-profits.ts`, `src/components/islands/admin/NonProfitsIsland.astro`, `src/pages/admin/non-profits.astro`
**Test Plan**:
- Given admin user visits /admin/non-profits
- When page loads
- Then non-profits list renders via island component
- And TipTap editor initializes in modal
**Dependencies**: T-002
**Status**: [ ] not started

### T-012: Migrate public-sectors.astro (opus)
**AC**: AC-US1-01, AC-US1-02, AC-US1-03, AC-US1-04, AC-US2-01, AC-US2-02, AC-US2-03, AC-US2-04, AC-US3-01, AC-US3-02, AC-US3-03, AC-US3-04
**Description**: 5 innerHTML usages — includes table rendering with status badges and complex modal
**Files**: `src/lib/db/queries/admin/public-sectors.ts`, `src/components/islands/admin/PublicSectorsIsland.astro`, `src/pages/admin/public-sectors.astro`
**Test Plan**:
- Given admin user visits /admin/public-sectors
- When page loads
- Then public sectors table renders via island component
**Dependencies**: T-002
**Status**: [ ] not started

### T-013: Migrate products.astro (opus)
**AC**: AC-US1-01, AC-US1-02, AC-US1-03, AC-US1-04, AC-US2-01, AC-US2-02, AC-US2-03, AC-US2-04, AC-US3-01, AC-US3-02, AC-US3-03, AC-US3-04
**Description**: 8 innerHTML usages — most complex page. Has search, filters, pagination, and complex create/edit modal with business selector
**Files**: `src/lib/db/queries/admin/products.ts`, `src/components/islands/admin/ProductsIsland.astro` (enhance existing), `src/pages/admin/products.astro`
**Test Plan**:
- Given admin user visits /admin/products
- When page loads
- Then products/SKUs list renders via island component
- And search/filter works client-side
- And create/edit modal submits via astro:actions
**Dependencies**: T-002
**Status**: [ ] not started

### T-014: Migrate listings/index.astro (opus)
**AC**: AC-US1-01, AC-US1-02, AC-US1-03, AC-US1-04, AC-US2-01, AC-US2-02, AC-US2-03, AC-US2-04, AC-US3-01, AC-US3-02, AC-US3-03, AC-US3-04
**Files**: `src/lib/db/queries/admin/listings.ts`, `src/components/islands/admin/ListingsIsland.astro`, `src/pages/admin/listings/index.astro`
**Test Plan**:
- Given admin user visits /admin/listings
- When page loads
- Then listings table renders via island component
**Dependencies**: T-002
**Status**: [ ] not started

## Phase 5: Dashboard

### T-015: Migrate admin/index.astro (haiku)
**AC**: AC-US1-01, AC-US1-02, AC-US1-03, AC-US1-04
**Description**: Dashboard page with stats charts using SVG innerHTML. Migrate to DashboardIsland with server-fetched stats
**Files**: `src/lib/db/queries/admin/dashboard.ts`, `src/components/islands/admin/DashboardIsland.astro`, `src/pages/admin/index.astro`
**Test Plan**:
- Given admin user visits /admin
- When page loads
- Then stats cards render via island component
- And SVG chart renders from server-fetched data
**Dependencies**: T-002
**Status**: [ ] not started

## Phase 6: Build Verification

### T-016: Run full build verification (haiku)
**AC**: AC-US4-01
**Description**: Run full Astro build and verify no errors across all admin pages
**Implementation**:
- `pnpm exec -- astro build`
- Fix any TypeScript errors in new island components
- Fix any import path issues
**Test**: Build succeeds with zero errors
**Dependencies**: T-003 through T-015
**Status**: [ ] not started

### T-017: Verify zero innerHTML in admin pages (haiku)
**AC**: AC-US4-02
**Description**: Confirm no innerHTML string assignment patterns remain in admin pages
**Implementation**:
- `grep -n "\.innerHTML\s*=" src/pages/admin/*.astro`
- `grep -n "innerHTML\s*=" src/pages/admin/*.astro`
- Both should return zero results
**Test**: grep returns empty results
**Dependencies**: T-016
**Status**: [ ] not started

## Execution Strategy

Tasks T-003 through T-010 are parallelizable by complexity. Run 3-4 in parallel for speed.

```
EXECUTION STRATEGY
================================================
Tasks: 17 | Complexity: High (3 complex pages)

sw:do 0137        - Step-by-step, full control
sw:auto 0137      - Autonomous sequential (unattended)
sw:team-lead      - Parallel multi-agent (recommended for speed)
```

Recommended approach: `sw:do 0137` for controlled step-by-step migration, verifying build after each page.