-- 1. Wipe and Recreate Tables
DROP TABLE IF EXISTS public.completed_missions CASCADE;
DROP TABLE IF EXISTS public.proof_ledger CASCADE;
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

-- 2. Add Demo Projects
INSERT INTO public.missions (title, description, reward_ap, mission_type, image_url)
VALUES 
('Amazon Reforestation', 'Contribute to the largest tree-planting initiative in the rainforest.', 5000, 'Environmental', 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80'),
('City Solar Grid', 'Help install renewable energy panels in low-income urban housing.', 3500, 'Civic', 'https://images.unsplash.com/photo-1509391366360-fe5bb58583bb?w=800&q=80'),
('Ocean Plastic Sentinel', 'Deploy 10 bio-degradable waste collection bins at your local beach.', 2500, 'Environmental', 'https://images.unsplash.com/photo-1621451537084-482c73073a0f?w=800&q=80');

-- 3. Security (Allow Public Read, Authenticated Write)
ALTER TABLE public.missions DISABLE ROW LEVEL SECURITY; -- Open for testing simplicity
GRANT ALL ON TABLE public.missions TO postgres, anon, authenticated, service_role;

-- 4. Auth Trigger (Ensuring unique usernames)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, username, avatar_url, aura_points, level)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    'https://api.dicebear.com/7.x/avataaars/svg?seed=' || COALESCE(new.raw_user_meta_data->>'username', new.id::text),
    0,
    1
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. Refresh Cache
NOTIFY pgrst, 'reload schema';
