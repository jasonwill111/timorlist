-- Migration: Fix remaining schema mismatches (safe version)
-- Run: npx wrangler d1 execute timorup-db --remote --file=migrations/0061_fix_schema.sql

-- ============================================
-- 1. businesses: Add registration_url
-- ============================================
ALTER TABLE businesses ADD COLUMN registration_url TEXT;

-- ============================================
-- 2. public_sectors: Add missing subscription fields
-- ============================================
ALTER TABLE public_sectors ADD COLUMN rating_average REAL DEFAULT 0;
ALTER TABLE public_sectors ADD COLUMN rating_count INTEGER DEFAULT 0;
ALTER TABLE public_sectors ADD COLUMN trial_started_at INTEGER;
ALTER TABLE public_sectors ADD COLUMN grace_period_end_date INTEGER;
ALTER TABLE public_sectors ADD COLUMN subscription_status TEXT DEFAULT 'none';
ALTER TABLE public_sectors ADD COLUMN subscription_expires_at INTEGER;
ALTER TABLE public_sectors ADD COLUMN plan_type TEXT;
ALTER TABLE public_sectors ADD COLUMN publish_date INTEGER;
ALTER TABLE public_sectors ADD COLUMN expiry_date INTEGER;

-- ============================================
-- Note: products/blog_posts already have views/likes/saves/shares
-- No need to add these fields - they exist in remote but not in local TS
-- This is acceptable - SQLite ignores extra columns