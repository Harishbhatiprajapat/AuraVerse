-- 1. Ensure bucket exists with correct settings
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES (
  'evidence', 
  'evidence', 
  true, 
  52428800, -- 50MB limit
  '{"image/*"}' -- Only allow images
)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Clear old policies to avoid "already exists" errors
DROP POLICY IF EXISTS "Guardians can upload proof" ON storage.objects;
DROP POLICY IF EXISTS "Public can view proof" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own proof" ON storage.objects;

-- 3. Policy: ALLOW INSERT (The most important for uploads)
-- Use (storage.foldername(name))[1] if you use subfolders, or simpler:
CREATE POLICY "Guardians can upload proof" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'evidence');

-- 4. Policy: ALLOW SELECT (So everyone can see the proof)
CREATE POLICY "Public can view proof" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'evidence');

-- 5. Policy: ALLOW DELETE (So users can manage their files)
CREATE POLICY "Users can delete own proof" 
ON storage.objects FOR DELETE 
TO authenticated 
USING (bucket_id = 'evidence' AND auth.uid() = owner);
