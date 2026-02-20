import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export const useAura = () => {
  const [profile, setProfile] = useState<any>(null)
  const [missions, setMissions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isDemo, setIsDemo] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      // Check if we are in a mock demo session (set by App.tsx)
      const isDemoSession = localStorage.getItem('aura_demo_mode') === 'true'
      if (isDemoSession) {
        setIsDemo(true)
        setProfile({
          id: 'demo-user',
          username: 'DemoLegend',
          avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Demo',
          aura_points: 25000,
          level: 50,
          reputation_score: 99.9,
          impact_type: 'Legendary'
        })
        setMissions([
          { id: '1', title: 'Global Reforestation', reward_ap: 5000, mission_type: 'Environmental', description: 'Sample mission for demo.' },
          { id: '2', title: 'Civic Hackathon', reward_ap: 3000, mission_type: 'Civic', description: 'Sample mission for demo.' }
        ])
        setLoading(false)
        return
      }
      setLoading(false)
      return
    }

    // 1. Fetch Missions
    const { data: missionsData } = await supabase
      .from('missions')
      .select('*')
      .order('created_at', { ascending: false })
    
    setMissions(missionsData || [])

    // 2. Fetch Profile
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    
    setProfile(profileData)
    setLoading(false)
  }

  useEffect(() => {
    fetchData()

    // Real-time Subscription for Profile Updates (AP, Level)
    const channel = supabase
      .channel('profile-sync')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'profiles' },
        (payload) => {
          if (profile && payload.new.id === profile.id) {
            setProfile(payload.new)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const verifyImpact = async (missionId: string, evidenceUrl: string) => {
    if (isDemo) return { data: { status: 'verified', message: 'Demo Mode: Impact automatically verified!' } }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Not authenticated' }

    try {
      const { data, error } = await supabase.functions.invoke('verify-impact', {
        body: { user_id: user.id, mission_id: missionId, evidence_url: evidenceUrl },
      })
      return { data, error }
    } catch (e: any) {
      return { error: e.message || 'Verification engine offline' }
    }
  }

  const createMission = async (missionData: { title: string, description: string, reward_ap: number, mission_type: string }) => {
    if (isDemo) {
      setMissions([ { ...missionData, id: Math.random().toString() }, ...missions])
      return { data: missionData }
    }

    const { data, error } = await supabase
      .from('missions')
      .insert([missionData])
      .select()

    if (!error) fetchData() // Refresh missions list
    return { data, error }
  }

  return { profile, missions, loading, verifyImpact, createMission, refresh: fetchData }
}
