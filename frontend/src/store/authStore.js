import { create } from 'zustand'
import * as api from '@/api/api'

export const useAuthStore = create((set) => ({
  user: api.getCurrentUser(),
  token: null,
  isAuthenticated: api.isAuthenticated(),
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null })
    try {
      const { token, user } = await api.login(email, password)
      set({ user, token, isAuthenticated: true, loading: false })
    } catch (err) {
      set({ error: err.message, loading: false })
    }
  },

  register: async (name, email, password) => {
    set({ loading: true, error: null })
    try {
      const { token, user } = await api.register(name, email, password)
      set({ user, token, isAuthenticated: true, loading: false })
    } catch (err) {
      set({ error: err.message, loading: false })
    }
  },

  logout: async () => {
    api.logout()
    set({ user: null, token: null, isAuthenticated: false })
  },

  clearError: () => set({ error: null }),
}))
