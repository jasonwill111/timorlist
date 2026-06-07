---
id: US-001
feature: FS-137
title: "Admin List Items as Astro Components (P1)"
status: not_started
priority: P1
created: 2026-06-07
tldr: "**As a** developer."
project: timorup
---

# US-001: Admin List Items as Astro Components (P1)

**Feature**: [FS-137](./FEATURE.md)

**As a** developer
**I want** admin list items rendered via Astro components instead of innerHTML template strings
**So that** the codebase is type-safe, maintainable, and AI-editable at the component level

---

## Acceptance Criteria

- [ ] **AC-US1-01**: All 13 admin pages (`src/pages/admin/*.astro`) no longer use `.innerHTML = \`...\`` for list rendering
- [ ] **AC-US1-02**: Each admin page has a corresponding island component (`src/components/islands/admin/*.astro`) that receives data via props and renders list items as Astro/HTML markup
- [ ] **AC-US1-03**: Server-side initial data is passed as serialized JSON props to islands (not fetched client-side for initial render)
- [ ] **AC-US1-04**: TypeScript interfaces are defined for each entity list (users, products, businesses, etc.)

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
- [ ] **T-015**: Migrate admin/index.astro (haiku)
