-- 1. Ensure the missions table is explicitly defined in public
CREATE TABLE IF NOT EXISTS public.missions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id),
  title text NOT NULL,
  description text NOT NULL,
  reward_ap integer NOT NULL,
  mission_type text NOT NULL,
  image_url text DEFAULT 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Force the API to reload the schema cache IMMEDIATELY
-- This is the most effective command for the "Could not find table" error
NOTIFY pgrst, 'reload schema';

-- 3. Grant full permissions to ensure the API can see it
GRANT ALL ON TABLE public.missions TO postgres, anon, authenticated, service_role;
