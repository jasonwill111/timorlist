---
increment: 0103-fulldev-migration-refactor
title: "Full-Stack Migration: @fulldev Integration + Separation of Concerns"
type: refactor
priority: P1
status: in-progress
created: 2026-06-04
project: TimorUp
---

# Increment 0103: Full-Stack Migration to @fulldev + Separation of Concerns

## Overview

Comprehensive refactoring to:
1. **Replace custom UI components** with @fulldev equivalents (60% reduction)
2. **Consolidate duplicated backend logic** across lib, actions, and API layers
3. **Separate UI/UX concerns from business logic** for maintainability
4. **Maximize component reuse** across the full stack

**Analysis Report**: `docs/FULL-STACK-MIGRATION-ANALYSIS.md`

## Executive Summary

| Layer | Current | Opportunity | Risk |
|-------|---------|-------------|------|
| UI Components | 45 files, ~800 LoC | 60% replaceable → ~480 LoC reduction | LOW |
| Islands/Blocks | 12 islands, ~70KB | 10/12 replaceable | MEDIUM |
| Lib Utilities | 108 files, 13,871 LoC | 15+ consolidation targets | MEDIUM |
| Actions Layer | 47 actions, 7 domains | 7 duplication groups | HIGH |
| API Layer | 21 endpoints | 3 security issues | CRITICAL |

**Total Estimated Reduction**: 1,500+ LoC  
**Estimated Maintainability Improvement**: 60-70% faster future development  

## Phase 1: Foundation (Week 1-2)

### Tasks

- [ ] T-001: Install @fulldev: `npx shadcn@latest add @fulldev/init -y --overwrite`
- [ ] T-002: Install components: button, input, badge, label, textarea, avatar, skeleton, select, native-select
- [ ] T-003: Install card: `npx shadcn@latest add @fulldev/card -y`
- [ ] T-004: **FIX SECURITY** SEC-001: api/admin/skus/index.ts - add auth check
- [ ] T-005: **FIX SECURITY** SEC-002: api/products/index.ts POST - remove client isAdmin bypass
- [ ] T-006: **FIX SECURITY** SEC-003: api/products/[id].ts PUT/DELETE - remove client isAdmin bypass
- [ ] T-007: Create lib/result.ts - consolidate Result types from type-utils.ts, queries/result.ts, action-helpers.ts
- [ ] T-008: Create lib/sanitize.ts - consolidate escaping functions
- [ ] T-009: Create lib/env.ts - consolidate env access patterns
- [ ] T-010: Delete LoadingButton.astro - replace with Button loading={true}

### Verification

- [ ] @fulldev/init installed successfully
- [ ] Button, Input, Badge, Card work in test pages
- [ ] Security fixes verified with curl tests
- [ ] Build passes: `pnpm build`

## Phase 2: Component Migration (Week 3-4)

### Tasks

- [ ] T-011: Migrate Button.astro → @fulldev/button (17 files)
- [ ] T-012: Migrate Input.astro → @fulldev/input (5 files)
- [ ] T-013: Migrate Badge.astro → @fulldev/badge (3 files)
- [ ] T-014: Migrate Card family → @fulldev/card (11 files)
- [ ] T-015: Migrate Avatar.astro → @fulldev/avatar (1 file)
- [ ] T-016: Extract card-colors.ts (ORG_TYPE_COLORS, LISTING_TYPE_COLORS, etc)
- [ ] T-017: Extract card-helpers.ts (buildEntityHref, buildListingHref)
- [ ] T-018: Extract image-utils.ts (resolveEntityImage)
- [ ] T-019: Refactor BusinessCard to use extracted libs
- [ ] T-020: Refactor ListingCard to use extracted libs
- [ ] T-021: Refactor ProductCard to use extracted libs

### Verification

- [ ] All UI components migrated and working
- [ ] Domain logic extracted to lib/ui/
- [ ] BusinessCard, ListingCard still render correctly
- [ ] Build passes: `pnpm build`

## Phase 3: Backend Consolidation (Week 5-6)

### Tasks

- [ ] T-022: Extract lib/rating.ts (rating recalculation - used in 2 places)
- [ ] T-023: Fix DUPE-1: adBanners single CRUD path (3 files → 1)
- [ ] T-024: Fix DUPE-2: servicePackages re-export (delete duplicate)
- [ ] T-025: Fix DUPE-3: Auth logic (light-auth.ts vs signIn.ts consolidation)
- [ ] T-026: Fix DUPE-4: Rating recalc (use lib/rating.ts)
- [ ] T-027: Fix DUPE-5: Listings split (merge admin/listings.ts + admin/listing.ts)
- [ ] T-028: Fix DUPE-6: setRole split (merge into admin/users/index.ts)
- [ ] T-029: Create lib/api-helpers.ts (jsonResponse, errorResponse helpers)
- [ ] T-030: Create lib/api-cache.ts (cacheResponse helpers)
- [ ] T-031: Create lib/api-middleware.ts (rate limit helpers)

