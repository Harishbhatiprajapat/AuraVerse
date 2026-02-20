import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!supabaseUrl || !supabaseKey) {
      console.error('❌ EDGE-ERROR: Missing environment variables in Supabase Dashboard.')
      throw new Error('Server configuration error')
    }

    const supabaseClient = createClient(supabaseUrl, supabaseKey)

    // Parse request body
    const body = await req.json().catch(() => ({}))
    const { user_id, mission_id, evidence_url } = body

    console.log(`🚀 Processing Proof: User=${user_id}, Mission=${mission_id}`)

    if (!user_id || !mission_id || !evidence_url) {
      throw new Error(`Missing required fields: user=${!!user_id}, mission=${!!mission_id}, url=${!!evidence_url}`)
    }

    // 🤖 SIMULATED AI LOGIC (Always succeeds for prototype hackathon)
    const status = 'verified'

    // 1. Update Proof Ledger
    const { error: ledgerError } = await supabaseClient
      .from('proof_ledger')
      .insert([{ 
        user_id, 
        mission_id, 
        evidence_url, 
        status, 
        verified_at: new Date().toISOString() 
      }])

    if (ledgerError) {
      console.error('❌ LEDGER-ERROR:', ledgerError)
      throw new Error('Database write failed (ledger)')
    }

    // 2. Fetch Reward
    const { data: mission, error: missionError } = await supabaseClient
      .from('missions')
      .select('reward_ap')
      .eq('id', mission_id)
      .single()

    if (missionError || !mission) {
      console.error('❌ MISSION-ERROR:', missionError)
      throw new Error('Mission not found in registry')
    }

    // 3. Update User Aura
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('aura_points')
      .eq('id', user_id)
      .single()

    if (profileError || !profile) {
      console.error('❌ PROFILE-ERROR:', profileError)
      throw new Error('User profile not found')
    }

    const newPoints = (profile.aura_points || 0) + mission.reward_ap
    const { error: updateError } = await supabaseClient
      .from('profiles')
      .update({ aura_points: newPoints })
      .eq('id', user_id)

    if (updateError) {
      console.error('❌ UPDATE-ERROR:', updateError)
      throw new Error('Aura update failed')
    }

    console.log(`✅ Success: +${mission.reward_ap} AP awarded to ${user_id}`)

    return new Response(
      JSON.stringify({ status: 'verified', message: 'Impact authenticated!', reward: mission.reward_ap }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )

  } catch (error) {
    console.error('💥 FATAL-ERROR:', error.message)
    return new Response(
      JSON.stringify({ error: error.message, status: 'error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
