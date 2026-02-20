import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { user_id, mission_id, evidence_url } = await req.json()

    if (!user_id || !mission_id) {
      throw new Error('Missing user_id or mission_id')
    }

    // 🤖 AI ENGINE SIMULATION (95% Success rate)
    const isAuthentic = Math.random() > 0.05
    const status = isAuthentic ? 'verified' : 'rejected'

    // 1. Log to Proof Ledger
    const { error: ledgerError } = await supabaseClient
      .from('proof_ledger')
      .insert({ 
        user_id, 
        mission_id, 
        evidence_url, 
        status, 
        verified_at: new Date().toISOString() 
      })

    if (ledgerError) throw ledgerError

    if (isAuthentic) {
      // 2. Fetch Reward from Missions
      const { data: mission, error: missionError } = await supabaseClient
        .from('missions')
        .select('reward_ap')
        .eq('id', mission_id)
        .single()

      if (missionError || !mission) throw new Error('Mission not found')

      // 3. Update User Profile
      const { data: profile, error: profileError } = await supabaseClient
        .from('profiles')
        .select('aura_points, level')
        .eq('id', user_id)
        .single()

      if (profileError || !profile) throw new Error('Profile not found')

      const newPoints = (profile.aura_points || 0) + mission.reward_ap
      const newLevel = Math.floor(newPoints / 1000) + 1

      const { error: updateError } = await supabaseClient
        .from('profiles')
        .update({ aura_points: newPoints, level: newLevel })
        .eq('id', user_id)

      if (updateError) throw updateError

      return new Response(
        JSON.stringify({ status: 'verified', points_added: mission.reward_ap, new_total: newPoints }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ status: 'rejected', message: 'AI could not verify impact authenticity.' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }), 
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
