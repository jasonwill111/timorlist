# Tasks — Increment 0111: Business + Public Pages UI Component Migration

## Phase 1: Shared Components
- [ ] T-101: Header.astro — Button replacement
- [ ] T-102: Footer.astro — Button replacement
- [ ] T-103: PhotoGallery.astro — Button
- [ ] T-104: UpdatesSection.astro — Button, Avatar
- [ ] T-105: CarouselBanner.astro — Button
- [ ] T-106: pnpm build exits 0
- [ ] T-107: Visual smoke test all pages

## Phase 2: Homepage
- [ ] T-201: src/pages/index.astro — Input, Button, Badge
- [ ] T-202: pnpm build exits 0
- [ ] T-203: curl test: GET / → 200

## Phase 3: Search
- [ ] T-301: src/pages/search.astro — Input, Button, Badge
- [ ] T-302: pnpm build exits 0
- [ ] T-303: curl test: GET /search → 200

## Phase 4: Business Detail + Edit
- [ ] T-401: business/[slug].astro — Button, Badge, Avatar
- [ ] T-402: business/[slug]/edit — Input, Tabs, Button
- [ ] T-403: pnpm build exits 0
- [ ] T-404: curl test: GET /business/{slug} → 200

## Phase 5: Product Pages
- [ ] T-501: business/[slug]/product/new — Input, Textarea, Button
- [ ] T-502: business/[slug]/product/[id]/edit — same
- [ ] T-503: business/[slug]/product/[id] — Button, Badge
- [ ] T-504: business/[slug]/products — Button, Badge
- [ ] T-505: pnpm build exits 0

## Phase 6: Listings
- [ ] T-601: listings/index — Input, Button, Badge
- [ ] T-602: listings/[slug] — Button, Badge, Avatar
- [ ] T-603: pnpm build exits 0

## Phase 7: Non-Profit / Public-Sector
- [ ] T-701: non-profit/[slug] — Button, Badge, Avatar
- [ ] T-702: public-sector/[slug] — same
- [ ] T-703: pnpm build exits 0

## Phase 8: Modal Internal Buttons
- [ ] T-801: Audit Modal.astro internal buttons
- [ ] T-802: Replace native <button> with <Button>
- [ ] T-803: pnpm build exits 0

## Phase 9: Verification
- [ ] T-901: Visual smoke test all public pages
- [ ] T-902: Curl test 10 public pages
- [ ] T-903: wrangler deploy
- [ ] T-904: Post-deploy smoke test
- [ ] T-905: Monitor error logs 1h
