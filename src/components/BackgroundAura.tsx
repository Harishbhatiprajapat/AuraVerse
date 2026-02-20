import { motion } from 'framer-motion'

export const BackgroundAura = () => {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-[#020208] pointer-events-none">
      <motion.div
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
        className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-brand-blue/5 blur-[80px] will-change-transform"
      />
      <motion.div
        animate={{
          x: [0, -60, 0],
          y: [0, -40, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className="absolute -bottom-[10%] -right-[10%] w-[60%] h-[60%] rounded-full bg-brand-purple/5 blur-[100px] will-change-transform"
      />
      {/* Static noise texture is better for performance than dynamic svg filters */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
    </div>
  )
}
