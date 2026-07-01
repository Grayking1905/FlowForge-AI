import { create } from 'zustand'
import * as api from '@/api/api'

export const useProjectStore = create((set, get) => ({
  projects: [],
  selectedProject: null,
  loading: false,
  filter: { category: 'All', status: null },

  fetchProjects: async () => {
    set({ loading: true })
    try {
      const projects = await api.fetchProjects(get().filter.category)
      set({ projects, loading: false })
    } catch (err) {
      console.error('fetchProjects error:', err)
      set({ loading: false })
    }
  },

  setFilter: (filter) => {
    set({ filter: { ...get().filter, ...filter } })
    get().fetchProjects()
  },

  getProject: async (id) => {
    const project = await api.fetchProject(id)
    set({ selectedProject: project })
    return project
  },

  createProject: async (data) => {
    const project = await api.createProject(data)
    set({ projects: [...get().projects, project] })
    return project
  },

  updateProject: async (id, data) => {
    const project = await api.updateProject(id, data)
    set({ projects: get().projects.map(p => p.id === id ? project : p) })
    return project
  },

  deleteProject: async (id) => {
    await api.deleteProject(id)
    set({ projects: get().projects.filter(p => p.id !== id) })
  },
}))
