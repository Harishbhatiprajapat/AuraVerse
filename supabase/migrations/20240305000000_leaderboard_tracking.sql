-- 1. Create a table to track completed missions (Prevent double points)
CREATE TABLE IF NOT EXISTS public.completed_missions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  mission_id uuid REFERENCES public.missions(id) ON DELETE CASCADE,
  completed_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, mission_id) -- One completion per mission per user
);

-- 2. Ensure Profiles are Publicly Readable for Leaderboard
CREATE POLICY IF NOT EXISTS "Allow everyone to read profiles" ON public.profiles FOR SELECT USING (true);

-- 3. Ensure Storage Bucket is PUBLIC
UPDATE storage.buckets SET public = true WHERE id = 'evidence';

-- 4. Reload API Cache
NOTIFY pgrst, 'reload schema';
