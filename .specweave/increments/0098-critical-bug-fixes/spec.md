---
increment: 0098-critical-bug-fixes
title: "Workers Production Critical Bug Fixes"
type: bugfix
priority: P0
status: completed
created: 2026-05-31
---

# Critical Bug Fixes - Workers Production

## Problem

项目部署到 Cloudflare Workers 后发现以下关键问题：

1. **Schema 字段错误** - `business/[slug].astro` 使用不存在的字段
2. **Media 查询失败** - 字段名与 schema 不匹配
3. **JSON 解析崩溃** - 不安全的 `JSON.parse()` 导致页面崩溃

## Root Cause

### 1. planStatus vs subscriptionStatus
- Schema 定义: `businesses.subscriptionStatus`
- 代码使用: `business.planStatus` ❌
- 结果: 订阅状态检查失败

### 2. Media Schema Fields
- Schema 定义: `media.entityType`, `media.entityId`
- 代码使用: `media.type`, `media.typeId` ❌
- 结果: Gallery 图片无法加载

### 3. Unsafe JSON.parse
- 直接使用 `JSON.parse(str)` 无错误处理
- 当 `str` 为 `null`、`undefined` 或无效 JSON 时崩溃
- 结果: 页面无法渲染

## Solution

### 1. Fix business/[slug].astro
```typescript
// Before
const planStatus = business.planStatus || 'none';

// After
const subscriptionStatus = business.subscriptionStatus || 'none';
```

### 2. Fix Media Query
```typescript
// Before
.where(eq(media.typeId, business.id))
.where(eq(media.type, 'businesses'))

// After
.where(eq(media.entityId, business.id))
.where(eq(media.entityType, 'businesses'))
```

### 3. Add safeJsonParse
```typescript
function safeJsonParse<T>(str: unknown, fallback: T): T {
  if (!str || typeof str !== 'string') return fallback;
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
}
```

## Files Changed

| File | Change |
|------|--------|
| `src/pages/business/[slug].astro` | `planStatus` → `subscriptionStatus`, `type`/`typeId` → `entityType`/`entityId` |
| `src/components/islands/HomepageContent.astro` | Added `safeJsonParse()`, replaced 4 `JSON.parse()` calls |
| `src/lib/errors/errorCodes.ts` | Added `USER_NOT_FOUND` error code |

## Verification

- [x] TypeScript compile passed
- [x] Files syntax verified
- [ ] Deploy to production
- [ ] Test business detail page
- [ ] Test homepage content loading
