-- 1. Ensure proof_ledger is writable
CREATE POLICY IF NOT EXISTS "Allow authenticated proof submission" ON public.proof_ledger FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- 2. Allow SELECT on proof_ledger for verification checks
CREATE POLICY IF NOT EXISTS "Allow users to view proofs" ON public.proof_ledger FOR SELECT USING (true);

-- 3. Ensure profiles table allows UPDATES to aura_points
-- This is necessary for the Instant Verification Bypass
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE 
TO authenticated 
USING (auth.uid() = id) 
WITH CHECK (auth.uid() = id);

-- 4. Reload Cache
NOTIFY pgrst, 'reload schema';
