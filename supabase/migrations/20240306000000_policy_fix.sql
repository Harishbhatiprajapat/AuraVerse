-- 1. Drop existing policies to prevent "already exists" error
DROP POLICY IF EXISTS "Allow everyone to read profiles" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;

-- 2. Create the Public Read policy
CREATE POLICY "Allow everyone to read profiles" 
ON public.profiles FOR SELECT 
USING (true);

-- 3. Ensure Storage Bucket is set to Public
-- (Standard SQL way to ensure the setting is correct)
UPDATE storage.buckets SET public = true WHERE id = 'evidence';

-- 4. Reload Schema Cache for the API
NOTIFY pgrst, 'reload schema';
