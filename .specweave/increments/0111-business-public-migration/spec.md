---
increment: 0111-business-public-migration
title: "Business + Public Pages UI Component Migration"
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

# Refactor: Business + Public Pages UI Component Migration

## Overview

Public-facing pages (business detail, listings, search, homepage) and shared components (Header, Footer, CarouselBanner) still use raw HTML elements. This is the highest-impact increment because changes affect the primary user experience. After this increment, **all shadcn-style components in src/components/ui/ will have at least one consumer**.

## User Stories

### US-1: Homepage — Use Standard Components

**As a** visitor
**I want** the homepage to use standard buttons, inputs, and badges
**So that** the experience is consistent

**Acceptance Criteria:**
- [ ] `src/pages/index.astro` uses `<Input>` for search
- [ ] Uses `<Button>` for search submit
- [ ] Uses `<Badge>` for category tags
- [ ] `pnpm build` exits 0
- [ ] GET / → 200

### US-2: Search Page — Use Standard Components

- [ ] `src/pages/search.astro` uses `<Input>` for search query
- [ ] Uses `<Button>` for submit
- [ ] Uses `<Badge>` for filters and tags
- [ ] `pnpm build` exits 0

### US-3: Business Detail — Use Standard Components

- [ ] `src/pages/business/[slug].astro` uses `<Button>` for all actions
- [ ] Uses `<Badge>` for category/status
- [ ] Uses `<Avatar>` for owner profile
- [ ] `pnpm build` exits 0

### US-4: Business Edit — Use Standard Components

- [ ] `src/pages/business/[slug]/edit/index.astro` uses `<Input>` for form fields
- [ ] Uses `<Tabs>` for multi-section forms
- [ ] Uses `<Button>` for actions
- [ ] `pnpm build` exits 0

### US-5: Product Pages — Use Standard Components

- [ ] `src/pages/business/[slug]/product/new/index.astro` uses `<Input>`, `<Textarea>`, `<Button>`
- [ ] `src/pages/business/[slug]/product/[id]/edit/index.astro` — same
- [ ] `src/pages/business/[slug]/product/[id]/index.astro` — Button, Badge
- [ ] `src/pages/business/[slug]/products.astro` — Button, Badge
- [ ] `pnpm build` exits 0

### US-6: Listings — Use Standard Components

- [ ] `src/pages/listings/index.astro` uses `<Input>`, `<Button>`, `<Badge>`
- [ ] `src/pages/listings/[slug].astro` uses `<Button>`, `<Badge>`, `<Avatar>`
- [ ] `pnpm build` exits 0

### US-7: Non-Profit / Public-Sector Detail — Use Standard Components

- [ ] `src/pages/non-profit/[slug].astro` uses `<Button>`, `<Badge>`, `<Avatar>`
- [ ] `src/pages/public-sector/[slug].astro` — same
- [ ] `pnpm build` exits 0

### US-8: Header — Use Button Component

- [ ] `src/components/Header.astro` replaces native `<button>` with `<Button>`
- [ ] Mobile menu toggle button
- [ ] Login/Logout button
- [ ] `pnpm build` exits 0

### US-9: Footer — Use Button Component

- [ ] `src/components/Footer.astro` replaces native `<button>` with `<Button>` (if any)
- [ ] `pnpm build` exits 0

### US-10: PhotoGallery — Use Button Component

- [ ] `src/components/PhotoGallery.astro` uses `<Button>` for navigation arrows
- [ ] `pnpm build` exits 0

### US-11: CarouselBanner — Use Button Component

- [ ] `src/components/ui/CarouselBanner.astro` uses `<Button>` for slide navigation
- [ ] `pnpm build` exits 0

### US-12: UpdatesSection — Use Button and Avatar

- [ ] `src/components/UpdatesSection.astro` uses `<Button>` for actions
- [ ] Uses `<Avatar>` for user profile pictures
- [ ] `pnpm build` exits 0

## Out of Scope

- Visual design changes (preserve current look)
- Adding new sections to pages
- Form submission logic changes

## Dependencies

- Increment 0108: Components hardened
- Increment 0110: Admin patterns proven

## Risk

**HIGH**: Public-facing changes are most visible. Mitigation:
- Per-page incremental commits (not bulk)
- Visual regression test via obscura MCP on each page
- Curl smoke test after each page
- Deploy during low-traffic window
- Have rollback plan ready
