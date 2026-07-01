import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useNotificationStore } from '@/store/notificationStore'
import { useTeamStore } from '@/store/teamStore'
import { connectWebSocket, disconnectWebSocket, subscribeToNotifications } from '@/api/websocket'
import AppLayout from '@/components/layout/AppLayout'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import Dashboard from '@/pages/Dashboard'
import Projects from '@/pages/Projects'
import Tasks from '@/pages/Tasks'
import Team from '@/pages/Team'
import AIAssistant from '@/pages/AIAssistant'
import Settings from '@/pages/Settings'

function ProtectedRoute({ children }) {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated)
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

export default function App() {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated)
  const user = useAuthStore(s => s.user)

  useEffect(() => {
    if (isAuthenticated && user) {
      // Fetch initial data
      useNotificationStore.getState().fetchNotifications()
      useTeamStore.getState().fetchUsers()

      // Connect WebSocket and subscribe to notifications
      connectWebSocket(() => {
        subscribeToNotifications(user.id, (notification) => {
          useNotificationStore.getState().addNotification(notification)
        })
      })

      return () => disconnectWebSocket()
    }
  }, [isAuthenticated, user])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="projects" element={<Projects />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="team" element={<Team />} />
          <Route path="ai" element={<AIAssistant />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
