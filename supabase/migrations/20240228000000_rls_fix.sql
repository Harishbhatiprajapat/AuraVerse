-- 1. Drop existing policies to start fresh
DROP POLICY IF EXISTS "Authenticated users can create missions" ON public.missions;
DROP POLICY IF EXISTS "Missions are viewable by everyone" ON public.missions;

-- 2. Policy: Allow anyone (even guests) to VIEW missions
CREATE POLICY "Missions are viewable by everyone" 
ON public.missions FOR SELECT 
USING (true);

-- 3. Policy: Allow logged-in users to CREATE missions
-- This fix solves the "Row-Level Security policy" error
CREATE POLICY "Authenticated users can create missions" 
ON public.missions FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

-- 4. Policy: Allow users to UPDATE their own missions (optional but useful)
CREATE POLICY "Users can update own missions" 
ON public.missions FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id);

-- 5. Policy: Allow users to DELETE their own missions
CREATE POLICY "Users can delete own missions" 
ON public.missions FOR DELETE 
TO authenticated 
USING (auth.uid() = user_id);
