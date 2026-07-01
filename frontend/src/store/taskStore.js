import { create } from 'zustand'
import * as api from '@/api/api'

export const useTaskStore = create((set, get) => ({
  tasks: [],
  loading: false,

  fetchTasks: async (projectId = null) => {
    set({ loading: true })
    try {
      // If no projectId, fetch from project 1 (Nexus) as default
      const tasks = await api.fetchTasks(projectId || 1)
      set({ tasks, loading: false })
    } catch (err) {
      console.error('fetchTasks error:', err)
      set({ loading: false })
    }
  },

  createTask: async (data) => {
    const projectId = data.projectId || 1
    const task = await api.createTask(projectId, data)
    set({ tasks: [...get().tasks, task] })
    return task
  },

  updateTask: async (id, data) => {
    const task = await api.updateTask(id, data)
    set({ tasks: get().tasks.map(t => t.id === id ? task : t) })
    return task
  },

  deleteTask: async (id) => {
    await api.deleteTask(id)
    set({ tasks: get().tasks.filter(t => t.id !== id) })
  },

  moveTask: async (taskId, newStatus) => {
    const task = await api.updateTaskStatus(taskId, newStatus)
    set({ tasks: get().tasks.map(t => t.id === taskId ? task : t) })
  },

  getTasksByStatus: (status) => {
    return get().tasks.filter(t => t.status === status)
  },
}))
