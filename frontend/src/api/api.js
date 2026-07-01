// FlowForge AI — Real API Client
// Replaces mockApi.js with HTTP calls to Spring Boot backend

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

function getToken() {
  return localStorage.getItem('ff_token')
}

function headers(extra = {}) {
  const h = { 'Content-Type': 'application/json', ...extra }
  const token = getToken()
  if (token) h['Authorization'] = `Bearer ${token}`
  return h
}

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: headers(options.headers),
  })
  if (res.status === 401) {
    localStorage.removeItem('ff_token')
    localStorage.removeItem('ff_user')
    window.location.href = '/login'
    throw new Error('Unauthorized')
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(err.error || err.message || 'Request failed')
  }
  if (res.status === 204) return null
  return res.json()
}

// ========================
// AUTH
// ========================
export async function login(email, password) {
  const data = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
  localStorage.setItem('ff_token', data.token)
  localStorage.setItem('ff_user', JSON.stringify(data.user))
  return data
}

export async function register(name, email, password) {
  const data = await request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  })
  localStorage.setItem('ff_token', data.token)
  localStorage.setItem('ff_user', JSON.stringify(data.user))
  return data
}

export function logout() {
  localStorage.removeItem('ff_token')
  localStorage.removeItem('ff_user')
}

export function getCurrentUser() {
  const u = localStorage.getItem('ff_user')
  return u ? JSON.parse(u) : null
}

export function isAuthenticated() {
  return !!getToken()
}

export async function fetchMe() {
  return request('/auth/me')
}

// ========================
// USERS
// ========================
export async function fetchUsers() {
  return request('/users')
}

export async function fetchUser(id) {
  return request(`/users/${id}`)
}

export async function updateUser(id, data) {
  return request(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) })
}

// ========================
// PROJECTS
// ========================
export async function fetchProjects(category) {
  const params = category && category !== 'All' ? `?category=${category}` : ''
  return request(`/projects${params}`)
}

export async function fetchProject(id) {
  return request(`/projects/${id}`)
}

export async function createProject(data) {
  return request('/projects', { method: 'POST', body: JSON.stringify(data) })
}

export async function updateProject(id, data) {
  return request(`/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) })
}

export async function deleteProject(id) {
  return request(`/projects/${id}`, { method: 'DELETE' })
}

export async function addProjectMember(projectId, userId) {
  return request(`/projects/${projectId}/members`, {
    method: 'POST', body: JSON.stringify({ userId })
  })
}

// ========================
// TASKS
// ========================
export async function fetchTasks(projectId) {
  return request(`/projects/${projectId}/tasks`)
}

export async function fetchTask(taskId) {
  return request(`/tasks/${taskId}`)
}

export async function createTask(projectId, data) {
  return request(`/projects/${projectId}/tasks`, {
    method: 'POST', body: JSON.stringify(data)
  })
}

export async function updateTask(taskId, data) {
  return request(`/tasks/${taskId}`, {
    method: 'PUT', body: JSON.stringify(data)
  })
}

export async function updateTaskStatus(taskId, status) {
  return request(`/tasks/${taskId}/status`, {
    method: 'PUT', body: JSON.stringify({ status })
  })
}

export async function deleteTask(taskId) {
  return request(`/tasks/${taskId}`, { method: 'DELETE' })
}

// ========================
// COMMENTS
// ========================
export async function fetchComments(taskId) {
  return request(`/tasks/${taskId}/comments`)
}

export async function addComment(taskId, content) {
  return request(`/tasks/${taskId}/comments`, {
    method: 'POST', body: JSON.stringify({ content })
  })
}

// ========================
// CHANNELS & MESSAGES
// ========================
export async function fetchChannels() {
  return request('/channels')
}

export async function fetchMessages(channelId) {
  return request(`/channels/${channelId}/messages`)
}

export async function sendMessage(channelId, content) {
  return request(`/channels/${channelId}/messages`, {
    method: 'POST', body: JSON.stringify({ content })
  })
}

export async function toggleReaction(messageId, emoji) {
  return request(`/channels/messages/${messageId}/reactions`, {
    method: 'POST', body: JSON.stringify({ emoji })
  })
}

export async function createChannel(name, type) {
  return request('/channels', {
    method: 'POST', body: JSON.stringify({ name, type })
  })
}

// ========================
// NOTIFICATIONS
// ========================
export async function fetchNotifications() {
  return request('/notifications')
}

export async function markNotificationRead(id) {
  return request(`/notifications/${id}/read`, { method: 'PUT' })
}

export async function markAllNotificationsRead() {
  return request('/notifications/read-all', { method: 'PUT' })
}

// ========================
// AI
// ========================
export async function sendAiChat(message, conversationId) {
  return request('/ai/chat', {
    method: 'POST',
    body: JSON.stringify({ message, conversationId })
  })
}

export async function generateTasksFromDescription(description) {
  return request('/ai/tasks-from-description', {
    method: 'POST', body: JSON.stringify({ description })
  })
}

export async function getAiSummary(projectId) {
  return request('/ai/summary', {
    method: 'POST', body: JSON.stringify({ projectId: String(projectId) })
  })
}

export async function simulateWhatIf(description) {
  return request('/ai/simulate', {
    method: 'POST', body: JSON.stringify({ description })
  })
}

export async function fetchAiConversations() {
  return request('/ai/conversations')
}

export async function fetchAiConversationMessages(convId) {
  return request(`/ai/conversations/${convId}/messages`)
}
