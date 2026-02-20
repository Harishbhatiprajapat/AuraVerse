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

    // 🤖 AI ENGINE SIMULATION (Logic for Hackathon Prototype)
    // In a real app, you would pass the evidence_url to Gemini/Tensorflow here.
    const isAuthentic = Math.random() > 0.05 // 95% success rate for prototype simulation
    const status = isAuthentic ? 'verified' : 'rejected'

    // Update Proof Ledger
    const { data: proof, error: proofError } = await supabaseClient
      .from('proof_ledger')
      .insert({ user_id, mission_id, evidence_url, status, verified_at: new Date().toISOString() })
      .select()
      .single()

    if (proofError) throw proofError

    if (isAuthentic) {
      // Fetch mission reward
      const { data: mission } = await supabaseClient
        .from('missions')
        .select('reward_ap')
        .eq('id', mission_id)
        .single()

      if (mission) {
        // Award AP and Increment Level logic (Simple for prototype)
        const { data: profile } = await supabaseClient
          .from('profiles')
          .select('aura_points, level')
          .eq('id', user_id)
          .single()

        if (profile) {
          const newPoints = profile.aura_points + mission.reward_ap
          const newLevel = Math.floor(newPoints / 1000) + 1 // Basic leveling logic

          await supabaseClient
            .from('profiles')
            .update({ aura_points: newPoints, level: newLevel })
            .eq('id', user_id)
        }
      }
    }

    return new Response(
      JSON.stringify({ status, proof, message: isAuthentic ? 'Impact Verified! Aura Points awarded.' : 'Verification failed. Evidence inconclusive.' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
