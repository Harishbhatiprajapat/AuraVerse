import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { Sparkles, ArrowRight, Zap, Globe, Heart } from 'lucide-react'

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.3 }
  }
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 40, filter: 'blur(10px)' },
  visible: { 
    opacity: 1, 
    y: 0, 
    filter: 'blur(0px)',
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  }
} as any // Use as any to bypass strict easing array type if needed in this motion version

export const Hero = ({ onActionClick }: { onActionClick: () => void }) => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-32 pb-48 px-6">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 text-center max-w-7xl mx-auto"
      >
        <motion.div variants={itemVariants}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center gap-3 px-8 py-3 rounded-full glass-million border-brand-blue/30 mb-12 backdrop-blur-3xl cursor-default"
          >
            <Sparkles className="w-5 h-5 text-brand-blue animate-pulse" />
            <span className="text-xs font-black tracking-[0.4em] uppercase text-brand-blue">AuraVerse Alpha v1.0</span>
          </motion.div>
        </motion.div>

        <motion.h1 
          variants={itemVariants}
          className="text-6xl sm:text-8xl md:text-[12rem] lg:text-[14rem] font-[900] italic tracking-tightest leading-[0.8] mb-12 uppercase"
        >
          <span className="bg-gradient-to-r from-brand-blue via-brand-cyan to-brand-blue bg-clip-text text-transparent drop-shadow-[0_0_50px_rgba(0,210,255,0.4)]">Aura</span>
          <br />
          <span className="text-white/10 hover:text-white transition-colors duration-1000 italic">Verse.</span>
        </motion.h1>

        <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center gap-6 md:gap-12 mt-20">
           <FeatureBadge icon={<Globe className="w-6 h-6" />} label="Planet Impact" />
           <FeatureBadge icon={<Zap className="w-6 h-6" />} label="Gamified Energy" />
           <FeatureBadge icon={<Heart className="w-6 h-6" />} label="Community Aura" />
        </motion.div>

        <motion.p 
          variants={itemVariants}
          className="max-w-3xl mx-auto text-xl md:text-2xl font-medium text-white/40 mb-20 leading-snug mt-20 px-4"
        >
          The next-gen digital ecosystem where your <span className="text-white">creative energy</span> transforms into <span className="text-brand-blue">real-world impact</span>.
        </motion.p>

        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-6 md:gap-10">
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 60px rgba(0, 210, 255, 0.4)' }}
            whileTap={{ scale: 0.95 }}
            onClick={onActionClick}
            className="w-full sm:w-auto px-12 py-8 bg-brand-blue text-brand-navy font-black rounded-3xl flex items-center justify-center gap-4 text-xl md:text-2xl transition-all duration-300 shadow-2xl uppercase italic"
          >
            Participate <ArrowRight className="w-6 h-6" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
            whileTap={{ scale: 0.95 }}
            className="w-full sm:w-auto px-12 py-8 glass-million border border-white/20 text-white font-black rounded-3xl text-xl md:text-2xl uppercase italic"
          >
            The Mission
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Animated Orbitals */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] border border-white/5 rounded-full opacity-20"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 90, repeat: Infinity, ease: 'linear' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/5 rounded-full opacity-10"
        />
      </div>
    </section>
  )
}

const FeatureBadge = ({ icon, label }: any) => (
  <motion.div 
    whileHover={{ y: -5, color: '#fff' }}
    className="flex flex-col items-center gap-4 group cursor-default"
  >
    <div className="w-16 h-16 glass-million flex items-center justify-center text-white/40 group-hover:text-brand-blue group-hover:border-brand-blue/50 transition-all">
      {icon}
    </div>
    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 group-hover:text-white/60">{label}</span>
  </motion.div>
)
