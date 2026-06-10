---
id: US-001
feature: FS-139
title: "Install Starwind UI (P0)"
status: completed
priority: P1
created: 2026-06-07T00:00:00.000Z
tldr: "**As a** developer."
project: timorup
---

# US-001: Install Starwind UI (P0)

**Feature**: [FS-139](./FEATURE.md)

**As a** developer
**I want** Starwind UI installed via its CLI
**So that** Starwind components are available as source files in `src/components/starwind/`

---

## Acceptance Criteria

- [x] **AC-US1-01**: `npx starwind@latest init` 成功，生成 `starwind.config.json`
- [x] **AC-US1-02**: `npx starwind@latest add` 安装 10 个差异化组件：toast, dropzone, pagination, progress, color-picker, scroll-area, hover-card, context-menu, image, item
- [x] **AC-US1-03**: `src/components/starwind/` 目录存在，组件文件完整
- [x] **AC-US1-04**: `starwind.config.json` 中 `baseDir` 指向 `src/components/starwind`

---

## Implementation

**Increment**: [0139-fulldev-starwind-migration](../../../../../increments/0139-fulldev-starwind-migration/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

- [x] **T-001**: Initialize Starwind CLI
- [x] **T-002**: Install Starwind Components
