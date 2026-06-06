# Plan — Increment 0114: Typography Refactor

## Architecture Decisions

### 1. Font Weight Strategy

**Current**: Load 5 weights per font (10 woff2 files total)
**Decision**: Reduce to essential weights only

| Font | Loaded Weights | Use Case |
|------|----------------|----------|
| Plus Jakarta Sans (body) | 400, 500, 600, 700 | Drop 800 |
| Sora (headings) | 600, 700 | Drop 400, 500, 800 |

**Rationale**:
- `font-extrabold` (800) is rarely used in modern UI design
- Sora 400, 500 not used (only bold variants for headings)
- Saves 3 woff2 files (~30KB)

**Why not font-thin, font-extralight, font-light?**
- Not in our type scale
- Don't add cognitive load to design system

### 2. Type Scale

**Decision**: Standardize on 7 levels

| Level | Size | Tailwind Class | Use |
|-------|------|----------------|-----|
| Display | 48-60px | `text-5xl`, `text-6xl` | Hero, splash (rare) |
| H1 | 30px | `text-3xl` | Page title |
| H2 | 24px | `text-2xl` | Section |
| H3 | 20px | `text-xl` | Subsection |
| H4 | 18px | `text-lg` | Card title |
| Body | 16px | `text-base` | Long form |
| Small | 14px | `text-sm` | Card body, UI |
| Caption | 12px | `text-xs` | Meta, badges |
| Meta | 10px | `text-[10px]` (custom) | Compact card metadata |

### 3. Arbitrary Font Size Solution

**Decision**: Add `--text-meta: 10px` token for compact card metadata

```css
@theme {
  --text-meta: 10px;
}
```

Usage: `<span class="text-meta">` → `<span class="text-[10px]">` (Tailwind utility)

Or, simpler: standardize to `text-xs` (12px) with `tracking-tight` and let small metadata be slightly larger.

### 4. Heading Standardization

**Decision**: Apply consistent heading classes

| Tag | Standard Classes |
|-----|------------------|
| h1 | `text-3xl font-bold leading-tight` |
| h2 | `text-2xl font-semibold leading-tight` |
| h3 | `text-xl font-semibold leading-snug` |
| h4 | `text-lg font-medium leading-snug` |

**Exceptions** (documented):
- Hero h1: `text-5xl font-bold` (homepage, business landing)
- Splash h1: `text-6xl font-bold` (404, 500)

### 5. Line Heights

| Element | Line Height | Tailwind |
|---------|-------------|----------|
| Display | 1.0-1.1 | `leading-none` or `leading-tight` |
| H1-H2 | 1.1-1.2 | `leading-tight` |
| H3-H4 | 1.3 | `leading-snug` |
| Body | 1.5-1.6 | `leading-normal` or `leading-relaxed` |
| Caption | 1.4 | `leading-snug` |

### 6. Semantic Type Tokens

```css
@theme {
  /* Sizes */
  --text-meta: 10px;
  --text-caption: 12px;
  --text-body: 16px;
  --text-h4: 18px;
  --text-h3: 20px;
  --text-h2: 24px;
  --text-h1: 30px;
}
```

These can be used as `text-[length:var(--text-h1)]` or by extending Tailwind config.

## Migration Strategy

### Phase 1: Reduce font weights (safe, no visual change)
1. Verify no usage of removed weights
2. Delete woff2 files
3. Remove @font-face declarations
4. Test build + visual

### Phase 2: Add type tokens (additive, no change)
1. Add CSS variables to @theme
2. Document usage
3. No code changes yet

### Phase 3: Fix arbitrary sizes (careful, may affect visual)
1. Use baseline screenshots
2. Replace one file at a time
3. Compare screenshots
4. Revert if visual change

### Phase 4: Heading standardization (cascading change)
1. Start with most-used pages
2. Apply standard scale
3. Visual verify
4. Note exceptions

### Phase 5: Documentation (final, no code change)
1. Update .impeccable.md
2. Add type scale section
3. Document "DO NOT" rules

## Risk Mitigation

| Risk | Severity | Mitigation |
|------|----------|------------|
| Visual regression on cards | HIGH | Per-file commits + baseline screenshots |
| Font FOIT on weight removal | MEDIUM | Test in production before full deploy |
| Heading hierarchy breaks design | MEDIUM | Start with admin pages (less critical) |
| Documentation drift | LOW | Update after code changes |

## Verification Plan

### Before Each Phase
1. `pnpm build` — must exit 0
2. Visual spot check on 1-2 pages
3. Git status shows expected changes only

### After Each Phase
1. Compare to baseline screenshots
2. Test interactivity (admin forms, search)
3. Console error check

### After All Phases
1. Full Playwright test of 20 pages
2. Visual diff of 5 baseline pages
3. Performance check (font payload)

## Success Metrics

| Metric | Before | After |
|--------|--------|-------|
| Font files | 10 | 7 |
| Total font payload | ~100KB | ~70KB |
| Arbitrary font sizes | 23 | 0 |
| text-sm (14px) body text | 613 | 200 (only where appropriate) |
| text-base (16px) body text | 43 | 200+ (default) |
| Documented heading scale | None | Full h1-h6 |
| Updated .impeccable.md | No | Yes |

## Future Considerations

### When to upgrade to Astro 6/7
- Both versions support the same font loading mechanism
- CSS variables in @theme work the same
- No changes needed

### When to consider system fonts
- If removing all web fonts is desired
- Would change visual identity significantly
- Out of scope for this increment

### When to add OpenType features
- For Sora (headings): ligatures, contextual alternates
- For Plus Jakarta Sans: tabular numbers for data tables
- Future enhancement, not in scope