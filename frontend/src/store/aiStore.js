import { create } from 'zustand'
import * as api from '@/api/api'

export const useAIStore = create((set, get) => ({
  messages: [],
  conversationId: null,
  conversations: [],
  loading: false,
  suggestedActions: [
    { icon: 'schema', label: 'Generate project roadmap' },
    { icon: 'search_insights', label: 'Identify bottleneck tasks' },
    { icon: 'summarize', label: 'Summarize weekly progress' },
  ],

  fetchConversations: async () => {
    try {
      const conversations = await api.fetchAiConversations()
      set({ conversations })
    } catch (err) {
      console.error('fetchConversations error:', err)
    }
  },

  loadConversation: async (convId) => {
    try {
      const messages = await api.fetchAiConversationMessages(convId)
      const formatted = messages.map((m, i) => ({
        id: i,
        role: m.role.toLowerCase(),
        content: m.content,
        metadata: m.metadata,
        createdAt: m.createdAt,
      }))
      set({ messages: formatted, conversationId: convId })
    } catch (err) {
      console.error('loadConversation error:', err)
    }
  },

  sendMessage: async (content) => {
    const userMsg = { id: Date.now(), role: 'user', content }
    set({ messages: [...get().messages, userMsg], loading: true })

    try {
      const response = await api.sendAiChat(content, get().conversationId)
      const aiMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        content: response.content,
        metadata: response.metadata,
      }
      set({
        messages: [...get().messages, aiMsg],
        conversationId: response.conversationId,
        loading: false,
      })
    } catch (err) {
      console.error('AI chat error:', err)
      set({ loading: false })
    }
  },

  clearMessages: () => set({ messages: [], conversationId: null }),
}))
