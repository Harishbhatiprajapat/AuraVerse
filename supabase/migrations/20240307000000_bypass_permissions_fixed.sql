-- 1. Correct Permissions for proof_ledger
DROP POLICY IF EXISTS "Allow authenticated proof submission" ON public.proof_ledger;
DROP POLICY IF EXISTS "Users can insert their own proof" ON public.proof_ledger;

CREATE POLICY "Allow authenticated proof submission" 
ON public.proof_ledger FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

-- 2. Allow viewing proofs
DROP POLICY IF EXISTS "Allow users to view proofs" ON public.proof_ledger;
DROP POLICY IF EXISTS "Users can view their own proof" ON public.proof_ledger;

CREATE POLICY "Allow users to view proofs" 
ON public.proof_ledger FOR SELECT 
USING (true);

-- 3. Ensure profiles table allows UPDATES to aura_points
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE 
TO authenticated 
USING (auth.uid() = id) 
WITH CHECK (auth.uid() = id);

-- 4. Reload API Cache
NOTIFY pgrst, 'reload schema';
