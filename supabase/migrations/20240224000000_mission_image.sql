-- Add image_url column to missions table
ALTER TABLE public.missions 
ADD COLUMN IF NOT EXISTS image_url text DEFAULT 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80';

-- Refresh the cache (Internal trigger)
NOTIFY pgrst, 'reload schema';
