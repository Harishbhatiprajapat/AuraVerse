import { motion, AnimatePresence } from 'framer-motion'
import { ShieldCheck, Leaf, Flame, Award, Globe, Edit3, X, Save } from 'lucide-react'
import { useAura } from '../context/AuraContext'
import { useState } from 'react'

export const ProfilePreview = () => {
  const { profile, myMissions, loading, updateProfile } = useAura()
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({ username: '', bio: '', avatar_url: '' })

  const handleEditOpen = () => {
    setEditData({ 
      username: profile?.username || '', 
      bio: profile?.bio || '', 
      avatar_url: profile?.avatar_url || '' 
    })
    setIsEditing(true)
  }

  const handleSave = async () => {
    const { error } = await updateProfile(editData)
    if (!error) setIsEditing(false)
    else alert('Failed to update: ' + (error as any)?.message)
  }

  if (loading) return null

  return (
    <section className="px-6 py-32 md:px-24 relative overflow-hidden">
      {/* Edit Modal */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsEditing(false)} className="absolute inset-0 bg-brand-navy/90 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-lg glass-million p-10 border-brand-blue/30">
              <button onClick={() => setIsEditing(false)} className="absolute top-6 right-6 p-2 glass-million hover:bg-white/10"><X className="w-5 h-5" /></button>
              <h3 className="text-3xl font-black italic uppercase tracking-tighter mb-8 flex items-center gap-3"><Edit3 className="w-6 h-6 text-brand-blue" /> Edit Identity</h3>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-2">Identity Handle</label>
                  <input type="text" value={editData.username} onChange={(e) => setEditData({...editData, username: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-blue/50 transition-all font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-2">Identity Bio</label>
                  <textarea rows={3} value={editData.bio} onChange={(e) => setEditData({...editData, bio: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-blue/50 transition-all font-medium text-sm resize-none" placeholder="Tell the Verse your story..." />
                </div>
                <button onClick={handleSave} className="w-full py-4 bg-brand-blue text-brand-navy font-black text-lg rounded-2xl shadow-[0_0_30px_rgba(0,210,255,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 uppercase italic">
                  <Save className="w-5 h-5" /> Save Changes
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Hyper-Liquid Background Aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-blue/5 rounded-full blur-[150px] animate-pulse-slow z-[-1]" />
      
      <div className="flex flex-col lg:flex-row items-center gap-16">
        {/* Left Side (Aura Avatar) */}
        <div className="relative group">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            className="absolute -inset-8 rounded-full border border-dashed border-brand-blue/20 opacity-40"
          />
          <motion.div
             animate={{ scale: [1, 1.1, 1] }}
             transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
             className="absolute -inset-4 rounded-full bg-gradient-to-r from-brand-blue/20 to-brand-purple/20 blur-2xl opacity-50 group-hover:opacity-100 transition-opacity"
          />
          
          <div className="relative w-72 h-72 md:w-96 md:h-96 rounded-full overflow-hidden border-4 border-white/5 bg-brand-navy p-2 shadow-2xl">
            <div className="w-full h-full rounded-full overflow-hidden relative">
              <img 
                src={profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.username || 'Haris'}`} 
                alt="Profile" 
                className="w-full h-full object-cover p-12 transform group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-blue/40 to-transparent mix-blend-overlay group-hover:from-brand-purple/60 transition-colors duration-1000" />
            </div>
          </div>

          {/* Edit Icon Overlay */}
          <button onClick={handleEditOpen} className="absolute bottom-6 right-6 w-14 h-14 bg-brand-blue rounded-full flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all group">
             <Edit3 className="w-6 h-6 text-brand-navy group-hover:rotate-12 transition-transform" />
          </button>

          {/* Streak Flame Component */}
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-4 -right-4 glass-million p-4 border-brand-pink/30 flex items-center gap-2 shadow-[0_0_20px_rgba(255,0,255,0.3)]"
          >
            <Flame className="w-6 h-6 text-brand-pink animate-bounce" />
            <span className="text-xl font-black italic text-brand-pink">12</span>
          </motion.div>

          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 px-10 py-3 glass-million rounded-full font-black text-brand-blue border-brand-blue/40 shadow-[0_0_30px_rgba(0,210,255,0.4)] tracking-widest uppercase italic text-center min-w-[200px]">
            LEVEL {profile?.level || '1'} <span className="text-white/30 text-xs ml-2">{profile?.impact_type || 'Innovator'}</span>
          </div>
        </div>

        {/* Right Side (Bio & Stats) */}
        <div className="flex-1 space-y-12 text-center lg:text-left">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-3 px-6 py-2 glass-million border-brand-cyan/20">
              <ShieldCheck className="w-5 h-5 text-brand-cyan" />
              <span className="text-sm font-black text-brand-cyan tracking-[0.3em] uppercase">Reputation: {profile?.reputation_score || '100'}%</span>
            </div>
            <h2 className="text-5xl md:text-8xl font-black italic tracking-tighter leading-none break-words">
              {profile?.username?.toUpperCase() || 'IDENTITY'} <span className="bg-gradient-to-r from-brand-blue to-brand-purple bg-clip-text text-transparent italic">{profile?.impact_type?.toUpperCase() || 'GUARDIAN'}</span>
            </h2>
            <p className="text-lg md:text-2xl text-white/40 max-w-xl font-medium px-4 lg:px-0">
              {profile?.bio || 'Initializing Aura... Community impact engine active.'} 
              {!profile?.bio && <span className="text-brand-blue ml-2 cursor-pointer hover:underline" onClick={handleEditOpen}>#DefineIdentity</span>}
            </p>
          </div>

          {/* NFT Badge Showcase */}
          <div className="space-y-6 px-4 lg:px-0">
            <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20">Digital Certificates of Impact</h3>
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 md:gap-6">
              <NFTBadge label="Eco Sentinel" type="Rare" color="text-green-400 border-green-400/20" icon={<Leaf />} />
              <NFTBadge label="Civic Alpha" type="Legendary" color="text-brand-blue border-brand-blue/20" icon={<Globe />} />
              <NFTBadge label="Founder" type="Unique" color="text-brand-pink border-brand-pink/20" icon={<Award />} />
            </div>
          </div>

          {/* Hosted Missions Section */}
          {myMissions.length > 0 && (
            <div className="space-y-6 px-4 lg:px-0">
              <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-brand-purple/60">My Hosted Missions</h3>
              <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                {myMissions.map((m) => (
                  <div key={m.id} className="px-6 py-4 glass-million border-brand-purple/20 bg-brand-purple/5 flex items-center gap-3 group hover:border-brand-purple/50 transition-all cursor-pointer">
                    <div className="w-2 h-2 rounded-full bg-brand-purple shadow-[0_0_10px_rgba(146,0,255,1)]" />
                    <span className="text-xs font-black italic uppercase tracking-tight truncate max-w-[150px]">{m.title}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-8 md:gap-12 pt-12 border-t border-white/5 mx-4 lg:mx-0">
             <ImpactStat label="Carbon Offset" value="4.2t" color="text-brand-blue" />
             <ImpactStat label="Aura Points" value={profile?.aura_points?.toLocaleString() || '0'} color="text-brand-purple" />
             <ImpactStat label="Proofs" value="24" color="text-brand-pink" />
          </div>
        </div>
      </div>
    </section>
  )
}

const NFTBadge = ({ label, type, color, icon }: any) => (
  <motion.div 
    whileHover={{ y: -10, rotate: -2, boxShadow: '0 0 30px rgba(255,255,255,0.05)' }}
    className={`w-36 h-48 glass-million p-4 flex flex-col items-center justify-center text-center gap-3 border ${color} relative overflow-hidden group`}
  >
    <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity" />
    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-2">
      {icon}
    </div>
    <div className="font-black italic text-[10px] tracking-tighter uppercase leading-none">{label}</div>
    <div className={`text-[8px] font-black uppercase tracking-widest opacity-40`}>{type}</div>
  </motion.div>
)

const ImpactStat = ({ label, value, color }: any) => (
  <div className="text-center sm:text-left">
    <div className={`text-5xl font-black italic tracking-tighter ${color}`}>{value}</div>
    <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mt-2">{label}</div>
  </div>
)
