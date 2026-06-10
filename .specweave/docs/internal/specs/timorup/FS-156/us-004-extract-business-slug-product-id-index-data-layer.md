---
id: US-004
feature: FS-156
title: "Extract business/[slug]/product/[id]/index data layer"
status: completed
priority: P0
created: 2026-06-08T00:00:00.000Z
tldr: "**As a** developer."
project: timorup
---

# US-004: Extract business/[slug]/product/[id]/index data layer

**Feature**: [FS-156](./FEATURE.md)

**As a** developer
**I want** business/[slug]/product/[id]/index.astro to use the existing `getProductById` query function
**So that** the 109-line raw SQL frontmatter is replaced with a single function call

---

## Acceptance Criteria

- [x] **AC-US4-01**: business/[slug]/product/[id]/index.astro frontmatter uses `getProductWithDetails` from `src/lib/db/queries/products.ts`
- [x] **AC-US4-02**: business/[slug]/product/[id]/index.astro has zero `db.prepare()` calls
- [x] **AC-US4-03**: business/[slug]/product/[id]/index.astro frontmatter reduced from ~109 lines to 68 lines; inline post-processing (title/desc, spec/price parsing, type labels) remains in frontmatter as non-DB wiring logic

---

## Implementation

**Increment**: [0156-data-layer-extraction](../../../../../increments/0156-data-layer-extraction/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

- [x] **T-008**: Wire business/[slug]/product/[id]/index.astro to existing query function
