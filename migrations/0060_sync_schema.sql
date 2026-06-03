-- Migration: Sync remote D1 schema with local schema
-- Run: npx wrangler d1 execute timorup-db --remote --file=migrations/0060_sync_schema.sql

-- ============================================
-- 1. businesses: Add missing latestUpdate fields
-- ============================================
-- Note: These fields exist in local schema but not in remote
-- latestUpdate, latestUpdateImages, latestUpdateDate

-- ============================================
-- 2. non_profits: Add missing rating/subscription fields
-- ============================================
ALTER TABLE non_profits ADD COLUMN rating_average REAL DEFAULT 0;
ALTER TABLE non_profits ADD COLUMN rating_count INTEGER DEFAULT 0;
ALTER TABLE non_profits ADD COLUMN trial_started_at INTEGER;
ALTER TABLE non_profits ADD COLUMN grace_period_end_date INTEGER;
ALTER TABLE non_profits ADD COLUMN subscription_status TEXT DEFAULT 'none';
ALTER TABLE non_profits ADD COLUMN subscription_expires_at INTEGER;

-- ============================================
-- 3. products: Note extra fields in remote (not in local TS)
-- ============================================
-- Remote has: views, likes, saves, shares
-- These are extra fields that exist in DB but not mapped in schema
-- No action needed - SQLite allows extra columns

-- ============================================
-- 4. businesses: Add missing fields
-- ============================================
ALTER TABLE businesses ADD COLUMN latest_update TEXT;
ALTER TABLE businesses ADD COLUMN latest_update_images TEXT;
ALTER TABLE businesses ADD COLUMN latest_update_date INTEGER;

-- ============================================
-- 5. listings: Add missing expires_at
-- ============================================
ALTER TABLE listings ADD COLUMN expires_at INTEGER;

-- ============================================
-- 6. public_sectors: Add government_data if missing
-- ============================================
-- Note: government_data exists in local but need to verify in remote
-- This is a JSON field for government-specific data

-- ============================================
-- 7. blog_posts: Note extra fields in remote (not in local TS)
-- ============================================
-- Remote has: views, likes, saves, shares
-- These are extra fields that exist in DB but not mapped in schema
-- No action needed - SQLite allows extra columns