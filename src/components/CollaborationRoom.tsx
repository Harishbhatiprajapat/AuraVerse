import { MessageSquare, Send, Users, Circle } from 'lucide-react'

export const CollaborationRoom = () => {
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
              <p className="text-white/40 font-bold uppercase tracking-widest text-[10px]">1,240 Creators Online</p>
            </div>
          </div>
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 h-[600px]">
        {/* Sidebar: Active Teams */}
        <div className="lg:col-span-1 glass-card p-6 overflow-y-auto space-y-6 border-white/5">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/30 mb-4">Active Teams</h3>
          <TeamItem name="EcoGuardians" members={42} active />
          <TeamItem name="Code4Climate" members={12} />
          <TeamItem name="UrbanFixers" members={89} />
          <TeamItem name="AuraDesigners" members={34} />
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-3 glass-card flex flex-col overflow-hidden border-brand-pink/20">
          <div className="flex-1 p-8 overflow-y-auto space-y-6">
            <ChatMessage user="AuraLegend_99" message="Just finished the Plastic Free Week mission! 🌍✨" time="2m ago" />
            <ChatMessage user="EcoWarrior" message="That's awesome! I'm halfway through. The AI verification was super fast." time="1m ago" avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Eco" />
            <div className="flex items-center gap-4 py-4 opacity-30">
              <div className="h-[1px] flex-1 bg-white/20" />
              <span className="text-[10px] font-black uppercase tracking-widest">New Messages</span>
              <div className="h-[1px] flex-1 bg-white/20" />
            </div>
            <ChatMessage user="Haris (You)" message="Anyone want to join my Urban Reforestation mission this weekend?" time="Just now" isMe />
          </div>

          {/* Input Bar */}
          <div className="p-6 bg-white/5 border-t border-white/5 backdrop-blur-3xl">
            <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl px-6 py-4">
              <input 
                type="text" 
                placeholder="Share your impact or ask for collaborators..."
                className="bg-transparent focus:outline-none font-medium text-sm w-full"
              />
              <button className="p-2 bg-brand-pink rounded-xl shadow-[0_0_15px_rgba(255,0,255,0.4)] hover:scale-110 transition-all">
                <Send className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

const TeamItem = ({ name, members, active = false }: { name: string, members: number, active?: boolean }) => (
  <div className={`p-4 rounded-2xl border cursor-pointer transition-all ${active ? 'bg-brand-pink/10 border-brand-pink/30 shadow-[0_0_15px_rgba(255,0,255,0.1)]' : 'border-white/5 hover:bg-white/5'}`}>
    <div className="font-black text-sm italic uppercase tracking-tight mb-1">{name}</div>
    <div className="flex items-center gap-2 text-white/30 text-[10px] font-bold uppercase tracking-widest">
      <Users className="w-3 h-3" /> {members} Members
    </div>
  </div>
)

const ChatMessage = ({ user, message, time, isMe = false, avatar }: { user: string, message: string, time: string, isMe?: boolean, avatar?: string }) => (
  <div className={`flex gap-4 ${isMe ? 'flex-row-reverse' : ''}`}>
    <img 
      src={avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user}`} 
      className="w-10 h-10 rounded-full bg-white/5"
    />
    <div className={`max-w-[70%] ${isMe ? 'text-right' : ''}`}>
      <div className="flex items-center gap-2 mb-1 justify-end flex-row-reverse">
        <span className="text-[10px] font-black uppercase tracking-widest opacity-30">{time}</span>
        <span className="text-xs font-black italic uppercase tracking-tight">{user}</span>
      </div>
      <div className={`p-4 rounded-2xl text-sm leading-relaxed ${isMe ? 'bg-brand-pink/20 border border-brand-pink/30 rounded-tr-none' : 'bg-white/5 border border-white/10 rounded-tl-none'}`}>
        {message}
      </div>
    </div>
  </div>
)
