import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder'

if (!import.meta.env.VITE_SUPABASE_URL) {
  console.error('🔴 AURA-ERROR: VITE_SUPABASE_URL is missing! The app will show a white screen or fail to load data. Please add it to your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
