import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from './lib/supabase'
import { Navbar } from './components/Navbar'
import type { ViewType } from './components/Navbar'
import { Hero } from './components/Hero'
import { Dashboard } from './components/Dashboard'
import { ProfilePreview } from './components/ProfilePreview'
import { ImpactProofModal } from './components/ImpactProofModal'
import { HostMissionModal } from './components/HostMissionModal'
import { CollaborationRoom } from './components/CollaborationRoom'
import { Auth } from './components/Auth'
import { APBurst } from './components/APBurst'
import { BackgroundAura } from './components/BackgroundAura'
import type { Session } from '@supabase/supabase-js'
import './App.css'

function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [currentView, setCurrentView] = useState<ViewType>('home')
  const [isProofModalOpen, setIsProofModalOpen] = useState(false)
  const [isHostModalOpen, setIsHostModalOpen] = useState(false)
  const [selectedMission, setSelectedMission] = useState<any>(null)
  const [celebration, setCelebration] = useState({ isVisible: false, amount: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleDemoLogin = () => {
    localStorage.setItem('aura_demo_mode', 'true')
    setSession({ 
      access_token: 'demo', 
      user: { id: 'demo-user', email: 'demo@auraverse.co' } 
    } as any)
  }

  const handleParticipate = (mission: any) => {
    setSelectedMission(mission)
    setIsProofModalOpen(true)
  }

  const handleVerificationSuccess = (amount: number) => {
    setCelebration({ isVisible: true, amount })
  }

  if (loading) return (
    <div className="min-h-screen bg-[#020208] flex items-center justify-center">
       <div className="w-16 h-16 border-4 border-brand-blue/20 border-t-brand-blue rounded-full animate-spin shadow-[0_0_20px_rgba(0,210,255,0.3)]" />
    </div>
  )

  if (!session) {
    return <Auth onDemoLogin={handleDemoLogin} />
  }

  return (
    <main className="relative min-h-screen pb-40 selection:bg-brand-blue/30">
      <BackgroundAura />
      <Navbar 
        onActionClick={() => { setSelectedMission(null); setIsProofModalOpen(true); }} 
        currentView={currentView}
        setView={setCurrentView}
      />
      
      <AnimatePresence mode="wait">
        <motion.div
          key={currentView}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {currentView === 'home' && (
            <>
              <Hero onActionClick={() => setCurrentView('missions')} />
              <ProfilePreview />
            </>
          )}
          
          {(currentView === 'dashboard' || currentView === 'missions') && (
            <div className="pt-32">
              <Dashboard 
                onHostMission={() => setIsHostModalOpen(true)} 
                onParticipate={handleParticipate}
                defaultTab={currentView === 'missions' ? 'Events' : 'Overview'}
              />
            </div>
          )}

          {currentView === 'community' && (
            <div className="pt-32">
              <CollaborationRoom />
            </div>
          )}
        </motion.div>
      </AnimatePresence>
      
      <ImpactProofModal 
        isOpen={isProofModalOpen} 
        onClose={() => setIsProofModalOpen(false)} 
        mission={selectedMission}
        onSuccess={handleVerificationSuccess}
      />
      <HostMissionModal isOpen={isHostModalOpen} onClose={() => setIsHostModalOpen(false)} />

      <APBurst 
        amount={celebration.amount} 
        isVisible={celebration.isVisible} 
        onComplete={() => setCelebration({ ...celebration, isVisible: false })} 
      />
    </main>
  )
}

export default App
