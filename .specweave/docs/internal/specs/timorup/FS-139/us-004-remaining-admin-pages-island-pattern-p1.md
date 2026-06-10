---
id: US-004
feature: FS-139
title: "Remaining Admin Pages → Island Pattern (P1)"
status: completed
priority: P1
created: 2026-06-07T00:00:00.000Z
tldr: "**As a** developer."
project: timorup
---

# US-004: Remaining Admin Pages → Island Pattern (P1)

**Feature**: [FS-139](./FEATURE.md)

**As a** developer
**I want** remaining admin pages migrated to the island pattern
**So that** no inline scripts remain in admin pages and XSS risks are eliminated

---

## Acceptance Criteria

- [x] **AC-US4-01**: `pages/admin/login.astro` → 创建 `LoginIsland.astro`，inline script 全部迁移
- [x] **AC-US4-02**: `pages/admin/media.astro` → 创建 `MediaIsland.astro`，inline script 全部迁移
- [x] **AC-US4-03**: `pages/admin/ai-tools.astro` → 创建 `AIToolsIsland.astro`，inline script 全部迁移
- [x] **AC-US4-04**: `pages/admin/settings.astro` → 创建 `SettingsIsland.astro`，inline script 全部迁移
- [x] **AC-US4-05**: 所有 island 使用 `textContent`/`classList`/`value` 替代 innerHTML，无 XSS 风险

---

## Implementation

**Increment**: [0139-fulldev-starwind-migration](../../../../../increments/0139-fulldev-starwind-migration/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

- [x] **T-013**: Create LoginIsland
- [x] **T-014**: Create MediaIsland
- [x] **T-015**: Create AIToolsIsland
- [x] **T-016**: Create SettingsIsland
