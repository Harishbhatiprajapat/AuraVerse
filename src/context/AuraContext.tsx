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

// ⚡ HARDCODED DEFAULTS (Emergency Fallback)
const DEFAULT_MISSIONS = [
  { id: 'd1', title: 'Global Reforestation', reward_ap: 5000, mission_type: 'Environmental', description: 'Plant a native tree.', image_url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80', created_at: new Date().toISOString() },
  { id: 'd2', title: 'Ocean Plastic Recovery', reward_ap: 2500, mission_type: 'Environmental', description: 'Beach cleanup.', image_url: 'https://images.unsplash.com/photo-1621451537084-482c73073a0f?w=800&q=80', created_at: new Date().toISOString() },
  { id: 'd3', title: 'Civic Infrastructure', reward_ap: 1500, mission_type: 'Civic', description: 'Report civic issues.', image_url: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&q=80', created_at: new Date().toISOString() }
]

export const AuraProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<any>(null)
  const [missions, setMissions] = useState<any[]>(DEFAULT_MISSIONS)
  const [myMissions, setMyMissions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isDemo, setIsDemo] = useState(false)

  const fetchData = async () => {
    console.log('🔄 AURA-SYNC: Fetching...')
    const { data: { user } } = await supabase.auth.getUser()
    
    if (localStorage.getItem('aura_demo_mode') === 'true' && !user) {
      setIsDemo(true)
      setProfile({ id: 'demo', username: 'DemoLegend', aura_points: 25000, level: 50 })
      setLoading(false)
      return
    }

    if (!user) { setLoading(false); return; }

    try {
      // Fetch Missions
      const { data: mData, error: mError } = await supabase
        .from('missions')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (mError) throw mError

      // If DB has missions, use them. Otherwise keep defaults.
      if (mData && mData.length > 0) {
        setMissions(mData)
        setMyMissions(mData.filter(m => m.user_id === user.id))
      }

      // Fetch Profile
      const { data: pData } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setProfile(pData)
    } catch (e) {
      console.error('❌ AURA-SYNC: Fetch Error:', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    const channel = supabase.channel('global-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'missions' }, () => fetchData())
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [])

  const createMission = async (missionData: any) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (isDemo) {
      const nm = { ...missionData, id: Math.random().toString(), created_at: new Date().toISOString(), user_id: 'demo' }
      setMissions(prev => [nm, ...prev])
      return { data: nm }
    }
    const res = await supabase.from('missions').insert([{ ...missionData, user_id: user?.id }]).select()
    if (!res.error) await fetchData()
    return res
  }

  const verifyImpact = async (missionId: string, evidenceUrl: string) => {
    const { data: { user } } = await supabase.auth.getUser()
    return supabase.functions.invoke('verify-impact', {
      body: { user_id: user?.id || 'demo', mission_id: missionId, evidence_url: evidenceUrl },
    })
  }

  const updateProfile = async (updates: any) => {
    const { data: { user } } = await supabase.auth.getUser()
    const res = await supabase.from('profiles').update(updates).eq('id', user?.id).select()
    if (!res.error) setProfile(res.data[0])
    return res
  }

  const uploadEvidence = async (file: File) => {
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
