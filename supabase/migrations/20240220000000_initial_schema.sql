-- Create Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username text UNIQUE NOT NULL,
  avatar_url text,
  aura_points integer DEFAULT 0,
  level integer DEFAULT 1,
  reputation_score numeric DEFAULT 100.0,
  impact_type text DEFAULT 'Balanced', -- Environmental, Civic, Creative
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Missions Table
CREATE TABLE IF NOT EXISTS public.missions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  reward_ap integer NOT NULL,
  mission_type text NOT NULL, -- Environmental, Civic, Creative
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Proof Ledger Table (Evidence)
CREATE TABLE IF NOT EXISTS public.proof_ledger (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  mission_id uuid REFERENCES public.missions(id),
  evidence_url text NOT NULL,
  status text DEFAULT 'pending', -- pending, verified, rejected
  verified_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proof_ledger ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Missions are viewable by everyone" ON public.missions FOR SELECT USING (true);

CREATE POLICY "Users can view their own proof" ON public.proof_ledger FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own proof" ON public.proof_ledger FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Realtime Configuration
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.proof_ledger;
