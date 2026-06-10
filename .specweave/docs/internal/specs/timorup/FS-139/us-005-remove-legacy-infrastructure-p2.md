---
id: US-005
feature: FS-139
title: "Remove Legacy Infrastructure (P2)"
status: completed
priority: P1
created: 2026-06-07T00:00:00.000Z
tldr: "**As a** developer."
project: timorup
---

# US-005: Remove Legacy Infrastructure (P2)

**Feature**: [FS-139](./FEATURE.md)

**As a** developer
**I want** legacy shadcn CLI infrastructure removed
**So that** project uses only fulldev source files + starwind source files

---

## Acceptance Criteria

- [x] **AC-US5-01**: `components.json` 删除
- [x] **AC-US5-02**: `Button.astro`, `Card.astro`, `CardContent.astro`, `CardDescription.astro`, `CardHeader.astro`, `CardTitle.astro`, `Input.astro`, `Select.astro`, `Textarea.astro`, `Label.astro`, `Accordion.astro`, `Tabs.astro`, `TabsList.astro`, `TabsTrigger.astro` 删除
- [x] **AC-US5-03**: 所有页面/布局中对 PascalCase 文件的 import 更新为 fulldev 子目录路径
- [x] **AC-US5-04**: `lib/utils.ts` 中 `cn()` 函数保留（fulldev + starwind 共用）

---

## Implementation

**Increment**: [0139-fulldev-starwind-migration](../../../../../increments/0139-fulldev-starwind-migration/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

- [x] **T-017**: Delete components.json
- [x] **T-018**: Delete PascalCase re-export files
