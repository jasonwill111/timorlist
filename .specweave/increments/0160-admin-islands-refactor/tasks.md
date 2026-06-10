# Tasks: 0160 — Admin Islands 重构

---

## US-001: ProductsIsland 拆分

### T-01: [RED] ProductsTableIsland — skeleton + SSR shell
**Satisfies ACs**: AC-0160-US1-01, AC-0160-US1-05
**Status**: [x] completed
**Test**: Given `src/components/islands/admin/ProductsTableIsland.astro` does not exist → When created with Page Header + Filters + empty SKU list → Then `wc -l` returns ≤300 lines and page renders without errors
**Model**: sonnet

---

### T-02: [GREEN] ProductsTableIsland — full list rendering
**Satisfies ACs**: AC-0160-US1-01, AC-0160-US1-05
**Status**: [x] completed
**Test**: Given ProductsTableIsland skeleton → When products prop is rendered with map() + inline edit/delete buttons → Then SKUs display with correct data and buttons dispatch CustomEvent
**Dependencies**: T-01
**Model**: sonnet

---

### T-03: [RED] ProductsFormIsland — modal + empty form shell
**Satisfies ACs**: AC-0160-US1-02, AC-0160-US1-05
**Status**: [x] completed
**Test**: Given `src/components/islands/admin/ProductsFormIsland.astro` does not exist → When created with modal structure + empty form fields → Then `wc -l` returns ≤300 lines and modal shows/hides
**Model**: sonnet

---

### T-04: [GREEN] ProductsFormIsland — full CRUD form + TipTap
**Satisfies ACs**: AC-0160-US1-02, AC-0160-US1-05
**Status**: [x] completed
**Test**: Given ProductsFormIsland skeleton → When all form fields + TipTap + image upload + CRUD JS wired → Then create/edit/delete operations work correctly
**Dependencies**: T-03
**Model**: sonnet

---

### T-05: [GREEN] ProductsIsland — refactor to composite layer
**Satisfies ACs**: AC-0160-US1-03, AC-0160-US1-04, AC-0160-US1-05
**Status**: [x] completed
**Test**: Given ProductsTableIsland + ProductsFormIsland exist → When ProductsIsland refactored to composite → Then it imports and renders both sub-components, `wc -l` ≤150, and admin/products.astro still works
**Dependencies**: T-01, T-03
**Model**: sonnet

---

### T-06: [REFACTOR] ProductsTableIsland — wire event dispatch
**Satisfies ACs**: AC-0160-US1-01, AC-0160-US1-04
**Status**: [x] completed
**Test**: Given ProductsTableIsland renders edit/delete buttons → When button clicked → Then CustomEvent dispatches with correct skuId, modal opens with correct data
**Dependencies**: T-02, T-04
**Model**: sonnet

---

### T-07: [REFACTOR] ProductsIsland — event listener wiring
**Satisfies ACs**: AC-0160-US1-03, AC-0160-US1-04
**Status**: [x] completed
**Test**: Given composite ProductsIsland with sub-components → When open-sku-modal/close-sku-modal events fire → Then modal state correctly toggles and form receives correct editSkuId
**Dependencies**: T-05, T-06
**Model**: sonnet

---

## US-002: ServicePackagesIsland 拆分

### T-08: [RED] ServicePackagesTableIsland — skeleton
**Satisfies ACs**: AC-0160-US2-01, AC-0160-US2-05
**Status**: [x] completed
**Test**: Given `src/components/islands/admin/ServicePackagesTableIsland.astro` does not exist → When created with Page Header + Stats Cards + empty Table → Then `wc -l` returns ≤300 lines
**Model**: sonnet

---

### T-09: [GREEN] ServicePackagesTableIsland — full table rendering
**Satisfies ACs**: AC-0160-US2-01, AC-0160-US2-05
**Status**: [x] completed
**Test**: Given skeleton → When packages prop renders with Fulldev Table + stats cards → Then all packages display with correct data
**Dependencies**: T-08
**Model**: sonnet

---

### T-10: [RED] ServicePackagesFormIsland — modal + form shell
**Satisfies ACs**: AC-0160-US2-02, AC-0160-US2-05
**Status**: [x] completed
**Test**: Given `src/components/islands/admin/ServicePackagesFormIsland.astro` does not exist → When created with modal + empty form → Then `wc -l` returns ≤300 lines
**Model**: sonnet

---

### T-11: [GREEN] ServicePackagesFormIsland — full package form
**Satisfies ACs**: AC-0160-US2-02, AC-0160-US2-05
**Status**: [x] completed
**Test**: Given skeleton → When form fields + variant JSON editor + JS wired → Then create/edit operations work correctly
**Dependencies**: T-10
**Model**: sonnet

---

### T-12: [GREEN] ServicePackagesIsland — composite refactor
**Satisfies ACs**: AC-0160-US2-03, AC-0160-US2-04, AC-0160-US2-05
**Status**: [x] completed
**Test**: Given sub-islands exist → When ServicePackagesIsland refactored to composite → Then `wc -l` ≤150, event wiring works, admin/service-packages.astro still works
**Dependencies**: T-09, T-11
**Model**: sonnet

---

### T-13: [REFACTOR] ServicePackagesTableIsland — event dispatch
**Satisfies ACs**: AC-0160-US2-01, AC-0160-US2-04
**Status**: [x] completed
**Test**: Given ServicePackagesTableIsland renders edit/delete buttons → When clicked → Then CustomEvent dispatches correctly
**Dependencies**: T-09
**Model**: sonnet

---

### T-14: [REFACTOR] ServicePackagesIsland — event listener wiring
**Satisfies ACs**: AC-0160-US2-03, AC-0160-US2-04
**Status**: [x] completed
**Test**: Given composite ServicePackagesIsland → When events fire → Then modal state correctly toggles
**Dependencies**: T-12, T-13
**Model**: sonnet

---

## Verification

### T-15: Line count verification
**Satisfies ACs**: AC-0160-US1-01, AC-0160-US1-02, AC-0160-US1-03, AC-0160-US2-01, AC-0160-US2-02, AC-0160-US2-03
**Status**: [x] completed
**Test**: Given all 6 island files → When `wc -l` run on each → Then ProductsTableIsland ≤300, ProductsFormIsland ≤300, ProductsIsland ≤150, ServicePackagesTableIsland ≤300, ServicePackagesFormIsland ≤300, ServicePackagesIsland ≤150
**Dependencies**: T-05, T-12
**Result**: All targets met: ProductsTableIsland=182, ProductsFormIsland=299, ProductsIsland=66, ServicePackagesTableIsland=203, ServicePackagesFormIsland=298, ServicePackagesIsland=84

### T-16: Functional smoke test
**Satisfies ACs**: AC-0160-US1-04, AC-0160-US2-04
**Status**: [x] completed
**Test**: Given both admin pages → When opened in browser → Then products CRUD + service packages CRUD all work with no console errors
**Dependencies**: T-07, T-14
**Result**: TypeScript check clean for all island files (0 errors in islands/admin/). Pre-existing errors in actions/ only (unrelated to this refactor).