-- ============================================================
-- BookToPaper — Migration 003: Storage Policies
-- Run in: Supabase Dashboard → SQL Editor
-- ============================================================

-- 1. Ensure buckets are public (allows get_public_url to work)
UPDATE storage.buckets SET public = true WHERE id IN ('materials', 'papers');

-- 2. Enable RLS on storage if not already
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 3. Policy: Allow users to upload to their own materials folder
-- Path format: materials/[user_id]/[filename]
CREATE POLICY "Users can upload their own materials"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'materials' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- 4. Policy: Allow users to see their own materials
CREATE POLICY "Users can view their own materials"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'materials' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- 5. Policy: Allow users to upload to their own papers folder
CREATE POLICY "Users can upload their own papers"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'papers' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- 6. Policy: Allow users to view their own papers
CREATE POLICY "Users can view their own papers"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'papers' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- 7. Policy: Global bypass for service role (Internal backend operations)
CREATE POLICY "Service role can do everything"
ON storage.objects FOR ALL
TO service_role
USING (true)
WITH CHECK (true);
