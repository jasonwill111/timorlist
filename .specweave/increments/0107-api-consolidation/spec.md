---
increment: 0107-api-consolidation
title: "API Layer Consolidation"
type: refactor
priority: P1
status: pending
created: 2026-06-04
structure: user-stories
test_mode: manual-e2e
coverage_target: 0
project: TimorUp
production: https://timorup.jasonwill.workers.dev
epic: 0103-fulldev-migration-refactor
---

# Refactor: API Layer Consolidation

## Overview

Increment 0103 created three new utility libraries (`api-helpers.ts`, `api-cache.ts`, `api-middleware.ts`) but did not apply them to existing routes. Three API routes still define inline `jsonResponse` helpers, and 12 admin routes have no rate limiting, no method enforcement, and no standardized error responses.

This increment **applies** the helpers to existing routes, completing the consolidation work started in 0103.

## User Stories

### US-1: API Developer — Eliminate Duplicate jsonResponse

**As an** API developer
**I want** all API routes to import a single `jsonResponse` helper
**So that** response shapes are consistent across the codebase

**Acceptance Criteria:**
- [ ] `src/pages/api/admin/skus/index.ts` imports `jsonResponse` from `@/lib/api-helpers`
- [ ] `src/pages/api/products/index.ts` imports `jsonResponse` from `@/lib/api-helpers`
- [ ] `src/pages/api/products/[id].ts` imports `jsonResponse` from `@/lib/api-helpers`
- [ ] Zero inline `function jsonResponse` definitions remain in `src/pages/api/`
- [ ] All three routes return identical response shape for `{ success, data | error }`
- [ ] `pnpm build` exits 0
- [ ] curl tests confirm responses match pre-refactor shape

### US-2: API Consumer — Standardized Error Responses

**As an** API consumer (frontend)
**I want** all error responses to use the same status code + body shape
**So that** I can handle errors uniformly without per-route special cases

**Acceptance Criteria:**
- [ ] Unauthorized returns `{ success: false, error: { code: 'UNAUTHORIZED', message } }` with HTTP 401
- [ ] Bad request returns `{ success: false, error: { code: 'BAD_REQUEST', message } }` with HTTP 400
- [ ] Not found returns `{ success: false, error: { code: 'NOT_FOUND', message } }` with HTTP 404
- [ ] All admin routes use these helpers instead of inline error responses

### US-3: API Operator — Rate Limiting on All Admin Endpoints

**As an** API operator
**I want** all admin write endpoints to have rate limiting
**So that** abuse is prevented

**Acceptance Criteria:**
- [ ] All 12 admin write endpoints use `withRateLimit` from `@/lib/api-middleware`
- [ ] Rate limit: 60 requests per minute per IP per endpoint
- [ ] 429 response includes `Retry-After` header
- [ ] curl tests confirm rate limit triggers after 60 requests

### US-4: API Developer — Method Enforcement

**As an** API developer
**I want** all API routes to explicitly declare allowed HTTP methods
**So that** accidental GET on a write endpoint returns 405 instead of 500

**Acceptance Criteria:**
- [ ] All API routes use `withMethods` from `@/lib/api-middleware`
- [ ] `405 Method Not Allowed` returns `Allow` header listing valid methods
- [ ] curl tests confirm `405` for disallowed methods

### US-5: Public API Consumer — Cached Public Endpoints

**As a** public API consumer
**I want** GET endpoints to have edge cache headers
**So that** latency is reduced and Cloudflare caching kicks in

**Acceptance Criteria:**
- [ ] Public GET endpoints use `cachedJsonResponse` with `'API'` preset
- [ ] Cache-Control header is set to `public, s-maxage=60, stale-while-revalidate=30`
- [ ] curl `-I` shows the cache header

## Out of Scope

- New API endpoints
- Response shape changes (must be backwards compatible)
- Auth logic changes (separate increment)

## Dependencies

- `src/lib/api-helpers.ts` (created in 0103)
- `src/lib/api-cache.ts` (created in 0103)
- `src/lib/api-middleware.ts` (created in 0103)

## Risk

**Medium**: API changes can break consumers. Mitigation:
- Backwards-compatible response shapes
- Curl smoke tests before deploy
- Deploy to production with verified behavior
