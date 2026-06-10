---
increment: 0150-finalize-form-pages-migration
title: Finalize Form Pages Migration
type: refactor
priority: P0
status: completed
created: 2026-06-08T00:00:00.000Z
structure: user-stories
test_mode: TDD
coverage_target: 80
---

# Feature: Finalize Form Pages Migration

## Overview

Complete all remaining form page component migrations — eliminate all raw HTML form elements across the project. This is the final sweep after 0146–0147 form migrations.

## User Stories

### US-001: admin/ai-tools.astro Form Cleanup (P0)
**Project**: timorup

**As a** developer
**I want** admin/ai-tools.astro uses Fulldev components for all form controls
**So that** AI generation interface has consistent styling

**Acceptance Criteria**:
- [x] **AC-US1-01**: 1 raw button → `<Button>` component
- [x] **AC-US1-02**: 7 labels with paired inputs → `<Label for>` with `id` on Input
- [x] **AC-US1-03**: 16 orphan labels (no associated input) → converted to static text/heading
- [x] **AC-US1-04**: AI generation forms still function correctly

### US-002: admin/listings/[id]/edit Form Cleanup (P0)
**Project**: timorup

**As a** developer
**I want** admin/listings/[id]/edit/index.astro uses Fulldev components for all form controls
**So that** Listing edit form has consistent styling

**Acceptance Criteria**:
- [x] **AC-US2-01**: 14 raw labels → `<Label for>` (add `id` to all Fulldev Input components first)
- [x] **AC-US2-02**: 1 raw input → `<Input>` component
- [x] **AC-US2-03**: Listing edit save still works correctly

### US-003: admin/media.astro Form Cleanup (P1)
**Project**: timorup

**As a** developer
**I want** admin/media.astro form labels are cleaned up
**So that** Filter section has consistent UI

**Acceptance Criteria**:
- [x] **AC-US3-01**: 3 raw labels → converted to static text or proper FilterSection
- [x] **AC-US3-02**: Media filter UI still works

### US-004: business/[slug]/edit Map Section Label (P1)
**Project**: timorup

**As a** developer
**I want** business/[slug]/edit/index.astro map section label is converted
**So that** no stray raw labels remain

**Acceptance Criteria**:
- [x] **AC-US4-01**: 1 raw label (map section) → converted to static text/heading

## Out of Scope

- Starwind duplicate component deprecation (handled in 0154)
- Data layer extraction for remaining pages (handled in 0151–0153)

## Dependencies

- 0145 (Fulldev installation)
- 0146 (partial form migration)
- 0147 (remaining form migration)
