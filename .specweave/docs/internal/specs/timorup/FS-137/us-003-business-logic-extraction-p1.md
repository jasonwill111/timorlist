---
id: US-003
feature: FS-137
title: "Business Logic Extraction (P1)"
status: not_started
priority: P1
created: 2026-06-07
tldr: "**As a** developer."
project: timorup
---

# US-003: Business Logic Extraction (P1)

**Feature**: [FS-137](./FEATURE.md)

**As a** developer
**I want** database queries and business logic moved from `.astro` frontmatter into `src/lib/db/queries/`
**So that** data fetching is reusable, testable, and separated from page rendering

---

## Acceptance Criteria

- [ ] **AC-US3-01**: Admin pages import query functions from `src/lib/db/queries/` instead of inlining `db.select()` calls
- [ ] **AC-US3-02**: Each query function has TypeScript return types matching the entity interface
- [ ] **AC-US3-03**: Query functions are located in `src/lib/db/queries/admin/` subdirectory
- [ ] **AC-US3-04**: Frontmatter in admin pages contains ONLY: imports, `prerender` flag, data fetching calls, and layout props — no business logic

---

## Implementation

**Increment**: [0137-admin-innerhtml-migration](../../../../../increments/0137-admin-innerhtml-migration/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

- [ ] **T-003**: Migrate ad-banners.astro (haiku)
- [ ] **T-004**: Migrate ai-tools.astro (haiku)
- [ ] **T-005**: Migrate service-packages.astro (haiku)
- [ ] **T-006**: Migrate reviews.astro (haiku)
- [ ] **T-007**: Migrate orders.astro (haiku)
- [ ] **T-008**: Migrate users.astro (haiku)
- [ ] **T-009**: Migrate businesses.astro (haiku)
- [ ] **T-010**: Migrate blogs.astro (haiku)
- [ ] **T-011**: Migrate non-profits.astro (opus)
- [ ] **T-012**: Migrate public-sectors.astro (opus)
- [ ] **T-013**: Migrate products.astro (opus)
- [ ] **T-014**: Migrate listings/index.astro (opus)
