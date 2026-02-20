import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export const useAura = () => {
  const [profile, setProfile] = useState<any>(null)
  const [missions, setMissions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 1. Initial Fetch
    const fetchData = async () => {
      setLoading(true)
      
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: missionsData } = await supabase.from('missions').select('*')
      setMissions(missionsData || [])

      // Fetch the actual profile for the logged in user
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      
      setProfile(profileData)
      setLoading(false)
    }

    fetchData()

    // 2. Real-time Subscription (The "Magic")
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'profiles' },
        (payload: any) => {
          if (profile && payload.new.id === profile.id) {
            setProfile(payload.new)
            console.log('✨ Aura Updated!', payload.new)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const verifyImpact = async (missionId: string, evidenceUrl: string) => {
    if (!profile) return { error: 'No user profile found' }

    try {
      const { data, error } = await supabase.functions.invoke('verify-impact', {
        body: { user_id: profile.id, mission_id: missionId, evidence_url: evidenceUrl },
      })
      return { data, error }
    } catch (e: any) {
      return { error: e.message || 'Unknown error' }
    }
  }

  return { profile, missions, loading, verifyImpact }
}
