import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, TrendingUp, Zap, Users, Leaf, Calendar, Plus, Map, List, Globe } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useAura } from '../hooks/useAura'

export const Dashboard = ({ onHostMission, onParticipate, defaultTab = 'Overview' }: { onHostMission: () => void, onParticipate: (mission: any) => void, defaultTab?: string }) => {
  const [activeTab, setActiveTab] = useState(defaultTab)
  const { profile, missions, loading } = useAura()

  useEffect(() => {
    setActiveTab(defaultTab)
  }, [defaultTab])

  if (loading) return (
    <div className="h-64 flex items-center justify-center">
       <div className="w-10 h-10 border-2 border-brand-blue/20 border-t-brand-blue rounded-full animate-spin" />
    </div>
  )

  return (
    <section className="px-6 py-24 md:px-24">
      {/* ... header logic */}
      <div className="flex flex-col lg:flex-row items-center justify-between mb-16 gap-8">
        <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter break-words text-center lg:text-left">
          Dashboard <span className="bg-gradient-to-r from-brand-blue to-brand-purple bg-clip-text text-transparent opacity-50 text-2xl md:text-4xl block md:inline">/ {activeTab}</span>
        </h2>
        
        <div className="flex items-center gap-2 md:gap-4 bg-white/5 p-2 rounded-2xl border border-white/5 backdrop-blur-xl relative">
          <TabButton active={activeTab === 'Overview'} onClick={() => setActiveTab('Overview')} icon={<List className="w-5 h-5" />} label="Overview" />
          <TabButton active={activeTab === 'Events'} onClick={() => setActiveTab('Events')} icon={<Calendar className="w-5 h-5" />} label="Events" />
          <TabButton active={activeTab === 'Global'} onClick={() => setActiveTab('Global')} icon={<Map className="w-5 h-5" />} label="Impact" />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'Overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-12"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <StatCard icon={<Zap className="w-8 h-8 text-brand-blue" />} label="Aura Points" value={profile?.aura_points?.toLocaleString() || '0'} sub="AP ✨" />
              <StatCard icon={<TrendingUp className="w-8 h-8 text-brand-cyan" />} label="Impact Score" value={profile?.reputation_score || '0'} sub="Points 🚀" />
              <StatCard icon={<Trophy className="w-8 h-8 text-brand-purple" />} label="Level" value={profile?.level || '1'} sub="Innovator 🎖" />
              <StatCard icon={<Users className="w-8 h-8 text-brand-pink" />} label="Streak" value="12" sub="Days 🔥" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-3xl font-bold flex items-center gap-3 italic uppercase tracking-tight">
                    <Leaf className="w-8 h-8 text-green-400" /> Active Missions
                  </h3>
                </div>
                <div className="space-y-4">
                  {missions.length > 0 ? missions.map((m) => (
                    <MissionCard 
                      key={m.id}
                      title={m.title} 
                      desc={m.description} 
                      reward={`${m.reward_ap} AP`} 
                      type={m.mission_type} 
                      tagColor={m.mission_type === 'Environmental' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-blue-500/20 text-blue-400 border-blue-500/30'} 
                      onClick={() => onParticipate(m)}
                    />
                  )) : (
                    <div className="p-12 text-center glass-card opacity-40">No missions found. Host one!</div>
                  )}
                </div>
              </div>

              {/* ... leaderboard logic */}
              <div className="space-y-8">
                <h3 className="text-3xl font-bold flex items-center gap-3 italic uppercase tracking-tight">
                  <Trophy className="w-8 h-8 text-yellow-400" /> Leaderboard
                </h3>
                <div className="glass-card p-6 space-y-6">
                  <LeaderboardItem rank={1} name="AuraLegend_99" points="152k" avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Aura" />
                  <LeaderboardItem rank={2} name="EcoWarrior" points="128k" avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Eco" />
                  <LeaderboardItem rank={3} name="CyberImpact" points="98k" avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Impact" />
                  <div className="pt-4 border-t border-white/10 mt-4">
                    <LeaderboardItem 
                      rank={142} 
                      name={profile?.username || 'You'} 
                      points={profile?.aura_points?.toLocaleString() || '0'} 
                      avatar={profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.username || 'Haris'}`} 
                      active 
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'Events' && (
          <motion.div
            key="events"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-12"
          >
            <div className="glass-card p-12 text-center border-brand-purple/20 bg-brand-purple/5 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-brand-purple/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              <h3 className="text-4xl font-black mb-4 italic uppercase tracking-tighter relative z-10">Community Event Hub</h3>
              <p className="text-xl text-white/50 mb-8 max-w-2xl mx-auto relative z-10">Host your own missions and build your community's Aura. Impact starts with you.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
                <button 
                  onClick={onHostMission}
                  className="px-10 py-5 bg-brand-purple text-white font-black rounded-2xl flex items-center gap-3 text-lg shadow-[0_0_30px_rgba(146,0,255,0.4)] hover:scale-105 transition-all uppercase tracking-widest italic"
                >
                  <Plus className="w-6 h-6" /> Host a Mission
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {missions && missions.length > 0 ? missions.map((m) => (
                <EventCard 
                  key={m.id}
                  title={m.title} 
                  host={m.username || 'Guardian'} 
                  date={new Date(m.created_at).toLocaleDateString()} 
                  ap={`${m.reward_ap} AP`} 
                  image={m.image_url || "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&h=250&fit=crop"}
                  onClick={() => onParticipate(m)}
                />
              )) : (
                <div className="col-span-full py-32 text-center glass-million border-white/5 flex flex-col items-center justify-center gap-6">
                   <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center border border-white/10 animate-pulse">
                      <Calendar className="w-10 h-10 text-white/20" />
                   </div>
                   <div>
                     <p className="text-2xl font-black italic uppercase tracking-widest text-white/60">No active missions found in the Verse.</p>
                     <p className="text-sm mt-2 font-medium text-white/30">The community is waiting for your initiative.</p>
                   </div>
                   <button onClick={onHostMission} className="text-brand-purple font-black uppercase tracking-widest text-xs border-b border-brand-purple/30 pb-1 hover:text-white transition-colors">Launch First Mission →</button>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'Global' && (
          <motion.div
            key="global"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-12"
          >
             <div className="relative h-[600px] glass-card overflow-hidden border-brand-cyan/20">
               <div className="absolute inset-0 bg-brand-navy/60 backdrop-blur-3xl z-10 flex flex-col items-center justify-center text-center p-12">
                 <Globe className="w-24 h-24 text-brand-cyan mb-8 animate-pulse shadow-[0_0_50px_rgba(0,255,255,0.4)]" />
                 <h3 className="text-5xl font-black italic uppercase tracking-tighter mb-4">Aura Impact Heatmap</h3>
                 <p className="text-xl text-white/50 max-w-2xl">Visualize real-time environmental and civic contributions across the globe. Powered by the Proof of Impact Ledger.</p>
                 <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8">
                   <div className="text-center">
                     <div className="text-3xl font-black text-brand-blue">142k</div>
                     <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Trees Planted</div>
                   </div>
                   <div className="text-center">
                     <div className="text-3xl font-black text-brand-purple">85k</div>
                     <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Civic Issues Fixed</div>
                   </div>
                   <div className="text-center">
                     <div className="text-3xl font-black text-brand-pink">500t</div>
                     <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">CO2 Offset</div>
                   </div>
                   <div className="text-center">
                     <div className="text-3xl font-black text-brand-cyan">1.2M</div>
                     <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Total Aura</div>
                   </div>
                 </div>
               </div>
               <div className="absolute inset-0 opacity-20 grayscale scale-150">
                 <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1200&h=800&fit=crop" className="w-full h-full object-cover" />
               </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

const TabButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
  <button 
    onClick={onClick}
    className={`relative px-6 py-4 rounded-xl flex items-center gap-3 transition-all ${active ? 'text-brand-blue' : 'text-white/30 hover:text-white/60'}`}
  >
    {active && (
      <motion.div 
        layoutId="dash-tab-bg"
        className="absolute inset-0 bg-brand-blue/10 border border-brand-blue/20 rounded-xl shadow-[0_0_20px_rgba(0,210,255,0.1)]"
      />
    )}
    <div className="relative z-10">{icon}</div>
    <span className="relative z-10 text-[10px] font-black uppercase tracking-[0.2em] italic">{label}</span>
  </button>
)

const StatCard = ({ icon, label, value, sub }: { icon: React.ReactNode, label: string, value: string, sub: string }) => (
  <motion.div
    whileHover={{ y: -8, transition: { duration: 0.2 } }}
    className="glass-million p-8 flex flex-col items-center text-center group relative overflow-hidden"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    <div className="mb-6 transform transition-all duration-500 group-hover:scale-125 group-hover:drop-shadow-[0_0_15px_rgba(0,210,255,0.6)]">
      {icon}
    </div>
    <span className="text-white/20 uppercase tracking-[0.3em] text-[10px] font-black mb-2">{label}</span>
    <div className="text-4xl font-black mb-1 italic tracking-tighter text-glow-blue">{value}</div>
    <span className="text-white/40 text-xs font-bold uppercase tracking-widest">{sub}</span>
  </motion.div>
)

const MissionCard = ({ title, desc, reward, type, tagColor, onClick }: { title: string, desc: string, reward: string, type: string, tagColor: string, onClick?: () => void }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    whileHover={{ x: 10, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
    viewport={{ once: true }}
    className="glass-million p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8 group cursor-pointer border-white/5 relative overflow-hidden"
  >
    <div className="flex-1 min-w-0 z-10">
      <div className={`inline-block px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border mb-4 ${tagColor} backdrop-blur-3xl`}>
        {type}
      </div>
      <h3 className="text-2xl font-black mb-2 group-hover:text-brand-blue transition-colors italic uppercase tracking-tight truncate">{title}</h3>
      <p className="text-white/30 text-base font-medium line-clamp-2 sm:line-clamp-1 group-hover:text-white/60 transition-colors">{desc}</p>
    </div>
    <div className="flex flex-col sm:items-end gap-6 shrink-0 z-10">
      <div className="text-left sm:text-right">
        <div className="text-3xl font-black text-brand-blue italic tracking-tighter mb-1 text-glow-blue">{reward}</div>
        <div className="text-white/20 text-[10px] font-black uppercase tracking-[0.3em]">Potential Aura</div>
      </div>
      <motion.button 
        whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(0, 210, 255, 0.4)' }}
        whileTap={{ scale: 0.95 }}
        onClick={(e) => { e.stopPropagation(); onClick?.(); }}
        className="px-8 py-3 bg-brand-blue text-brand-navy rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] italic transition-all"
      >
        Initialize
      </motion.button>
    </div>
  </motion.div>
)

const LeaderboardItem = ({ rank, name, points, avatar, active = false }: { rank: number, name: string, points: string, avatar: string, active?: boolean }) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    whileInView={{ opacity: 1, y: 0 }}
    whileHover={{ x: 5 }}
    className={`flex items-center gap-4 p-3 rounded-2xl transition-all ${active ? 'bg-brand-blue/10 border border-brand-blue/30 shadow-[0_0_20px_rgba(0,210,255,0.1)]' : 'hover:bg-white/5'}`}
  >
    <span className={`w-8 font-black italic text-xl ${rank <= 3 ? 'text-brand-blue drop-shadow-[0_0_8px_rgba(0,210,255,0.5)]' : 'text-white/20'}`}>{rank}</span>
    <div className="relative">
      <img src={avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Haris"} alt={name} className="w-12 h-12 rounded-full bg-white/5 border border-white/10" />
      {active && <div className="absolute -top-1 -right-1 w-4 h-4 bg-brand-blue rounded-full border-4 border-brand-navy flex items-center justify-center animate-pulse" />}
    </div>
    <span className={`flex-1 font-black italic uppercase tracking-tight ${active ? 'text-white' : 'text-white/60'}`}>{name}</span>
    <div className="text-right">
      <span className="font-black text-brand-blue italic uppercase tracking-tighter text-lg">{points}</span>
      <div className="text-[8px] font-black uppercase text-white/20 tracking-widest leading-none">AP Aura</div>
    </div>
  </motion.div>
)

const EventCard = ({ title, host, date, ap, image, onClick }: { title: string, host: string, date: string, ap: string, image: string, onClick?: () => void }) => (
  <motion.div
    whileHover={{ y: -5 }}
    onClick={onClick}
    className="glass-card overflow-hidden group cursor-pointer border-white/5"
  >
    <div className="h-40 overflow-hidden relative">
      <img src={image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
      <div className="absolute top-4 right-4 px-3 py-1 glass-card bg-brand-purple/20 border-brand-purple/30 text-white font-black italic uppercase tracking-tighter text-xs">
        {ap}
      </div>
    </div>
    <div className="p-6">
      <div className="flex items-center gap-2 mb-2 text-white/40">
        <Calendar className="w-4 h-4" />
        <span className="text-[10px] font-black uppercase tracking-widest">{date}</span>
      </div>
      <h4 className="text-xl font-black mb-1 italic uppercase tracking-tighter group-hover:text-brand-purple transition-colors">{title}</h4>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded-full bg-brand-purple/20 border border-brand-purple/30" />
        <span className="text-xs text-white/40 font-bold uppercase tracking-widest">Hosted by {host}</span>
      </div>
    </div>
  </motion.div>
)
