---
id: US-004
feature: FS-155
title: "Astro Action Integration (P1)"
status: completed
priority: P1
created: 2026-06-08T00:00:00.000Z
tldr: "**As a** admin user."
project: timorup
---

# US-004: Astro Action Integration (P1)

**Feature**: [FS-155](./FEATURE.md)

**As a** admin user
**I want** the admin AI tools page to work with the new Flue backend
**So that** content generation still works for admins

---

## Acceptance Criteria

- [x] **AC-US4-01**: `src/actions/admin/aiGenerate.ts` still calls `generateListing/Sku/Blog/Landing` (unchanged interface)
- [x] **AC-US4-02**: Action timeout (120s) still works with Flue's `Promise.race`
- [x] **AC-US4-03**: Error responses still match `{ success, error: { code, message } }` shape
- [x] **AC-US4-04**: `src/pages/admin/ai-tools.astro` AIToolsIsland (from 0139) still renders previews correctly

---

## Implementation

**Increment**: [0155-flue-framework-migration](../../../../../increments/0155-flue-framework-migration/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

- [x] **T-009**: Run full build + existing test suite
- [x] **T-010**: E2E test homepage still works
- [x] **T-011**: Manual AI tool test
