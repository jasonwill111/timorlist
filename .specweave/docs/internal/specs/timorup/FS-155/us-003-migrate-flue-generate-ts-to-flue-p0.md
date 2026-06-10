---
id: US-003
feature: FS-155
title: "Migrate `flue-generate.ts` to Flue (P0)"
status: completed
priority: P1
created: 2026-06-08T00:00:00.000Z
tldr: "**As a** developer."
project: timorup
---

# US-003: Migrate `flue-generate.ts` to Flue (P0)

**Feature**: [FS-155](./FEATURE.md)

**As a** developer
**I want** the 4 generator functions (generateListing/Sku/Blog/Landing) to use Flue
**So that** raw `fetch()` API calls are eliminated

---

## Acceptance Criteria

- [x] **AC-US3-01**: `src/lib/ai/flue-generate.ts` no longer calls `fetch()` directly
- [x] **AC-US3-02**: All 4 functions delegate to Flue agent via `init(agent).session().prompt()`
- [x] **AC-US3-03**: Return type stays same (`Promise<ListingOutput>` etc.) — callers unchanged
- [x] **AC-US3-04**: Schema validation still happens via valibot (now in Flue layer)
- [x] **AC-US3-05**: Build passes, all existing tests still green

---

## Implementation

**Increment**: [0155-flue-framework-migration](../../../../../increments/0155-flue-framework-migration/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

- [x] **T-006**: Create flue-bridge adapter
- [x] **T-007**: Refactor flue-generate.ts to use bridge
- [x] **T-008**: Write tests for bridge
- [x] **T-009**: Run full build + existing test suite
