# TimorUp - Business Directory Platform

Timor-Leste's business directory platform built with Astro + Cloudflare Workers.

## Tech Stack

| Component | Technology |
|-----------|------------|
| Framework | Astro 6.4.2 |
| Database | Drizzle ORM + D1 |
| Auth | better-auth 1.6.11 (with REST API fallback) |
| AI | Mastra 1.29.1 + Workers AI |
| Validation | Zod 4.4.1 |
| Styling | TailwindCSS 4.2.4 |
| Deploy | Cloudflare Workers |

## Features

- **4 Entity Types**: Businesses, Non-Profits, Public Sectors, Classified Listings
- **Unified Card Rendering**: Reusable BusinessCard/ListingCard components
- **Server Actions**: 48 server actions for all write operations
- **REST API Fallback**: `/api/auth` endpoint for Cloudflare Workers compatibility
- **Direct SSR Pattern**: All list/detail pages use Server-Side Rendering (not Server Islands `is:defer`)
- **AI Tools**: Listing creator, SKU creator, blog generator, landing page creator
- **Admin Dashboard**: Full CRUD for all entities (17 pages)
- **Media Management**: R2 storage with image compression
- **Type Safety**: Strict TypeScript with proper types throughout
- **Cloudflare Workers**: Optimized deployment with D1 database and R2 media storage

## Pages (100% Tested)

### Public Pages
- `/` - Homepage with carousel, business cards, listings, non-profits, public sectors
- `/businesses` - Business directory with 20 cards, filters, pagination
- `/non-profits` - Non-profit directory with category badges
- `/public-sectors` - Government offices directory
- `/listings` - Classified ads with 24 cards, type filters
- `/login`, `/register` - Authentication forms
- `/pricing`, `/about`, `/faq`, `/contact`

### Admin Pages
- `/admin` - Dashboard with stats and charts
- `/admin/businesses`, `/admin/listings`, `/admin/non-profits`, `/admin/public-sectors`
- `/admin/categories` - Category management (hierarchical)
- `/admin/media` - Media upload and management
- `/admin/users`, `/admin/products`, `/admin/orders`, `/admin/reviews`
- `/admin/blogs`, `/admin/ad-banners`, `/admin/service-packages`, `/admin/ai-tools`

## Commands

```bash
pnpm dev          # Start dev server (wrangler dev --local)
pnpm build        # Build for production
pnpm test          # Run unit tests
pnpm test:e2e      # Run E2E tests
pnpm db:push       # Push schema to D1
pnpm db:seed       # Seed database
```

## Project Structure

```
src/
├── actions/          # Astro Server Actions
├── components/        # UI components
├── db/                # Drizzle schema + migrations
├── layouts/           # Layout components
├── lib/               # Utilities (auth, AI, media, etc.)
├── mastra/            # AI agents
├── pages/             # Astro pages + API routes
└── types/             # TypeScript type definitions
```

## Documentation

- [SpecWeave Increments](.specweave/docs/internal/specs/timorup/)
- [Feature Catalog](.specweave/docs/internal/specs/timorup/)

## License

MIT

