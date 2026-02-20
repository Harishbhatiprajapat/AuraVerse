import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

interface AuraContextType {
  profile: any
  missions: any[]
  myMissions: any[]
  leaderboard: any[]
  loading: boolean
  isDemo: boolean
  refresh: () => Promise<void>
  verifyImpact: (missionId: string, evidenceUrl: string) => Promise<any>
  createMission: (missionData: any) => Promise<any>
  updateProfile: (updates: any) => Promise<any>
  uploadEvidence: (file: File) => Promise<any>
}

const AuraContext = createContext<AuraContextType | undefined>(undefined)

// ⚡ HARDCODED DEFAULTS (Guaranteed Visibility)
const FALLBACK_MISSIONS = [
  { id: 'f1', title: 'Amazon Reforestation', description: 'Plant native trees in the rainforest.', reward_ap: 5000, mission_type: 'Environmental', image_url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80', created_at: new Date().toISOString(), username: 'Aura Core' },
  { id: 'f2', title: 'City Solar Grid', description: 'Install renewable panels in urban housing.', reward_ap: 3500, mission_type: 'Civic', image_url: 'https://images.unsplash.com/photo-1509391366360-fe5bb58583bb?w=800&q=80', created_at: new Date().toISOString(), username: 'Aura Core' },
  { id: 'f3', title: 'Ocean Plastic Sentinel', description: 'Deploy bio-degradable bins at local beaches.', reward_ap: 2500, mission_type: 'Environmental', image_url: 'https://images.unsplash.com/photo-1621451537084-482c73073a0f?w=800&q=80', created_at: new Date().toISOString(), username: 'Aura Core' }
]

export const AuraProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<any>(null)
  const [missions, setMissions] = useState<any[]>(FALLBACK_MISSIONS)
  const [myMissions, setMyMissions] = useState<any[]>([])
  const [leaderboard, setLeaderboard] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isDemo, setIsDemo] = useState(false)

  const fetchData = async () => {
    console.log('🔄 AURA-SYNC: Initializing global sync...')
    
    // 1. Fetch Missions (Simplified query)
    try {
      const { data: mData, error: mError } = await supabase
        .from('missions')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (!mError && mData && mData.length > 0) {
        console.log('✅ AURA-SYNC: Missions loaded from DB:', mData.length)
        setMissions(mData)
      } else if (mError) {
        console.warn('⚠️ AURA-SYNC: Falling back to internal mission registry.', mError)
      }
    } catch (e) {
      console.error('Missions Fetch Error:', e)
    }

    // 2. Fetch Leaderboard
    try {
      const { data: lData } = await supabase
        .from('profiles')
        .select('username, aura_points, avatar_url, level')
        .order('aura_points', { ascending: false })
        .limit(10)
      if (lData) setLeaderboard(lData)
    } catch (e) {}

    const { data: { user } } = await supabase.auth.getUser()
    
    if (localStorage.getItem('aura_demo_mode') === 'true' && !user) {
      setIsDemo(true)
      setProfile({ id: 'demo', username: 'DemoLegend', aura_points: 25000, level: 50, avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Demo' })
      setLoading(false)
      return
    }

    if (!user) { setLoading(false); return; }

    try {
      // 3. Sync Profile
      const { data: pData } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      if (pData) {
        setProfile(pData)
        // Correctly filter my missions using the fresh data
        const { data: myMData } = await supabase.from('missions').select('*').eq('user_id', user.id)
        setMyMissions(myMData || [])
      }
    } catch (e) {
      console.error('Profile Sync Error:', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    const channel = supabase.channel('sync-all')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'missions' }, () => {
        console.log('✨ AURA-SYNC: Mission update detected!')
        fetchData()
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [])

  const verifyImpact = async (missionId: string, evidenceUrl: string) => {
    const { data: { user } } = await supabase.auth.getUser()
    const mission = missions.find(m => m.id === missionId) || FALLBACK_MISSIONS.find(m => m.id === missionId)
    const rewardAmount = mission?.reward_ap || 1000

    if (isDemo || !user) {
      const newPoints = (profile?.aura_points || 0) + rewardAmount
      setProfile({ ...profile, aura_points: newPoints })
      return { data: { status: 'verified', reward: rewardAmount } }
    }

    try {
      const newPoints = (profile?.aura_points || 0) + rewardAmount
      const newLevel = Math.floor(newPoints / 1000) + 1
      await supabase.from('profiles').update({ aura_points: newPoints, level: newLevel }).eq('id', user.id)
      await supabase.from('proof_ledger').insert([{ user_id: user.id, mission_id: missionId, evidence_url: evidenceUrl, status: 'verified' }])
      await fetchData()
      return { data: { status: 'verified', reward: rewardAmount } }
    } catch (e: any) {
      return { error: e.message }
    }
  }

  const createMission = async (missionData: any) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (isDemo || !user) {
      const nm = { ...missionData, id: Math.random().toString(), created_at: new Date().toISOString(), username: 'DemoLegend' }
      setMissions(prev => [nm, ...prev])
      return { data: nm }
    }
    const res = await supabase.from('missions').insert([{ ...missionData, user_id: user?.id }]).select()
    if (!res.error) await fetchData()
    return res
  }

  const updateProfile = async (updates: any) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (isDemo || !user) { setProfile({ ...profile, ...updates }); return { data: updates } }
    const res = await supabase.from('profiles').update(updates).eq('id', user?.id).select()
    if (!res.error) setProfile(res.data[0])
    return res
  }

  const uploadEvidence = async (file: File) => {
    if (isDemo) return { data: { publicUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09' } }
    const fileName = `${Date.now()}-${file.name.replace(/[^a-z0-9.]/gi, '_')}`
    const { error } = await supabase.storage.from('evidence').upload(fileName, file)
    if (error) return { error }
    const { data } = supabase.storage.from('evidence').getPublicUrl(fileName)
    return { data: { publicUrl: data.publicUrl } }
  }

  return (
    <AuraContext.Provider value={{ profile, missions, myMissions, leaderboard, loading, isDemo, refresh: fetchData, verifyImpact, createMission, updateProfile, uploadEvidence }}>
      {children}
    </AuraContext.Provider>
  )
}

export const useAura = () => {
  const context = useContext(AuraContext)
  if (context === undefined) throw new Error('useAura error')
  return context
}
