---
increment: 0109-auth-forms-migration
title: "Auth Forms Migration to FormField"
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

# Refactor: Auth Forms Migration to FormField

## Overview

Five auth-related pages use a mix of inline `<input>`, `<label>`, error message markup, and validation icon positioning. This creates visual inconsistency and maintenance burden. The `FormField.astro` component (created in 0103, hardened in 0108) provides a single composition pattern. This increment migrates all five pages to use it.

## User Stories

### US-1: Login Page — Use FormField

**As a** user visiting `/login`
**I want** the form fields to render consistently with other auth pages
**So that** the experience is predictable

**Acceptance Criteria:**
- [ ] `src/pages/login.astro` uses `<FormField>` for email and password
- [ ] Existing validation icon position preserved
- [ ] Password field uses PasswordInput (unchanged)
- [ ] Form submission flow unchanged
- [ ] Visual regression test via obscura MCP: login page renders 200 + correct fields
- [ ] `pnpm build` exits 0
- [ ] curl test: GET /login → 200

### US-2: Register Page — Use FormField

**As a** new user visiting `/register`
**I want** consistent form field rendering
**So that** registration feels familiar

**Acceptance Criteria:**
- [ ] `src/pages/register.astro` uses `<FormField>` for all input fields
- [ ] Existing flow unchanged
- [ ] `pnpm build` exits 0
- [ ] curl test: GET /register → 200

### US-3: Forgot Password Page — Use FormField

**As a** user who forgot their password
**I want** the email field to use the standard FormField pattern
**So that** the form is accessible and consistent

**Acceptance Criteria:**
- [ ] `src/pages/forgot-password.astro` uses `<FormField>` for email
- [ ] Button.astro with loading state preserved
- [ ] `pnpm build` exits 0
- [ ] curl test: GET /forgot-password → 200

### US-4: Reset Password Page — Use FormField

**As a** user resetting their password
**I want** password fields to use the standard pattern
**So that** validation messages are consistent

**Acceptance Criteria:**
- [ ] `src/pages/reset-password.astro` uses `<FormField>` for password inputs
- [ ] `pnpm build` exits 0
- [ ] curl test: GET /reset-password → 200

### US-5: Contact Page — Use FormField

**As a** user contacting support
**I want** the contact form to use the standard fields
**So that** the form looks professional

**Acceptance Criteria:**
- [ ] `src/pages/contact.astro` uses `<FormField>` for name, email, message
- [ ] Textarea for message field
- [ ] `pnpm build` exits 0
- [ ] curl test: GET /contact → 200

## Out of Scope

- Admin forms (separate increment 0110)
- Form submission logic changes
- Validation rule changes
- New auth flows

## Dependencies

- Increment 0108: FormField.astro hardened with password support
- Existing auth pages

## Risk

**Medium**: Auth forms are critical user flow. Mitigation:
- Visual regression test on each page after migration
- Curl test confirms 200 response
- Full auth flow test (login → dashboard) on staging before production
- Per-page incremental deploy (one page at a time if possible)
