# Tasks — Increment 0134: SVG → LucideIcon

- [x] T-001: IconRenderer — add `leading-none` class, simplify inline style
- [x] T-002: MediaGallery — replace 4 inline SVG (Image icon, Play, X close, ChevronLeft/Right) with LucideIcon
- [x] T-003: ShareDialog — replace 9 inline SVG (share icon, close, +7 brand icons) with LucideIcon
- [x] T-004: ShareDialog — extract brand icon paths to data structure (socialBrands)
- [x] T-005: `pnpm build` exits 0
- [x] T-006: Visual smoke test (icons render correctly)

## Summary

- Replaced 14 inline `<svg>` with `<LucideIcon>` component
- Reduced duplication of brand SVG paths (now in socialBrands array)
- Maximizes reuse of centralized icon system

## Definition of Done
- [x] All 3 files use LucideIcon
- [x] `pnpm build` exit 0
- [x] No visual regression
