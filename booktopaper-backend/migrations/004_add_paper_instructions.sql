-- ============================================================
-- BookToPaper — Migration 004: Add Paper Instructions
-- Run in: Supabase Dashboard → SQL Editor
-- ============================================================

-- Add general_instructions column to papers table
ALTER TABLE papers ADD COLUMN IF NOT EXISTS general_instructions TEXT;
