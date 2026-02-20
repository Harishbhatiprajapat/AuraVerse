import { motion, AnimatePresence } from 'framer-motion'
import { X, Upload, ShieldCheck, MapPin, Camera, Sparkles, Loader2, CheckCircle } from 'lucide-react'
import { useState } from 'react'

export const ImpactProofModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const [step, setStep] = useState<'upload' | 'scanning' | 'success'>('upload')

  const handleUpload = () => {
    setStep('scanning')
    setTimeout(() => setStep('success'), 3000)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-brand-navy/95 backdrop-blur-3xl"
          />
          <motion.div
            initial={{ scale: 0.8, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, y: 50, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-4xl glass-million p-12 md:p-16 border-brand-blue/30 overflow-hidden shadow-[0_0_100px_rgba(0,210,255,0.2)]"
          >
            {/* Animated Laser Scan Effect */}
            {step === 'scanning' && (
              <motion.div 
                initial={{ top: '0%' }}
                animate={{ top: '100%' }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="absolute left-0 right-0 h-[2px] bg-brand-blue/60 z-10 shadow-[0_0_20px_rgba(0,210,255,1)]"
              />
            )}

            <button 
              onClick={() => { onClose(); setStep('upload'); }}
              className="absolute top-10 right-10 p-3 glass-million hover:bg-white/10 transition-all z-20"
            >
              <X className="w-8 h-8" />
            </button>

            <AnimatePresence mode="wait">
              {step === 'upload' && (
                <motion.div 
                  key="upload"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-12"
                >
                  <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                    <div className="w-16 h-16 bg-brand-blue/20 rounded-2xl flex items-center justify-center border border-brand-blue/30 shadow-lg shrink-0">
                      <ShieldCheck className="w-9 h-9 text-brand-blue" />
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter truncate">Impact Proof Ledger</h2>
                      <p className="text-brand-blue font-black uppercase tracking-[0.4em] text-[10px] mt-1">Immutable Verification Node v4.0</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 overflow-y-auto max-h-[60vh] md:max-h-none pr-2">
                    <div className="space-y-6">
                      <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">1. Verification Source</label>
                      <div className="grid grid-cols-2 gap-4">
                        <SourceButton icon={<Camera className="w-6 h-6" />} label="Visual" active />
                        <SourceButton icon={<MapPin className="w-6 h-6" />} label="Geo-Sync" />
                      </div>
                      <div className="p-8 glass-million bg-white/5 border-white/5 space-y-4">
                         <div className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">Active Mission</div>
                         <div className="text-xl font-black italic uppercase tracking-tight text-brand-blue">Plastic Free Week Challenge</div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">2. Authenticate Evidence</label>
                      <div 
                        onClick={handleUpload}
                        className="border-2 border-dashed border-white/10 rounded-[2rem] p-16 text-center hover:border-brand-blue/50 hover:bg-brand-blue/5 transition-all cursor-pointer group"
                      >
                        <Upload className="w-16 h-16 mx-auto mb-6 text-white/10 group-hover:text-brand-blue group-hover:scale-110 transition-all" />
                        <p className="text-xl font-black italic uppercase tracking-tight text-white/40 group-hover:text-white">Initialize Upload</p>
                        <p className="text-[10px] text-white/10 mt-3 font-black uppercase tracking-[0.3em]">AI-Ready Nodes Connected</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 'scanning' && (
                <motion.div 
                  key="scanning"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-[400px] flex flex-col items-center justify-center text-center space-y-8"
                >
                  <div className="relative">
                    <Loader2 className="w-32 h-32 text-brand-blue animate-spin opacity-20" />
                    <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 text-brand-blue animate-pulse" />
                  </div>
                  <h3 className="text-4xl font-black italic uppercase tracking-tighter animate-pulse text-brand-blue">AI Analyzing Evidence...</h3>
                  <p className="text-white/40 font-black uppercase tracking-[0.5em] text-xs">Matching metadata with impact ledger</p>
                </motion.div>
              )}

              {step === 'success' && (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="h-[400px] flex flex-col items-center justify-center text-center space-y-8"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 10, stiffness: 100 }}
                  >
                    <CheckCircle className="w-32 h-32 text-brand-cyan shadow-[0_0_50px_rgba(0,255,255,0.4)]" />
                  </motion.div>
                  <h3 className="text-5xl font-black italic uppercase tracking-tighter text-brand-cyan">Impact Verified!</h3>
                  <div className="px-10 py-4 glass-million border-brand-cyan/20 bg-brand-cyan/5">
                    <span className="text-2xl font-black text-white italic">+1,200 <span className="text-brand-cyan">Aura Points</span> Awarded</span>
                  </div>
                  <button 
                    onClick={() => { onClose(); setStep('upload'); }}
                    className="px-12 py-5 bg-brand-cyan text-brand-navy font-black text-xl rounded-2xl hover:scale-105 transition-all shadow-[0_0_30px_rgba(0,255,255,0.4)] uppercase italic"
                  >
                    Return to Mission Hub
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

const SourceButton = ({ icon, label, active = false }: any) => (
  <button className={`flex flex-col items-center gap-3 p-8 rounded-[1.5rem] border transition-all ${active ? 'bg-brand-blue/10 border-brand-blue/50 text-brand-blue shadow-[0_0_30px_rgba(0,210,255,0.2)]' : 'bg-white/5 border-white/5 text-white/30 hover:text-white hover:border-white/20'}`}>
    {icon}
    <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
  </button>
)
