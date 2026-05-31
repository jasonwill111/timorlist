---
name: 0099-unified-card-rendering
description: Unified card rendering + container width standardization
metadata:
  type: feature
  created: 2026-05-31
---

# Plan: Unified Card Rendering + Container Width Standardization

## Design

### 1. BusinessCard.astro Enhancements

**Location**: `src/components/business/BusinessCard.astro`

**New Props**:
```typescript
profileImageId?: string | null;  // Media API image ID
views?: number;                  // View count with eye icon
entityType?: 'business' | 'nonprofit' | 'publicsector';
```

**Image Resolution Logic**:
```typescript
// Priority: thumbnail > profileImageId > placeholder
const imageSrc = thumbnail || (profileImageId ? `/api/media/${profileImageId}` : null);
```

### 2. ListingCard.astro Enhancements

**Location**: `src/components/business/ListingCard.astro`

**New Props**:
```typescript
profileImageId?: string | null;  // Media API image ID
```

### 3. Container Width Standard

All content containers use `max-w-7xl`:
- Header.astro: line 16, 133
- Footer.astro: line 8
- List pages: explicit wrapper with max-w-7xl

### 4. Navigation URL Patterns

| entityType | href |
|------------|------|
| business | `/business/${slug}` |
| nonprofit | `/non-profit/${slug}` |
| publicsector | `/public-sector/${slug}` |

## Implementation Order

1. Enhance BusinessCard.astro (3 new props)
2. Enhance ListingCard.astro (1 new prop)
3. Update Header.astro and Footer.astro container widths
4. Refactor 4 list pages to use card components

## Files to Modify

| File | Change |
|------|--------|
| `src/components/business/BusinessCard.astro` | Add profileImageId, views, entityType props |
| `src/components/business/ListingCard.astro` | Add profileImageId prop |
| `src/components/Header.astro` | max-w-6xl → max-w-7xl |
| `src/components/Footer.astro` | max-w-6xl → max-w-7xl |
| `src/pages/businesses/index.astro` | Use BusinessCard component |
| `src/pages/non-profits/index.astro` | Use BusinessCard component |
| `src/pages/public-sectors/index.astro` | Use BusinessCard component |
| `src/components/islands/ListingListNew.astro` | Use ListingCard component |

## Rationale

1. **Extend existing components** rather than create new ones to avoid code duplication
2. **profileImageId > thumbnail** for Media API compatibility (existing pages use this pattern)
3. **entityType prop** enables single component for all 3 entity types (business/nonprofit/publicsector)
4. **max-w-7xl** provides 3200px max-width, giving more space for content than current max-w-6xl (2880px)