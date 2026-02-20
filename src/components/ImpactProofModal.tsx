import { motion, AnimatePresence } from 'framer-motion'
import { X, Upload, ShieldCheck, Sparkles, Loader2, CheckCircle } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { useAura } from '../hooks/useAura'

export const ImpactProofModal = ({ isOpen, onClose, mission: initialMission, onSuccess }: { isOpen: boolean, onClose: () => void, mission: any, onSuccess: (amount: number) => void }) => {
  const [step, setStep] = useState<'upload' | 'scanning' | 'success'>('upload')
  const { verifyImpact, uploadEvidence, missions, refresh } = useAura()
  const [selectedMission, setSelectedMission] = useState<any>(initialMission)
  const [reward, setReward] = useState(0)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (initialMission) setSelectedMission(initialMission)
    if (missions.length === 0) refresh()
  }, [initialMission, missions.length])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !selectedMission) {
      if (!selectedMission) alert('Please select a mission first!')
      return
    }

    // Show preview
    const reader = new FileReader()
    reader.onloadend = () => setPreviewUrl(reader.result as string)
    reader.readAsDataURL(file)

    setStep('scanning')

    try {
      console.log('🚀 Initializing Upload for mission:', selectedMission.id)
      
      // 1. Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await uploadEvidence(file)
      if (uploadError) {
        console.error('❌ Upload Error:', uploadError)
        throw new Error('Upload failed: ' + (uploadError.message || 'Check storage permissions'))
      }
      console.log('✅ File Uploaded:', uploadData.publicUrl)

      // 2. Verify with AI Engine
      console.log('🤖 Triggering AI Verification...')
      const { data: verifyData, error: verifyError } = await verifyImpact(selectedMission.id, uploadData.publicUrl)
      
      if (verifyError) {
        console.error('❌ Verification Error:', verifyError)
        throw new Error('Verification Error: ' + (verifyError.message || 'Edge function failed'))
      }
      
      console.log('✨ Verification Data Received:', verifyData)

      if (verifyData && verifyData.status === 'verified') {
        const points = selectedMission.reward_ap
        console.log('🎉 Mission Verified! Reward:', points)
        setReward(points)
        setStep('success')
        onSuccess(points)
        refresh() // Refresh profile data
      } else {
        console.warn('⚠️ Verification Rejected:', verifyData)
        throw new Error(verifyData?.message || 'AI could not verify impact authenticity')
      }
    } catch (err: any) {
      console.error('💥 Flow Error:', err)
      alert(err.message || 'Could not complete verification')
      setStep('upload')
      setPreviewUrl(null)
    }
  }

  const triggerFilePicker = () => {
    if (!selectedMission) {
      alert('Please select an active mission from the list first.')
      return
    }
    fileInputRef.current?.click()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-brand-navy/95 backdrop-blur-3xl" />
          
          <motion.div
            initial={{ scale: 0.8, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, y: 50, opacity: 0 }}
            className="relative w-full max-w-5xl glass-million p-8 md:p-16 border-brand-blue/30 overflow-hidden shadow-2xl"
          >
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />

            <button onClick={() => { onClose(); setStep('upload'); setPreviewUrl(null); }} className="absolute top-8 right-8 p-3 glass-million hover:bg-white/10 z-20">
              <X className="w-6 h-6" />
            </button>

            <AnimatePresence mode="wait">
              {step === 'upload' && (
                <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
                  <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                    <div className="w-16 h-16 bg-brand-blue/20 rounded-2xl flex items-center justify-center border border-brand-blue/30 shadow-lg shrink-0">
                      <ShieldCheck className="w-9 h-9 text-brand-blue" />
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter truncate">Impact Proof</h2>
                      <p className="text-brand-blue font-black uppercase tracking-[0.4em] text-[10px]">Secure Verification Node v4.0</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="space-y-8">
                      <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">1. Select Active Mission</label>
                        <div className="grid grid-cols-1 gap-3 max-h-[300px] overflow-y-auto pr-2">
                          {missions.length > 0 ? missions.map((m) => (
                            <button
                              key={m.id}
                              onClick={() => setSelectedMission(m)}
                              className={`p-5 rounded-2xl border text-left transition-all ${selectedMission?.id === m.id ? 'bg-brand-blue/20 border-brand-blue shadow-[0_0_20px_rgba(0,210,255,0.2)]' : 'bg-white/5 border-white/10 hover:border-white/30'}`}
                            >
                              <div className="font-black italic uppercase tracking-tight text-sm mb-1">{m.title}</div>
                              <div className="text-[10px] font-bold text-brand-blue uppercase">{m.reward_ap} AP Reward</div>
                            </button>
                          )) : (
                            <div className="p-8 text-center glass-million text-white/20 uppercase tracking-widest text-xs">No Missions Available</div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-8">
                      <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">2. Submit Evidence</label>
                      <div 
                        onClick={triggerFilePicker}
                        className={`relative border-2 border-dashed rounded-[2.5rem] p-16 text-center transition-all cursor-pointer group ${selectedMission ? 'border-brand-blue/40 hover:bg-brand-blue/5' : 'border-white/5 opacity-50 cursor-not-allowed'}`}
                      >
                        {previewUrl ? (
                          <div className="absolute inset-4 rounded-[2rem] overflow-hidden">
                            <img src={previewUrl} className="w-full h-full object-cover" alt="Preview" />
                            <div className="absolute inset-0 bg-brand-navy/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                               <p className="font-black italic uppercase text-xs">Change Photo</p>
                            </div>
                          </div>
                        ) : (
                          <>
                            <Upload className="w-16 h-16 mx-auto mb-6 text-white/10 group-hover:text-brand-blue group-hover:scale-110 transition-all" />
                            <p className="text-xl font-black italic uppercase tracking-tight text-white/40 group-hover:text-white">Initialize Upload</p>
                            <p className="text-[10px] text-white/10 mt-3 font-black uppercase tracking-[0.3em]">AI-Ready Nodes Connected</p>
                          </>
                        )}
                      </div>
                      
                      {!selectedMission && (
                        <p className="text-center text-xs font-bold text-brand-blue animate-pulse uppercase tracking-widest">← Please select a mission to unlock upload</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 'scanning' && (
                <motion.div key="scanning" className="h-[500px] flex flex-col items-center justify-center text-center space-y-8">
                   <div className="relative">
                    <Loader2 className="w-32 h-32 text-brand-blue animate-spin opacity-20" />
                    <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 text-brand-blue animate-pulse" />
                  </div>
                  <h3 className="text-4xl font-black italic uppercase tracking-tighter animate-pulse text-brand-blue">AI Analyzing Evidence...</h3>
                  <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden">
                    <motion.div initial={{ x: '-100%' }} animate={{ x: '100%' }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }} className="w-1/2 h-full bg-brand-blue shadow-[0_0_15px_rgba(0,210,255,1)]" />
                  </div>
                </motion.div>
              )}

              {step === 'success' && (
                <motion.div key="success" className="h-[500px] flex flex-col items-center justify-center text-center space-y-8">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 10, stiffness: 100 }}>
                    <CheckCircle className="w-32 h-32 text-brand-cyan shadow-[0_0_50px_rgba(0,255,255,0.4)]" />
                  </motion.div>
                  <h3 className="text-5xl font-black italic uppercase tracking-tighter text-brand-cyan">Impact Verified!</h3>
                  <div className="px-10 py-4 glass-million border-brand-cyan/20 bg-brand-cyan/5">
                    <span className="text-2xl font-black text-white italic">+{reward.toLocaleString()} <span className="text-brand-cyan">Aura Points</span> Awarded</span>
                  </div>
                  <button onClick={() => { onClose(); setStep('upload'); setPreviewUrl(null); }} className="px-12 py-5 bg-brand-cyan text-brand-navy font-black text-xl rounded-2xl hover:scale-105 transition-all shadow-[0_0_30px_rgba(0,255,255,0.4)] uppercase italic">Return to Mission Hub</button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
