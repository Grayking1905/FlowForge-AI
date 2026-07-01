import { create } from 'zustand'
import * as api from '@/api/api'

export const useNotificationStore = create((set, get) => ({
  notifications: [],
  loading: false,

  fetchNotifications: async () => {
    try {
      const notifications = await api.fetchNotifications()
      set({ notifications })
    } catch (err) {
      console.error('fetchNotifications error:', err)
    }
  },

  addNotification: (notification) => {
    set({ notifications: [notification, ...get().notifications] })
  },

  markRead: async (id) => {
    await api.markNotificationRead(id)
    set({ notifications: get().notifications.map(n => n.id === id ? { ...n, read: true } : n) })
  },

  markAllRead: async () => {
    await api.markAllNotificationsRead()
    set({ notifications: get().notifications.map(n => ({ ...n, read: true })) })
  },

  unreadCount: () => get().notifications.filter(n => !n.read).length,
}))