### Verification

- [ ] No duplicate functions found in lib/
- [ ] Actions use consolidated helpers
- [ ] API endpoints use shared middleware
- [ ] Build passes: `pnpm build`

## Phase 4: Advanced Migration (Week 7-8)

### Tasks

- [ ] T-032: Create lib/db/queries/entity.ts (generic entity queries)
- [ ] T-033: Apply templating to: businesses, non_profits, public_sectors
- [ ] T-034: Create FormField component (label + input + error)
- [ ] T-035: Migrate Modal.astro → @fulldev/dialog (15 files)
- [ ] T-036: Migrate Tabs → @fulldev/tabs
- [ ] T-037: Audit islands for @fulldev/blocks replacement
- [ ] T-038: Final duplicate code audit

### Verification

- [ ] Modal migrated to @fulldev/dialog
- [ ] DB queries templated where applicable
- [ ] All pages render correctly
- [ ] E2E tests pass: `pnpm test` (or manual verification)

## User Stories

### US-001: Install @fulldev (P0)
**Problem**: Project has custom UI components that duplicate @fulldev functionality
**Solution**: Install @fulldev via shadcn CLI
**Files**: New components installed to src/components/ui/

### US-002: Security Fixes (P0 - CRITICAL)
**Problem**: 3 API endpoints have security vulnerabilities
- api/admin/skus: No auth check
- api/products: Client-controlled isAdmin bypass
**Solution**: Add proper server-side auth validation
**Files**: src/pages/api/admin/skus/index.ts, src/pages/api/products/index.ts, src/pages/api/products/[id].ts

### US-003: UI Component Migration (P1)
**Problem**: 13 UI components can be replaced with @fulldev equivalents
**Solution**: Replace custom components with @fulldev
**Files**: src/components/ui/Button.astro, Input.astro, Badge.astro, Card.astro, etc.

### US-004: Domain Logic Extraction (P1)
**Problem**: Business logic mixed with presentation in BusinessCard, ListingCard, ProductCard
**Solution**: Extract to lib/ui/card-colors.ts, card-helpers.ts, image-utils.ts
**Files**: src/components/business/*.astro, new src/lib/ui/*.ts

### US-005: Lib Consolidation (P1)
**Problem**: 15+ duplication groups identified in lib/
**Solution**: Consolidate to canonical implementations
**Files**: src/lib/result.ts, sanitize.ts, env.ts, rating.ts, api-helpers.ts

### US-006: Actions Consolidation (P2)
**Problem**: 7 duplication groups in actions layer
**Solution**: Merge duplicated code, extract shared functions
**Files**: src/actions/admin/*.ts

### US-007: DB Query Templating (P2)
**Problem**: getById, getBySlug, getByOwner patterns duplicated across 5+ tables
**Solution**: Create generic entity query module
**Files**: src/lib/db/queries/entity.ts

### US-008: Modal Migration (P2)
**Problem**: Custom Modal uses global showModal/hideModal API
**Solution**: Migrate to @fulldev/dialog with reactive state
**Files**: src/components/ui/Modal.astro, 15+ usage sites

## Acceptance Criteria

- [ ] All security issues fixed and verified
- [ ] @fulldev installed and components migrated
- [ ] Domain logic separated from presentation
- [ ] Lib utilities consolidated (0 duplicate functions)
- [ ] Actions consolidated (0 duplicate logic)
- [ ] DB queries templated where applicable
- [ ] Modal migrated to @fulldev/dialog
- [ ] Build passes: `pnpm build` exits 0
- [ ] All pages render correctly
- [ ] E2E tests pass

## Expected Outcomes

| Metric | Before | After | Change |
|--------|--------|-------|--------|
| UI Components LoC | ~800 | ~250 | -69% |
| Lib Duplications | 15+ | 0 | -100% |
| Action Duplications | 7 groups | 0 | -100% |
| Security Issues | 3 critical | 0 | -100% |
| Maintainability | LOW | HIGH | +200% |

## Rollback Plan

If migration causes issues:
1. Revert to pre-migration git commit
2. Restore custom components from backup
3. Re-deploy previous version
4. Document failure reason before retrying

## Dependencies

- @fulldev packages (npm registry)
- shadcn CLI (npx shadcn@latest)
- Current Drizzle schema unchanged
- Cloudflare Workers environment compatibility maintained