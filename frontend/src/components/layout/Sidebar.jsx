import { NavLink } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

const navItems = [
  { to: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
  { to: '/projects', icon: 'folder_open', label: 'Projects' },
  { to: '/tasks', icon: 'assignment', label: 'Tasks' },
  { to: '/team', icon: 'group', label: 'Team' },
  { to: '/ai', icon: 'smart_toy', label: 'AI Assistant', accent: true },
]

const footerItems = [
  { to: '/settings', icon: 'settings', label: 'Settings' },
]

export default function Sidebar() {
  const logout = useAuthStore(s => s.logout)

  return (
    <nav className="hidden md:flex flex-col h-full py-6 px-4 bg-surface/60 backdrop-blur-xl w-64 border-r border-primary/10 shadow-[0_0_30px_rgba(125,211,252,0.05)] z-50 shrink-0">
      {/* Brand */}
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-tertiary flex items-center justify-center shadow-lg shadow-primary/20">
          <span className="material-symbols-outlined text-on-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
            data_exploration
          </span>
        </div>
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-primary">FlowForge AI</h1>
          <p className="text-xs text-on-surface-variant">Premium Project Hub</p>
        </div>
      </div>

      {/* CTA */}
      <button className="mb-8 w-full py-2.5 rounded-lg bg-primary/10 border border-primary/20 text-primary font-semibold hover:bg-primary/20 hover:border-primary/40 transition-colors duration-200 flex items-center justify-center gap-2 active:scale-95 shadow-[0_0_15px_rgba(125,211,252,0.1)]">
        <span className="material-symbols-outlined text-sm">add</span>
        New Project
      </button>

      {/* Main Navigation */}
      <div className="flex-1 space-y-1">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-200 active:scale-95 group ${
                isActive
                  ? 'text-primary bg-primary/10 font-semibold border-r-2 border-primary'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-primary/5'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={`material-symbols-outlined ${item.accent && !isActive ? 'text-tertiary' : ''} ${!isActive ? 'group-hover:text-primary/70' : ''} transition-colors`}
                  style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  {item.icon}
                </span>
                <span className={`text-sm tracking-wide ${item.accent && !isActive ? 'text-tertiary' : ''}`}>
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>

      {/* Footer Navigation */}
      <div className="mt-auto space-y-1 pt-6 border-t border-outline-variant/20">
        {footerItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-200 active:scale-95 group ${
                isActive
                  ? 'text-primary bg-primary/10 font-semibold'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-primary/5'
              }`
            }
          >
            <span className="material-symbols-outlined group-hover:text-primary/70 transition-colors">{item.icon}</span>
            <span className="text-sm tracking-wide">{item.label}</span>
          </NavLink>
        ))}
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-primary/5 transition-colors duration-200 active:scale-95 group w-full"
        >
          <span className="material-symbols-outlined group-hover:text-error/70 transition-colors">logout</span>
          <span className="text-sm tracking-wide">Sign Out</span>
        </button>
      </div>
    </nav>
  )
}
