# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

### Fixed
- **0100-workers-testing-fix** (2026-05-31): Workers 100% functional testing fixes:
  - `/listings` page: Converted Server Island to Direct SSR (cards now render)
  - Auth forms: Added REST API `/api/auth` fallback for Cloudflare Workers
  - Admin auth: Fixed `getAdminUser` to parse Request cookies (17 admin pages now work)
- **0099-unified-card-rendering** (2026-05-31): Unified card rendering + container width:
  - BusinessCard, ListingCard components enhanced with new props
  - All 4 list pages (businesses, non-profits, public-sectors, listings) use card components
  - Header/Footer standardized to `max-w-7xl` container width
- **0098-critical-bug-fixes** (2026-05-31): Workers production bug fixes:
  - `business/[slug].astro`: Fixed `planStatus` → `subscriptionStatus` (correct schema field)
  - `business/[slug].astro`: Fixed media query `type`/`typeId` → `entityType`/`entityId`
  - `HomepageContent.astro`: Added `safeJsonParse()` wrapper for safe JSON parsing
  - `errorCodes.ts`: Added `USER_NOT_FOUND` error code
- **0095-code-review-security-fixes**: Critical security improvements:
  - XSS vulnerability fixed in ai-tools.astro (DOMPurify sanitization)
  - CSRF protection added to middleware.ts (origin validation)
  - Window interface declared in global.d.ts
- **0094-test-coverage**: Enhanced test coverage infrastructure
- **0093-security-best-practices**: Security best practices documented
- **0092-frontend-ux-improvements**: Focus trap, reduced motion support
- **0091-code-arch-refactor**: Unified error handling, removed dead code
- **0090-db-optimization**: N+1 query fix, database performance
- **0089-typescript-safety**: Type guards, any removal
- **0088-xss-sanitization-a11y**: DOMPurify XSS prevention, aria-hidden
- **0087-auth-security-hardening**: Rate limiting, cookie config

### Changed
- **0058-code-quality-cleanup-p0**: P0 code quality fixes:
  - Type-safe env wrapper (`src/lib/env.ts`) - replaces `as any` pattern
  - Empty catch blocks fixed (10 locations) with proper error logging
  - Production console.log removed (17 locations)
  - Redundant REST APIs deleted (9 files)
- **0081-api-migration-completion** (2026-05-31): Complete REST API cleanup:
  - Added `src/actions/account/` module (4 actions for user private data)
  - Deleted 5 orphaned REST APIs (account/*, subscriptions)
  - Updated pages to use Server Actions instead of fetch
  - Final: 21 REST APIs (keep) / 48 Server Actions

### Changed
- `src/mastra/agents/index.ts` - uses env wrapper, removes `as any`
- `src/actions/admin/aiGenerate.ts` - uses env wrapper, removes debug logs
- `src/lib/auth-kv-store.ts` - proper error logging in catch blocks
- `src/lib/subscription.ts` - proper error logging in catch blocks
- `src/actions/index.ts` - added account module export

## [1.0.0] - 2026-05-07

### Added
- Tech stack modernization (0032-0036):
  - Zod 4 validation with z.email(), z.url(), z.coerce.*
  - Drizzle relations (one/many) configured
  - Mastra AI with unified provider config + Workers AI fallback
  - Server Actions with defineAction + Zod validation
  - Type refactor: 84 any usages �?proper types
- TypeScript strict mode: strict, noUncheckedIndexedAccess, noImplicitReturns
- Motion animations integrated in Layout.astro
- XSS prevention with escapeHtml() (10 usages)

### Fixed
- dev script --local flag for proper D1 dev
- wrangler.toml compatibility_date 2025-04-01

### Changed
- All 30 increments completed and archived
- Feature catalog with 36 features (6 active, 30 archived)

[1.0.0]: https://github.com/jasonwill111/timorup/compare/v0.0.0...v1.0.0

