---
id: US-007
feature: FS-139
title: "Build Verification (P0)"
status: completed
priority: P1
created: 2026-06-07T00:00:00.000Z
tldr: "**As a** developer."
project: timorup
---

# US-007: Build Verification (P0)

**Feature**: [FS-139](./FEATURE.md)

**As a** developer
**I want** the full build to pass after migration
**So that** no runtime regressions exist

---

## Acceptance Criteria

- [x] **AC-US7-01**: `pnpm exec -- astro build` 退出码 0，无错误
- [x] **AC-US7-02**: `pnpm exec -- playwright test` 核心 E2E 场景通过
- [x] **AC-US7-03**: 无 `innerHTML` 在非 island 页面中使用

---

## Implementation

**Increment**: [0139-fulldev-starwind-migration](../../../../../increments/0139-fulldev-starwind-migration/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

- [x] **T-023**: Full build verification
- [x] **T-024**: E2E smoke test
