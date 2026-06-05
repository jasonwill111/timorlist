# Tasks — Increment 0111: Business + Public Pages UI Component Migration

## Phase 1: Shared Components (lowest risk, affects all pages)

- [ ] T-101: `src/components/Header.astro` — replace native `<button>` with `<Button>`
- [ ] T-102: `src/components/Footer.astro` — replace native `<button>` (if any) with `<Button>`
- [ ] T-103: `src/components/PhotoGallery.astro` — use `<Button>` for nav arrows
- [ ] T-104: `src/components/UpdatesSection.astro` — use `<Button>`, `<Avatar>`
- [ ] T-105: `src/components/ui/CarouselBanner.astro` — use `<Button>` for slide navigation
- [ ] T-106: `pnpm build` exits 0
- [ ] T-107: Visual smoke test of all pages (Header change affects every page)

## Phase 2: Homepage

- [ ] T-201: `src/pages/index.astro` — use `<Input>` for search, `<Button>` for submit, `<Badge>` for tags
- [ ] T-202: `pnpm build` exits 0
- [ ] T-203: curl test: GET / → 200

## Phase 3: Search Page

- [ ] T-301: `src/pages/search.astro` — use `<Input>`, `<Button>`, `<Badge>`
- [ ] T-302: `pnpm build` exits 0
- [ ] T-303: curl test: GET /search → 200

## Phase 4: Business Detail + Edit

- [ ] T-401: `src/pages/business/[slug].astro` — use `<Button>`, `<Badge>`, `<Avatar>`
- [ ] T-402: `src/pages/business/[slug]/edit/index.astro` — use `<Input>`, `<Tabs>`, `<Button>`
- [ ] T-403: `pnpm build` exits 0
- [ ] T-404: curl test: GET /business/{slug} → 200

## Phase 5: Product Pages

- [ ] T-501: `src/pages/business/[slug]/product/new/index.astro` — use `<Input>`, `<Textarea>`, `<Button>`
- [ ] T-502: `src/pages/business/[slug]/product/[id]/edit/index.astro` — same
- [ ] T-503: `src/pages/business/[slug]/product/[id]/index.astro` — `<Button>`, `<Badge>`
- [ ] T-504: `src/pages/business/[slug]/products.astro` — `<Button>`, `<Badge>`
- [ ] T-505: `pnpm build` exits 0

## Phase 6: Listings

- [ ] T-601: `src/pages/listings/index.astro` — use `<Input>`, `<Button>`, `<Badge>`
- [ ] T-602: `src/pages/listings/[slug].astro` — use `<Button>`, `<Badge>`, `<Avatar>`
- [ ] T-603: `pnpm build` exits 0

## Phase 7: Non-Profit / Public-Sector Detail

- [ ] T-701: `src/pages/non-profit/[slug].astro` — use `<Button>`, `<Badge>`, `<Avatar>`
- [ ] T-702: `src/pages/public-sector/[slug].astro` — same
- [ ] T-703: `pnpm build` exits 0

## Phase 8: Modal and ToastContainer Internal Buttons

- [ ] T-801: Audit `src/components/ui/Modal.astro` for internal buttons
- [ ] T-802: Replace any native `<button>` with `<Button>`
- [ ] T-803: Audit `src/components/ui/ToastContainer.astro`
- [ ] T-804: Audit `src/components/ui/ShareDialog.astro`
- [ ] T-805: `pnpm build` exits 0

## Phase 9: Verification

- [ ] T-901: Visual smoke test of all public pages via obscura MCP
- [ ] T-902: Curl test: 10 public pages all return 200
- [ ] T-903: wrangler deploy to production
- [ ] T-904: Post-deploy smoke test
- [ ] T-905: Monitor error logs for 1 hour post-deploy

## Completion Criteria

- [ ] 12 public pages use standard components
- [ ] 6 business pages use standard components
- [ ] 6 shared components use standard components
- [ ] Zero native `<button>` in migrated files
- [ ] Zero native `<input>` in migrated files
- [ ] All 18+ components in `src/components/ui/` have at least one consumer
- [ ] `pnpm build` exits 0
- [ ] All public pages return 200
