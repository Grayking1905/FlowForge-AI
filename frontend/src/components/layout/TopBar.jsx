import { useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useNotificationStore } from '@/store/notificationStore'

export default function TopBar() {
  const user = useAuthStore(s => s.user)
  const notifications = useNotificationStore(s => s.notifications)
  const unreadCount = notifications.filter(n => !n.read).length
  const [showNotifications, setShowNotifications] = useState(false)
  const markAllRead = useNotificationStore(s => s.markAllRead)

  return (
    <header className="flex justify-between items-center px-8 w-full sticky top-0 z-40 bg-surface/60 backdrop-blur-xl h-16 border-b border-primary/10">
      {/* Mobile Menu Toggle */}
      <button className="md:hidden text-on-surface-variant hover:text-primary p-2">
        <span className="material-symbols-outlined">menu</span>
      </button>

      {/* Search Bar */}
      <div className="flex-1 max-w-md ml-4 md:ml-0 relative group focus-within:ring-1 focus-within:ring-primary/30 rounded-lg transition-all duration-300">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">search</span>
        <input
          className="w-full bg-surface-container/50 border border-outline-variant/30 text-on-surface placeholder-on-surface-variant/50 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-primary/50 focus:bg-surface-container/80 transition-all"
          placeholder="Search projects, tasks, or ask AI..."
          type="text"
        />
      </div>

      {/* Trailing Actions */}
      <div className="flex items-center gap-4">
        <button className="hidden lg:flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold hover:bg-primary/20 hover:border-primary/40 transition-colors">
          <span className="material-symbols-outlined text-sm">bolt</span>
          Quick Action
        </button>

        <div className="flex items-center gap-2 border-l border-outline-variant/30 pl-4 ml-2">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 text-on-surface-variant hover:text-primary rounded-full hover:bg-surface-bright/50 transition-all relative"
            >
              <span className="material-symbols-outlined">notifications</span>
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full animate-pulse" />
              )}
            </button>

            {/* Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 top-12 w-80 glass-elevated rounded-xl p-4 animate-fade-in-up z-50">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-sm text-on-surface">Notifications</h3>
                  <button onClick={markAllRead} className="text-xs text-primary hover:underline">Mark all read</button>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {notifications.map(n => (
                    <div key={n.id} className={`flex items-start gap-3 p-2 rounded-lg text-sm ${!n.read ? 'bg-primary/5' : ''}`}>
                      <span className={`material-symbols-outlined text-sm mt-0.5 ${n.type === 'error' ? 'text-error' : n.type === 'ai' ? 'text-tertiary' : 'text-primary'}`}>
                        {n.type === 'error' ? 'error' : n.type === 'ai' ? 'auto_awesome' : n.type === 'task' ? 'assignment' : 'check_circle'}
                      </span>
                      <div>
                        <p className="text-on-surface text-xs">{n.message}</p>
                        <p className="text-on-surface-variant text-[10px] mt-1">{new Date(n.createdAt).toLocaleTimeString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Settings */}
          <button className="p-2 text-on-surface-variant hover:text-primary rounded-full hover:bg-surface-bright/50 transition-all">
            <span className="material-symbols-outlined">settings</span>
          </button>

          {/* Avatar */}
          <button className="ml-2 w-8 h-8 rounded-full overflow-hidden border border-primary/20 hover:border-primary/50 transition-colors relative group">
            {user?.avatar ? (
              <img className="w-full h-full object-cover" src={user.avatar} alt={user.name} />
            ) : (
              <div className="w-full h-full bg-surface-container-highest flex items-center justify-center text-xs text-on-surface-variant font-bold">
                {user?.initials || user?.name?.charAt(0) || 'U'}
              </div>
            )}
            <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>
      </div>
    </header>
  )
}
