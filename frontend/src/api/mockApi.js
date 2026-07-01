// Mock API layer for FlowForge AI
import { SEED_USERS, SEED_PROJECTS, SEED_TASKS, SEED_CHANNELS, SEED_MESSAGES, SEED_NOTIFICATIONS } from './seedData'

const STORAGE_PREFIX = 'flowforge_'

function getStore(key) {
  try {
    const data = localStorage.getItem(STORAGE_PREFIX + key)
    return data ? JSON.parse(data) : null
  } catch { return null }
}

function setStore(key, data) {
  localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(data))
}

function initStore(key, seedData) {
  if (!getStore(key)) setStore(key, seedData)
  return getStore(key)
}

// Initialize all stores
export function initializeData() {
  initStore('users', SEED_USERS)
  initStore('projects', SEED_PROJECTS)
  initStore('tasks', SEED_TASKS)
  initStore('channels', SEED_CHANNELS)
  initStore('messages', SEED_MESSAGES)
  initStore('notifications', SEED_NOTIFICATIONS)
  initStore('currentUser', SEED_USERS[0])
}

// Simulate network delay
const delay = (ms = 200) => new Promise(r => setTimeout(r, ms))

// ===== AUTH =====
export const authApi = {
  async login(email, password) {
    await delay(500)
    const users = getStore('users')
    const user = users.find(u => u.email === email)
    if (!user) throw new Error('Invalid credentials')
    const token = btoa(JSON.stringify({ userId: user.id, exp: Date.now() + 86400000 }))
    setStore('currentUser', user)
    setStore('token', token)
    return { token, user }
  },

  async register(name, email, password) {
    await delay(500)
    const users = getStore('users')
    if (users.find(u => u.email === email)) throw new Error('Email already exists')
    const newUser = { id: Date.now(), name, email, role: 'developer', avatar: null, initials: name.split(' ').map(n => n[0]).join(''), status: 'online' }
    users.push(newUser)
    setStore('users', users)
    const token = btoa(JSON.stringify({ userId: newUser.id, exp: Date.now() + 86400000 }))
    setStore('currentUser', newUser)
    setStore('token', token)
    return { token, user: newUser }
  },

  async logout() {
    localStorage.removeItem(STORAGE_PREFIX + 'currentUser')
    localStorage.removeItem(STORAGE_PREFIX + 'token')
  },

  getCurrentUser() {
    return getStore('currentUser')
  },

  isAuthenticated() {
    return !!getStore('token')
  },
}

// ===== PROJECTS =====
export const projectApi = {
  async list(filters = {}) {
    await delay()
    let projects = getStore('projects') || []
    if (filters.category && filters.category !== 'All') {
      projects = projects.filter(p => p.category === filters.category)
    }
    if (filters.status) {
      projects = projects.filter(p => p.status === filters.status)
    }
    return projects
  },

  async get(id) {
    await delay()
    const projects = getStore('projects') || []
    return projects.find(p => p.id === id) || null
  },

  async create(data) {
    await delay(300)
    const projects = getStore('projects') || []
    const newProject = {
      id: Date.now(), ...data,
      status: 'Active', progress: 0, tasksCount: 0, completedTasks: 0, updatesCount: 0,
      teamIds: [authApi.getCurrentUser()?.id],
      createdAt: new Date().toISOString(),
    }
    projects.push(newProject)
    setStore('projects', projects)
    return newProject
  },

  async update(id, data) {
    await delay()
    const projects = getStore('projects') || []
    const idx = projects.findIndex(p => p.id === id)
    if (idx === -1) throw new Error('Project not found')
    projects[idx] = { ...projects[idx], ...data }
    setStore('projects', projects)
    return projects[idx]
  },

  async delete(id) {
    await delay()
    let projects = getStore('projects') || []
    projects = projects.filter(p => p.id !== id)
    setStore('projects', projects)
  },
}

// ===== TASKS =====
export const taskApi = {
  async list(projectId = null) {
    await delay()
    let tasks = getStore('tasks') || []
    if (projectId) tasks = tasks.filter(t => t.projectId === projectId)
    return tasks
  },

  async create(data) {
    await delay(300)
    const tasks = getStore('tasks') || []
    const newTask = { id: Date.now(), status: 'Backlog', priority: 'Medium', ...data, createdAt: new Date().toISOString() }
    tasks.push(newTask)
    setStore('tasks', tasks)
    return newTask
  },

  async update(id, data) {
    await delay()
    const tasks = getStore('tasks') || []
    const idx = tasks.findIndex(t => t.id === id)
    if (idx === -1) throw new Error('Task not found')
    tasks[idx] = { ...tasks[idx], ...data }
    setStore('tasks', tasks)
    return tasks[idx]
  },

  async delete(id) {
    await delay()
    let tasks = getStore('tasks') || []
    tasks = tasks.filter(t => t.id !== id)
    setStore('tasks', tasks)
  },

  async updateStatus(id, status) {
    return this.update(id, { status })
  },
}

// ===== TEAM =====
export const teamApi = {
  async getUsers() {
    await delay()
    return getStore('users') || []
  },

  async getChannels() {
    await delay()
    return getStore('channels') || []
  },

  async getMessages(channelId) {
    await delay()
    const messages = getStore('messages') || []
    return messages.filter(m => m.channelId === channelId)
  },

  async sendMessage(channelId, content) {
    await delay(200)
    const messages = getStore('messages') || []
    const user = authApi.getCurrentUser()
    const newMsg = {
      id: Date.now(), channelId, userId: user?.id, content,
      timestamp: new Date().toISOString(), reactions: [], threadCount: 0, isCurrentUser: true,
    }
    messages.push(newMsg)
    setStore('messages', messages)
    return newMsg
  },
}

// ===== NOTIFICATIONS =====
export const notificationApi = {
  async list() {
    await delay()
    return getStore('notifications') || []
  },

  async markRead(id) {
    const notifications = getStore('notifications') || []
    const idx = notifications.findIndex(n => n.id === id)
    if (idx !== -1) { notifications[idx].read = true; setStore('notifications', notifications) }
  },

  async markAllRead() {
    const notifications = (getStore('notifications') || []).map(n => ({ ...n, read: true }))
    setStore('notifications', notifications)
  },
}
