-- 1. CLEAN RESET
DROP TABLE IF EXISTS public.missions CASCADE;

-- 2. CREATE TABLE (STRICT & SIMPLE)
CREATE TABLE public.missions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  reward_ap integer NOT NULL DEFAULT 1000,
  mission_type text NOT NULL DEFAULT 'Environmental',
  image_url text DEFAULT 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  user_id uuid DEFAULT auth.uid()
);

-- 3. BYPASS ALL SECURITY FOR TESTING (PUBLIC ACCESS)
ALTER TABLE public.missions DISABLE ROW LEVEL SECURITY;
GRANT ALL ON TABLE public.missions TO postgres, anon, authenticated, service_role;

-- 4. INSERT 3 DEFAULT PROJECTS
INSERT INTO public.missions (title, description, reward_ap, mission_type, image_url)
VALUES 
(
  'Global Reforestation', 
  'Plant a native tree in your community and upload a photo of the sapling.', 
  5000, 
  'Environmental', 
  'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80'
),
(
  'Ocean Plastic Recovery', 
  'Participate in a beach cleanup and document the waste recovered.', 
  2500, 
  'Environmental', 
  'https://images.unsplash.com/photo-1621451537084-482c73073a0f?w=800&q=80'
),
(
  'Civic Infrastructure Report', 
  'Report local maintenance issues like broken streetlights to city officials.', 
  1500, 
  'Civic', 
  'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&q=80'
);

-- 5. REFRESH API
NOTIFY pgrst, 'reload schema';
