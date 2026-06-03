<!-- specweave:living-doc {"name": "ENTITY-STRUCTURE.md", "version": "1.7.0", "updated": "2026-06-03", "type": "data-model", "domain": "database", "maintainedBy": "team", "lastChange": "architecture-optimization"} -->
# Entity Structure

## 5 Entity Types (Independent Database Tables)

| Entity | DB Table | Category Link | List | Detail | Admin |
|:-------|:---------|:-------------:|:----:|:------:|:------:|
| **Business** | businesses | business_categories | /businesses | /business/[slug] | /admin/businesses |
| **Non-Profit** | non_profits | non_profit_categories | /non-profits | /non-profit/[slug] | /admin/non-profits |
| **Public Sector** | public_sectors | public_sector_categories | /public-sectors | /public-sector/[slug] | /admin/public-sectors |
| **Listing** | listings | listing_categories | /listings | /listing/[slug] | /admin/listings |
| **Product** | products | product_categories | /business/[slug]/products | /product/[slug] | /admin/products |

## Subscription Model (2026-06-01)

### Plan Comparison

| Feature | Businesses | Non-Profits | Public Sectors | Listings |
|---------|:-----------:|:-----------:|:--------------:|:--------:|
| **Plan** | ✅ Paid | ❌ Free | ❌ Free | ✅ Paid |
| **Media Limits** | Global constants | Global constants | Global constants | Global constants |
| **Renewal** | Monthly/Yearly | - | - | 7/30/365 days |
| **Grace Period** | 30 days (read-only) | None | None | 14 days |
| **On Expiry** | Delete after grace | Never | Never | Delete after grace |
| **Downgrade** | Wait for expiry | N/A | N/A | Wait for expiry |

### Media Limits (Global Constants)

| Entity | Detail Images | Detail Videos | Product Images | Product Videos |
|--------|:-------------:|:-------------:|:--------------:|:--------------:|
| Business | 16 | 2 | 6 | 1 |
| Listing | 6 | 1 | 6 | 1 |

### Order Lookup Rule

```sql
-- Get current active plan (paid order with latest planExpiresAt)
SELECT * FROM orders
WHERE type=? AND typeId=? AND status='paid'
ORDER BY planExpiresAt DESC
LIMIT 1
```

**Renewal formula**:
```
new.planExpiresAt = max(now, old.planExpiresAt) + duration
// Remaining time automatically added
```

### Subscription Lifecycle

| Entity | Status | User Action |
|--------|--------|-------------|
| **Active** | planExpiresAt > now | Full access |
| **Grace Period** | planExpiresAt < now < planExpiresAt + grace | Read-only (entity visible, no edit) |
| **Expired** | After grace period | Entity deleted |

### Feature Comparison

| Feature | Businesses | Non-Profits | Public Sectors | Listings |
|---------|:----------:|:-----------:|:-------------:|:--------:|
| **Unique Sections** | Products/Services, Reviews | ❌ | ❌ | ❌ |
| **Industry Category** | ✅ Two-level | ❌ | ❌ | ❌ |
| **Sub-category** | ✅ parentId | ✅ parentId | ✅ parentId | ✅ parentId |

## Category Table Structure (4 tables, identical schema)

| Field | Description |
|-------|-------------|
| id | Primary key |
| name | Category name |
| slug | URL slug |
| description | Description |
| icon | Icon |
| **parentId** | **Parent category ID (two-level)** |
| createdAt/updatedAt | Timestamps |

## Listing Visibility Rules

| Condition | Status |
|-----------|--------|
| Created → within 3 days | Public |
| Renewed before expiration | Public (30/365 days) |
| Expired without renewal | Deleted after 7 days |

## URL Naming Convention

- Plural = list page (`/businesses`)
- Singular + slug = detail page (`/business/[slug]`)
- `/admin/` + plural = CRUD admin page (`/admin/businesses`)

## ⚠️ Schema Field Names (Critical!)

### media table

| Correct Field | Wrong Field | Description |
|--------------|-------------|-------------|
| `entityType` | `type` | Entity type: 'businesses', 'non-profits', 'public-sectors', 'listings' |
| `entityId` | `typeId` | Related entity ID |

### latestUpdates table

| Entity | Correct `type` value | Wrong value |
|--------|---------------------|-------------|
| Business | `'business'` | `'businesses'` |
| Non-Profit | `'non_profit'` | `'non_profits'` |
| Public Sector | `'public_sector'` | `'public_sectors'` |

