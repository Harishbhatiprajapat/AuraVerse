import { motion } from 'framer-motion'
import { Sparkles, ArrowRight, Zap, Globe, Heart } from 'lucide-react'

export const Hero = ({ onActionClick }: { onActionClick: () => void }) => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-32 pb-48 overflow-hidden bg-[#020208]">
      {/* Dynamic Liquid background */}
      <div className="absolute top-1/4 left-1/4 w-[1000px] h-[1000px] bg-brand-blue/10 rounded-full blur-[180px] animate-liquid z-0" />
      <div className="absolute bottom-1/4 right-1/4 w-[1000px] h-[1000px] bg-brand-purple/10 rounded-full blur-[180px] animate-liquid z-0" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 text-center px-6 max-w-7xl mx-auto"
      >
        <motion.div
          whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(0, 210, 255, 0.3)' }}
          className="inline-flex items-center gap-3 px-8 py-3 rounded-full glass-million border-brand-blue/30 mb-12 backdrop-blur-3xl"
        >
          <Sparkles className="w-5 h-5 text-brand-blue animate-pulse" />
          <span className="text-xs font-black tracking-[0.4em] uppercase text-brand-blue">AuraVerse Alpha v1.0</span>
        </motion.div>

        <h1 className="text-6xl sm:text-8xl md:text-[12rem] lg:text-[14rem] font-[900] italic tracking-tightest leading-[0.8] mb-12 uppercase break-words">
          <span className="bg-gradient-to-r from-brand-blue via-brand-cyan to-brand-blue bg-clip-text text-transparent drop-shadow-[0_0_50px_rgba(0,210,255,0.4)]">Aura</span>
          <br />
          <span className="text-white/20 hover:text-white transition-colors duration-1000 italic">Verse.</span>
        </h1>

        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12 mt-20">
           <FeatureBadge icon={<Globe className="w-6 h-6" />} label="Planet Impact" />
           <FeatureBadge icon={<Zap className="w-6 h-6" />} label="Gamified Energy" />
           <FeatureBadge icon={<Heart className="w-6 h-6" />} label="Community Aura" />
        </div>

        <p className="max-w-3xl mx-auto text-lg md:text-2xl lg:text-3xl font-medium text-white/40 mb-20 leading-snug mt-20 px-4">
          The next-gen digital ecosystem where your <span className="text-white">creative energy</span> transforms into <span className="text-brand-blue">real-world impact</span>. Join the million-dollar movement.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 md:gap-10 px-4">
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 60px rgba(0, 210, 255, 0.4)' }}
            whileTap={{ scale: 0.95 }}
            onClick={onActionClick}
            className="w-full sm:w-auto px-10 md:px-16 py-6 md:py-8 bg-brand-blue text-brand-navy font-black rounded-3xl flex items-center justify-center gap-4 text-xl md:text-2xl transition-all duration-300 shadow-[0_20px_60px_-15px_rgba(0,210,255,0.6)] uppercase italic"
          >
            Launch Prototype <ArrowRight className="w-6 h-6 md:w-8 md:h-8" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
            whileTap={{ scale: 0.95 }}
            className="w-full sm:w-auto px-10 md:px-16 py-6 md:py-8 glass-million border border-white/20 text-white font-black rounded-3xl text-xl md:text-2xl uppercase italic tracking-widest"
          >
            Watch Trailer
          </motion.button>
        </div>
      </motion.div>

      {/* Floating Interactive Elements */}
      <motion.div
        animate={{ y: [0, -30, 0], rotate: [12, 15, 12] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[15%] left-[10%] w-48 h-48 glass-million rounded-[3rem] opacity-30 flex items-center justify-center shadow-2xl border-brand-blue/20"
      >
         <Zap className="w-20 h-20 text-brand-blue" />
      </motion.div>

      <motion.div
        animate={{ y: [0, 30, 0], rotate: [-12, -15, -12] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-[20%] right-[10%] w-64 h-64 glass-million rounded-[4rem] opacity-30 flex items-center justify-center shadow-2xl border-brand-purple/20"
      >
         <Heart className="w-24 h-24 text-brand-purple" />
      </motion.div>
    </section>
  )
}

const FeatureBadge = ({ icon, label }: any) => (
  <div className="flex flex-col items-center gap-4 group">
    <div className="w-16 h-16 glass-million flex items-center justify-center text-white/40 group-hover:text-white group-hover:border-white/30 transition-all">
      {icon}
    </div>
    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 group-hover:text-white/60">{label}</span>
  </div>
)
