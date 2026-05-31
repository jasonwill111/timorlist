---
name: 0098-critical-bug-fixes
description: Workers production critical bug fixes
metadata:
  type: bugfix
  created: 2026-05-31
---

# Plan: Workers Production Critical Bug Fixes

## Priority: P0 (Critical)

## Root Causes

1. Schema 定义与代码使用不匹配
2. 不安全的 JSON 解析导致崩溃

## Implementation

### Step 1: Fix subscriptionStatus field
- Change `business.planStatus` → `business.subscriptionStatus`

### Step 2: Fix media query fields
- Change `media.type` → `media.entityType`
- Change `media.typeId` → `media.entityId`

### Step 3: Add safeJsonParse wrapper
- Create reusable safe JSON parser function
- Replace all `JSON.parse()` calls in HomepageContent.astro

### Step 4: Add USER_NOT_FOUND error code
- Add to `src/lib/errors/errorCodes.ts`

## Verification

1. TypeScript compile
2. Deploy to production
3. Manual testing on key pages
