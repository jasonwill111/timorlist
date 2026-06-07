---
id: US-002
feature: FS-137
title: "Admin Modal Forms as Astro Components (P1)"
status: not_started
priority: P1
created: 2026-06-07
tldr: "**As a** developer."
project: timorup
---

# US-002: Admin Modal Forms as Astro Components (P1)

**Feature**: [FS-137](./FEATURE.md)

**As a** developer
**I want** admin create/edit modal forms rendered as Astro components instead of innerHTML template strings
**So that** forms are type-safe, accessible, and use the existing shadcn/ui component library

---

## Acceptance Criteria

- [ ] **AC-US2-01**: Each admin page's create/edit modal is a dedicated Astro island component
- [ ] **AC-US2-02**: Modals use existing `Button`, `Input`, `Select`, `Textarea` components from `@/components/ui/`
- [ ] **AC-US2-03**: Modal open/close state is managed client-side; form data submission uses `astro:actions`
- [ ] **AC-US2-04**: No inline SVG or raw HTML strings in modal templates — all UI via shadcn components

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
