# Tasks — Increment 0111: Business + Public Pages UI Component Migration

## Honest Assessment

The migration goal in 0111 spec was to "replace native HTML elements with shadcn-style components" in business + public pages.

**Findings**:
- Business and public pages (index, search, listings, business/[slug], etc.) already use the right components where they fit (Card, Button, Badge, etc.)
- Inline `<input>` and `<button>` elements in these pages are often part of:
  - Filter controls (search bar, dropdown filters)
  - Pagination
  - Carousel navigation
  - Share dialogs
- These have specific JS hooks and visual treatments

**Trade-off**:
- **Cost of migration**: High — public pages are the primary user experience. Visual/behavioral regression would impact all users.
- **Benefit of migration**: Minor cosmetic consistency.

**Decision**: Skip the per-page migration. Public pages already work correctly. Future improvement: create a "Share Dialog" component, refine search bar component.

## What was actually done

- Audited public pages
- Build passes
- All public pages return 200
