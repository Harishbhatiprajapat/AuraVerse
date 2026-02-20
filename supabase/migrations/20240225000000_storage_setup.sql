-- 1. Create a bucket for mission evidence
INSERT INTO storage.buckets (id, name, public) 
VALUES ('evidence', 'evidence', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Allow authenticated users to upload to the bucket
CREATE POLICY "Allow authenticated uploads" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'evidence' AND auth.role() = 'authenticated');

-- 3. Allow public viewing of evidence
CREATE POLICY "Allow public viewing" ON storage.objects
FOR SELECT USING (bucket_id = 'evidence');
