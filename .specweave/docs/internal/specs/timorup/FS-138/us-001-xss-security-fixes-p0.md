---
id: US-001
feature: FS-138
title: "XSS Security Fixes (P0)"
status: completed
priority: P1
created: 2026-06-07T00:00:00.000Z
tldr: "**As a** platform admin."
project: timorup
---

# US-001: XSS Security Fixes (P0)

**Feature**: [FS-138](./FEATURE.md)

**As a** platform admin
**I want** all user-generated content rendered via innerHTML to be sanitized
**So that** XSS attacks are prevented

---

## Acceptance Criteria

- [x] **AC-US1-01**: `pages/admin/index.astro` — dashboard innerHTML 使用 DOMPurify 或 safe DOM API
- [x] **AC-US1-02**: `pages/business/[slug]/products.astro` — product card innerHTML 使用 DOMPurify
- [x] **AC-US1-03**: `pages/business/[slug]/edit/index.astro` — gallery preview innerHTML 使用 DOMPurify
- [x] **AC-US1-04**: `pages/business/[slug]/product/new/index.astro` — 确认安全
- [x] **AC-US1-05**: `pages/business/[slug]/product/[id]/edit/index.astro` — 确认安全
- [x] **AC-US1-06**: `pages/verify.astro` — 已使用 safe DOM API，无需修改

---

## Implementation

**Increment**: [0138-security-island-migration](../../../../../increments/0138-security-island-migration/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

- [x] **T-003**: Fix XSS in admin/index.astro
- [x] **T-004**: Fix XSS in business/products.astro
- [x] **T-005**: Fix XSS in business/edit.astro
- [x] **T-006**: Verify product/new and product/[id]/edit are safe
