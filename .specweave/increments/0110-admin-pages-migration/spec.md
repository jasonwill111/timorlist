---
increment: 0110-admin-pages-migration
title: "Admin Pages UI Component Migration"
type: refactor
priority: P1
status: pending
created: 2026-06-04
structure: user-stories
test_mode: manual-e2e
project: TimorUp
production: https://timorup.jasonwill.workers.dev
---

# Refactor: Admin Pages UI Component Migration

## User Stories

### US-1: Admin Users
- [ ] admin/users.astro uses Input, Badge, Avatar, Button
- [ ] pnpm build exits 0

### US-2: Admin Businesses
- [ ] admin/businesses.astro uses Input, Badge, Avatar, Tabs
- [ ] pnpm build exits 0

### US-3: Admin Categories
- [ ] admin/categories.astro uses Input, Badge, Tabs
- [ ] pnpm build exits 0

### US-4: Admin Products
- [ ] admin/products.astro uses Input, Badge, Tabs, Avatar
- [ ] pnpm build exits 0

### US-5: Admin Listings
- [ ] admin/listings/index.astro uses Input, Badge, Avatar
- [ ] admin/listings/new/index.astro uses Input, Tabs
- [ ] admin/listings/[id]/edit/index.astro uses Input, Tabs
- [ ] pnpm build exits 0

### US-6: Admin Blogs/AI/Orders/Reviews/ServicePackages/Media/Settings
- [ ] All use Input, Badge, Button
- [ ] pnpm build exits 0

### US-7: Admin Buttons
- [ ] All admin pages replace native <button> with <Button>
- [ ] pnpm build exits 0

## Risk
Medium: visual changes. Mitigation: per-page commits + visual smoke test.
