-- Migration: 0064_listing_taxonomy_v1
-- Date: 2026-06-01
-- Changes:
--   1. Remove listingType from listings (derive from category.parentId)
--   2. Rename adBanners.startDate/endDate to planExpiresAt
--   3. Remove businesses.planSlug (query from orders instead)
--   4. Make listings.categoryId NOT NULL

-- ============================================
-- 1. Remove listingType from listings
-- ============================================
ALTER TABLE listings DROP COLUMN listing_type;

-- ============================================
-- 2. Rename adBanners dates to planExpiresAt
-- ============================================
ALTER TABLE ad_banners ADD COLUMN plan_expires_at INTEGER;
-- Copy data from endDate if exists
UPDATE ad_banners SET plan_expires_at = end_date WHERE end_date IS NOT NULL;
-- Remove old columns
ALTER TABLE ad_banners DROP COLUMN start_date;
ALTER TABLE ad_banners DROP COLUMN end_date;

-- ============================================
-- 3. Remove businesses.plan_slug
-- ============================================
ALTER TABLE businesses DROP COLUMN plan_slug;

-- ============================================
-- 4. Make listings.category_id NOT NULL
-- (Requires existing rows to have category_id)
-- ============================================
-- First, set a default category for listings without one
UPDATE listings SET category_id = 'other' WHERE category_id IS NULL;
-- Then make NOT NULL
ALTER TABLE listings ALTER COLUMN category_id TEXT NOT NULL;

-- ============================================
-- Verification queries
-- ============================================
-- .headers on
-- SELECT name FROM pragma_table_info('listings') WHERE name = 'listing_type';  -- Should return empty
-- SELECT name FROM pragma_table_info('ad_banners') WHERE name = 'plan_expires_at';  -- Should return 1 row
-- SELECT name FROM pragma_table_info('ad_banners') WHERE name = 'start_date';  -- Should return empty
-- SELECT name FROM pragma_table_info('businesses') WHERE name = 'plan_slug';  -- Should return empty
