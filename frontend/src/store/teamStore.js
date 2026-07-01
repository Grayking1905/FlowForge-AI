import { create } from 'zustand'
import * as api from '@/api/api'
import { subscribeToChannel, unsubscribeFromChannel } from '@/api/websocket'

export const useTeamStore = create((set, get) => ({
  users: [],
  channels: [],
  messages: [],
  activeChannel: 2, // #development
  loading: false,

  fetchUsers: async () => {
    try {
      const users = await api.fetchUsers()
      set({ users })
    } catch (err) {
      console.error('fetchUsers error:', err)
    }
  },

  fetchChannels: async () => {
    try {
      const channels = await api.fetchChannels()
      set({ channels })
    } catch (err) {
      console.error('fetchChannels error:', err)
    }
  },

  fetchMessages: async (channelId) => {
    set({ loading: true })
    try {
      const cid = channelId || get().activeChannel
      const messages = await api.fetchMessages(cid)
      set({ messages, loading: false })
    } catch (err) {
      console.error('fetchMessages error:', err)
      set({ loading: false })
    }
  },

  setActiveChannel: (channelId) => {
    const prev = get().activeChannel
    if (prev) unsubscribeFromChannel(prev)
    set({ activeChannel: channelId })
    get().fetchMessages(channelId)
    // Subscribe to real-time messages for this channel
    subscribeToChannel(channelId, (msg) => {
      set(state => {
        // Avoid duplicates
        if (state.messages.some(m => m.id === msg.id)) return state
        return { messages: [...state.messages, msg] }
      })
    })
  },

  sendMessage: async (content) => {
    try {
      // Send via REST — WebSocket subscription will add the message
      await api.sendMessage(get().activeChannel, content)
    } catch (err) {
      console.error('sendMessage error:', err)
    }
  },

  toggleReaction: async (messageId, emoji) => {
    try {
      await api.toggleReaction(messageId, emoji)
      // Refresh messages to get updated reactions
      get().fetchMessages()
    } catch (err) {
      console.error('toggleReaction error:', err)
    }
  },

  getUserById: (id) => get().users.find(u => u.id === id),
}))
