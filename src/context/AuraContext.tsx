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

export const AuraProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<any>(null)
  const [missions, setMissions] = useState<any[]>([])
  const [myMissions, setMyMissions] = useState<any[]>([])
  const [leaderboard, setLeaderboard] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isDemo, setIsDemo] = useState(false)

  const fetchData = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    
    // 1. Fetch Leaderboard
    const { data: lData } = await supabase
      .from('profiles')
      .select('username, aura_points, avatar_url, level')
      .order('aura_points', { ascending: false })
      .limit(10)
    setLeaderboard(lData || [])

    if (localStorage.getItem('aura_demo_mode') === 'true' && !user) {
      setIsDemo(true)
      setProfile({ id: 'demo', username: 'DemoLegend', aura_points: 25000, level: 50, avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Demo', impact_type: 'Legendary' })
      setLoading(false)
      return
    }

    if (!user) { setLoading(false); return; }

    try {
      // 2. Fetch Missions (Simplified query to avoid join errors)
      const { data: mData } = await supabase
        .from('missions')
        .select('*')
        .order('created_at', { ascending: false })
      
      setMissions(mData || [])
      setMyMissions((mData || []).filter(m => m.user_id === user.id))

      // 3. Fetch My Profile
      const { data: pData } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setProfile(pData)
    } catch (e) {
      console.error('Fetch Error:', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    const channel = supabase.channel('global-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => fetchData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'missions' }, () => fetchData())
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [])

  const verifyImpact = async (missionId: string, evidenceUrl: string) => {
    console.log('⚡ AURA-BYPASS: Initializing instant verification...')
    const { data: { user } } = await supabase.auth.getUser()
    
    // 1. Find mission reward
    const mission = missions.find(m => m.id === missionId)
    const rewardAmount = mission?.reward_ap || 1000

    if (isDemo) {
      const newPoints = (profile.aura_points || 0) + rewardAmount
      setProfile({ ...profile, aura_points: newPoints })
      return { data: { status: 'verified', reward: rewardAmount } }
    }

    if (!user) return { error: 'Auth required' }

    try {
      // 2. Insert into Proof Ledger
      await supabase.from('proof_ledger').insert([{
        user_id: user.id,
        mission_id: missionId,
        evidence_url: evidenceUrl,
        status: 'verified',
        verified_at: new Date().toISOString()
      }])

      // 3. Increment Profile Points Directly (BYPASS)
      const { data: currentProfile } = await supabase.from('profiles').select('aura_points, level').eq('id', user.id).single()
      const newPoints = (currentProfile?.aura_points || 0) + rewardAmount
      const newLevel = Math.floor(newPoints / 1000) + 1

      const { data: updated, error: uError } = await supabase
        .from('profiles')
        .update({ aura_points: newPoints, level: newLevel })
        .eq('id', user.id)
        .select()

      if (uError) throw uError

      console.log('✅ AURA-BYPASS: Points incremented! New Total:', newPoints)
      await fetchData() // Sync everything
      
      return { data: { status: 'verified', reward: rewardAmount } }
    } catch (e: any) {
      console.error('❌ AURA-BYPASS Error:', e)
      return { error: e.message }
    }
  }

  const createMission = async (missionData: any) => {
    const { data: { user } } = await supabase.auth.getUser()
    const res = await supabase.from('missions').insert([{ ...missionData, user_id: user?.id }]).select()
    if (!res.error) await fetchData()
    return res
  }

  const updateProfile = async (updates: any) => {
    const { data: { user } } = await supabase.auth.getUser()
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
  if (context === undefined) throw new Error('useAura must be used within AuraProvider')
  return context
}
