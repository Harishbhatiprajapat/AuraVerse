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
import type { Session } from '@supabase/supabase-js'
import './App.css'

function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [currentView, setCurrentView] = useState<ViewType>('home')
  const [isProofModalOpen, setIsProofModalOpen] = useState(false)
  const [isHostModalOpen, setIsHostModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Initial Auth State
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    // Listen for Auth Changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleDemoLogin = () => {
    localStorage.setItem('aura_demo_mode', 'true')
    const mockSession = { 
      access_token: 'demo-token', 
      user: { id: 'demo-user', email: 'demo@auraverse.co' } 
    } as any
    setSession(mockSession)
  }

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return (
          <motion.div
            key="home"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <Hero onActionClick={() => setIsProofModalOpen(true)} />
            <ProfilePreview />
          </motion.div>
        )
      case 'dashboard':
        return (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, x: 50, filter: 'blur(10px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, x: -50, filter: 'blur(10px)' }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="pt-32"
          >
            <Dashboard onHostMission={() => setIsHostModalOpen(true)} />
          </motion.div>
        )
      case 'missions':
        return (
          <motion.div
            key="missions"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            transition={{ duration: 0.6, ease: 'backOut' }}
            className="pt-32"
          >
             <Dashboard onHostMission={() => setIsHostModalOpen(true)} defaultTab="Events" />
          </motion.div>
        )
      case 'community':
        return (
          <motion.div
            key="community"
            initial={{ opacity: 0, rotateX: -10 }}
            animate={{ opacity: 1, rotateX: 0 }}
            exit={{ opacity: 0, rotateX: 10 }}
            transition={{ duration: 0.6 }}
            className="pt-32"
          >
            <CollaborationRoom />
          </motion.div>
        )
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-[#020208] flex items-center justify-center">
       <div className="w-16 h-16 border-4 border-brand-blue/20 border-t-brand-blue rounded-full animate-spin" />
    </div>
  )

  if (!session) {
    return <Auth onDemoLogin={handleDemoLogin} />
  }

  return (
    <main className="relative min-h-screen pb-40">
      <Navbar 
        onActionClick={() => setIsProofModalOpen(true)} 
        currentView={currentView}
        setView={setCurrentView}
      />
      
      <AnimatePresence mode="wait">
        {renderView()}
      </AnimatePresence>
      
      <ImpactProofModal isOpen={isProofModalOpen} onClose={() => setIsProofModalOpen(false)} />
      <HostMissionModal isOpen={isHostModalOpen} onClose={() => setIsHostModalOpen(false)} />

      {/* Background Particles Layer */}
      <div className="fixed inset-0 pointer-events-none opacity-20 overflow-hidden z-[-1]">
        {Array.from({ length: 40 }).map((_, i) => (
          <div
            key={i}
            className="absolute bg-brand-blue rounded-full blur-[2px] animate-float"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 4 + 1}px`,
              height: `${Math.random() * 4 + 1}px`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 5 + 5}s`
            }}
          />
        ))}
      </div>
    </main>
  )
}

export default App
