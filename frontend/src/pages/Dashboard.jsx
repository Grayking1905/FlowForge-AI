import { useEffect } from 'react'
import { useProjectStore } from '@/store/projectStore'
import { useTeamStore } from '@/store/teamStore'

// Static dashboard widget data (will be replaced by API in future)
const DEADLINES = [
  { id: 1, title: 'API Integration Module', project: 'Project Nexus', urgency: 'error', days: '2 days left', date: 'Jul 8' },
  { id: 2, title: 'Design Review: Phase 2', project: 'Project Aegis', urgency: 'primary', days: '5 days left', date: 'Jul 11' },
  { id: 3, title: 'Regression Suite', project: 'Data Pipeline V2', urgency: 'tertiary', days: '12 days', date: 'Jul 18' },
]
const ACTIVITY = [
  { id: 1, title: 'Marcus Chen pushed', highlight: 'PR #402', description: 'WebSocket integration + latency fix', time: '2h ago', color: 'primary' },
  { id: 2, title: 'Build failed:', highlight: 'staging-web', description: 'Error in auth-service. Rollback initiated.', time: '5h ago', color: 'error' },
  { id: 3, title: 'Elena Jordan completed', highlight: 'Task: Setup DB Schema', description: '', time: '8h ago', color: 'tertiary' },
  { id: 4, title: 'AI flagged potential issue:', highlight: '', description: 'Increased API latency detected. Recommend scaling.', time: '12h ago', color: 'outline' },
]

