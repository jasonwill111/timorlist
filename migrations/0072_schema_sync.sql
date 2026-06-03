-- Migration 0072: Sync remote D1 schema to match local Drizzle schema
-- Generated: 2026-06-02
-- Based on: SCHEMA_DECISIONS.md + remote schema verification

-- =============================================
-- PHASE 1: Rename columns (saved_items)
-- =============================================
ALTER TABLE saved_items RENAME COLUMN item_type TO type;
ALTER TABLE saved_items RENAME COLUMN item_id TO typeId;

-- =============================================
-- PHASE 2: Drop orphan tables
-- =============================================
DROP TABLE IF EXISTS business_pages;
DROP TABLE IF EXISTS categories;

-- =============================================
-- PHASE 3: Drop deprecated columns
-- =============================================

-- businesses
ALTER TABLE businesses DROP COLUMN IF EXISTS grace_period_end_date;
ALTER TABLE businesses DROP COLUMN IF EXISTS grace_period_end_at;
ALTER TABLE businesses DROP COLUMN IF EXISTS latest_updates;
ALTER TABLE businesses DROP COLUMN IF EXISTS plan_type;
ALTER TABLE businesses DROP COLUMN IF EXISTS publish_date;
ALTER TABLE businesses DROP COLUMN IF EXISTS expiry_date;
ALTER TABLE businesses DROP COLUMN IF EXISTS subscription_status;
ALTER TABLE businesses DROP COLUMN IF EXISTS subscription_expires_at;
ALTER TABLE businesses DROP COLUMN IF EXISTS limits;
ALTER TABLE businesses DROP COLUMN IF EXISTS plan_slug;
ALTER TABLE businesses DROP COLUMN IF EXISTS organization_type;

-- non_profits
ALTER TABLE non_profits DROP COLUMN IF EXISTS rating_average;
ALTER TABLE non_profits DROP COLUMN IF EXISTS rating_count;
ALTER TABLE non_profits DROP COLUMN IF EXISTS latest_updates;
ALTER TABLE non_profits DROP COLUMN IF EXISTS trial_started_at;
ALTER TABLE non_profits DROP COLUMN IF EXISTS grace_period_end_date;
ALTER TABLE non_profits DROP COLUMN IF EXISTS subscription_status;
ALTER TABLE non_profits DROP COLUMN IF EXISTS subscription_expires_at;

-- public_sectors
ALTER TABLE public_sectors DROP COLUMN IF EXISTS rating_average;
ALTER TABLE public_sectors DROP COLUMN IF EXISTS rating_count;
ALTER TABLE public_sectors DROP COLUMN IF EXISTS latest_updates;
ALTER TABLE public_sectors DROP COLUMN IF EXISTS trial_started_at;
ALTER TABLE public_sectors DROP COLUMN IF EXISTS grace_period_end_date;
ALTER TABLE public_sectors DROP COLUMN IF EXISTS subscription_status;
ALTER TABLE public_sectors DROP COLUMN IF EXISTS subscription_expires_at;
ALTER TABLE public_sectors DROP COLUMN IF EXISTS plan_type;
ALTER TABLE public_sectors DROP COLUMN IF EXISTS publish_date;
ALTER TABLE public_sectors DROP COLUMN IF EXISTS expiry_date;

-- listings
ALTER TABLE listings DROP COLUMN IF EXISTS listing_type;
ALTER TABLE listings DROP COLUMN IF EXISTS expires_at;
ALTER TABLE listings DROP COLUMN IF EXISTS grace_period_end_at;

-- orders
ALTER TABLE orders DROP COLUMN IF EXISTS variant_id;

-- ad_banners
ALTER TABLE ad_banners DROP COLUMN IF EXISTS end_date;

-- =============================================
-- PHASE 4: Add/rename columns
-- =============================================

-- orders: rename expires_at → plan_expires_at
ALTER TABLE orders RENAME COLUMN expires_at TO plan_expires_at;

-- orders: service_package_id must be NOT NULL
UPDATE orders SET service_package_id = 'unknown' WHERE service_package_id IS NULL;
ALTER TABLE orders ALTER COLUMN service_package_id SET NOT NULL;

-- ad_banners: add plan_expires_at
ALTER TABLE ad_banners ADD COLUMN plan_expires_at INTEGER;

-- blog_posts: add featured
ALTER TABLE blog_posts ADD COLUMN featured INTEGER DEFAULT 0;

-- =============================================
-- PHASE 5: Data migration - populate cache fields
-- =============================================

-- Populate businesses latestUpdate cache
UPDATE businesses SET
  latest_update = (
    SELECT content FROM latest_updates
    WHERE entity_type = 'businesses' AND entity_id = businesses.id
    ORDER BY created_at DESC LIMIT 1
  ),
  latest_update_date = (
    SELECT created_at FROM latest_updates
    WHERE entity_type = 'businesses' AND entity_id = businesses.id
    ORDER BY created_at DESC LIMIT 1
  )
WHERE latest_update IS NULL;

-- Populate non_profits latestUpdate cache
UPDATE non_profits SET
  latest_update = (
    SELECT content FROM latest_updates
    WHERE entity_type = 'non_profits' AND entity_id = non_profits.id
    ORDER BY created_at DESC LIMIT 1
  ),
  latest_update_date = (
    SELECT created_at FROM latest_updates
    WHERE entity_type = 'non_profits' AND entity_id = non_profits.id
    ORDER BY created_at DESC LIMIT 1
  )
WHERE latest_update IS NULL;

-- Populate public_sectors latestUpdate cache
UPDATE public_sectors SET
  latest_update = (
    SELECT content FROM latest_updates
    WHERE entity_type = 'public_sectors' AND entity_id = public_sectors.id
    ORDER BY created_at DESC LIMIT 1
  ),
  latest_update_date = (
    SELECT created_at FROM latest_updates
    WHERE entity_type = 'public_sectors' AND entity_id = public_sectors.id
    ORDER BY created_at DESC LIMIT 1
  )
WHERE latest_update IS NULL;

-- =============================================
-- PHASE 6: Update migration tracking
-- =============================================
INSERT INTO d1_migrations (id, name, applied_at)
VALUES ('0072', 'schema_sync', strftime('%s', 'now') * 1000);