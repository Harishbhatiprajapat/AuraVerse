import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const isSupabaseConfigured = () => {
  return !!import.meta.env.VITE_SUPABASE_URL && !!import.meta.env.VITE_SUPABASE_ANON_KEY && !import.meta.env.VITE_SUPABASE_URL.includes('placeholder')
}

if (!isSupabaseConfigured()) {
  console.error('🔴 AURA-ERROR: Supabase credentials are missing or invalid! Please check your .env file.')
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder-fail.supabase.co', 
  supabaseAnonKey || 'placeholder-key'
)