export default function Dashboard() {
  const { projects, fetchProjects } = useProjectStore()
  const { users, fetchUsers } = useTeamStore()

  useEffect(() => { fetchProjects(); fetchUsers() }, [])

  const activeProjects = projects.filter(p => ['ACTIVE','REVIEW','Active','Review'].includes(p.status)).slice(0, 2)

  return (
    <div className="p-6 md:p-8 space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-on-surface tracking-tight">Overview</h2>
          <p className="text-on-surface-variant mt-1 text-sm">Welcome back. Here's what the AI has analyzed today.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 rounded-sm border border-outline-variant text-sm text-on-surface-variant hover:text-on-surface hover:border-primary/40 transition-colors bg-surface-container/50">Last 7 Days</button>
          <button className="px-3 py-1.5 rounded-sm border border-outline-variant text-sm text-on-surface-variant hover:text-on-surface hover:border-primary/40 transition-colors bg-surface-container/50">Export Report</button>
        </div>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[minmax(180px,auto)]">
        {/* Hero AI Insights Card */}
        <div className="md:col-span-8 glass-elevated rounded-xl p-6 relative overflow-hidden group glow-effect flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 group-hover:bg-primary/10 transition-all duration-500" />
          <div className="flex justify-between items-start relative z-10">
            <div className="flex items-center gap-2 text-tertiary">
              <span className="material-symbols-outlined">auto_awesome</span>
              <span className="text-xs font-semibold uppercase tracking-wider">AI Insights</span>
            </div>
            <span className="px-2 py-1 rounded-sm bg-secondary-container/50 text-on-secondary-container text-xs font-medium border border-secondary/20">System Optimal</span>
          </div>
          <div className="mt-4 relative z-10 flex-1">
            <h3 className="text-2xl font-semibold text-on-surface mb-2">Project Health is <span className="text-primary">Excellent</span></h3>
            <p className="text-on-surface-variant text-sm max-w-lg leading-relaxed">
              FlowForge AI has automatically resolved 14 merge conflicts and optimized 3 deployment pipelines in the last 24 hours. Team velocity is up 12% compared to last sprint.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-6 relative z-10">
            {[
              { label: 'Tasks Automated', value: '1,248', change: '+8% this week', icon: 'trending_up', color: 'text-primary' },
              { label: 'Code Quality', value: 'A+', change: '0 critical issues', icon: 'check_circle', color: 'text-secondary' },
              { label: 'Time Saved', value: '42h', change: 'AI assisted', icon: 'schedule', color: 'text-tertiary' },
            ].map((metric, i) => (
              <div key={i} className="p-4 rounded-lg bg-surface-container-low/50 border border-outline-variant/20">
                <div className="text-on-surface-variant text-xs mb-1">{metric.label}</div>
                <div className="text-xl font-bold text-on-surface">{metric.value}</div>
                <div className={`${metric.color} text-xs mt-1 flex items-center`}>
                  <span className="material-symbols-outlined text-[14px]">{metric.icon}</span> {metric.change}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="md:col-span-4 glass-panel rounded-xl p-6 flex flex-col glow-effect">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-on-surface">Upcoming Deadlines</h3>
            <button className="text-on-surface-variant hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-sm">more_horiz</span>
            </button>
          </div>
          <div className="space-y-4 flex-1 overflow-y-auto pr-2">
            {DEADLINES.map(d => (
              <div key={d.id} className="flex items-start gap-3 group">
                <div className={`w-2 h-2 rounded-full mt-2 shadow-[0_0_8px] ${
                  d.urgency === 'error' ? 'bg-error shadow-error/60' :
                  d.urgency === 'primary' ? 'bg-primary shadow-primary/60' : 'bg-tertiary shadow-tertiary/60'
                }`} />
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-on-surface group-hover:text-primary transition-colors">{d.title}</h4>
                  <p className="text-xs text-on-surface-variant mt-0.5">Project: {d.project}</p>
                </div>
                <div className="text-right">
                  {d.due === 'Today' ? (
                    <span className="text-xs font-semibold text-error bg-error-container/20 px-2 py-0.5 rounded-sm">{d.due}</span>
                  ) : (
                    <span className="text-xs text-on-surface-variant">{d.due}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-2 text-xs font-semibold text-primary/80 hover:text-primary bg-primary/5 hover:bg-primary/10 rounded-sm border border-primary/10 transition-all">
            View All Deadlines
          </button>
        </div>

        {/* Active Projects */}
        <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {activeProjects.map(project => (
            <div key={project.id} className={`glass-panel rounded-xl p-5 hover:-translate-y-1 transition-transform duration-300 glow-effect border-t ${project.color === 'primary' ? 'border-t-primary/20' : 'border-t-tertiary/20'}`}>
              <div className="flex justify-between items-start mb-4">
                <div className={`w-10 h-10 rounded-sm flex items-center justify-center ${
                  project.color === 'primary' ? 'bg-primary-container/30 border border-primary/20 text-primary' : 'bg-tertiary-container/30 border border-tertiary/20 text-tertiary'
                }`}>
                  <span className="material-symbols-outlined">{project.icon}</span>
                </div>
                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  project.color === 'primary' ? 'bg-primary/10 text-primary' : 'bg-tertiary/10 text-tertiary'
                }`}>{project.status}</span>
              </div>
              <h3 className="text-lg font-semibold text-on-surface mb-1">{project.name}</h3>
              <p className="text-xs text-on-surface-variant mb-4 line-clamp-2">{project.description}</p>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-on-surface-variant">Progress</span>
                <span className={`text-xs font-semibold ${project.color === 'primary' ? 'text-primary' : 'text-tertiary'}`}>{project.progress}%</span>
              </div>
              <div className="w-full bg-surface-container-highest rounded-full h-1.5 mb-4 overflow-hidden">
                <div className={`h-1.5 rounded-full ${project.color === 'primary' ? 'bg-linear-to-r from-primary-container to-primary' : 'bg-linear-to-r from-tertiary-container to-tertiary'}`} style={{ width: `${project.progress}%` }} />
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-outline-variant/20">
                <div className="flex -space-x-2">
                  {(project.teamIds || []).slice(0, 2).map(tid => {
                    const u = users.find(u => u.id === tid)
                    return u?.avatar ? (
                      <img key={tid} className="w-6 h-6 rounded-full border border-surface-container object-cover" src={u.avatar} alt={u.name} />
                    ) : (
                      <div key={tid} className="w-6 h-6 rounded-full border border-surface-container bg-surface-container-highest flex items-center justify-center text-[10px] text-on-surface-variant">
                        {u?.initials || '?'}
                      </div>
                    )
                  })}
                  {(project.teamIds || []).length > 2 && (
                    <div className="w-6 h-6 rounded-full border border-surface-container bg-surface-container-highest flex items-center justify-center text-[10px] text-on-surface-variant">
                      +{(project.teamIds || []).length - 2}
                    </div>
                  )}
                </div>
                <span className="text-xs text-on-surface-variant flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">commit</span> {project.updatesCount} updates
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity Feed */}
        <div className="md:col-span-4 glass-panel rounded-xl p-6 glow-effect row-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-on-surface">Recent Activity</h3>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              <span className="text-xs text-on-surface-variant">Live</span>
            </div>
          </div>
          <div className="relative pl-4 space-y-6 before:absolute before:inset-y-0 before:left-[11px] before:w-[1px] before:bg-outline-variant/30">
            {ACTIVITY.map(item => (
              <div key={item.id} className="relative">
                <div className={`absolute -left-[18px] top-1 w-4 h-4 rounded-full bg-surface border-2 z-10 flex items-center justify-center ${
                  item.color === 'primary' ? 'border-primary' : item.color === 'tertiary' ? 'border-tertiary' : item.color === 'error' ? 'border-error' : 'border-outline'
                }`} />
                <div className="pl-4">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="text-sm font-medium text-on-surface">
                      {item.title} {item.highlight && <span className="text-primary">{item.highlight}</span>}
                    </span>
                    <span className="text-[10px] text-on-surface-variant">{item.time}</span>
                  </div>
                  {item.color === 'error' ? (
                    <p className="text-xs text-on-error-container bg-error-container/20 p-2 rounded-sm mt-1 border border-error/20">{item.description}</p>
                  ) : item.color === 'primary' ? (
                    <p className="text-xs text-on-surface-variant bg-surface-container-low/50 p-2 rounded-sm mt-1 border border-outline-variant/20">{item.description}</p>
                  ) : (
                    <p className="text-xs text-on-surface-variant">{item.description}</p>
                  )}
                  {item.actionLabel && (
                    <div className="flex gap-2 mt-2">
                      <button className="text-[10px] px-2 py-1 bg-tertiary/10 text-tertiary rounded-sm hover:bg-tertiary/20 transition-colors">{item.actionLabel}</button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
