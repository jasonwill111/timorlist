---
id: US-001
feature: FS-140
title: "Initialize Starwind CLI (P0)"
status: completed
priority: P0
created: 2026-06-07T00:00:00.000Z
tldr: "**As a** developer."
project: timorup
---

# US-001: Initialize Starwind CLI (P0)

**Feature**: [FS-140](./FEATURE.md)

**As a** developer
**I want** Starwind CLI initialized in the project
**So that** components can be installed via starwind commands

---

## Acceptance Criteria

- [x] **AC-US1-01**: `starwind.config.json` 存在，配置 `baseDir: "src/components/starwind"`
- [x] **AC-US1-02**: `npx starwind@latest --version` 输出正常
- [x] **AC-US1-03**: `src/components/starwind/` 目录存在

---

## Implementation

**Increment**: [0140-starwind-install](../../../../../increments/0140-starwind-install/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

_No tasks defined for this user story_
