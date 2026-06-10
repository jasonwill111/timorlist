---
increment: 0109-auth-forms-migration
title: Auth Forms Migration to FormField
type: refactor
priority: P1
status: completed
created: 2026-06-04T00:00:00.000Z
structure: user-stories
test_mode: manual-e2e
project: TimorUp
production: 'https://timorup.jasonwill.workers.dev'
---

# Refactor: Auth Forms Migration to FormField

## User Stories

### US-1: Login Page
- [x] src/pages/login.astro uses FormField for email and password
- [x] Validation icon position preserved
- [ ] Password field still uses PasswordInput
- [ ] pnpm build exits 0
- [ ] GET /login returns 200

### US-2: Register Page
- [x] src/pages/register.astro uses FormField for all inputs
- [ ] pnpm build exits 0
- [ ] GET /register returns 200

### US-3: Forgot Password
- [x] src/pages/forgot-password.astro uses FormField
- [ ] pnpm build exits 0
- [ ] GET /forgot-password returns 200

### US-4: Reset Password
- [x] src/pages/reset-password.astro uses FormField
- [ ] pnpm build exits 0
- [ ] GET /reset-password returns 200

### US-5: Contact
- [x] src/pages/contact.astro uses FormField
- [ ] Textarea for message
- [ ] pnpm build exits 0
- [ ] GET /contact returns 200

## Risk
Medium: auth forms are critical. Mitigation: per-page deploy, visual smoke test.
