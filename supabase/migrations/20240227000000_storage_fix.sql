-- 1. Create the 'evidence' bucket
-- Note: 'storage' is a separate schema in Supabase
INSERT INTO storage.buckets (id, name, public) 
VALUES ('evidence', 'evidence', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Policy: Allow authenticated users to upload files
-- This ensures only logged-in Guardians can submit proof
CREATE POLICY "Guardians can upload proof" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'evidence' 
  AND auth.role() = 'authenticated'
);

-- 3. Policy: Allow public viewing of evidence images
-- This allows the community to see verified impact proof
CREATE POLICY "Public can view proof" ON storage.objects
FOR SELECT USING (bucket_id = 'evidence');

-- 4. Policy: Allow users to delete their own evidence (optional but good practice)
CREATE POLICY "Users can delete own proof" ON storage.objects
FOR DELETE USING (
  bucket_id = 'evidence' 
  AND auth.uid() = owner
);
