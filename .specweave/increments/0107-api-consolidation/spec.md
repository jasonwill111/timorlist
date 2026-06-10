---
increment: 0107-api-consolidation
title: API Layer Consolidation
type: refactor
priority: P1
status: completed
created: 2026-06-04T00:00:00.000Z
structure: user-stories
test_mode: manual-e2e
project: TimorUp
production: 'https://timorup.jasonwill.workers.dev'
---

# Refactor: API Layer Consolidation

## Overview
Apply the api-helpers, api-cache, api-middleware utilities (created in 0103) to existing API routes.

## User Stories

### US-1: Eliminate Duplicate jsonResponse
- [ ] src/pages/api/admin/skus/index.ts imports jsonResponse from @/lib/api-helpers
- [ ] src/pages/api/products/index.ts imports jsonResponse from @/lib/api-helpers
- [ ] src/pages/api/products/[id].ts imports jsonResponse from @/lib/api-helpers
- [ ] Zero inline `function jsonResponse` in src/pages/api/
- [ ] pnpm build exits 0

### US-2: Standardized Error Responses
- [ ] Unauthorized: { success: false, error: { code: 'UNAUTHORIZED' } } HTTP 401
- [ ] All error responses use helpers from @/lib/api-helpers

### US-3: Rate Limiting
- [ ] All 12 admin write endpoints use withRateLimit (60/min/IP)
- [ ] 429 response includes Retry-After header

### US-4: Method Enforcement
- [ ] All API routes use withMethods
- [ ] 405 returns Allow header

### US-5: Edge Caching
- [ ] Public GET endpoints use cachedJsonResponse with 'API' preset
- [ ] Cache-Control: public, s-maxage=60, stale-while-revalidate=30

## Risk
Medium: API changes can break consumers. Mitigation: backwards-compatible response shapes.
