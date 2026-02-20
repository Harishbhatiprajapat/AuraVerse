import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Rocket, Globe, Users, Trophy, Image as ImageIcon } from 'lucide-react'
import { useState } from 'react'
import { useAura } from '../hooks/useAura'

export const HostMissionModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const [missionType, setMissionType] = useState('Environmental')
  const [title, setTitle] = useState('')
  const [reward, setReward] = useState('1000')
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80')
  const [isDeploying, setIsDeploying] = useState(false)
  const { createMission } = useAura()

  const handleHost = async () => {
    if (!title || !description) return
    
    setIsDeploying(true)
    try {
      const { data, error } = await createMission({
        title,
        description,
        reward_ap: parseInt(reward),
        mission_type: missionType,
        image_url: imageUrl
      })

      if (!error && data) {
        onClose()
        setTitle('')
        setDescription('')
      } else {
        alert('Deployment failed: ' + (error as any)?.message)
      }
    } catch (e: any) {
      alert('Error deploying mission')
    } finally {
      setIsDeploying(false)
    }
  }

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
            className="relative w-full max-w-4xl glass-card p-12 border-brand-purple/30 shadow-[0_0_50px_rgba(146,0,255,0.2)]"
          >
            {isDeploying && (
              <div className="absolute inset-0 z-50 flex items-center justify-center bg-brand-navy/60 backdrop-blur-sm rounded-[inherit]">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 border-4 border-brand-purple/20 border-t-brand-purple rounded-full animate-spin" />
                  <p className="text-brand-purple font-black uppercase tracking-widest text-xs italic">Deploying to Verse...</p>
                </div>
              </div>
            )}
            {/* ... rest of the modal */}
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
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Urban Reforestation Drive"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-purple/50 transition-all font-bold"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Cover Image URL</label>
                  <div className="relative group">
                    <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <input 
                      type="text" 
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 focus:outline-none focus:border-brand-purple/50 transition-all font-medium text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Mission Brief</label>
                  <textarea 
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the impact goals and requirements..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-purple/50 transition-all font-medium text-sm resize-none"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Reward (AP ✨)</label>
                  <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl px-6 py-4">
                    <Trophy className="w-5 h-5 text-brand-purple" />
                    <input 
                      type="number" 
                      value={reward}
                      onChange={(e) => setReward(e.target.value)}
                      className="bg-transparent focus:outline-none font-black text-xl w-full"
                    />
                  </div>
                </div>

                <div className="p-6 rounded-3xl bg-brand-purple/10 border border-brand-purple/20">
                   <div className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-purple/60 mb-2">Image Preview</div>
                   <div className="h-24 rounded-xl overflow-hidden">
                      <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.src = 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80')} />
                   </div>
                </div>
              </div>
            </div>

            <button 
              onClick={handleHost}
              className="w-full mt-10 py-6 bg-gradient-to-r from-brand-purple to-brand-pink text-white font-black text-xl rounded-2xl shadow-[0_0_40px_rgba(146,0,255,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-widest italic"
            >
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
