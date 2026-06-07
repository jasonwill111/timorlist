---
id: US-008
feature: FS-103
title: "Modal Migration (P2)"
status: not_started
priority: P1
created: 2026-06-04
tldr: "**Problem**: Custom Modal uses global showModal/hideModal API."
project: TimorUp
---

# US-008: Modal Migration (P2)

**Feature**: [FS-103](./FEATURE.md)

**Problem**: Custom Modal uses global showModal/hideModal API
**Solution**: Migrate to @fulldev/dialog with reactive state
**Files**: src/components/ui/Modal.astro, 15+ usage sites

## Acceptance Criteria

- [x] All security issues fixed and verified
- [x] @fulldev installed and components migrated
- [x] Domain logic separated from presentation
- [x] Lib utilities consolidated (0 duplicate functions)
- [x] Actions consolidated (0 duplicate logic)
- [x] DB queries templated where applicable
- [x] Modal migrated to @fulldev/dialog
- [x] Build passes: `pnpm build` exits 0
- [x] All pages render correctly
- [x] E2E tests pass

## Expected Outcomes

| Metric | Before | After | Change |
|--------|--------|-------|--------|
| UI Components LoC | ~800 | ~250 | -69% |
| Lib Duplications | 15+ | 0 | -100% |
| Action Duplications | 7 groups | 0 | -100% |
| Security Issues | 3 critical | 0 | -100% |
| Maintainability | LOW | HIGH | +200% |

## Rollback Plan

If migration causes issues:
1. Revert to pre-migration git commit
2. Restore custom components from backup
3. Re-deploy previous version
4. Document failure reason before retrying

## Dependencies

- @fulldev packages (npm registry)
- shadcn CLI (npx shadcn@latest)
- Current Drizzle schema unchanged
- Cloudflare Workers environment compatibility maintained

---

## Acceptance Criteria

No acceptance criteria defined.

---

## Implementation

**Increment**: [0103-fulldev-migration-refactor](../../../../../increments/0103-fulldev-migration-refactor/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

_No tasks defined for this user story_
