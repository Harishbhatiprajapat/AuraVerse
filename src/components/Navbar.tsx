import { Zap, Layout, Target, Users, Home } from 'lucide-react'
import { motion } from 'framer-motion'

export type ViewType = 'home' | 'dashboard' | 'missions' | 'community'

interface NavbarProps {
  onActionClick: () => void
  currentView: ViewType
  setView: (view: ViewType) => void
}

export const Navbar = ({ onActionClick, currentView, setView }: NavbarProps) => {
  return (
    <nav className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] px-8 py-4 glass-card glass-panel flex items-center gap-10 border-white/5 shadow-2xl backdrop-blur-3xl">
      <NavItem 
        icon={<Home className="w-5 h-5" />} 
        label="Home" 
        active={currentView === 'home'} 
        onClick={() => setView('home')} 
      />
      <NavItem 
        icon={<Layout className="w-5 h-5" />} 
        label="Stats" 
        active={currentView === 'dashboard'} 
        onClick={() => setView('dashboard')} 
      />
      
      <motion.div 
        whileHover={{ scale: 1.15, rotate: 5, boxShadow: '0 0 30px rgba(0, 210, 255, 0.8)' }}
        whileTap={{ scale: 0.95 }}
        onClick={onActionClick}
        className="w-12 h-12 bg-brand-blue rounded-2xl flex items-center justify-center -mt-10 cursor-pointer shadow-[0_0_20px_rgba(0,210,255,0.6)] transition-all"
      >
        <Zap className="w-6 h-6 text-brand-navy fill-current" />
      </motion.div>

      <NavItem 
        icon={<Target className="w-5 h-5" />} 
        label="Missions" 
        active={currentView === 'missions'} 
        onClick={() => setView('missions')} 
      />
      <NavItem 
        icon={<Users className="w-5 h-5" />} 
        label="Rooms" 
        active={currentView === 'community'} 
        onClick={() => setView('community')} 
      />
    </nav>
  )
}

const NavItem = ({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) => {
  return (
    <div 
      onClick={onClick}
      className={`relative flex flex-col items-center gap-1 cursor-pointer transition-all duration-300 group ${active ? 'text-brand-blue' : 'text-white/30 hover:text-white/80'}`}
    >
      <div className={`transition-transform duration-300 group-hover:scale-110 ${active ? 'scale-110 drop-shadow-[0_0_8px_rgba(0,210,255,0.5)]' : ''}`}>
        {icon}
      </div>
      <span className="text-[10px] font-black italic uppercase tracking-widest">{label}</span>
      {active && (
        <motion.div 
          layoutId="nav-glow"
          className="absolute -bottom-2 w-1 h-1 bg-brand-blue rounded-full shadow-[0_0_10px_rgba(0,210,255,1)]"
        />
      )}
    </div>
  )
}
