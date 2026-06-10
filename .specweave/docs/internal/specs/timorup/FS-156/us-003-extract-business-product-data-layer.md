---
id: US-003
feature: FS-156
title: "Extract business/product data layer"
status: completed
priority: P0
created: 2026-06-08T00:00:00.000Z
tldr: "**As a** developer."
project: timorup
---

# US-003: Extract business/product data layer

**Feature**: [FS-156](./FEATURE.md)

**As a** developer
**I want** business/[slug]/product/new and business/[slug]/product/[id]/edit to import data from query functions
**So that** frontmatter contains no db.prepare() calls or drizzle-orm imports

---

## Acceptance Criteria

- [x] **AC-US3-01**: business/[slug]/product/new.astro frontmatter has zero imports from `@/db/schema` or `drizzle-orm`
- [x] **AC-US3-02**: business/[slug]/product/new.astro imports `getProductCategories` from `src/lib/db/queries/products.ts`; mutations use `actions.products.createProduct` (server action, not query layer)
- [x] **AC-US3-03**: business/[slug]/product/[id]/edit.astro frontmatter has zero imports from `@/db/schema` or `drizzle-orm`
- [x] **AC-US3-04**: business/[slug]/product/[id]/edit.astro imports `getProductCategories` from `src/lib/db/queries/products.ts`; mutations use `actions.products.updateProduct` (server action, not query layer)

---

## Implementation

**Increment**: [0156-data-layer-extraction](../../../../../increments/0156-data-layer-extraction/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

- [x] **T-005**: Add createProduct + updateProduct to products.ts
- [x] **T-006**: Wire business/[slug]/product/new.astro to query functions
- [x] **T-007**: Wire business/[slug]/product/[id]/edit.astro to query functions
