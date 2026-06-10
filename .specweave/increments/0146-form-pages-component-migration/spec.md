---
increment: 0146-form-pages-component-migration
title: Form pages component migration -- Fulldev replaces raw HTML
type: refactor
priority: P1
status: completed
created: 2026-06-07T00:00:00.000Z
structure: user-stories
test_mode: test-after
coverage_target: 80
---

# Feature: Form pages component migration -- Fulldev replaces raw HTML

## Overview

6 form-heavy pages: raw HTML -> Fulldev components. Replace raw HTML buttons/inputs/selects with Fulldev Button/Input/Select/Textarea/Label/Form/Card/Checkbox/Switch components.

## User Stories

### US-001: admin/ai-tools.astro form component migration (P0)
**Project**: timorup

**As a** developer
**I want** admin/ai-tools.astro uses Fulldev components
**So that** AI generation forms have consistent UI style

**Acceptance Criteria**:
- [x] **AC-US1-01**: All raw button -> Button component (preserve variant/size)
- [x] **AC-US1-02**: All raw input -> Input component
- [x] **AC-US1-03**: All raw select -> Select component
- [x] **AC-US1-04**: All raw textarea -> Textarea component
- [x] **AC-US1-05**: All raw label -> Label component
- [x] **AC-US1-06**: AI generation forms work correctly (listing/AI/SKU generation)

### US-002: admin/listings/[id]/edit form component migration (P0)
**Project**: timorup

**As a** developer
**I want** admin/listings/[id]/edit/index.astro uses Fulldev components
**So that** Edit form has consistent UI style

**Acceptance Criteria**:
- [x] **AC-US2-01**: All raw input -> Input component
- [x] **AC-US2-02**: All raw select -> Select component
- [x] **AC-US2-03**: All raw textarea -> Textarea component
- [x] **AC-US2-04**: All raw button -> Button component
- [x] **AC-US2-05**: Listing edit save works correctly

### US-003: business/[slug]/edit form component migration (P1)
**Project**: timorup

**As a** developer
**I want** business/[slug]/edit/index.astro uses Fulldev components
**So that** Business edit page form is consistent

**Acceptance Criteria**:
- [x] **AC-US3-01**: All raw form controls -> Fulldev components
- [x] **AC-US3-02**: Business info save/update works correctly

### US-004: business/[slug]/product forms component migration (P1)
**Project**: timorup

**As a** developer
**I want** product new/edit pages use Fulldev components
**So that** Product management forms are consistent

**Acceptance Criteria**:
- [x] **AC-US4-01**: business/[slug]/product/new/index.astro uses Fulldev components
- [x] **AC-US4-02**: business/[slug]/product/[id]/edit/index.astro uses Fulldev components
- [x] **AC-US4-03**: Product create/edit works correctly

### US-005: edit-business-page/[id] form component migration (P1)
**Project**: timorup

**As a** developer
**I want** edit-business-page/[id].astro uses Fulldev components
**So that** Business page edit is consistent

**Acceptance Criteria**:
- [x] **AC-US5-01**: Raw form controls -> Fulldev components
- [x] **AC-US5-02**: Business info save works correctly

### US-006: Build + function verification (P0)
**Project**: timorup

**As a** developer
**I want** All changes pass build, functions work correctly
**So that** No regression

**Acceptance Criteria**:
- [x] **AC-US6-01**: pnpm exec -- astro build exit code 0
- [x] **AC-US6-02**: All form submissions (AI generation, listing edit, product management) work correctly

## Out of Scope

- Form data layer extraction (query functions, handled in 0142/0148)
- Non-form page Fulldev migration (0147 handles this)
- Existing island page modifications (0143 handles this)

## Dependencies

- Depends on 0145 (Fulldev installation complete)
