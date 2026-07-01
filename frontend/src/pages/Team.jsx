import { useEffect, useState, useRef } from 'react'
import { useTeamStore } from '@/store/teamStore'

export default function Team() {
  const { channels, messages, activeChannel, fetchUsers, fetchChannels, fetchMessages, setActiveChannel, sendMessage, users } = useTeamStore()
  const [input, setInput] = useState('')
  const messagesEndRef = useRef(null)

  useEffect(() => {
    fetchUsers()
    fetchChannels()
    fetchMessages()
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = () => {
    if (!input.trim()) return
    sendMessage(input.trim())
    setInput('')
  }

  const activeChannelData = channels.find(c => c.id === activeChannel)
  const directMessages = users.filter(u => u.id !== 1).slice(0, 3)

  const getUserById = (id) => users.find(u => u.id === id)

  return (
    <div className="flex h-full overflow-hidden animate-fade-in relative">
      {/* Background */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" style={{ background: 'radial-gradient(circle at 70% 30%, rgba(125,211,252,0.15) 0%, transparent 60%)' }} />

      <div className="flex flex-1 relative z-10 p-4 gap-4 overflow-hidden">
        {/* Channel Sidebar */}
        <div className="w-64 hidden md:flex flex-col gap-4 shrink-0 glass-panel rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(125,211,252,0.03)]">
          <div className="p-4 border-b border-primary/10 flex items-center justify-between bg-surface-container-low/50">
            <h2 className="font-semibold text-on-surface">FlowForge HQ</h2>
            <button className="text-on-surface-variant hover:text-primary transition-colors">
              <span className="material-symbols-outlined">edit_square</span>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-3 pb-4">
            {/* Channels */}
            <div className="mb-6">
              <div className="flex items-center justify-between px-2 mb-2 group">
                <h3 className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Channels</h3>
                <button className="text-on-surface-variant opacity-0 group-hover:opacity-100 hover:text-primary transition-all">
                  <span className="material-symbols-outlined text-sm">add</span>
                </button>
              </div>
              <div className="space-y-0.5">
                {channels.map(ch => (
                  <button
                    key={ch.id}
                    onClick={() => setActiveChannel(ch.id)}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                      activeChannel === ch.id
                        ? 'bg-primary/10 text-primary border-l-2 border-primary'
                        : 'text-on-surface-variant hover:bg-primary/5 hover:text-on-surface'
                    }`}
                  >
                    <span className={`${activeChannel === ch.id ? 'text-primary/70' : 'text-on-surface-variant/70'} text-lg`}>#</span>
                    <span className={`text-sm ${activeChannel === ch.id ? 'font-semibold' : ''}`}>{ch.name}</span>
                    {ch.unread > 0 && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Direct Messages */}
            <div>
              <div className="flex items-center justify-between px-2 mb-2 group">
                <h3 className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Direct Messages</h3>
                <button className="text-on-surface-variant opacity-0 group-hover:opacity-100 hover:text-primary transition-all">
                  <span className="material-symbols-outlined text-sm">add</span>
                </button>
              </div>
              <div className="space-y-1">
                {directMessages.map(u => (
                  <button key={u.id} className="w-full flex items-center gap-3 px-2 py-2 rounded-lg text-on-surface-variant hover:bg-primary/5 hover:text-on-surface transition-colors">
                    <div className="relative">
                      {u.avatar ? (
                        <img className="w-6 h-6 rounded-full object-cover border border-primary/20" src={u.avatar} alt={u.name} />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-surface-variant flex items-center justify-center border border-outline-variant text-[10px] font-bold">{u.initials}</div>
                      )}
                      <div className={`absolute bottom-0 right-0 w-2 h-2 rounded-full border border-surface ${u.status === 'online' ? 'bg-green-500' : u.status === 'away' ? 'bg-yellow-500' : 'bg-outline'}`} />
                    </div>
                    <span className="text-sm truncate">{u.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col glass-elevated rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(125,211,252,0.06)] relative">
          {/* Chat Header */}
          <div className="h-16 px-6 border-b border-primary/10 flex items-center justify-between bg-surface-container-low/80 shrink-0">
            <div className="flex items-center gap-4">
              <div>
                <h2 className="font-bold text-lg text-on-surface flex items-center gap-2">
                  <span className="text-primary/70 text-xl">#</span> {activeChannelData?.name || 'general'}
                </h2>
                <p className="text-xs text-on-surface-variant mt-0.5 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[14px]">group</span> 12 members
                  <span className="w-1 h-1 rounded-full bg-outline-variant" />
                  Engineering updates and API discussions.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 rounded-xl text-on-surface-variant hover:bg-primary/10 hover:text-primary transition-colors">
                <span className="material-symbols-outlined">search</span>
              </button>
              <button className="p-2 rounded-xl text-on-surface-variant hover:bg-primary/10 hover:text-primary transition-colors">
                <span className="material-symbols-outlined">more_horiz</span>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
            <div className="flex items-center justify-center relative my-2">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-outline-variant/30" /></div>
              <span className="relative px-4 text-xs font-semibold text-on-surface-variant bg-surface-dim rounded-full py-1 border border-outline-variant/30">Today, Jul 1</span>
            </div>

            {messages.map(msg => {
              const isCurrentUser = msg.isCurrentUser
              const isSystem = msg.isSystem

              return (
                <div key={msg.id} className={`flex gap-4 group ${isCurrentUser ? 'bg-primary/5 -mx-6 px-6 py-3 border-l-2 border-primary' : ''}`}>
                  {/* Avatar */}
                  {isSystem ? (
                    <div className="w-10 h-10 rounded-full bg-tertiary-container flex items-center justify-center shrink-0 border border-tertiary/30 mt-1">
                      <span className="text-on-tertiary-container font-bold text-sm">AI</span>
                    </div>
                  ) : msg.userAvatar ? (
                    <img className={`w-10 h-10 rounded-full object-cover shrink-0 border mt-1 ${isCurrentUser ? 'border-primary/50 shadow-[0_0_10px_rgba(125,211,252,0.2)]' : 'border-primary/20 shadow-sm'}`} src={msg.userAvatar} alt={msg.userName} />
                  ) : null}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className={`font-semibold ${isCurrentUser ? 'text-primary' : isSystem ? 'text-tertiary' : 'text-on-surface'}`}>
                        {isCurrentUser ? 'You' : isSystem ? 'System Bot' : msg.userName}
                      </span>
                      {isSystem && <span className="bg-tertiary/20 text-tertiary text-[9px] uppercase px-1.5 py-0.5 rounded-xs font-bold tracking-wider">Automated</span>}
                      <span className="text-xs text-on-surface-variant">{msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</span>
                    </div>
                    <div className="text-sm text-on-surface/90 leading-relaxed max-w-3xl">{msg.content}</div>

                    {/* Embed */}
                    {msg.embed && (
                      <div className="glass-panel p-4 rounded-xl border border-outline-variant max-w-md flex items-start gap-4 mt-3">
                        <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center shrink-0 border border-green-500/30">
                          <span className="material-symbols-outlined text-green-400">check_circle</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm text-on-surface mb-1">{msg.embed.title}</h4>
                          <p className="text-xs text-on-surface-variant mb-2">{msg.embed.subtitle}</p>
                          <button className="text-xs font-semibold text-primary hover:underline">View Logs</button>
                        </div>
                      </div>
                    )}

                    {/* Reactions */}
                    {msg.reactions?.length > 0 && (
                      <div className="mt-2 flex gap-2">
                        {msg.reactions.map((r, i) => (
                          <button key={i} className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-surface-variant border border-outline-variant/50 text-xs text-on-surface-variant hover:border-primary/50 hover:text-primary transition-colors">
                            <span className="material-symbols-outlined text-[14px]">{r.emoji}</span>
                            <span>{r.count}</span>
                          </button>
                        ))}
                        {msg.threadCount > 0 && (
                          <button className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-primary hover:bg-primary/10 transition-colors text-xs font-semibold">
                            {msg.threadCount} replies
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-surface-container-low/90 backdrop-blur-md border-t border-primary/10 shrink-0">
            <div className="glass-panel rounded-2xl flex flex-col glow-focus transition-all duration-300">
              <textarea
                className="w-full bg-transparent border-none text-on-surface text-sm p-4 placeholder-on-surface-variant/50 focus:ring-0 resize-none focus:outline-none"
                placeholder={`Message #${activeChannelData?.name || 'general'}...`}
                rows="1"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
              />
              <div className="flex items-center justify-between px-3 pb-3">
                <div className="flex items-center gap-1">
                  <button className="p-2 rounded-lg text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-colors" title="Formatting">
                    <span className="material-symbols-outlined text-[20px]">format_bold</span>
                  </button>
                  <button className="p-2 rounded-lg text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-colors" title="Attach file">
                    <span className="material-symbols-outlined text-[20px]">attach_file</span>
                  </button>
                  <button className="p-2 rounded-lg text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-colors" title="Emoji">
                    <span className="material-symbols-outlined text-[20px]">mood</span>
                  </button>
                  <div className="w-px h-5 bg-outline-variant/50 mx-1" />
                  <button className="p-2 rounded-lg text-tertiary hover:bg-tertiary/10 transition-colors flex items-center gap-1.5" title="Generate with AI">
                    <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider hidden sm:block">AI Draft</span>
                  </button>
                </div>
                <button onClick={handleSend} className="w-8 h-8 rounded-lg bg-primary/20 text-primary border border-primary/30 flex items-center justify-center hover:bg-primary/40 transition-colors hover:shadow-[0_0_15px_rgba(125,211,252,0.4)]">
                  <span className="material-symbols-outlined text-[18px]">send</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar: AI Context */}
        <aside className="w-80 hidden lg:flex flex-col gap-4 shrink-0 overflow-y-auto pb-4">
          {/* Thread Context */}
          <div className="glass-panel p-5 rounded-2xl border-t border-l border-tertiary/20 relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-tertiary/20 rounded-full blur-2xl group-hover:bg-tertiary/30 transition-all duration-500" />
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className="flex items-center gap-2 text-tertiary">
                <span className="material-symbols-outlined">psychology</span>
                <h3 className="font-semibold text-sm">Thread Context</h3>
              </div>
              <button className="text-on-surface-variant hover:text-tertiary transition-colors">
                <span className="material-symbols-outlined text-[18px]">refresh</span>
              </button>
            </div>
            <div className="space-y-3 relative z-10">
              <p className="text-xs text-on-surface/80 leading-relaxed">
                <strong className="text-on-surface">Summary:</strong> The team is finalizing the new WebSocket integration. Marcus deployed PR #402 to staging, reducing latency to ~40ms.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="px-2 py-1 rounded-sm bg-tertiary/10 border border-tertiary/20 text-[10px] text-tertiary font-semibold tracking-wide uppercase">Performance</span>
                <span className="px-2 py-1 rounded-sm bg-surface-variant border border-outline-variant text-[10px] text-on-surface-variant font-semibold tracking-wide uppercase">Backend</span>
              </div>
            </div>
          </div>

          {/* Suggested Actions */}
          <div className="glass-panel p-5 rounded-2xl flex-1 flex flex-col">
            <h3 className="font-semibold text-sm text-on-surface mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[18px]">task_alt</span> Suggested Actions
            </h3>
            <div className="space-y-3 flex-1">
              {['Review PR #402', 'Check Design System UI'].map((action, i) => (
                <div key={i} className="p-3 rounded-xl bg-surface-container-low/50 border border-outline-variant/30 hover:border-primary/30 transition-colors cursor-pointer group">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5"><div className="w-4 h-4 rounded-sm border border-on-surface-variant/50 group-hover:border-primary transition-colors" /></div>
                    <p className="text-sm text-on-surface font-medium group-hover:text-primary transition-colors">{action}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-4 w-full py-2.5 rounded-lg border border-outline-variant text-xs font-semibold text-on-surface-variant hover:text-primary hover:border-primary/50 transition-colors flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-[16px]">add_task</span> Add to Board
            </button>
          </div>
        </aside>
      </div>
    </div>
  )
}
