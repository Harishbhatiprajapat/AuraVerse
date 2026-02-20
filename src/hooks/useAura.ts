import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export const useAura = () => {
  const [profile, setProfile] = useState<any>(null)
  const [missions, setMissions] = useState<any[]>([])
  const [myMissions, setMyMissions] = useState<any[]>([])
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
        const mockMissions = [
          { id: '1', title: 'Global Reforestation', reward_ap: 5000, mission_type: 'Environmental', description: 'Sample mission for demo.', user_id: 'demo-user' },
          { id: '2', title: 'Civic Hackathon', reward_ap: 3000, mission_type: 'Civic', description: 'Sample mission for demo.', user_id: 'other-user' }
        ]
        setMissions(mockMissions)
        setMyMissions(mockMissions.filter(m => m.user_id === 'demo-user'))
        setLoading(false)
        return
      }
      setLoading(false)
      return
    }

    // 1. Fetch Missions
    try {
      const { data: missionsData, error: missionsError } = await supabase
        .from('missions')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (missionsError) {
        console.error('Missions Fetch Error:', missionsError)
        setMissions([])
      } else {
        setMissions(missionsData || [])
        setMyMissions((missionsData || []).filter(m => m.user_id === user.id))
      }
    } catch (e) {
      console.error('Network Error fetching missions:', e)
    }

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

  const createMission = async (missionData: { title: string, description: string, reward_ap: number, mission_type: string, image_url?: string }) => {
    const { data: { user } } = await supabase.auth.getUser()
    const userId = user?.id || 'demo-user'

    if (isDemo) {
      const newMission = { ...missionData, id: Math.random().toString(), user_id: userId }
      setMissions([ newMission, ...missions])
      setMyMissions([ newMission, ...myMissions])
      return { data: newMission }
    }

    const { data, error } = await supabase
      .from('missions')
      .insert([{ ...missionData, user_id: userId }])
      .select()

    if (!error) fetchData() // Refresh missions list
    return { data, error }
  }

  const updateProfile = async (updates: { username?: string, bio?: string, avatar_url?: string }) => {
    if (isDemo) {
      setProfile({ ...profile, ...updates })
      return { data: updates }
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Not authenticated' }

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()

    if (!error) setProfile(data[0])
    return { data, error }
  }

  const uploadEvidence = async (file: File) => {
    if (isDemo) return { data: { publicUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09' } }

    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random()}-${Date.now()}.${fileExt}`
    const filePath = `proofs/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('evidence')
      .upload(filePath, file)

    if (uploadError) return { error: uploadError }

    const { data } = supabase.storage
      .from('evidence')
      .getPublicUrl(filePath)

    return { data: { publicUrl: data.publicUrl } }
  }

  return { profile, missions, myMissions, loading, verifyImpact, createMission, updateProfile, uploadEvidence, refresh: fetchData }
}
