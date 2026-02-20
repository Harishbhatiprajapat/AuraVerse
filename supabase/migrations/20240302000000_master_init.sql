-- 1. Ensure Table is Correct
DROP TABLE IF EXISTS public.missions CASCADE;

CREATE TABLE public.missions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text NOT NULL,
  reward_ap integer NOT NULL DEFAULT 1000,
  mission_type text NOT NULL DEFAULT 'Environmental',
  image_url text DEFAULT 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable RLS
ALTER TABLE public.missions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view missions" ON public.missions FOR SELECT USING (true);
CREATE POLICY "Auth users can host missions" ON public.missions FOR INSERT TO authenticated WITH CHECK (true);

-- 3. Add Demo Projects (High Fidelity)
INSERT INTO public.missions (title, description, reward_ap, mission_type, image_url)
VALUES 
(
  'Ocean Plastic Recovery', 
  'Participate in a local beach or river cleanup. Document your collection of plastic waste to earn massive Aura points.', 
  2500, 
  'Environmental', 
  'https://images.unsplash.com/photo-1621451537084-482c73073a0f?w=800&q=80'
),
(
  'Urban Forest Initiative', 
  'Plant a native tree in your community or a designated green zone. Provide a photo proof of the sapling and its location.', 
  5000, 
  'Environmental', 
  'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80'
),
(
  'Civic Repair Network', 
  'Report 3 unique civic infrastructure issues (potholes, broken lights) via the official city portal and upload screenshots.', 
  1500, 
  'Civic', 
  'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&q=80'
);

-- 4. Reload Schema Cache
NOTIFY pgrst, 'reload schema';
