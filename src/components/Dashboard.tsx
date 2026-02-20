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
        
        <div className="flex items-center gap-2 md:gap-4 bg-white/5 p-2 rounded-2xl border border-white/5 backdrop-blur-xl">
          <TabButton active={activeTab === 'Overview'} onClick={() => setActiveTab('Overview')} icon={<List className="w-5 h-5" />} />
          <TabButton active={activeTab === 'Events'} onClick={() => setActiveTab('Events')} icon={<Calendar className="w-5 h-5" />} />
          <TabButton active={activeTab === 'Global'} onClick={() => setActiveTab('Global')} icon={<Map className="w-5 h-5" />} />
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
                    <LeaderboardItem rank={142} name={profile?.username || 'You'} points={profile?.aura_points?.toLocaleString() || '0'} avatar={profile?.avatar_url} active />
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
            <div className="glass-card p-12 text-center border-brand-purple/20 bg-brand-purple/5">
              <h3 className="text-4xl font-black mb-4 italic uppercase tracking-tighter">Community Event Hub</h3>
              <p className="text-xl text-white/50 mb-8 max-w-2xl mx-auto">Host your own missions and build your community's Aura. Impact starts with you.</p>
              <button 
                onClick={onHostMission}
                className="px-10 py-5 bg-brand-purple text-white font-black rounded-2xl flex items-center gap-3 text-lg mx-auto shadow-[0_0_30px_rgba(146,0,255,0.4)] hover:scale-105 transition-all uppercase tracking-widest italic"
              >
                <Plus className="w-6 h-6" /> Host a Mission
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <EventCard title="Earth Day Sprint" host="EcoTeam" date="22 Feb" ap="5k AP" image="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&h=250&fit=crop" />
              <EventCard title="Hack for Peace" host="AuraHub" date="25 Feb" ap="10k AP" image="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=250&fit=crop" />
              <EventCard title="Clean City Run" host="CityGuard" date="28 Feb" ap="3k AP" image="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400&h=250&fit=crop" />
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

const TabButton = ({ active, onClick, icon }: { active: boolean, onClick: () => void, icon: React.ReactNode }) => (
  <button 
    onClick={onClick}
    className={`p-4 rounded-xl transition-all ${active ? 'bg-brand-blue/20 text-brand-blue border border-brand-blue/30 shadow-[0_0_20px_rgba(0,210,255,0.2)]' : 'text-white/40 hover:text-white/80'}`}
  >
    {icon}
  </button>
)

const StatCard = ({ icon, label, value, sub }: { icon: React.ReactNode, label: string, value: string, sub: string }) => (
  <motion.div
    whileHover={{ y: -5, boxShadow: '0 0 20px rgba(0, 210, 255, 0.2)' }}
    className="glass-card p-6 flex flex-col items-center text-center group"
  >
    <div className="mb-4 transform transition-transform duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_rgba(0,210,255,0.6)]">
      {icon}
    </div>
    <span className="text-white/40 uppercase tracking-widest text-[10px] font-bold mb-1">{label}</span>
    <div className="text-3xl font-black mb-1 italic uppercase tracking-tighter">{value}</div>
    <span className="text-white/60 text-xs font-semibold">{sub}</span>
  </motion.div>
)

const MissionCard = ({ title, desc, reward, type, tagColor, onClick }: { title: string, desc: string, reward: string, type: string, tagColor: string, onClick?: () => void }) => (
  <motion.div
    whileHover={{ x: 5, backgroundColor: 'rgba(255, 255, 255, 0.08)' }}
    className="glass-card p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 group cursor-pointer"
  >
    <div className="flex-1 min-w-0">
      <div className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border mb-3 ${tagColor}`}>
        {type}
      </div>
      <h3 className="text-xl font-bold mb-2 group-hover:text-brand-blue transition-colors italic uppercase tracking-tight truncate">{title}</h3>
      <p className="text-white/50 text-sm line-clamp-2 sm:line-clamp-1">{desc}</p>
    </div>
    <div className="flex flex-col sm:items-end gap-4 shrink-0">
      <div className="text-left sm:text-right">
        <div className="text-brand-blue font-black text-xl mb-1">{reward}</div>
        <div className="text-white/30 text-[10px] font-bold uppercase tracking-widest">Potential Gain</div>
      </div>
      <button 
        onClick={(e) => { e.stopPropagation(); onClick?.(); }}
        className="px-6 py-2 bg-brand-blue/10 border border-brand-blue/30 text-brand-blue rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-blue hover:text-brand-navy transition-all"
      >
        Complete Mission
      </button>
    </div>
  </motion.div>
)

const LeaderboardItem = ({ rank, name, points, avatar, active = false }: { rank: number, name: string, points: string, avatar: string, active?: boolean }) => (
  <div className={`flex items-center gap-4 ${active ? 'bg-brand-blue/10 p-2 rounded-xl -mx-2 border border-brand-blue/20 shadow-[0_0_15px_rgba(0,210,255,0.1)]' : ''}`}>
    <span className={`w-6 font-black text-lg ${rank <= 3 ? 'text-brand-blue' : 'text-white/20'}`}>{rank}</span>
    <img src={avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Haris"} alt={name} className="w-10 h-10 rounded-full bg-white/5" />
    <span className={`flex-1 font-bold ${active ? 'text-white' : 'text-white/70'}`}>{name}</span>
    <span className="font-black text-brand-blue italic uppercase tracking-tighter">{points}</span>
  </div>
)

const EventCard = ({ title, host, date, ap, image }: { title: string, host: string, date: string, ap: string, image: string }) => (
  <motion.div
    whileHover={{ y: -5 }}
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
