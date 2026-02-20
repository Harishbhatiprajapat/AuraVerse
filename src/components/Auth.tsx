import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { Zap, Mail, Lock, User, ArrowRight, Github } from 'lucide-react'

export const Auth = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
      } else {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        alert('Verification email sent! Check your inbox.')
      }
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#020208] relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-brand-blue/10 rounded-full blur-[150px] animate-liquid" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-brand-purple/10 rounded-full blur-[150px] animate-liquid" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-xl glass-million p-12 md:p-16 border-white/5 shadow-2xl relative z-10"
      >
        <div className="flex flex-col items-center text-center mb-12">
          <div className="w-20 h-20 bg-brand-blue/20 rounded-3xl flex items-center justify-center border border-brand-blue/30 shadow-[0_0_30px_rgba(0,210,255,0.3)] mb-8">
            <Zap className="w-10 h-10 text-brand-blue fill-current" />
          </div>
          <h1 className="text-5xl font-black italic uppercase tracking-tighter mb-4">
            {isLogin ? 'Welcome Back' : 'Join AuraVerse'}
          </h1>
          <p className="text-white/40 font-bold uppercase tracking-[0.3em] text-[10px]">
            {isLogin ? 'Reconnect with your impact' : 'Start your creative impact journey'}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-4">Email Node</label>
            <div className="relative group">
              <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-brand-blue transition-colors" />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="aura_guardian@impact.co"
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-16 pr-6 py-5 focus:outline-none focus:border-brand-blue/50 transition-all font-medium text-lg"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-4">Access Key</label>
            <div className="relative group">
              <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-brand-blue transition-colors" />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-16 pr-6 py-5 focus:outline-none focus:border-brand-blue/50 transition-all font-medium text-lg"
              />
            </div>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold text-center"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <button 
            disabled={loading}
            className="w-full py-6 bg-brand-blue text-brand-navy font-black text-xl rounded-2xl shadow-[0_20px_40px_-10px_rgba(0,210,255,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all uppercase italic flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {loading ? 'Processing...' : isLogin ? 'Initialize Aura' : 'Create Identity'} 
            {!loading && <ArrowRight className="w-6 h-6" />}
          </button>
        </form>

        <div className="mt-12 pt-12 border-t border-white/5 flex flex-col items-center gap-8">
          <p className="text-white/30 font-bold uppercase tracking-widest text-[10px]">Or continue with</p>
          <div className="flex gap-4">
             <SocialButton icon={<Github className="w-6 h-6" />} />
             <SocialButton icon={<User className="w-6 h-6" />} />
          </div>
          
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-brand-blue font-black uppercase tracking-widest text-[10px] hover:text-white transition-colors"
          >
            {isLogin ? "New to the Verse? Create Account" : "Already a Guardian? Sign In"}
          </button>
        </div>
      </motion.div>
    </div>
  )
}

const SocialButton = ({ icon, onClick }: { icon: React.ReactNode, onClick?: () => void }) => (
  <button 
    onClick={onClick}
    type="button"
    className="w-16 h-16 glass-million flex items-center justify-center text-white/40 hover:text-white hover:border-brand-blue/50 transition-all cursor-pointer"
  >
    {icon}
  </button>
)
