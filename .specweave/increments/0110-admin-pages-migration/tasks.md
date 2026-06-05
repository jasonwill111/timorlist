# Tasks — Increment 0110: Admin Pages UI Component Migration

## Phase 1: Users

- [ ] T-101: `src/pages/admin/users.astro` — replace `<input>` with `<Input>`
- [ ] T-102: Replace inline status badges with `<Badge>`
- [ ] T-103: Replace inline avatar markup with `<Avatar>`
- [ ] T-104: Replace native `<button>` with `<Button>`
- [ ] T-105: `pnpm build` exits 0
- [ ] T-106: Visual smoke test

## Phase 2: Businesses

- [ ] T-201: `src/pages/admin/businesses.astro` — replace `<input>` with `<Input>`
- [ ] T-202: Replace inline badges with `<Badge>`
- [ ] T-203: Replace inline avatar with `<Avatar>`
- [ ] T-204: Replace native `<button>` with `<Button>`
- [ ] T-205: Apply `<Tabs>` if applicable
- [ ] T-206: `pnpm build` exits 0

## Phase 3: Categories

- [ ] T-301: `src/pages/admin/categories.astro` — replace `<input>` with `<Input>`
- [ ] T-302: Replace inline badges with `<Badge>`
- [ ] T-303: Apply `<Tabs>` (industry/status tabs)
- [ ] T-304: Replace native `<button>` with `<Button>`
- [ ] T-305: `pnpm build` exits 0

## Phase 4: Products

- [ ] T-401: `src/pages/admin/products.astro` — replace `<input>` with `<Input>`
- [ ] T-402: Replace inline badges with `<Badge>`
- [ ] T-403: Apply `<Tabs>` (SKUs vs archived)
- [ ] T-404: Replace inline avatar with `<Avatar>`
- [ ] T-405: Replace native `<button>` with `<Button>`
- [ ] T-406: `pnpm build` exits 0

## Phase 5: Listings

- [ ] T-501: `src/pages/admin/listings/index.astro` — replace `<input>` with `<Input>`
- [ ] T-502: Replace inline badges with `<Badge>`
- [ ] T-503: Replace inline avatar with `<Avatar>`
- [ ] T-504: Replace native `<button>` with `<Button>`
- [ ] T-505: `src/pages/admin/listings/new/index.astro` — same treatment
- [ ] T-506: `src/pages/admin/listings/[id]/edit/index.astro` — same treatment
- [ ] T-507: `pnpm build` exits 0

## Phase 6: Blogs, AI Tools, Orders, Reviews, Service Packages, Media, Settings

- [ ] T-601: `src/pages/admin/blogs.astro` — Input, Badge, Button
- [ ] T-602: `src/pages/admin/ai-tools.astro` — Input, Badge, Button
- [ ] T-603: `src/pages/admin/orders.astro` — Badge, Button
- [ ] T-604: `src/pages/admin/reviews.astro` — Badge, Button
- [ ] T-605: `src/pages/admin/service-packages.astro` — Input, Badge, Button
- [ ] T-606: `src/pages/admin/media.astro` — Button
- [ ] T-607: `src/pages/admin/settings.astro` — Input, Button
- [ ] T-608: `pnpm build` exits 0

## Phase 7: Verification

- [ ] T-701: All admin pages return 200 (with auth redirect)
- [ ] T-702: Visual smoke test of 5 random admin pages via obscura MCP
- [ ] T-703: wrangler deploy to production
- [ ] T-704: Post-deploy smoke test

## Completion Criteria

- [ ] 14 admin pages use standard components
- [ ] Zero raw `<input>` in admin forms
- [ ] Zero raw `<button>` in admin pages (preserving click handlers)
- [ ] Status displays use `<Badge>`
- [ ] `pnpm build` exits 0
- [ ] All admin pages return 200
