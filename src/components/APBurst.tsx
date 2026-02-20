import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'

export const APBurst = ({ amount, isVisible, onComplete }: { amount: number, isVisible: boolean, onComplete: () => void }) => {
  const [particles, setParticles] = useState<any[]>([])

  useEffect(() => {
    if (isVisible) {
      const newParticles = Array.from({ length: 12 }).map((_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 400,
        y: (Math.random() - 0.5) * 400,
        scale: Math.random() * 1.5 + 0.5
      }))
      setParticles(newParticles)
      
      const timer = setTimeout(() => {
        onComplete()
        setParticles([])
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [isVisible])

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center pointer-events-none">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 2, opacity: 0 }}
            className="relative"
          >
            <div className="text-7xl font-black italic text-brand-blue drop-shadow-[0_0_30px_rgba(0,210,255,1)] flex items-center gap-4">
              <Sparkles className="w-12 h-12 fill-current" />
              +{amount.toLocaleString()} AP
            </div>

            {particles.map((p) => (
              <motion.div
                key={p.id}
                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                animate={{ x: p.x, y: p.y, opacity: 0, scale: p.scale }}
                transition={{ duration: 2, ease: 'easeOut' }}
                className="absolute top-1/2 left-1/2 w-4 h-4 bg-brand-blue rounded-full blur-[2px]"
              />
            ))}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
