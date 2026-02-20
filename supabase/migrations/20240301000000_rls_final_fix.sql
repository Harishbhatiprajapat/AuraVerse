-- 1. Ensure RLS is active
ALTER TABLE public.missions ENABLE ROW LEVEL SECURITY;

-- 2. Make user_id automatic (Best practice)
-- This ensures that if the frontend misses the ID, the DB catches it
ALTER TABLE public.missions 
ALTER COLUMN user_id SET DEFAULT auth.uid();

-- 3. Clear old policies
DROP POLICY IF EXISTS "Authenticated users can create missions" ON public.missions;
DROP POLICY IF EXISTS "Missions are viewable by everyone" ON public.missions;
DROP POLICY IF EXISTS "Users can update own missions" ON public.missions;

-- 4. Re-create Optimized Policies
-- Allow anyone to read
CREATE POLICY "Missions are viewable by everyone" 
ON public.missions FOR SELECT 
USING (true);

-- Allow authenticated users to insert (using their own ID)
-- This specifically targets the "new row violates RLS" error
CREATE POLICY "Authenticated users can create missions" 
ON public.missions FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Allow users to manage their own content
CREATE POLICY "Users can manage own missions" 
ON public.missions FOR ALL
TO authenticated 
USING (auth.uid() = user_id);

-- 5. Final Permission Grant
GRANT INSERT, SELECT, UPDATE, DELETE ON public.missions TO authenticated;
GRANT SELECT ON public.missions TO anon;