> **Common error**: Using `type`/`typeId` instead of `entityType`/`entityId` in detail page queries, or using `'non_profits'` instead of `'non_profit'`
***
## Classification Ads Taxonomy (2026-06-01)
### 10 Primary Categories
| # | Category | Slug | Sub-categories |
|---|----------|------|---------------|
| 1 | Vehicles | vehicles | 9 |
| 2 | Property Sale | property-sale | 8 |
| 3 | For Sale | for-sale | 12 |
| 4 | Jobs | jobs | 7 |
| 5 | Services | services | 8 |
| 6 | Rentals | rentals | 9 |
| 7 | Wanted | wanted | 7 |
| 8 | Community | community | 7 |
| 9 | Pets & Animals | pets-animals | 10 |
| 10 | Agriculture | agriculture | 7 |
### Taxonomy Document
See `docs/CLASSIFIEDS-TAXONOMY.md` for full field definitions and inheritance mechanism.
### Schema Changes (0064)
| Table | Change | Reason |
|-------|--------|--------|
| listings | Removed `listingType` | Derive from `category.parentId` |
| listings | `categoryId` → NOT NULL | Must select a category |
| listings | Added `listings_category_idx` | Faster category queries |
| ad_banners | Renamed `startDate/endDate` → `planExpiresAt` | Consistent naming |
| businesses | Removed `planSlug` | Query from orders table |
### Listing Type Derivation Rule
```typescript
// Derive listing type from category's parentId slug
function getListingType(categoryParentSlug: string): string {
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
  return typeMap[categoryParentSlug] || 'product';
}
```

---


### Frontend Pages Updated

- `src/pages/business/[slug].astro`: Uses `getSubscriptionDashboard` from orders table
- `src/pages/business/[slug]/edit/index.astro`: Uses `getSubscriptionDashboard` for `checkGracePeriod`
- `src/pages/business/[slug]/products.astro`: Uses `/api/subscriptions/dashboard` endpoint
- `src/components/islands/HomepageContent.astro`: Listings query with category join, derive type from `category.slug`
- `src/components/islands/ListingListNew.astro`: Listings query with category join, derive type from `category.slug`
- `src/pages/listing/[slug].astro`: Derives listing type from `category.slug` via join

---
## Bug Fix Log

### 2026-06-02 — Increment 0101: Security Audit & Best Practice Fixes

**No schema changes** — all fixes are code-level, schema unchanged. See `docs/ARCHITECTURE.md` → Bug Fix Log for full technical details.
### 2026-06-02 — Increment 0104: Schema Sync
Query layer migration complete:
  lib/db/queries/admin-listings.ts: Removed listingType from SELECT/INSERT/UPDATE
  lib/db/queries/businesses.ts: Removed subscriptionStatus from INSERT
  lib/subscription.ts: Rewritten to query orders table for subscription state
  pages/api/products/[businessPageId]/sku-usage.ts: Queries orders table
  pages/api/scheduled/_cleanup-expired.ts: Uses orders table, soft-delete via deletedAt
  pages/api/scheduled/_cleanup.ts: Uses orders table, soft-delete via deletedAt
  pages/api/scheduled/_mark-expired.ts: Simplified to monitoring-only
Admin actions updated:
  admin/subscriptions.ts: expiresAt → planExpiresAt
  admin/businesses.ts: Removed latestUpdates, planSlug
  admin/servicePackagesAdmin.ts: Queries orders table for package usage
Admin pages updated:
  admin/businesses.astro: Removed latestUpdates form field
  admin/non-profits.astro: Removed latestUpdates form field
  admin/public-sectors.astro: Removed latestUpdates form field
  admin/listings/index.astro: Removed listingType column and filters

---

## Schema Sync (2026-06-02)

Migration 0072 Summary. Remote D1 schema updated to match local schema.

**Tables modified:**
- businesses: Added views, deletedAt. Removed gracePeriodEndDate, latestUpdates JSON, planType, publishDate, expiryDate, subscriptionStatus, subscriptionExpiresAt, limits, planSlug, organizationType
- non_profits: Added views, deletedAt. Removed ratingAverage, ratingCount, trialStartedAt, gracePeriodEndDate, subscriptionStatus, subscriptionExpiresAt, latestUpdates JSON
- public_sectors: Added views, deletedAt. Removed ratingAverage, ratingCount, trialStartedAt, gracePeriodEndDate, subscriptionStatus, subscriptionExpiresAt, planType, publishDate, expiryDate, latestUpdates JSON
- listings: Added shares. Removed listingType, gracePeriodEndAt. Renamed expiresAt �� planExpiresAt
- products: Added deletedAt
- orders: Removed variantId. Renamed expiresAt �� planExpiresAt. Added servicePackageId NOT NULL, paidDate
- ad_banners: Removed endDate. Added planExpiresAt
- blog_posts: Added featured DEFAULT 0
- saved_items: Renamed itemType �� type, itemId �� typeId
