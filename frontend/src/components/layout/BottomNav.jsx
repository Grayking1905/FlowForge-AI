import { NavLink } from 'react-router-dom'

const items = [
  { to: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
  { to: '/projects', icon: 'folder_open', label: 'Projects' },
  { to: '/tasks', icon: 'assignment', label: 'Tasks' },
  { to: '/ai', icon: 'smart_toy', label: 'AI', accent: true },
]

export default function BottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 w-full flex justify-around items-center px-2 py-3 bg-surface/80 backdrop-blur-xl border-t border-primary/10 z-50">
      {items.map(item => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 p-2 transition-colors ${
              isActive
                ? item.accent ? 'text-tertiary' : 'text-primary'
                : 'text-on-surface-variant hover:text-on-surface'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <span
                className="material-symbols-outlined"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {item.icon}
              </span>
              <span className="text-[10px] font-medium">{item.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
