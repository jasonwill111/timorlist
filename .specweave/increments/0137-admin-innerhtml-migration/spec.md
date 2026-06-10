---
increment: 0137-admin-innerhtml-migration
title: Admin innerHTML Migration to Astro Components
type: refactor
priority: P1
status: completed
created: 2026-06-07T00:00:00.000Z
structure: user-stories
test_mode: TDD
coverage_target: 80
---

# Feature: Admin innerHTML Migration to Astro Components

## Overview

Replace innerHTML string-generation DOM patterns with proper Astro component architecture across 13 admin pages. Extract business logic from frontmatter into lib/db/queries/. Goal: clean separation of UI (Astro components) and business logic (lib layer), enabling AI maintainability.

## User Stories

### US-001: Admin List Items as Astro Components (P1)
**Project**: timorup

**As a** developer
**I want** admin list items rendered via Astro components instead of innerHTML template strings
**So that** the codebase is type-safe, maintainable, and AI-editable at the component level

**Acceptance Criteria**:
- [x] **AC-US1-01**: All 13 admin pages (`src/pages/admin/*.astro`) no longer use `.innerHTML = \`...\`` for list rendering
- [x] **AC-US1-02**: Each admin page has a corresponding island component (`src/components/islands/admin/*.astro`) that receives data via props and renders list items as Astro/HTML markup
- [x] **AC-US1-03**: Server-side initial data is passed as serialized JSON props to islands (not fetched client-side for initial render)
- [x] **AC-US1-04**: TypeScript interfaces are defined for each entity list (users, products, businesses, etc.)

---

### US-002: Admin Modal Forms as Astro Components (P1)
**Project**: timorup

**As a** developer
**I want** admin create/edit modal forms rendered as Astro components instead of innerHTML template strings
**So that** forms are type-safe, accessible, and use the existing shadcn/ui component library

**Acceptance Criteria**:
- [x] **AC-US2-01**: Each admin page's create/edit modal is a dedicated Astro island component
- [x] **AC-US2-02**: Modals use existing `Button`, `Input`, `Select`, `Textarea` components from `@/components/ui/`
- [x] **AC-US2-03**: Modal open/close state is managed client-side; form data submission uses `astro:actions`
- [x] **AC-US2-04**: No inline SVG or raw HTML strings in modal templates — all UI via shadcn components

---

### US-003: Business Logic Extraction (P1)
**Project**: timorup

**As a** developer
**I want** database queries and business logic moved from `.astro` frontmatter into `src/lib/db/queries/`
**So that** data fetching is reusable, testable, and separated from page rendering

**Acceptance Criteria**:
- [x] **AC-US3-01**: Admin pages import query functions from `src/lib/db/queries/` instead of inlining `db.select()` calls
- [x] **AC-US3-02**: Each query function has TypeScript return types matching the entity interface
- [x] **AC-US3-03**: Query functions are located in `src/lib/db/queries/admin/` subdirectory
- [x] **AC-US3-04**: Frontmatter in admin pages contains ONLY: imports, `prerender` flag, data fetching calls, and layout props — no business logic

---

### US-004: Build Verification (P1)
**Project**: timorup

**As a** developer
**I want** all migrated pages to build without errors
**So that** the refactor is verified complete and shippable

**Acceptance Criteria**:
- [x] **AC-US4-01**: `pnpm exec -- astro build` completes without errors
- [x] **AC-US4-02**: No `innerHTML` string assignment patterns remain in admin pages (grep verified)
- [x] **AC-US4-03**: E2E tests pass for admin pages (`npx playwright test e2e/admin.spec.ts`)

## Pages in Scope

| Page | innerHTML count | Entity |
|------|----------------|--------|
| `admin/index.astro` | 5 | Dashboard stats |
| `admin/users.astro` | 2 | Users |
| `admin/service-packages.astro` | 2 | Service packages |
| `admin/reviews.astro` | 2 | Reviews |
| `admin/public-sectors.astro` | 5 | Public sectors |
| `admin/products.astro` | 8 | Products/SKUs |
| `admin/orders.astro` | 2 | Orders |
| `admin/non-profits.astro` | 5 | Non-profits |
| `admin/businesses.astro` | 3 | Businesses |
| `admin/blogs.astro` | 4 | Blog posts |
| `admin/ai-tools.astro` | 2 | AI tools |
| `admin/ad-banners.astro` | 3 | Ad banners |
| `admin/listings/index.astro` | 4 | Listings |
| **Total** | **47** | |

## Pages Out of Scope

- `admin/categories.astro` — being deleted per user's earlier decision
- Non-admin pages

## Architecture

### Pattern: Server Island → Client Island

```
admin/products.astro (server)
  ├── fetch data server-side
  ├── pass as props to <ProductsIsland data={...} client:load />
  └── ProductsIsland renders list + modal (client hydration)
```

### Migration Order (by complexity)

1. **Simple pages** (low innerHTML count): ai-tools, service-packages, reviews, orders
2. **Medium pages**: users, businesses, blogs, ad-banners
3. **Complex pages**: non-profits, public-sectors, products
4. **Dashboard last**: admin/index.astro

### File Structure After Migration

```
src/
├── components/islands/admin/
│   ├── UsersIsland.astro
│   ├── ProductsIsland.astro
│   ├── BusinessesIsland.astro
│   ├── BlogsIsland.astro
│   ├── AdBannersIsland.astro
│   ├── ReviewsIsland.astro
│   ├── ServicePackagesIsland.astro
│   ├── OrdersIsland.astro
│   ├── NonProfitsIsland.astro
│   ├── PublicSectorsIsland.astro
│   ├── ListingsIsland.astro
│   └── DashboardIsland.astro
├── lib/db/queries/admin/
│   ├── users.ts
│   ├── products.ts
│   ├── businesses.ts
│   ├── blogs.ts
│   ├── ad-banners.ts
│   ├── reviews.ts
│   ├── service-packages.ts
│   ├── orders.ts
│   ├── non-profits.ts
│   ├── public-sectors.ts
│   └── listings.ts
└── pages/admin/
    ├── users.astro        (server-side data fetch, passes to island)
    ├── products.astro
    └── ...
```

## Dependencies

- Existing shadcn/ui components (`Button`, `Input`, `Select`, `Textarea`, `Card`, etc.)
- `astro:actions` for form submission (already used in ad-banners.astro)
- `client:load` directive for island hydration

## Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| Breaking existing admin functionality | E2E tests before/after; test each page incrementally |
| Over-complexity from islands | Start with simplest pages; validate pattern before scaling |
| Form state management complexity | Use `useState` equivalent via `<script>` in island components |
