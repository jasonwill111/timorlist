---
increment: 0138-security-island-migration
title: Admin Security + Island Migration
type: feature
priority: P1
status: completed
created: 2026-06-07T00:00:00.000Z
structure: user-stories
test_mode: TDD
coverage_target: 80
---

# Feature: Admin Security + Island Migration

## User Stories

### US-001: XSS Security Fixes (P0)
**Project**: timorup

**As a** platform admin
**I want** all user-generated content rendered via innerHTML to be sanitized
**So that** XSS attacks are prevented

**Acceptance Criteria**:
- [x] **AC-US1-01**: `pages/admin/index.astro` — dashboard innerHTML 使用 DOMPurify 或 safe DOM API
- [x] **AC-US1-02**: `pages/business/[slug]/products.astro` — product card innerHTML 使用 DOMPurify
- [x] **AC-US1-03**: `pages/business/[slug]/edit/index.astro` — gallery preview innerHTML 使用 DOMPurify
- [x] **AC-US1-04**: `pages/business/[slug]/product/new/index.astro` — 确认安全
- [x] **AC-US1-05**: `pages/business/[slug]/product/[id]/edit/index.astro` — 确认安全
- [x] **AC-US1-06**: `pages/verify.astro` — 已使用 safe DOM API，无需修改

---

### US-002: Admin Dashboard Island Migration (P1)
**Project**: timorup

**As a** platform admin
**I want** the admin dashboard to use the island pattern
**So that** server/client separation is clean and no innerHTML security risks

**Acceptance Criteria**:
- [x] **AC-US2-01**: `DashboardIsland.astro` 存在，包含所有 dashboard 逻辑
- [x] **AC-US2-02**: `pages/admin/index.astro` 简化为 island 引用 + 数据获取
- [x] **AC-US2-03**: 所有 innerHTML 改为 `textContent` / `classList` / `value`

---

### US-003: Bug Fix — Listing Edit Redirect (P1)
**Project**: timorup

**As a** admin
**I want** the listing edit page to redirect to the correct URL
**So that** I can navigate back to listings without 404

**Acceptance Criteria**:
- [x] **AC-US3-01**: `pages/admin/listings/[id]/edit/index.astro` — 所有 `/admin/listingss` → `/admin/listings`

---

### US-004: Legacy Component Dedup (P2)
**Project**: timorup

**As a** developer
**I want** duplicate PascalCase component files to be replaced with re-exports
**So that** no duplicate implementations exist

**Acceptance Criteria**:
- [x] **AC-US4-01**: `CardContent.astro`, `CardDescription.astro`, `CardHeader.astro`, `CardTitle.astro` → re-export
- [x] **AC-US4-02**: `Input.astro`, `Select.astro`, `Textarea.astro`, `Label.astro` → re-export
- [x] **AC-US4-03**: `Button.astro`, `Card.astro`, `Accordion.astro` → re-export

---

### US-005: CarouselBanner Inline Style Fix (P2)
**Project**: timorup

**As a** developer
**I want** CarouselBanner to use Tailwind instead of inline styles
**So that** design system is consistent

**Acceptance Criteria**:
- [x] **AC-US5-01**: `CarouselBanner.astro` inline style → Tailwind class
