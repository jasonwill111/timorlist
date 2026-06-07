# Plan: Admin innerHTML Migration to Astro Components

## Design

### Core Pattern: Server → Client Island

Each admin page follows this architecture:

```
Page (.astro, server-side)
  → fetch data in frontmatter
  → pass as JSON props to Island component
  → Island hydrates client-side (client:load)
  → Island renders list items + modal as HTML/Astro markup
```

**Why this pattern?**
- Server-side fetch: data loaded before page render (SEO, no loading flash)
- Island hydration: interactive (forms, modals, buttons work client-side)
- Type-safe props: TypeScript validates data shape at build time
- No innerHTML: list items are actual Astro components, not string templates

### Migration Pattern Per Page

**Before** (innerHTML pattern):
```astro
<script>
// Client fetches data
container.innerHTML = data.map(item => `
  <div class="item">${item.name}</div>
`).join('');
</script>
```

**After** (island pattern):
```astro
---
// Server fetches data
const items = await getAdminItems();
---
<AdminItemsIsland items={items} client:load />
```

### AdminIsland Component Structure

Each island follows this template:

```astro
---
interface Props {
  items: EntityItem[];
  config: AdminConfig;
}
const { items, config } = Astro.props;
---

<div class="admin-list">
  {items.map(item => (
    <AdminListItem item={item} config={config} />
  ))}
</div>

<!-- Modal -->
{showModal && <AdminModal entity={entity} config={config} />}

<script>
// Client-side: modal open/close, form submission, actions
</script>
```

### Business Logic Extraction

Query functions in `src/lib/db/queries/admin/{entity}.ts`:

```typescript
// src/lib/db/queries/admin/products.ts
export async function getAdminProducts(db: Database) {
  return db.select({...}).from(products).all();
}
```

Admin page frontmatter becomes:
```astro
const products = await getAdminProducts(db);
```

### Barrel Imports

All new island components use barrel imports:
```astro
import { ProductsIsland } from '@/components/islands/admin/products';
```

## Rationale

1. **innerHTML anti-pattern removal**: Template strings for DOM creation are untyped, XSS-prone, and unmaintainable. Astro components provide type safety and editor support.

2. **Server-first data fetching**: Current admin pages fetch data client-side after render. Server-side fetch eliminates loading flash and improves LCP.

3. **Separation of concerns**: Business logic (db queries) in lib layer, UI in components, page orchestration in .astro files. AI can reason about each layer independently.

4. **Precedent**: Products island already exists at `src/components/islands/ProductsSection.astro`. Pattern validated in 0136.

5. **Incremental safety**: Each page migrated independently; build verify after each; no big-bang change.

## Implementation Order

| Order | Page | Complexity | Files Created |
|-------|------|------------|---------------|
| 1 | ad-banners | Low | AdBannersIsland.astro, ad-banners.ts |
| 2 | ai-tools | Low | AiToolsIsland.astro, ai-tools.ts |
| 3 | service-packages | Low | ServicePackagesIsland.astro, service-packages.ts |
| 4 | reviews | Low | ReviewsIsland.astro, reviews.ts |
| 5 | orders | Low | OrdersIsland.astro, orders.ts |
| 6 | users | Medium | UsersIsland.astro, users.ts |
| 7 | businesses | Medium | BusinessesIsland.astro, businesses.ts |
| 8 | blogs | Medium | BlogsIsland.astro, blogs.ts |
| 9 | non-profits | High | NonProfitsIsland.astro, non-profits.ts |
| 10 | public-sectors | High | PublicSectorsIsland.astro, public-sectors.ts |
| 11 | products | High | ProductsIsland.astro (enhance existing), products.ts |
| 12 | listings | High | ListingsIsland.astro, listings.ts |
| 13 | admin/index | Medium | DashboardIsland.astro |

## Migration Checklist Per Page

For each page:
1. [ ] Read existing page, count innerHTML usages
2. [ ] Identify entity type and data structure
3. [ ] Create query function in `lib/db/queries/admin/{entity}.ts`
4. [ ] Create island component in `components/islands/admin/{Entity}Island.astro`
5. [ ] Port innerHTML list builder → Astro template in island
6. [ ] Port modal innerHTML → Astro template + shadcn components
7. [ ] Update page frontmatter to use query function, pass props to island
8. [ ] Build verify: `pnpm exec -- astro build`
9. [ ] E2E verify: Playwright test

## Technical Notes

- **No framework components**: All islands are vanilla Astro (`.astro` files) with `<script>` blocks for client behavior — no React/Vue/Svelte
- **Props serialization**: Complex objects passed as JSON stringified props to avoid serialization issues
- **Action usage**: Form submissions use `astro:actions` (already available in ad-banners.astro pattern)
- **Duplicate import fix**: products.astro has duplicate `Button` import (line 4 and 7) — fix during migration