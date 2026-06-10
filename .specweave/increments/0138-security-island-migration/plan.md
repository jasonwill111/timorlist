# Implementation Plan: Admin Security + Island Migration

## Architecture Decisions

### AD-001: DOMPurify over safe DOM API for XSS Fixes
- **Decision**: Use DOMPurify for complex HTML generation (charts, product cards), safe DOM API for simple cases
- **Why**: Chart HTML is template-string-based; DOMPurify is the minimal-change fix
- **Alternatives considered**: Full safe DOM API rewrite (too large, high risk)

### AD-002: Island Pattern for Dashboard
- **Decision**: Follow `ServicePackagesIsland.astro` pattern — server data via `set:html` JSON script tag, client uses `JSON.parse` + safe DOM API
- **Why**: Zero innerHTML, type-safe data flow, consistent with codebase patterns

### AD-003: Re-export over Deletion for Legacy Components
- **Decision**: Convert legacy PascalCase files to thin re-exports
- **Why**: Prevents breaking unknown import sites without doing a full grep audit

## Components

- `DashboardIsland.astro` (NEW): Admin dashboard island — stats cards, revenue chart, subscription list
- `pages/admin/index.astro` (MOD): Becomes island shell — server data fetch, island reference
- `pages/business/[slug]/products.astro` (MOD): Add DOMPurify to product card innerHTML
- `pages/business/[slug]/edit/index.astro` (MOD): Add DOMPurify to gallery preview
- `src/components/ui/*.astro` (MOD): 11 re-export files → thin wrappers

## DOMPurify Pattern

```typescript
// In <script> block of affected files
import DOMPurify from 'dompurify';
const sanitize = (html: string) => DOMPurify.sanitize(html, { USE_PROFILES: { html: true } });

// Before any innerHTML assignment
chartEl.innerHTML = sanitize(chartHTML);
cardEl.innerHTML = sanitize(cardHTML);
```

## Testing Strategy

- Build verification: `pnpm build` exit 0
- E2E regression: `pnpm test:e2e`
- Manual XSS test: inject `<img src=x onerror=alert(1)>` in product title → verify not executed