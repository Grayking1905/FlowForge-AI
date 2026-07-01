import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

export default function Login() {
  const [email, setEmail] = useState('alex@flowforge.ai')
  const [password, setPassword] = useState('password')
  const { login, loading, error, clearError } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    clearError()
    await login(email, password)
    if (useAuthStore.getState().isAuthenticated) navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-primary/8 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-tertiary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10 animate-fade-in-up">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-tertiary shadow-lg shadow-primary/20 mb-4">
            <span className="material-symbols-outlined text-on-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>data_exploration</span>
          </div>
          <h1 className="text-3xl font-bold text-primary tracking-tight">FlowForge AI</h1>
          <p className="text-on-surface-variant text-sm mt-2">Sign in to your project hub</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="glass-elevated rounded-2xl p-8 space-y-6 glow-effect">
          {error && (
            <div className="bg-error-container/20 border border-error/20 rounded-lg p-3 text-sm text-on-error-container flex items-center gap-2">
              <span className="material-symbols-outlined text-error text-sm">error</span> {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-on-surface mb-2">Email</label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              className="w-full bg-surface-container/50 border border-outline-variant/30 text-on-surface rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all placeholder-on-surface-variant/50"
              placeholder="you@company.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-on-surface mb-2">Password</label>
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)}
              className="w-full bg-surface-container/50 border border-outline-variant/30 text-on-surface rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all placeholder-on-surface-variant/50"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-primary/20 border border-primary/30 text-primary font-semibold hover:bg-primary/30 transition-colors active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(125,211,252,0.15)]"
          >
            {loading ? (
              <><span className="material-symbols-outlined animate-spin text-sm">progress_activity</span> Signing in...</>
            ) : (
              <><span className="material-symbols-outlined text-sm">login</span> Sign In</>
            )}
          </button>

          <p className="text-center text-sm text-on-surface-variant">
            Don't have an account? <Link to="/register" className="text-primary hover:underline font-medium">Sign up</Link>
          </p>
        </form>

        <p className="text-center text-[10px] text-on-surface-variant/50 mt-6">
          Demo credentials pre-filled. Just click Sign In.
        </p>
      </div>
    </div>
  )
}
