-- 1. Wipe and Recreate with absolute precision
DROP TABLE IF EXISTS public.missions CASCADE;

CREATE TABLE public.missions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid DEFAULT auth.uid(),
  title text NOT NULL,
  description text NOT NULL,
  reward_ap integer NOT NULL DEFAULT 1000,
  mission_type text NOT NULL DEFAULT 'Environmental',
  image_url text DEFAULT 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Disable RLS temporarily to confirm connectivity
-- We will re-enable this once we confirm data is flowing
ALTER TABLE public.missions DISABLE ROW LEVEL SECURITY;

-- 3. Add High-Fidelity Demo Projects
INSERT INTO public.missions (title, description, reward_ap, mission_type, image_url)
VALUES 
(
  'Ocean Plastic Recovery', 
  'Participate in a local beach or river cleanup. Document your collection of plastic waste.', 
  2500, 
  'Environmental', 
  'https://images.unsplash.com/photo-1621451537084-482c73073a0f?w=800&q=80'
),
(
  'Urban Forest Initiative', 
  'Plant a native tree in your community or a designated green zone.', 
  5000, 
  'Environmental', 
  'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80'
);

-- 4. Force API Refresh
NOTIFY pgrst, 'reload schema';
