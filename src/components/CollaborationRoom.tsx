import { useState, useEffect, useRef } from 'react'
import { MessageSquare, Send, Users, Circle, Loader2 } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAura } from '../hooks/useAura'
import { motion, AnimatePresence } from 'framer-motion'

export const CollaborationRoom = () => {
  const { profile } = useAura()
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchMessages()

    const channel = supabase
      .channel('chat-room')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          setMessages((prev) => [...prev, payload.new])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const fetchMessages = async () => {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: true })
      .limit(50)
    
    setMessages(data || [])
    setLoading(false)
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !profile) return

    const msg = {
      user_id: profile.id,
      username: profile.username,
      content: newMessage,
    }

    setNewMessage('')
    const { error } = await supabase.from('messages').insert([msg])
    if (error) console.error('Chat Error:', error)
  }

  return (
    <section className="px-6 py-24 md:px-24">
       <div className="flex items-center gap-6 mb-10">
          <div className="w-16 h-16 bg-brand-pink/20 rounded-2xl flex items-center justify-center border border-brand-pink/30 shadow-[0_0_30px_rgba(255,0,255,0.2)]">
            <MessageSquare className="w-8 h-8 text-brand-pink" />
          </div>
          <div>
            <h2 className="text-4xl font-black italic uppercase tracking-tighter">Impact Room</h2>
            <div className="flex items-center gap-2">
              <Circle className="w-2 h-2 fill-green-400 text-green-400 animate-pulse" />
              <p className="text-white/40 font-bold uppercase tracking-widest text-[10px]">Real-time Community Chat</p>
            </div>
          </div>
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 h-[600px]">
        {/* Sidebar: Active Teams */}
        <div className="lg:col-span-1 glass-card p-6 overflow-y-auto space-y-6 border-white/5">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/30 mb-4">Active Channels</h3>
          <TeamItem name="Global Feed" members={messages.length} active />
          <TeamItem name="Eco Guardians" members={12} />
          <TeamItem name="Civic Pulse" members={24} />
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-3 glass-card flex flex-col overflow-hidden border-brand-pink/20 bg-brand-navy/20">
          <div ref={scrollRef} className="flex-1 p-8 overflow-y-auto space-y-6 scroll-smooth">
            {loading ? (
              <div className="h-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-brand-pink animate-spin" />
              </div>
            ) : (
              messages.map((msg) => (
                <ChatMessage 
                  key={msg.id}
                  user={msg.username} 
                  message={msg.content} 
                  time={new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} 
                  isMe={msg.user_id === profile?.id}
                />
              ))
            )}
          </div>

          {/* Input Bar */}
          <form onSubmit={sendMessage} className="p-6 bg-white/5 border-t border-white/5 backdrop-blur-3xl">
            <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus-within:border-brand-pink/50 transition-all">
              <input 
                type="text" 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Share your impact or ask for collaborators..."
                className="bg-transparent focus:outline-none font-medium text-sm w-full"
              />
              <button 
                type="submit"
                className="p-2 bg-brand-pink rounded-xl shadow-[0_0_15px_rgba(255,0,255,0.4)] hover:scale-110 transition-all disabled:opacity-50"
                disabled={!newMessage.trim()}
              >
                <Send className="w-5 h-5 text-white" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}

const TeamItem = ({ name, members, active = false }: { name: string, members: number, active?: boolean }) => (
  <div className={`p-4 rounded-2xl border cursor-pointer transition-all ${active ? 'bg-brand-pink/10 border-brand-pink/30 shadow-[0_0_15px_rgba(255,0,255,0.1)]' : 'border-white/5 hover:bg-white/5'}`}>
    <div className="font-black text-sm italic uppercase tracking-tight mb-1">{name}</div>
    <div className="flex items-center gap-2 text-white/30 text-[10px] font-bold uppercase tracking-widest">
      <Users className="w-3 h-3" /> {members} active
    </div>
  </div>
)

const ChatMessage = ({ user, message, time, isMe = false }: { user: string, message: string, time: string, isMe?: boolean }) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className={`flex gap-4 ${isMe ? 'flex-row-reverse' : ''}`}
  >
    <img 
      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user}`} 
      className="w-10 h-10 rounded-full bg-white/5 border border-white/10"
    />
    <div className={`max-w-[70%] ${isMe ? 'text-right' : ''}`}>
      <div className={`flex items-center gap-2 mb-1 ${isMe ? 'flex-row-reverse' : ''}`}>
        <span className="text-xs font-black italic uppercase tracking-tight">{user}</span>
        <span className="text-[10px] font-black uppercase tracking-widest opacity-30">{time}</span>
      </div>
      <div className={`p-4 rounded-2xl text-sm leading-relaxed ${isMe ? 'bg-brand-pink/20 border border-brand-pink/30 rounded-tr-none' : 'bg-white/5 border border-white/10 rounded-tl-none'}`}>
        {message}
      </div>
    </div>
  </motion.div>
)
