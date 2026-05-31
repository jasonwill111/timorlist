---
name: 0098-critical-bug-fixes
description: Workers production critical bug fixes
metadata:
  type: bugfix
  created: 2026-05-31
---

# Tasks: Workers Production Critical Bug Fixes

## T-001: Fix subscriptionStatus Field
**Status**: [x] completed
**Files**: `src/pages/business/[slug].astro`
**Test**: Given business detail page → When page loads → Then subscription status displays correctly

## T-002: Fix Media Query Fields
**Status**: [x] completed
**Files**: `src/pages/business/[slug].astro`
**Test**: Given business with gallery images → When page loads → Then gallery images display correctly

## T-003: Add safeJsonParse Wrapper
**Status**: [x] completed
**Files**: `src/components/islands/HomepageContent.astro`
**Test**: Given homepage with tags/JSON data → When page loads → Then no JSON parse errors

## T-004: Add USER_NOT_FOUND Error Code
**Status**: [x] completed
**Files**: `src/lib/errors/errorCodes.ts`
**Test**: Given user not found scenario → When action called → Then proper error returned

## T-005: Verify TypeScript Compile
**Status**: [x] completed
**Test**: Given all files changed → When tsc runs → Then no blocking errors

## T-006: Deploy to Production
**Status**: [ ] pending
**Test**: Given production deploy → When tested → Then all pages load correctly

## T-007: Test Business Detail Page
**Status**: [ ] pending
**Test**: Given business with media → When visiting `/business/[slug]` → Then page loads without errors

## T-008: Test Homepage Content
**Status**: [ ] pending
**Test**: Given homepage → When visited → Then featured content displays correctly
