---
increment: 0110-admin-pages-migration
title: "Admin Pages UI Component Migration"
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

# Refactor: Admin Pages UI Component Migration

## Overview

Admin pages (`src/pages/admin/*`) use a mix of native HTML elements (raw `<input>`, `<button>`, inline status badges, custom tabs markup) and the available shadcn-style components in `src/components/ui/`. This inconsistency makes maintenance harder and visual differences more pronounced. This increment migrates admin pages to consistently use the available components.

## User Stories

### US-1: Admin Users — Standard Components

**As an** admin viewing `/admin/users`
**I want** all form fields, status badges, and user avatars to use standard components
**So that** the admin experience is consistent

**Acceptance Criteria:**
- [ ] `src/pages/admin/users.astro` uses `<Input>` for all form fields
- [ ] Uses `<Badge>` for role and status display
- [ ] Uses `<Avatar>` for user profile pictures
- [ ] `pnpm build` exits 0
- [ ] Page returns 200 (with admin auth redirect to login if not authenticated)

### US-2: Admin Businesses — Standard Components

- [ ] `src/pages/admin/businesses.astro` uses `<Input>`, `<Badge>`, `<Avatar>`
- [ ] Uses `<Tabs>` if multi-tab structure exists
- [ ] `pnpm build` exits 0

### US-3: Admin Categories — Standard Components

- [ ] `src/pages/admin/categories.astro` uses `<Input>`, `<Badge>`, `<Tabs>` (industry vs status tabs)
- [ ] `pnpm build` exits 0

### US-4: Admin Products — Standard Components

- [ ] `src/pages/admin/products.astro` uses `<Input>`, `<Badge>`, `<Tabs>`, `<Avatar>`
- [ ] `pnpm build` exits 0

### US-5: Admin Listings — Standard Components

- [ ] `src/pages/admin/listings/index.astro` uses `<Input>`, `<Badge>`, `<Avatar>`
- [ ] `src/pages/admin/listings/new/index.astro` uses `<Input>`, `<Tabs>` (if multi-step form)
- [ ] `src/pages/admin/listings/[id]/edit/index.astro` uses `<Input>`, `<Tabs>`
- [ ] `pnpm build` exits 0

### US-6: Admin Blogs — Standard Components

- [ ] `src/pages/admin/blogs.astro` uses `<Input>`, `<Badge>`
- [ ] `pnpm build` exits 0

### US-7: Admin AI Tools — Standard Components

- [ ] `src/pages/admin/ai-tools.astro` uses `<Input>`, `<Badge>`
- [ ] `pnpm build` exits 0

### US-8: Admin Orders / Reviews / Service Packages / Media / Settings

- [ ] All use `<Input>` for forms
- [ ] All use `<Badge>` for status display
- [ ] `pnpm build` exits 0

### US-9: Admin Buttons — Replace Native `<button>`

- [ ] All admin pages replace native `<button class="...">` with `<Button>`
- [ ] Preserve button text, intent, and click handlers
- [ ] `pnpm build` exits 0

## Out of Scope

- New admin features
- Form submission logic changes
- Database query changes

## Dependencies

- Increment 0108: Components hardened
- Increment 0109: FormField pattern proven
- Existing admin pages

## Risk

**Medium**: Admin pages are not public, but visual changes may surprise admin users. Mitigation:
- Per-page incremental commits
- Visual smoke test after each page
- Curl test confirms 200 response
