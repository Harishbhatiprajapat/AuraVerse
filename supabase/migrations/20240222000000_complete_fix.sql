-- 1. Create Profiles Table (if not exists)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username text UNIQUE NOT NULL,
  avatar_url text,
  aura_points integer DEFAULT 0,
  level integer DEFAULT 1,
  reputation_score numeric DEFAULT 100.0,
  impact_type text DEFAULT 'Balanced',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Missions Table (REQUIRED FIX)
CREATE TABLE IF NOT EXISTS public.missions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  reward_ap integer NOT NULL,
  mission_type text NOT NULL, -- Environmental, Civic, Creative
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create Proof Ledger Table
CREATE TABLE IF NOT EXISTS public.proof_ledger (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  mission_id uuid REFERENCES public.missions(id),
  evidence_url text NOT NULL,
  status text DEFAULT 'pending', -- pending, verified, rejected
  verified_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proof_ledger ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies (Fixing Insert for Missions)
CREATE POLICY IF NOT EXISTS "Missions are viewable by everyone" ON public.missions FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Authenticated users can create missions" ON public.missions FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 6. Trigger for Profile Creation (Ensure this is run)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, username, avatar_url, aura_points, level)
  VALUES (
    new.id,
    split_part(new.email, '@', 1),
    'https://api.dicebear.com/7.x/avataaars/svg?seed=' || new.id,
    0,
    1
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Re-apply trigger (Delete old if exists to avoid errors)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
