---
id: US-004
feature: FS-137
title: "Build Verification (P1)"
status: not_started
priority: P1
created: 2026-06-07
tldr: "**As a** developer."
project: timorup
---

# US-004: Build Verification (P1)

**Feature**: [FS-137](./FEATURE.md)

**As a** developer
**I want** all migrated pages to build without errors
**So that** the refactor is verified complete and shippable

---

## Acceptance Criteria

- [ ] **AC-US4-01**: `pnpm exec -- astro build` completes without errors
- [ ] **AC-US4-02**: No `innerHTML` string assignment patterns remain in admin pages (grep verified)
- [ ] **AC-US4-03**: E2E tests pass for admin pages (`npx playwright test e2e/admin.spec.ts`)

---

## Implementation

**Increment**: [0137-admin-innerhtml-migration](../../../../../increments/0137-admin-innerhtml-migration/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

- [ ] **T-001**: Fix duplicate import in products.astro (haiku)
- [ ] **T-002**: Audit all admin pages for innerHTML patterns (haiku)
- [ ] **T-016**: Run full build verification (haiku)
- [ ] **T-017**: Verify zero innerHTML in admin pages (haiku)
