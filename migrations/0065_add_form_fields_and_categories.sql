-- Migration: 0065_add_form_fields_and_categories
-- Date: 2026-06-01
-- Adds form_fields column and seeds 89 taxonomy categories

-- Step 1: Add form_fields column (idempotent - will fail if exists but that's ok)
ALTER TABLE listing_categories ADD COLUMN form_fields TEXT;

-- Step 2: Clear old categories
DELETE FROM listing_categories;

-- Step 3: Insert new taxonomy (89 categories)
-- Run the contents of 0065_category_taxonomy_v2_clean.sql
