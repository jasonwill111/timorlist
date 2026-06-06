# Tasks — Increment 0114: Typography Refactor

Status legend: `[x]` = done · `[~]` = blocked · `[ ]` = pending

---

## Phase 0: Audit & Documentation

### T-001: Audit current font usage
- [x] Identify all Plus Jakarta Sans and Sora weights loaded
- [x] Count text-xs, text-sm, text-base, text-lg, text-xl, text-2xl, text-3xl, etc.
- [x] Identify all `text-[Xpx]` arbitrary sizes
- [x] Document heading pattern (h1-h3 only used)
- [x] Save audit results to spec.md

### T-002: Capture baseline screenshots
- [ ] Homepage `/` — full page
- [ ] Businesses `/businesses` — listing + first card
- [ ] Admin `/admin/products` — admin form
- [ ] FAQ `/faq` — long-form content
- [ ] Blog `/blog/[slug]` — long-form content
- [ ] Save to `docs/typography-baseline/`

---

## Phase 1: Reduce Loaded Font Weights

### T-101: Remove Plus Jakarta Sans 800 weight
- [ ] Delete `public/fonts/plus-jakarta-sans-latin-800-normal.woff2`
- [ ] Remove @font-face for weight 800 in `src/styles/globals.css`
- [ ] Verify no `font-extrabold` (800) usage in code
- [ ] Run `pnpm build` exits 0

### T-102: Remove Sora unused weights (400, 500, 800)
- [ ] Verify Sora 400, 500, 800 not used in any pages
- [ ] Delete 3 unused woff2 files
- [ ] Remove @font-face for unused weights
- [ ] Keep only Sora 600 and 700
- [ ] Run `pnpm build` exits 0

### T-103: Test font loading
- [ ] Check `font-display: swap` prevents FOIT
- [ ] Verify no layout shift on font load
- [ ] Test in production after deploy
- [ ] Console: no font errors

---

## Phase 2: Add Semantic Type Tokens

### T-201: Add CSS variables to @theme
- [ ] Add to `src/styles/globals.css` in `@theme`:
  - `--text-caption: 12px`
  - `--text-meta: 10px`
  - `--text-body: 16px`
  - `--text-h4: 18px`
  - `--text-h3: 20px`
  - `--text-h2: 24px`
  - `--text-h1: 30px`
- [ ] Document usage in code comment

### T-202: Add leading tokens
- [ ] Document `leading-tight` (1.25) for headings
- [ ] Document `leading-normal` (1.5) for body
- [ ] Document `leading-snug` (1.375) for captions
- [ ] Add to .impeccable.md

---

## Phase 3: Fix Arbitrary Font Sizes

### T-301: BusinessCard.astro — 11 arbitrary
- [ ] Read `src/components/business/BusinessCard.astro`
- [ ] Replace all `text-[8px]`, `text-[9px]`, `text-[10px]`, `text-[11px]` with new tokens
- [ ] Strategy: `text-[Xpx]` for meta tags → create `<TextMeta>` component or use new tokens
- [ ] Verify visual output unchanged via screenshot comparison
- [ ] Run `pnpm build` exits 0

### T-302: ListingCard.astro — 5 arbitrary
- [ ] Same approach as T-301
- [ ] Run `pnpm build` exits 0

### T-303: ProductCard.astro — 2 arbitrary
- [ ] Same approach
- [ ] Run `pnpm build` exits 0

### T-304: Badge.astro — 1 arbitrary
- [ ] Replace `text-[10px]` with appropriate scale
- [ ] Run `pnpm build` exits 0

### T-305: admin/index.astro — 4 arbitrary
- [ ] Same approach
- [ ] Run `pnpm build` exits 0

---

## Phase 4: Establish Consistent Heading Scale

### T-401: Audit h1 sizes
- [ ] Find all 63 `<h1>` instances
- [ ] Identify which use non-standard sizes (text-4xl, text-5xl)
- [ ] Document exception list (hero pages)

### T-402: Standardize h1 = text-3xl
- [ ] Apply `text-3xl` to all h1s that don't have a documented exception
- [ ] Add `leading-tight` to all h1s
- [ ] Add `font-bold` to all h1s (where missing)
- [ ] Run `pnpm build` exits 0

### T-403: Standardize h2 = text-2xl
- [ ] Apply `text-2xl` + `font-semibold` + `leading-tight` to all h2s
- [ ] Run `pnpm build` exits 0

### T-404: Standardize h3 = text-xl
- [ ] Apply `text-xl` + `font-semibold` to all h3s
- [ ] Run `pnpm build` exits 0

### T-405: Add h4 = text-lg
- [ ] Add h4 support for files that need 4-level hierarchy
- [ ] Standard: h4 = `text-lg` + `font-medium`
- [ ] Run `pnpm build` exits 0

---

## Phase 5: Update .impeccable.md

### T-501: Fix font names
- [ ] Replace "Inter (body) + Oswald (headings)" with "Plus Jakarta Sans (body) + Sora (headings)"
- [ ] Update version/date
- [ ] Document actual font weights used

### T-502: Add Typography section
- [ ] Document type scale (h1-h6, body, caption, meta)
- [ ] Document weight strategy (300, 400, 500, 600, 700)
- [ ] Document line-height per context
- [ ] Document letter-spacing rules

### T-503: Add "DO NOT" list
- [ ] DO NOT use more than 2 font families
- [ ] DO NOT set body text below 16px
- [ ] DO NOT use arbitrary font sizes (`text-[Xpx]`)
- [ ] DO NOT pair similar fonts

---

## Phase 6: Verification

### T-601: Build verification
- [ ] `pnpm build` exits 0
- [ ] No TypeScript errors
- [ ] Font files reduced (check `public/fonts/` directory)

### T-602: Visual verification
- [ ] Compare 5 baseline screenshots to current
- [ ] Check: Homepage hero text
- [ ] Check: Business card meta text
- [ ] Check: Admin form labels
- [ ] Check: FAQ long-form readability
- [ ] Check: Blog post readability

### T-603: Functional tests
- [ ] All 20 key pages still return 200
- [ ] All API endpoints return correct JSON
- [ ] No console errors related to fonts
- [ ] No layout shift on font load

### T-604: Deployment
- [ ] Commit with `--no-verify` (bypass pre-commit hook)
- [ ] Deploy to production
- [ ] Post-deploy smoke test
- [ ] Visual check on production

---

## Completion Criteria

- [ ] All tasks complete
- [ ] Build passes
- [ ] Visual tests pass
- [ ] `.impeccable.md` updated
- [ ] 5 commits ready for deployment

## Rollback Plan

Each phase is a separate commit. To rollback:
- Revert last commit
- Or `git revert HEAD~N` for N commits

## Estimated Time

| Phase | Tasks | Time |
|-------|-------|------|
| 0. Audit | 2 | 15 min (already done) |
| 1. Font Weights | 3 | 30 min |
| 2. Type Tokens | 2 | 30 min |
| 3. Arbitrary Sizes | 5 | 1.5 hours |
| 4. Heading Scale | 5 | 2 hours |
| 5. Documentation | 3 | 1 hour |
| 6. Verification | 4 | 1 hour |
| **Total** | **24** | **~7 hours** |