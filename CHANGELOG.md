<!-- specweave:living-doc {"name": "CHANGELOG.md", "version": "1.0.6", "updated": "2026-06-03", "type": "changelog", "domain": "project", "maintainedBy": "team", "lastChange": "e2e-testing-bug-fixes"} -->
# Changelog
All notable changes to this project will be documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

## [1.0.6] - 2026-06-03

### Fixed
- **e2e-testing-bug-fixes** (2026-06-03): Comprehensive E2E testing and bug fixes (increment 0100):
  - Fixed product/[slug].astro: unterminated string (L222), missing close div, orphan block
  - Fixed blog/index.astro and blog/[slug].astro: null DB guard for graceful degradation
  - Fixed businesses page and API: removed `subscription_status` field (derived from orders table)
  - Playwright tests: fixed API response format assertion (success/data wrapper)
  - Playwright tests: fixed Admin Media session handling with re-authentication

### Changed
- **ci-deployment-fix** (2026-06-03): CI build pipeline fix:
  - Bypassed wrangler types in CI to avoid remote proxy connection issue
  - Used direct wrangler deploy for production deployment
  - Updated package.json build script with CI=true for wrangler types

### Performance
- Businesses API: simplified query conditions (status-based only, no deletedAt check)
- Deployment: direct wrangler deploy for faster iteration

## [1.0.5] - 2026-06-03

### Changed
- **architecture-optimization** (2026-06-03): Architecture improvements:
  - Unified rate-limit interface: `checkRateLimit()` now KV-first with memory fallback
  - Updated islands to use `client:visible` for lazy loading (performance)
  - Created action-helpers.ts with `withAuth`, `withDb`, `withAuthAndDb` utilities
  - Error codes already well-organized by domain (AUTH_*, DB_*, MEDIA_*, etc.)

### Performance
- Lazy-loaded ShareDialog components (client:visible instead of client:load)
- Reduced initial bundle size for product pages

## [1.0.4] - 2026-06-03
### Fixed
- **security-fix** (2026-06-03): Security audit and bug fixes:
  - Fixed src/actions/media/upload.ts: `user` variable was undefined (should be `session?.user`)
  - Media upload action now correctly validates authentication before processing

### Security
- Rate limiting: Sign in (5/min), Sign up (3/min), Forgot password (3/min)
- API rate limiting: 100 requests/min per IP via KV
- CSRF protection via origin header validation
- CSP, X-Frame-Options, HSTS headers enabled
- All write operations (media upload/delete/update) require authentication

## [1.0.3] - 2026-06-03

### Fixed
- **seo-geo-optimization** (2026-06-03): SEO and Geo best practices implementation:
  - Added geo.region=TL, geo.placename=Timor-Leste, geo.position to Layout
  - Added ICBM tag for geographic coordinates (-8.5569, 125.5603)
  - Added hreflang tags (en, pt, tl, x-default) for i18n
  - Added Organization and WebSite JSON-LD schema to Layout
  - Added BreadcrumbList schema to all detail pages
  - Added Product schema to product/listing pages
  - Fixed sitemap.xml: changed expiresAt → planExpiresAt for listings
  - Fixed actions/account/index.ts: orders.expiresAt → orders.planExpiresAt
  - Admin pages protected with noindex meta + robots.txt
  - Render strategy optimization: static prerender, CDN caching, SSR for dynamic pages

## [1.0.2] - 2026-06-03

### Fixed
- **project-cleanup** (2026-06-03): Complete project cleanup based on latest schema:
  - Fixed deprecated field references: removed `planType` from global.d.ts, seed.ts, validation.ts
  - Removed all `businesses.planType`, `businesses.subscriptionStatus`, `businesses.expiryDate` references
  - Removed all `listings.listingType`, `listings.expiresAt` references
  - Removed all `orders.variantId` references
  - Verified `gracePeriodEndDate` is calculated at runtime (not stored)
  - Verified `subscriptionStatus` derived from orders table (not stored)
  - Legacy brand names (timorlist, timorbiz) not found in codebase
  - Old route patterns (/organization/, /ngo/, /gov/) not found

## [1.0.1] - 2026-06-02

### Added
- Migration 0072 executed: Remote D1 schema aligned with local schema
- businesses/non_profits/public_sectors: Added views, deletedAt; removed 10+ deprecated fields
- listings: Added shares; removed listingType; renamed expiresAt → planExpiresAt
- products: Added deletedAt for soft-delete
- orders: Renamed expiresAt → planExpiresAt; removed variantId; added servicePackageId NOT NULL
- ad_banners: Removed endDate; added planExpiresAt
- blog_posts: Added featured DEFAULT 0
- saved_items: Renamed itemType → type, itemId → typeId

### Fixed
- **0104-schema-sync** (2026-06-02): Query layer migration to orders-based model
- Frontend pages: Updated business/[slug].astro, business/[slug]/edit, business/[slug]/products

### Changed
- Service packages: now managed in admin service-packages page
- Subscription status: dynamically calculated from orders table
- Grace period: dynamically calculated (30 days for businesses, 14 days for listings)

## [1.0.0] - 2026-05-XX

### Added
- Initial project setup with Astro + Cloudflare Workers
- D1 database with 36 tables for businesses, non-profits, public sectors, listings, products
- Better Auth for authentication with Google/Facebook OAuth
- R2 object storage for media files
- Cloudflare KV for sessions
- Admin dashboard with CRUD operations
- AI-powered content generation (MiniMax API)
- SEO optimization with sitemap, robots.txt, JSON-LD schemas
- Responsive UI with Tailwind CSS
- Local SEO with geo tags for Timor-Leste

### Features
- Business directory with categories and search
- Classified listings with media uploads
- Product/Service management
- Blog with categories
- Subscription plans (Starter, Pro, Max)
- Media limits based on subscription tier
- Soft delete with deletedAt timestamps
- Featured content and ad banners

### Infrastructure
- Cloudflare Workers for SSR
- D1 for database
- R2 for media storage
- KV for sessions
- CDN caching with intelligent TTLs
- Scheduled cleanup jobs for expired subscriptions