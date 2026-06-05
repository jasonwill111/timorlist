---
increment: 0108-ui-component-hardening
title: "UI Component Library Hardening"
type: refactor
priority: P1
status: pending
created: 2026-06-04
structure: user-stories
test_mode: manual-e2e
coverage_target: 0
project: TimorUp
production: https://timorup.jasonwill.workers.dev
epic: 0103-fulldev-migration-refactor
---

# Refactor: UI Component Library Hardening

## Overview

The codebase has 18 Astro components in `src/components/ui/` (Button, Input, Badge, Card, Tabs, Modal, Avatar, etc.) but several gaps prevent full migration in subsequent increments:
- No reusable empty state component
- No reusable page header
- No reusable confirm dialog
- Input.astro doesn't support password type properly
- Tabs.astro hasn't been adopted in any consumer

This increment **adds missing components** and **verifies APIs** so subsequent migration increments have all the tools they need.

## User Stories

### US-1: Page Developer — Empty State Component

**As a** page developer
**I want** a reusable `<EmptyState>` component
**So that** empty list views have consistent styling without re-implementing markup

**Acceptance Criteria:**
- [ ] `src/components/ui/EmptyState.astro` created
- [ ] Props: `icon?`, `title`, `description?`, `action?` (slot for CTA button)
- [ ] Used in at least one consumer after creation (e.g., admin/categories empty state)
- [ ] `pnpm build` exits 0

### US-2: Page Developer — Page Header Component

**As a** page developer
**I want** a reusable `<PageHeader>` component
**So that** page titles, descriptions, and action buttons are consistent

**Acceptance Criteria:**
- [ ] `src/components/ui/PageHeader.astro` created
- [ ] Props: `title`, `description?`, `actions?` (slot for buttons)
- [ ] Used in at least one consumer after creation
- [ ] `pnpm build` exits 0

### US-3: Page Developer — Confirm Dialog Component

**As a** page developer
**I want** a reusable `<ConfirmDialog>` Astro component
**So that** destructive action confirmations are consistent

**Acceptance Criteria:**
- [ ] `src/components/ui/ConfirmDialog.astro` created
- [ ] Props: `id`, `title`, `message`, `confirmText?`, `cancelText?`, `variant?` ('danger' | 'warning' | 'info')
- [ ] Works alongside `lib/modal.ts` programmatic API
- [ ] `pnpm build` exits 0

### US-4: Auth Developer — Input with Password Support

**As an** auth developer
**I want** `<Input type="password">` to work correctly
**So that** FormField.astro can wrap password fields cleanly

**Acceptance Criteria:**
- [ ] Input.astro `type` prop accepts `'password'` value
- [ ] No browser console warnings for password inputs
- [ ] `pnpm build` exits 0

### US-5: Tabs Consumer — Verify Tabs API

**As a** tabs consumer
**I want** to know exactly what the Tabs API is
**So that** I can adopt it confidently

**Acceptance Criteria:**
- [ ] Audit of Tabs.astro, TabsList.astro, TabsTrigger.astro, TabsContent.astro
- [ ] Each component has documented Props interface
- [ ] Example usage added as comment in Tabs.astro
- [ ] `pnpm build` exits 0

## Out of Scope

- Migrating any consumer to use new components (separate increments)
- Styling changes to existing components
- Adding new variants to Badge/Button

## Dependencies

- Existing components in `src/components/ui/`

## Risk

**Low**: Only adds new components and verifies existing ones. No breaking changes.
