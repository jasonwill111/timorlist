---
increment: 0147-remaining-pages-component-migration
title: Remaining pages component migration -- auth/dashboard/contact/search
type: refactor
priority: P2
status: completed
created: 2026-06-07T00:00:00.000Z
structure: user-stories
test_mode: test-after
coverage_target: 80
---

# Feature: Remaining pages component migration -- auth/dashboard/contact/search

## Overview

Remaining non-form pages use Fulldev components. Covers auth pages (login/register/forgot-password/reset-password), account dashboard, contact, search, and homepage hero sections.

## User Stories

### US-001: Auth pages component migration (P1)
**Project**: timorup

**As a** developer
**I want** login/register/forgot-password/reset-password pages use Fulldev components
**So that** Auth flows are consistent and accessible

**Acceptance Criteria**:
- [x] **AC-US1-01**: pages/login.astro uses Fulldev Button/Input/Label components
- [x] **AC-US1-02**: pages/register.astro uses Fulldev components
- [x] **AC-US1-03**: pages/forgot-password.astro uses Fulldev components
- [x] **AC-US1-04**: pages/reset-password.astro uses Fulldev components
- [x] **AC-US1-05**: Auth flows (login/register/password reset) work correctly

### US-002: Account dashboard component migration (P1)
**Project**: timorup

**As a** developer
**I want** account.astro uses Fulldev components
**So that** Dashboard UI is consistent

**Acceptance Criteria**:
- [x] **AC-US2-01**: pages/account.astro uses Fulldev Button/Card/Table components
- [x] **AC-US2-02**: Dashboard displays account info correctly

### US-003: Contact page component migration (P2)
**Project**: timorup

**As a** developer
**I want** contact.astro uses Fulldev components
**So that** Contact form is consistent

**Acceptance Criteria**:
- [x] **AC-US3-01**: pages/contact.astro uses Fulldev Form/Input/Textarea/Button components
- [x] **AC-US3-02**: Contact form submission works correctly

### US-004: Search page component migration (P2)
**Project**: timorup

**As a** developer
**I want** search.astro uses Fulldev components
**So that** Search UI is consistent

**Acceptance Criteria**:
- [x] **AC-US4-01**: pages/search.astro uses Fulldev Input/Button/Card components
- [x] **AC-US4-02**: Search functionality works correctly

### US-005: Homepage hero section using Fulldev blocks (P2)
**Project**: timorup

**As a** developer
**I want** homepage uses Fulldev blocks for hero section
**So that** Homepage is modern and consistent

**Acceptance Criteria**:
- [x] **AC-US5-01**: pages/index.astro hero section uses Fulldev hero-* block
- [x] **AC-US5-02**: Homepage displays correctly on all viewports

### US-006: Build + function verification (P0)
**Project**: timorup

**As a** developer
**I want** All changes pass build, functions work correctly
**So that** No regression

**Acceptance Criteria**:
- [x] **AC-US6-01**: pnpm exec -- astro build exit code 0
- [x] **AC-US6-02**: All page interactions (auth flows, dashboard, contact form, search) work correctly

## Out of Scope

- Admin page migration (0143/0146 handles this)
- Form page migration (0146 handles this)
- Data layer extraction (0148 handles this)

## Dependencies

- Depends on 0145 (Fulldev installation complete)
