import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import TopBar from './TopBar'
import BottomNav from './BottomNav'

export default function AppLayout() {
  return (
    <div className="flex h-screen bg-background text-on-surface overflow-hidden">
      {/* Ambient Background Glows */}
      <div className="ambient-glow-1" />
      <div className="ambient-glow-2" />

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <TopBar />
        <main className="flex-1 overflow-y-auto scroll-smooth pb-20 md:pb-0">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <BottomNav />
    </div>
  )
}
