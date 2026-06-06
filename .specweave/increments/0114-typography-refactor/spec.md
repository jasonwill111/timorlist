---
increment: 0114-typography-refactor
title: "Typography Refactor — 字体系统优化"
type: refactor
priority: P2
status: in_progress
created: 2026-06-05
structure: user-stories
test_mode: visual-manual
project: TimorUp
production: https://timorup.jasonwill.workers.dev
depends_on: 0113-dom-api-refactor
---

# Refactor: Typography Refactor — 字体系统优化

## Overview

Refactor the typography system in TimorUp to be more intentional, consistent, and performant. This includes reducing loaded font weights, fixing arbitrary font sizes, establishing a clear heading hierarchy, and updating design documentation.

## 背景与动机

### Current Issues (2026-06-05 Audit)

| Issue | Severity | Description |
|-------|----------|-------------|
| Body text below 16px | HIGH | 613 instances of `text-sm` (14px) vs only 43 of `text-base` (16px) |
| Arbitrary font sizes | MEDIUM | 23 occurrences of `text-[Xpx]` (8-11px) outside type scale |
| Unused font weights | LOW | Loading 5 weights per font, only 2-3 actively used |
| Inconsistent heading scale | MEDIUM | h1 ranges from `text-3xl` to `text-5xl` across pages |
| Outdated .impeccable.md | LOW | Says "Inter + Oswald" but actual fonts are Plus Jakarta Sans + Sora |

### Why Typography Matters

Typography is the foundation of interface design — it carries the majority of information. Getting it right is the highest-leverage improvement. Good typography is invisible; bad typography is distracting.

### Goals

1. **Readability**: Body text at 16px minimum (WCAG compliance)
2. **Consistency**: All text on a defined type scale
3. **Performance**: Reduce font weight count to lower network payload
4. **Hierarchy**: Clear h1-h6 scale with semantic intent
5. **Documentation**: Updated `.impeccable.md` reflecting actual system

## Current State

### Font System

| Font | Role | Weights Loaded | Files | Total Size |
|------|------|----------------|-------|------------|
| Plus Jakarta Sans | body (`--font-sans`) | 400, 500, 600, 700, 800 | 5 woff2 | ~50KB |
| Sora | headings (`--font-heading`) | 400, 500, 600, 700, 800 | 5 woff2 | ~50KB |

**Total**: 20 woff2 files, ~100KB

### Font Size Distribution (1,302 total uses)

| Size | Count | % | Issue |
|------|-------|---|-------|
| `text-xs` (12px) | 330 | 25% | Used for captions, badges — OK |
| `text-sm` (14px) | 613 | 47% | Used as default body — should be 16px |
| `text-base` (16px) | 43 | 3% | Underused — should be default |
| `text-lg` (18px) | 99 | 8% | H4 equivalent |
| `text-xl` (20px) | 42 | 3% | H3 |
| `text-2xl` (24px) | 101 | 8% | H2 |
| `text-3xl` (30px) | 34 | 3% | H1 default |
| `text-4xl` (36px) | 20 | 2% | H1 large |
| `text-5xl` (48px) | 6 | <1% | Hero |
| `text-6xl` (60px) | 3 | <1% | Hero large |
| `text-9xl` (96px) | 1 | <1% | Splash |

### Arbitrary Font Sizes (23 total)

| File | Count | Sizes |
|------|-------|-------|
| `components/business/BusinessCard.astro` | 11 | 8, 9, 10, 11px |
| `components/business/ListingCard.astro` | 5 | 9, 10px |
| `pages/admin/index.astro` | 4 | 10px |
| `components/business/ProductCard.astro` | 2 | 10px |
| `components/ui/Badge.astro` | 1 | 10px |

### Heading Pattern (225 headings)

| Tag | Count | Common Tailwind Class |
|-----|-------|----------------------|
| `<h1>` | 63 | `text-3xl font-bold` (most common) |
| `<h2>` | 89 | `text-2xl font-semibold` |
| `<h3>` | 73 | `text-xl font-semibold` |
| `<h4>` | 0 | (none) |
| `<h5>` | 0 | (none) |
| `<h6>` | 0 | (none) |

## User Stories

### US-1: Reduce Loaded Font Weights
- [ ] Remove Plus Jakarta Sans 800 weight (barely used)
- [ ] Remove Sora 400, 500, 800 weights (only 600, 700 commonly used)
- [ ] Verify font-display: swap still works
- [ ] Test no font flash / FOIT

### US-2: Fix Arbitrary Font Sizes
- [ ] Create `--text-2xs: 10px` token for compact metadata
- [ ] Replace all `text-[8px]`, `text-[9px]`, `text-[10px]`, `text-[11px]` with new token or existing scale
- [ ] Affects: BusinessCard, ListingCard, ProductCard, Badge, admin/index
- [ ] Verify visual output unchanged

### US-3: Establish Consistent Heading Scale
- [ ] Document standard scale: h1=text-3xl, h2=text-2xl, h3=text-xl, h4=text-lg
- [ ] Update pages with inconsistent h1 sizes to use standard
- [ ] Add `leading-tight` to all h1-h3 for proper line height
- [ ] Create `text-balance` or `text-pretty` for h1-h2 where supported

### US-4: Add Semantic Type Tokens
- [ ] Add CSS variables in `@theme`:
  - `--text-caption: 12px`
  - `--text-meta: 10px` (for compact metadata in cards)
  - `--text-h1: 30px`
  - `--text-h2: 24px`
  - `--text-h3: 20px`
  - `--text-h4: 18px`
  - `--text-body: 16px`
  - `--text-small: 14px` (current `text-sm`)
- [ ] Add `leading-tight`, `leading-snug`, `leading-normal` defaults to tokens

### US-5: Update .impeccable.md
- [ ] Replace "Inter (body) + Oswald (headings)" with "Plus Jakarta Sans (body) + Sora (headings)"
- [ ] Document type scale and usage rules
- [ ] Document font weight strategy

### US-6: Verification
- [ ] `pnpm build` exits 0
- [ ] No font flash on page load
- [ ] All 20 key pages still render correctly
- [ ] Visual spot check on 5 representative pages (homepage, businesses, admin, FAQ, blog)

## Acceptance Criteria

### Build Verification
- `pnpm build` exits 0
- No font loading errors in console
- Total font payload < 70KB (down from ~100KB)

### Visual Verification
- Heading hierarchy visible on all pages (h1 distinctly larger than h2)
- Body text readable (16px+ for long-form)
- No visual regressions (cards still look the same)
- 5 pages screenshot before/after compared

### Code Quality
- Zero `text-[Xpx]` arbitrary sizes (except for very specific cases)
- All headings use documented scale
- `.impeccable.md` reflects actual implementation

## 风险等级

**MEDIUM**
- Typography changes affect every page
- 23 arbitrary font sizes need verification (no visual regression)
- Font weight removal could cause FOUC if not done carefully

## Mitigation

1. **Per-file commits** — Each file modified separately for easy rollback
2. **Build verification** — `pnpm build` after each phase
3. **Visual spot checks** — Screenshot 5 pages before/after
4. **Font loading order** — `font-display: swap` + preconnect

## Tech Stack

- Astro 5.x (future Astro 6/7)
- Tailwind CSS 4.x
- Plus Jakarta Sans (body) + Sora (headings) — both local woff2
- No external font CDN

## Out of Scope

- Component-level refactoring (already done in 0113)
- Color system changes
- Spacing system changes
- New font family selection (Plus Jakarta + Sora are final)