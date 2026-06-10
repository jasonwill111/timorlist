---
id: US-006
feature: FS-139
title: "Starwind Components Integrated (P1)"
status: completed
priority: P1
created: 2026-06-07T00:00:00.000Z
tldr: "**As a** developer."
project: timorup
---

# US-006: Starwind Components Integrated (P1)

**Feature**: [FS-139](./FEATURE.md)

**As a** developer
**I want** Starwind components used in actual pages
**So that** the installed Starwind components are not wasted

---

## Acceptance Criteria

- [x] **AC-US6-01**: Toast 通知集成到登录/注册流程（成功/失败提示）
- [x] **AC-US6-02**: Pagination 集成到 `blog/index.astro` 和 `listings/index.astro` 列表页
- [x] **AC-US6-03**: Progress 组件用于 `business/[slug]/products.astro` 加载状态
- [x] **AC-US6-04**: Dropzone 集成到 `admin/media.astro` 文件上传

---

## Implementation

**Increment**: [0139-fulldev-starwind-migration](../../../../../increments/0139-fulldev-starwind-migration/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

- [x] **T-019**: Integrate Toast into auth flows
- [x] **T-020**: Integrate Pagination into list pages
- [x] **T-021**: Integrate Progress into product page
- [x] **T-022**: Integrate Dropzone into admin media
