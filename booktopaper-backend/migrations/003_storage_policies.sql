-- ============================================================
-- BookToPaper — Migration 003: Storage Policies
-- Run in: Supabase Dashboard → SQL Editor
-- ============================================================

-- 1. Ensure buckets are public (allows get_public_url to work)
UPDATE storage.buckets SET public = true WHERE id IN ('materials', 'papers');

-- 2. RLS is already enabled on storage.objects by Supabase — no action needed.

-- ────────────────────────────────────────────────
-- Drop any old conflicting policies before re-creating
-- ────────────────────────────────────────────────
DROP POLICY IF EXISTS "Users can upload their own materials"        ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own materials"          ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own materials"        ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own papers"           ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own papers"             ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own papers"           ON storage.objects;
DROP POLICY IF EXISTS "Service role can do everything"              ON storage.objects;

-- ────────────────────────────────────────────────
-- Service-role bypass (must come first / broadest)
-- The backend uses the Service Role key which SHOULD bypass RLS,
-- but an explicit policy guarantees it regardless of Supabase version.
-- ────────────────────────────────────────────────
CREATE POLICY "Service role can do everything"
ON storage.objects FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- ────────────────────────────────────────────────
-- materials bucket — authenticated user policies
-- Path format: {user_id}/{material_id}/{filename}
-- foldername(name)[1] returns the first path segment (user_id)
-- ────────────────────────────────────────────────
CREATE POLICY "Users can upload their own materials"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'materials' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can view their own materials"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'materials' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete their own materials"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'materials' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- ────────────────────────────────────────────────
-- papers bucket — authenticated user policies
-- ────────────────────────────────────────────────
CREATE POLICY "Users can upload their own papers"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'papers' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can view their own papers"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'papers' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete their own papers"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'papers' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
