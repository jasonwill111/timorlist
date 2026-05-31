# Implementation Plan: Code Review Fixes

## Overview

Fix 4 critical/high security and data integrity issues in production codebase.

## Design

### Fix 1: Media Upload entityType
Extract entity type from input.type before validation.
```typescript
const entityType = input.type.split('/')[0]; // 'businesses' from 'businesses/biz-123/profile'
const validation = validateMediaFile(file, entityType);
```

### Fix 2: Auth Cookie Security
Make secure conditional and sameSite strict.
```typescript
cookieConfig: {
  secure: import.meta.env.PROD,
  sameSite: 'strict',
}
```

### Fix 3: Business Rating Columns
Use schema column names (camelCase) in update query.
```typescript
.set({
  ratingAverage: stats?.avgRating || null,
  ratingCount: stats?.reviewCount || 0,
})
```

### Fix 4: BusinessListNew Filter
Move client-side filter to database WHERE clause.
```typescript
.where(inArray(businesses.status, ['active', 'live', 'published']))
```

## Rationale

1. **Media upload**: `validateMediaFile()` needs entity type string. Extract from input.type format `'type/id/purpose'`.
2. **Auth cookies**: Production requires `secure: true` for HTTPS. `sameSite: 'strict'` prevents CSRF.
3. **Query columns**: Schema uses `ratingAverage`/`ratingCount`, not `rating`/`reviewCount`.
4. **DB filtering**: Load only needed rows, not full table + filter in JS.

## Files Modified

- `src/actions/media/upload.ts`
- `src/lib/auth.ts`
- `src/lib/db/queries/businesses.ts`
- `src/components/islands/BusinessListNew.astro`

## Verification

Build passes: `pnpm build` completes in 2m5s with 0 errors.