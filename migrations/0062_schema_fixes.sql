-- Migration: Schema fixes for all 5 detail pages
-- Run: npx wrangler d1 execute timorup-db --remote --file=migrations/0062_schema_fixes.sql

-- Note: shares columns already exist in remote, skip those
-- This migration adds missing fields only

-- ============================================
-- 1. listings: Add expires_at
-- ============================================
ALTER TABLE listings ADD COLUMN expires_at INTEGER;

-- ============================================
-- 2. products: Add stats fields (if not already exists)
-- ============================================
-- Note: views, likes, saves, shares already exist in remote

-- ============================================
-- 3. blog_posts: Add stats fields
-- ============================================
-- Note: views, likes, saves, shares already exist in remote

-- ============================================
-- Local schema updates needed:
-- 1. businesses: categoryId NOT NULL (requires data migration)
-- 2. nonProfits: categoryId NOT NULL
-- 3. publicSectors: categoryId NOT NULL
-- 4. listings: categoryId NOT NULL
-- 5. products: categoryId NOT NULL
-- 6. All 5 pages + blog: Add UNIQUE slug (if not already enforced)
-- ============================================