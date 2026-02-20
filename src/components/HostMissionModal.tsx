import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Rocket, Globe, Users, Trophy } from 'lucide-react'
import { useState } from 'react'

export const HostMissionModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const [missionType, setMissionType] = useState('Environmental')

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-brand-navy/90 backdrop-blur-md"
          />
          <motion.div
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            className="relative w-full max-w-3xl glass-card p-12 border-brand-purple/30 shadow-[0_0_50px_rgba(146,0,255,0.2)]"
          >
            <button 
              onClick={onClose}
              className="absolute top-8 right-8 p-2 glass-card hover:bg-white/10"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex flex-col sm:flex-row items-center gap-6 mb-10 text-center sm:text-left">
              <div className="w-16 h-16 bg-brand-purple/20 rounded-2xl flex items-center justify-center border border-brand-purple/30 shrink-0">
                <Plus className="w-8 h-8 text-brand-purple" />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter">Host a Mission</h2>
                <p className="text-brand-purple font-bold uppercase tracking-widest text-[10px] md:text-xs">Empower your community. Earn Aura rewards.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 overflow-y-auto max-h-[60vh] md:max-h-none pr-2">
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Mission Category</label>
                  <div className="grid grid-cols-3 gap-3">
                    <TypeButton active={missionType === 'Environmental'} onClick={() => setMissionType('Environmental')} label="Eco" icon={<Globe className="w-4 h-4" />} />
                    <TypeButton active={missionType === 'Civic'} onClick={() => setMissionType('Civic')} label="Civic" icon={<Users className="w-4 h-4" />} />
                    <TypeButton active={missionType === 'Creative'} onClick={() => setMissionType('Creative')} label="Idea" icon={<Rocket className="w-4 h-4" />} />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Mission Title</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Urban Reforestation Drive"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-purple/50 transition-all font-bold"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Reward (AP ✨)</label>
                  <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl px-6 py-4">
                    <Trophy className="w-5 h-5 text-brand-purple" />
                    <input 
                      type="number" 
                      placeholder="1000"
                      className="bg-transparent focus:outline-none font-black text-xl w-full"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Mission Brief</label>
                  <textarea 
                    rows={6}
                    placeholder="Describe the impact goals and requirements..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-purple/50 transition-all font-medium text-sm resize-none"
                  />
                </div>

                <div className="p-6 rounded-3xl bg-brand-purple/10 border border-brand-purple/20">
                  <div className="flex items-center gap-3 mb-2">
                    <Rocket className="w-5 h-5 text-brand-purple" />
                    <span className="text-sm font-bold">Verification AI</span>
                  </div>
                  <p className="text-[11px] text-white/50 leading-relaxed">
                    Our AI models will automatically scan proof submissions for this mission to ensure authenticity.
                  </p>
                </div>
              </div>
            </div>

            <button className="w-full mt-10 py-6 bg-gradient-to-r from-brand-purple to-brand-pink text-white font-black text-xl rounded-2xl shadow-[0_0_40px_rgba(146,0,255,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-widest italic">
              Deploy Mission to AuraVerse
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

const TypeButton = ({ active, onClick, label, icon }: { active: boolean, onClick: () => void, label: string, icon: React.ReactNode }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${active ? 'bg-brand-purple/20 border-brand-purple text-brand-purple shadow-[0_0_15px_rgba(146,0,255,0.2)]' : 'border-white/5 text-white/40 hover:border-white/20'}`}
  >
    {icon}
    <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
  </button>
)
