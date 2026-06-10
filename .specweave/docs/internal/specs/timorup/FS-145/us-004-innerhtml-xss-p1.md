---
id: US-004
feature: FS-145
title: "innerHTML XSS 审计 (P1)"
status: completed
priority: P1
created: 2026-06-07T00:00:00.000Z
tldr: "**As a** developer."
project: TimorUp
---

# US-004: innerHTML XSS 审计 (P1)

**Feature**: [FS-145](./FEATURE.md)

**As a** developer
**I want** 确认所有 innerHTML 使用安全的 API
**So that** 防止 XSS 攻击

---

## Acceptance Criteria

- [x] **AC-US4-01**: `admin/ai-tools.astro` 所有 innerHTML 使用 textContent（safe）
- [x] **AC-US4-02**: `business/[slug]/edit/index.astro` 所有 innerHTML 使用 DOMPurify.sanitize
- [x] **AC-US4-03**: `business/[slug]/products.astro` 所有 innerHTML 使用 DOMPurify.sanitize
- [x] **AC-US4-04**: `verify.astro` 使用静态 SVG path（safe）

---

## Implementation

**Increment**: [0145-fulldev-install-legacy-cleanup](../../../../../increments/0145-fulldev-install-legacy-cleanup/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

_No tasks defined for this user story_
