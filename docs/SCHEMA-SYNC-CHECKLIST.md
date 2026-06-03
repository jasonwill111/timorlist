<!-- specweave:living-doc {"name": "SCHEMA-SYNC-CHECKLIST.md", "version": "1.1.0", "updated": "2026-06-03", "type": "reference", "domain": "database", "maintainedBy": "team", "lastChange": "project-cleanup"} -->
# Schema Sync Checklist
## Overview

确保 local schema、remote D1、API types、frontend components 完全同步的验证流程。

## Quick Commands

```bash
# Full validation
npx tsx scripts/schema-validator.ts

# Quick check (deprecated fields only)
npx tsx scripts/schema-validator.ts --mode=quick

# Remote D1 schema only
npx wrangler d1 execute timorup-db --remote --command "SELECT name FROM sqlite_master WHERE type='table';"

# Compare specific table
npx wrangler d1 execute timorup-db --remote --command "PRAGMA table_info(businesses);"
```

## Validation Phases

### Phase 1: Local Schema ✅
- [ ] 所有表定义存在
- [ ] 必需字段完整
- [ ] 无废弃字段

### Phase 2: Remote D1 ✅
- [ ] Remote 表结构与 local 一致
- [ ] 无遗留废弃字段
- [ ] 索引完整

### Phase 3: API Types ✅
- [ ] API 不返回废弃字段
- [ ] Zod schemas 同步
- [ ] Response types 正确

### Phase 4: Frontend Components ✅
- [ ] 组件不引用废弃字段
- [ ] 类型派生正确 (如 listingType from category)
- [ ] 表单字段与 schema 对齐

### Phase 5: Build ✅
- [ ] `pnpm build` 通过
- [ ] 无 TypeScript 错误
- [ ] 无类型不匹配警告

## Critical Field Mapping

### Businesses
| Local Field | Remote Field | Status |
|-------------|--------------|--------|
| planExpiresAt | plan_expires_at | ✅ |
| views | views | ✅ |
| deletedAt | deleted_at | ✅ |
| ~~subscriptionStatus~~ | ❌ (已删除) | ❌ |
| ~~gracePeriodEndDate~~ | ❌ (动态计算) | ❌ |

### Listings
| Local Field | Remote Field | Status |
|-------------|--------------|--------|
| planExpiresAt | plan_expires_at | ✅ |
| shares | shares | ✅ |
| ~~listingType~~ | ❌ (从 category 派生) | ❌ |

### Orders
| Local Field | Remote Field | Status |
|-------------|--------------|--------|
| planExpiresAt | plan_expires_at | ✅ |
| ~~variantId~~ | ❌ (删除) | ❌ |

## Type Derivation Rules

### Listing Type (从 category.slug 派生)
```typescript
const typeMap: Record<string, string> = {
  'vehicles': 'vehicle',
  'property-sale': 'property',
  'for-sale': 'product',
  'jobs': 'job',
  'services': 'service',
  'rentals': 'rental',
  'wanted': 'wanted',
  'community': 'community',
  'pets-animals': 'pet',
  'agriculture': 'agriculture',
};
```

### Subscription Status (从 orders 表派生)
```typescript
const status = now <= planExpiresAt ? 'active'
  : now <= planExpiresAt + GRACE_PERIOD_DAYS ? 'active (grace)'
  : 'expired';
```

## Deprecated Fields to Check

### 必须不存在的字段
```
businesses: subscriptionStatus, gracePeriodEndDate, latestUpdates, planSlug, planType, expiryDate
non_profits: subscriptionStatus, gracePeriodEndDate, latestUpdates, ratingAverage, ratingCount
public_sectors: subscriptionStatus, gracePeriodEndDate, latestUpdates, ratingAverage, ratingCount, planType
listings: listingType, gracePeriodEndAt
orders: variantId
saved_items: itemType, itemId (已重命名为 type, typeId)
```

## Migration Checklist

When adding a new schema change:

1. [ ] Update local `src/db/schema.ts`
2. [ ] Create migration file `migrations/XXXX_migration_name.sql`
3. [ ] Test migration on local D1
4. [ ] Apply migration to remote D1
5. [ ] Update all API endpoints
6. [ ] Update all components using the field
7. [ ] Run `scripts/schema-validator.ts`
8. [ ] Update this checklist
9. [ ] Update CHANGELOG.md

## Emergency Rollback

If a schema change causes issues:

1. Revert local schema changes
2. Revert remote D1 (may not be possible - use forward-only migrations)
3. Run `scripts/schema-validator.ts` to verify rollback
4. Fix and re-deploy