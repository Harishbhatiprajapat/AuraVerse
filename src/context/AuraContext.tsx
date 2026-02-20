import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

interface AuraContextType {
  profile: any
  missions: any[]
  myMissions: any[]
  loading: boolean
  isDemo: boolean
  refresh: () => Promise<void>
  verifyImpact: (missionId: string, evidenceUrl: string) => Promise<any>
  createMission: (missionData: any) => Promise<any>
  updateProfile: (updates: any) => Promise<any>
  uploadEvidence: (file: File) => Promise<any>
}

const AuraContext = createContext<AuraContextType | undefined>(undefined)

export const AuraProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<any>(null)
  const [missions, setMissions] = useState<any[]>([])
  const [myMissions, setMyMissions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isDemo, setIsDemo] = useState(false)

  const fetchData = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    
    const isDemoSession = localStorage.getItem('aura_demo_mode') === 'true'
    if (isDemoSession && !user) {
      setIsDemo(true)
      setProfile({
        id: 'demo-user',
        username: 'DemoLegend',
        avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Demo',
        aura_points: 25000,
        level: 50,
        reputation_score: 99.9,
        impact_type: 'Legendary',
        bio: 'The ultimate aura guardian.'
      })
      const mockMissions = [
        { id: '1', title: 'Global Reforestation', reward_ap: 5000, mission_type: 'Environmental', description: 'Sample mission for demo.', user_id: 'demo-user', created_at: new Date().toISOString() },
        { id: '2', title: 'Civic Hackathon', reward_ap: 3000, mission_type: 'Civic', description: 'Sample mission for demo.', user_id: 'other-user', created_at: new Date().toISOString() }
      ]
      setMissions(mockMissions)
      setMyMissions(mockMissions.filter(m => m.user_id === 'demo-user'))
      setLoading(false)
      return
    }

    if (!user) {
      setLoading(false)
      return
    }

    try {
      const { data: missionsData, error: mError } = await supabase
        .from('missions')
        .select('*, profiles:user_id (username)')
        .order('created_at', { ascending: false })
      
      if (mError) throw mError

      const formatted = (missionsData || []).map(m => ({ 
        ...m, 
        username: (m.profiles as any)?.username || 'Aura Sentinel' 
      }))
      
      setMissions(formatted)
      setMyMissions(formatted.filter(m => m.user_id === user.id))

      const { data: profileData } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setProfile(profileData)
    } catch (e) {
      console.error('Fetch Error:', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    const channel = supabase
      .channel('global-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => fetchData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'missions' }, () => fetchData())
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  const verifyImpact = async (missionId: string, evidenceUrl: string) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user && !isDemo) return { error: 'Auth required' }
    
    return supabase.functions.invoke('verify-impact', {
      body: { user_id: user?.id || 'demo-user', mission_id: missionId, evidence_url: evidenceUrl },
    })
  }

  const createMission = async (missionData: any) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user && !isDemo) return { error: 'Auth required' }

    if (isDemo) {
      const nm = { ...missionData, id: Math.random().toString(), user_id: 'demo-user', created_at: new Date().toISOString(), username: 'DemoLegend' }
      setMissions(prev => [nm, ...prev])
      setMyMissions(prev => [nm, ...prev])
      return { data: nm }
    }

    const res = await supabase
      .from('missions')
      .insert([{ ...missionData, user_id: user?.id }])
      .select()
    
    if (!res.error) await fetchData()
    return res
  }

  const updateProfile = async (updates: any) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (isDemo) { setProfile({ ...profile, ...updates }); return { data: updates } }
    const res = await supabase.from('profiles').update(updates).eq('id', user?.id).select()
    if (!res.error) setProfile(res.data[0])
    return res
  }

  const uploadEvidence = async (file: File) => {
    if (isDemo) return { data: { publicUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09' } }
    const fileName = `${Math.random()}-${Date.now()}.${file.name.split('.').pop()}`
    const { error } = await supabase.storage.from('evidence').upload(`proofs/${fileName}`, file)
    if (error) return { error }
    return { data: { publicUrl: supabase.storage.from('evidence').getPublicUrl(`proofs/${fileName}`).data.publicUrl } }
  }

  return (
    <AuraContext.Provider value={{ profile, missions, myMissions, loading, isDemo, refresh: fetchData, verifyImpact, createMission, updateProfile, uploadEvidence }}>
      {children}
    </AuraContext.Provider>
  )
}

export const useAura = () => {
  const context = useContext(AuraContext)
  if (context === undefined) throw new Error('useAura must be used within AuraProvider')
  return context
}
