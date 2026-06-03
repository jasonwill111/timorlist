-- Migration: Add missing plan fields
-- Run: npx wrangler d1 execute timorup-db --remote --file=migrations/0063_plan_fields.sql

-- ============================================
-- businesses: Add plan_expires_at and grace_period_end_at
-- ============================================
-- Note: plan_slug already exists from previous migration
ALTER TABLE businesses ADD COLUMN plan_expires_at INTEGER;

-- ============================================
-- listings: Add plan_expires_at, address, grace_period_end_at
-- ============================================
-- Note: expires_at already exists, will be deprecated
ALTER TABLE listings ADD COLUMN plan_expires_at INTEGER;
ALTER TABLE listings ADD COLUMN address TEXT;
ALTER TABLE listings ADD COLUMN grace_period_end_at INTEGER;

-- Copy data from expires_at to plan_expires_at
UPDATE listings SET plan_expires_at = expires_at WHERE expires_at IS NOT NULL;