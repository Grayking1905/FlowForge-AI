import { useState, useRef, useEffect } from 'react'
import { useAIStore } from '@/store/aiStore'

export default function AIAssistant() {
  const { messages, loading, sendMessage, suggestedActions } = useAIStore()
  const [input, setInput] = useState('')
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const handleSend = (text) => {
    const msg = text || input.trim()
    if (!msg) return
    sendMessage(msg)
    setInput('')
  }

  return (
    <div className="flex h-full overflow-hidden animate-fade-in relative">
      {/* Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-tertiary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="flex-1 flex flex-col md:flex-row h-full overflow-hidden">
        {/* Chat Interface */}
        <div className="flex-1 flex flex-col h-full max-w-4xl mx-auto w-full p-4 md:p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-primary/10">
            <div>
              <h2 className="text-2xl font-semibold text-primary">Forge Assistant</h2>
              <p className="text-on-surface-variant text-sm mt-1">Powered by Glacier Intelligence</p>
            </div>
            <div className="flex gap-2">
              <button className="p-2 glass-panel rounded-lg text-on-surface-variant hover:text-primary transition-colors">
                <span className="material-symbols-outlined">tune</span>
              </button>
              <button className="p-2 glass-panel rounded-lg text-on-surface-variant hover:text-primary transition-colors">
                <span className="material-symbols-outlined">share</span>
              </button>
            </div>
          </div>

          {/* Chat History */}
          <div className="flex-1 overflow-y-auto pr-4 space-y-6 scrollbar-hide flex flex-col pb-4">
            <div className="text-center text-xs text-on-surface-variant uppercase tracking-widest my-2">Session Started • Today, 09:41 AM</div>

            {messages.map(msg => (
              <div key={msg.id}>
                {msg.role === 'user' ? (
                  <div className="flex justify-end w-full animate-slide-in-right">
                    <div className="max-w-[80%] glass-panel bg-primary/5 border-primary/20 rounded-2xl rounded-tr-sm p-4">
                      <p className="text-sm">{msg.content}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-start w-full gap-4 animate-slide-in-left">
                    <div className="w-8 h-8 shrink-0 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mt-1">
                      <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
                    </div>
                    <div className="max-w-[85%] glass-elevated rounded-2xl rounded-tl-sm p-5 space-y-4">
                      <p className="text-sm">{msg.content}</p>

                      {/* Roadmap */}
                      {msg.roadmap && (
                        <div className="bg-surface-container-low/50 rounded-xl p-4 border border-outline-variant/30">
                          <h4 className="text-primary font-semibold text-sm mb-2 flex items-center gap-2">
                            <span className="material-symbols-outlined text-[16px]">map</span> Roadmap Draft
                          </h4>
                          <ul className="space-y-2 text-sm text-on-surface-variant">
                            {msg.roadmap.map((phase, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="material-symbols-outlined text-primary text-[16px] mt-0.5">
                                  {phase.done ? 'check_circle' : 'radio_button_unchecked'}
                                </span>
                                <span><strong>{phase.phase}:</strong> {phase.description}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Bottlenecks */}
                      {msg.bottlenecks && (
                        <div className="space-y-2">
                          <p className="text-sm font-semibold text-tertiary">Potential Bottlenecks:</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {msg.bottlenecks.map((b, i) => (
                              <div key={i} className={`glass-panel p-3 rounded-lg ${b.severity === 'error' ? 'border-error/20' : 'border-tertiary/20'}`}>
                                <div className={`flex items-center gap-2 mb-1 ${b.severity === 'error' ? 'text-error' : 'text-tertiary'}`}>
                                  <span className="material-symbols-outlined text-[16px]">{b.severity === 'error' ? 'warning' : 'group_work'}</span>
                                  {b.title}
                                </div>
                                <p className="text-xs text-on-surface-variant">{b.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Generated Tasks */}
                      {msg.generatedTasks && (
                        <div className="bg-surface-container-low/50 rounded-xl p-4 border border-outline-variant/30">
                          <h4 className="text-primary font-semibold text-sm mb-3 flex items-center gap-2">
                            <span className="material-symbols-outlined text-[16px]">assignment</span> Generated Tasks
                          </h4>
                          <div className="space-y-2">
                            {msg.generatedTasks.map((t, i) => (
                              <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-surface-container/50 border border-outline-variant/20">
                                <span className="material-symbols-outlined text-primary text-[16px]">check_box_outline_blank</span>
                                <span className="text-sm text-on-surface flex-1">{t.title}</span>
                                <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-primary/10 text-primary border border-primary/20">{t.tag}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Metrics */}
                      {msg.metrics && (
                        <div className="grid grid-cols-2 gap-3">
                          {Object.entries(msg.metrics).map(([key, val]) => (
                            <div key={key} className="bg-surface-container-low/50 rounded-lg p-3 border border-outline-variant/20">
                              <div className="text-[10px] text-on-surface-variant uppercase tracking-wider mb-1">{key.replace(/([A-Z])/g, ' $1')}</div>
                              <div className="text-sm font-semibold text-on-surface">{val}</div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Scenarios */}
                      {msg.scenarios && (
                        <div className="bg-surface-container-low/50 rounded-xl p-4 border border-outline-variant/30">
                          <h4 className="text-primary font-semibold text-sm mb-3 flex items-center gap-2">
                            <span className="material-symbols-outlined text-[16px]">analytics</span> Timeline Projections
                          </h4>
                          <div className="space-y-2">
                            {msg.scenarios.map((s, i) => (
                              <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-surface-container/50 border border-outline-variant/20">
                                <span className="text-sm text-on-surface">{s.name}</span>
                                <div className="flex items-center gap-3">
                                  <span className="text-sm font-semibold text-primary">{s.weeks} weeks</span>
                                  <span className="text-[10px] text-on-surface-variant bg-surface-variant px-1.5 py-0.5 rounded-sm">{s.confidence}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-2 mt-4 pt-4 border-t border-outline-variant/20">
                        <button className="text-xs px-3 py-1.5 glass-panel rounded-md hover:bg-primary/10 hover:text-primary transition-colors flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">add_task</span> Convert to Tasks
                        </button>
                        <button className="text-xs px-3 py-1.5 glass-panel rounded-md hover:bg-primary/10 hover:text-primary transition-colors flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">edit</span> Refine Timeline
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Loading indicator */}
            {loading && (
              <div className="flex justify-start w-full gap-4">
                <div className="w-8 h-8 shrink-0 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mt-1">
                  <span className="material-symbols-outlined text-primary text-sm animate-pulse" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
                </div>
                <div className="glass-elevated rounded-2xl rounded-tl-sm p-5">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="mt-4 shrink-0 relative">
            {/* Suggested Actions */}
            <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide text-xs">
              {suggestedActions.map((action, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(action.label)}
                  className="shrink-0 px-4 py-2 glass-panel rounded-full text-on-surface-variant hover:text-primary hover:bg-primary/5 transition-all border-primary/20 flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[14px]">{action.icon}</span> {action.label}
                </button>
              ))}
            </div>

            {/* Input Box */}
            <div className="relative glass-elevated rounded-2xl p-2 flex items-end gap-2 glow-interactive transition-all duration-300">
              <button className="p-2 text-on-surface-variant hover:text-primary transition-colors shrink-0">
                <span className="material-symbols-outlined">attach_file</span>
              </button>
              <textarea
                className="w-full bg-transparent border-none text-on-surface text-sm placeholder:text-on-surface-variant/50 resize-none focus:ring-0 p-2 min-h-[44px] max-h-32 overflow-y-auto focus:outline-none"
                placeholder="Ask me to create a project or suggest tasks..."
                rows="1"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
              />
              <button onClick={() => handleSend()} className="p-2 bg-primary/20 text-primary rounded-xl hover:bg-primary/30 transition-colors shrink-0 border border-primary/30">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>send</span>
              </button>
            </div>
            <div className="text-center mt-2 text-[10px] text-on-surface-variant/60">AI can make mistakes. Consider verifying critical project details.</div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="hidden xl:flex flex-col w-72 border-l border-primary/10 bg-surface-container-lowest/40 backdrop-blur-md p-6 h-full overflow-y-auto">
          <h3 className="text-sm font-semibold text-on-surface mb-4 tracking-wide uppercase">AI Context</h3>
          <div className="space-y-6">
            <div>
              <div className="text-xs text-on-surface-variant mb-2">Currently referencing</div>
              <div className="glass-panel p-3 rounded-xl border-primary/20 flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-[20px]">folder</span>
                <div>
                  <div className="text-sm font-medium">Global Workspace</div>
                  <div className="text-xs text-on-surface-variant mt-1">12 Active Projects</div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-on-surface mb-3 tracking-wide uppercase">Automations</h3>
              <div className="space-y-2">
                <div className="glass-panel p-3 rounded-xl hover:bg-primary/5 cursor-pointer transition-colors group">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-tertiary group-hover:text-tertiary-fixed transition-colors">Daily Standup</span>
                    <span className="material-symbols-outlined text-[16px] text-on-surface-variant">bolt</span>
                  </div>
                  <p className="text-xs text-on-surface-variant">Summarize team progress every morning at 9 AM.</p>
                </div>
                <div className="glass-panel p-3 rounded-xl hover:bg-primary/5 cursor-pointer transition-colors group">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-secondary group-hover:text-secondary-fixed transition-colors">Risk Alert</span>
                    <span className="material-symbols-outlined text-[16px] text-on-surface-variant">warning</span>
                  </div>
                  <p className="text-xs text-on-surface-variant">Notify when tasks are 2 days past due.</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-on-surface mb-3 tracking-wide uppercase">Recent Chats</h3>
              <ul className="space-y-2">
                {['Resource allocation for Dev Team', 'Draft project charter', 'Review Q2 deliverables'].map((chat, i) => (
                  <li key={i} className="text-xs text-on-surface-variant hover:text-primary cursor-pointer truncate flex items-center gap-2">
                    <span className="material-symbols-outlined text-[14px]">chat_bubble</span> {chat}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
