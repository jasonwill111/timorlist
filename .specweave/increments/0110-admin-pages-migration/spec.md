---
increment: 0110-admin-pages-migration
title: Admin Pages UI Component Migration
type: refactor
priority: P1
status: completed
created: 2026-06-04T00:00:00.000Z
structure: user-stories
test_mode: manual-e2e
project: TimorUp
production: 'https://timorup.jasonwill.workers.dev'
---

# Refactor: Admin Pages UI Component Migration

## User Stories

### US-1: Admin Users
- [x] admin/users.astro uses Input, Badge, Avatar, Button
- [ ] pnpm build exits 0

### US-2: Admin Businesses
- [x] admin/businesses.astro uses Input, Badge, Avatar, Tabs
- [ ] pnpm build exits 0

### US-3: Admin Categories
- [x] admin/categories.astro uses Input, Badge, Tabs
- [ ] pnpm build exits 0

### US-4: Admin Products
- [x] admin/products.astro uses Input, Badge, Tabs, Avatar
- [ ] pnpm build exits 0

### US-5: Admin Listings
- [x] admin/listings/index.astro uses Input, Badge, Avatar
- [x] admin/listings/new/index.astro uses Input, Tabs
- [x] admin/listings/[id]/edit/index.astro uses Input, Tabs
- [ ] pnpm build exits 0

### US-6: Admin Blogs/AI/Orders/Reviews/ServicePackages/Media/Settings
- [ ] All use Input, Badge, Button
- [ ] pnpm build exits 0

### US-7: Admin Buttons
- [ ] All admin pages replace native <button> with <Button>
- [ ] pnpm build exits 0

## Risk
Medium: visual changes. Mitigation: per-page commits + visual smoke test.
