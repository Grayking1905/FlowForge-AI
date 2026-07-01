import { useAuthStore } from '@/store/authStore'

export default function Settings() {
  const user = useAuthStore(s => s.user)

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold text-on-surface tracking-tight">Settings</h2>
        <p className="text-on-surface-variant mt-1 text-sm">Manage your account and preferences</p>
      </div>

      {/* Profile Section */}
      <div className="glass-elevated rounded-xl p-6 space-y-6">
        <h3 className="font-semibold text-on-surface flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">person</span> Profile
        </h3>
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-primary/30 shadow-[0_0_20px_rgba(125,211,252,0.15)]">
            {user?.avatar ? (
              <img className="w-full h-full object-cover" src={user.avatar} alt={user.name} />
            ) : (
              <div className="w-full h-full bg-surface-container-highest flex items-center justify-center text-2xl text-on-surface-variant font-bold">
                {user?.initials || 'U'}
              </div>
            )}
          </div>
          <div>
            <h4 className="text-lg font-semibold text-on-surface">{user?.name || 'User'}</h4>
            <p className="text-sm text-on-surface-variant">{user?.email}</p>
            <p className="text-xs text-primary mt-1 capitalize">{user?.role || 'Member'}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-outline-variant/20">
          <div>
            <label className="block text-sm font-medium text-on-surface mb-2">Display Name</label>
            <input defaultValue={user?.name} className="w-full bg-surface-container/50 border border-outline-variant/30 text-on-surface rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all" />
          </div>
          <div>
            <label className="block text-sm font-medium text-on-surface mb-2">Email</label>
            <input defaultValue={user?.email} className="w-full bg-surface-container/50 border border-outline-variant/30 text-on-surface rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all" />
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="glass-panel rounded-xl p-6 space-y-6">
        <h3 className="font-semibold text-on-surface flex items-center gap-2">
          <span className="material-symbols-outlined text-tertiary">palette</span> Preferences
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-on-surface">Dark Mode</p>
              <p className="text-xs text-on-surface-variant">Glacier theme is always dark</p>
            </div>
            <div className="w-11 h-6 rounded-full bg-primary/30 border border-primary/40 flex items-center px-0.5">
              <div className="w-5 h-5 rounded-full bg-primary shadow-[0_0_8px_rgba(125,211,252,0.5)] translate-x-5 transition-transform" />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-on-surface">AI Suggestions</p>
              <p className="text-xs text-on-surface-variant">Show AI-powered recommendations</p>
            </div>
            <div className="w-11 h-6 rounded-full bg-primary/30 border border-primary/40 flex items-center px-0.5">
              <div className="w-5 h-5 rounded-full bg-primary shadow-[0_0_8px_rgba(125,211,252,0.5)] translate-x-5 transition-transform" />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-on-surface">Email Notifications</p>
              <p className="text-xs text-on-surface-variant">Receive updates via email</p>
            </div>
            <div className="w-11 h-6 rounded-full bg-outline-variant border border-outline/40 flex items-center px-0.5">
              <div className="w-5 h-5 rounded-full bg-outline transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        <button className="px-4 py-2 rounded-lg border border-outline-variant text-on-surface-variant hover:text-on-surface text-sm transition-colors">Cancel</button>
        <button className="px-6 py-2 rounded-lg bg-primary/20 border border-primary/30 text-primary font-semibold hover:bg-primary/30 transition-colors text-sm shadow-[0_0_15px_rgba(125,211,252,0.1)]">
          Save Changes
        </button>
      </div>
    </div>
  )
}
