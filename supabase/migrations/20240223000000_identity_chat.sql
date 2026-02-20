-- 1. Update Profile Trigger to use metadata for username
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, username, avatar_url, aura_points, level)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    'https://api.dicebear.com/7.x/avataaars/svg?seed=' || new.id,
    0,
    1
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Create Messages Table for Chat
CREATE TABLE IF NOT EXISTS public.messages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  username text NOT NULL,
  content text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Enable RLS and Policies for Chat
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Messages are viewable by everyone" ON public.messages FOR SELECT USING (true);
CREATE POLICY "Authenticated users can send messages" ON public.messages FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 4. Enable Real-time for Messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
