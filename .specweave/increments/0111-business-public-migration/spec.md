---
increment: 0111-business-public-migration
title: "Business + Public Pages UI Component Migration"
type: refactor
priority: P1
status: pending
created: 2026-06-04
structure: user-stories
test_mode: manual-e2e
project: TimorUp
production: https://timorup.jasonwill.workers.dev
---

# Refactor: Business + Public Pages UI Component Migration

## User Stories

### US-1: Homepage
- [ ] src/pages/index.astro uses Input, Button, Badge
- [ ] pnpm build exits 0
- [ ] GET / returns 200

### US-2: Search
- [ ] src/pages/search.astro uses Input, Button, Badge
- [ ] pnpm build exits 0

### US-3: Business Detail
- [ ] src/pages/business/[slug].astro uses Button, Badge, Avatar
- [ ] pnpm build exits 0

### US-4: Business Edit
- [ ] src/pages/business/[slug]/edit uses Input, Tabs, Button
- [ ] pnpm build exits 0

### US-5: Product Pages
- [ ] business/[slug]/product/* uses Input, Textarea, Button, Badge
- [ ] pnpm build exits 0

### US-6: Listings
- [ ] listings/* uses Input, Button, Badge, Avatar
- [ ] pnpm build exits 0

### US-7: Non-Profit / Public-Sector
- [ ] non-profit/[slug], public-sector/[slug] use Button, Badge, Avatar
- [ ] pnpm build exits 0

### US-8: Header.astro
- [ ] Replace native <button> with <Button>
- [ ] pnpm build exits 0

### US-9: Footer.astro
- [ ] Replace native <button> with <Button>
- [ ] pnpm build exits 0

### US-10: PhotoGallery
- [ ] Use <Button> for nav arrows
- [ ] pnpm build exits 0

### US-11: CarouselBanner
- [ ] Use <Button> for slide navigation
- [ ] pnpm build exits 0

### US-12: UpdatesSection
- [ ] Use <Button>, <Avatar>
- [ ] pnpm build exits 0

## Risk
HIGH: public-facing changes. Mitigation: per-page commits, visual smoke test, low-traffic deploy.
