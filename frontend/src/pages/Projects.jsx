import { useEffect, useState } from 'react'
import { useProjectStore } from '@/store/projectStore'
import { useTeamStore } from '@/store/teamStore'

const categories = [
  { label: 'All Projects', icon: 'all_inclusive', value: 'All' },
  { label: 'Internal', icon: 'business', value: 'Internal' },
  { label: 'Client', icon: 'handshake', value: 'Client' },
  { label: 'Archived', icon: 'archive', value: 'Archived' },
]

const statuses = ['In Progress', 'Planning', 'Review', 'Blocked']

export default function Projects() {
  const { projects, fetchProjects, filter, setFilter } = useProjectStore()
  const [viewMode, setViewMode] = useState('grid')

  useEffect(() => { fetchProjects() }, [])

  const allProjects = useProjectStore(s => s.projects)
  const getCategoryCount = (cat) => {
    if (cat === 'All') return allProjects.length
    if (cat === 'Archived') return allProjects.filter(p => p.status === 'Archived').length
    return allProjects.filter(p => p.category === cat).length
  }

  const filteredProjects = filter.category === 'Archived'
    ? projects.filter(p => p.status === 'Archived')
    : filter.category === 'All'
    ? projects
    : projects.filter(p => p.category === filter.category)

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="hidden md:flex justify-between items-center px-8 py-5 border-b border-primary/5">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold tracking-tight text-on-surface">Projects Overview</h2>
          <span className="px-2.5 py-0.5 rounded-full bg-surface-variant text-on-surface-variant text-xs font-semibold border border-outline-variant/30">
            {filteredProjects.length} Active
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col md:flex-row gap-8">
        {/* Sidebar Filter */}
        <aside className="w-full md:w-56 shrink-0 flex flex-col gap-6">
          <div className="glass-panel rounded-xl p-5 border-l-2 border-l-primary/50">
            <h3 className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-4">Categories</h3>
            <ul className="space-y-1">
              {categories.map(cat => (
                <li key={cat.value}>
                  <button
                    onClick={() => setFilter({ category: cat.value })}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filter.category === cat.value
                        ? 'bg-primary/10 text-primary'
                        : 'text-on-surface hover:bg-surface-variant/50 group'
                    }`}
                  >
                    <span className={`flex items-center gap-2 ${filter.category !== cat.value ? 'text-on-surface-variant group-hover:text-on-surface' : ''}`}>
                      <span className="material-symbols-outlined text-[18px]">{cat.icon}</span> {cat.label}
                    </span>
                    <span className={`text-xs ${filter.category === cat.value ? 'bg-primary/20 px-1.5 rounded-sm text-primary' : 'text-on-surface-variant'}`}>
                      {getCategoryCount(cat.value)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="glass-panel rounded-xl p-5">
            <h3 className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-4">Status</h3>
            <div className="flex flex-wrap gap-2">
              {statuses.map(s => (
                <span key={s} className="px-2.5 py-1 rounded-md bg-surface-variant border border-outline-variant/30 text-xs text-on-surface hover:border-primary/30 cursor-pointer transition-colors">{s}</span>
              ))}
            </div>
          </div>
        </aside>

        {/* Grid Content */}
        <div className="flex-1 flex flex-col gap-6">
          {/* Toolbar */}
          <div className="flex justify-between items-center">
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-outline-variant/50 text-sm text-on-surface-variant hover:text-on-surface hover:border-outline-variant transition-colors bg-surface/30">
              <span className="material-symbols-outlined text-[18px]">sort</span> Sort: Recent
            </button>
            <div className="flex items-center bg-surface-variant/50 rounded-lg p-1 border border-outline-variant/20">
              <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-sm ${viewMode === 'grid' ? 'bg-surface/80 text-primary shadow-sm border border-primary/20' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface/50'} transition-colors`}>
                <span className="material-symbols-outlined text-[20px]">grid_view</span>
              </button>
              <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-sm ${viewMode === 'list' ? 'bg-surface/80 text-primary shadow-sm border border-primary/20' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface/50'} transition-colors`}>
                <span className="material-symbols-outlined text-[20px]">view_list</span>
              </button>
            </div>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-[280px]">
            {/* Featured Card */}
            {filteredProjects.length > 0 && filteredProjects[0].status !== 'Archived' && (
              <div className="glass-panel rounded-2xl p-6 flex flex-col glow-hover transition-all duration-300 xl:col-span-2 relative overflow-hidden group">
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-500" />
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div className="flex gap-3 items-center">
                    <div className="h-12 w-12 rounded-xl bg-surface-variant border border-primary/20 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-primary text-[24px]">{filteredProjects[0].icon}</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-on-surface">{filteredProjects[0].name}</h3>
                      <p className="text-sm text-on-surface-variant">{filteredProjects[0].client ? `Client: ${filteredProjects[0].client}` : filteredProjects[0].category}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <button className="text-on-surface-variant hover:text-primary"><span className="material-symbols-outlined">more_vert</span></button>
                    {filteredProjects[0].aiOptimized && (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-wider bg-tertiary/10 text-tertiary border border-tertiary/20">
                        <span className="material-symbols-outlined text-[12px]">auto_awesome</span> AI Optimized
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-sm text-on-surface-variant mb-6 line-clamp-2 relative z-10">{filteredProjects[0].description}</p>
                <div className="mt-auto relative z-10">
                  <div className="flex justify-between items-end mb-4">
                    <div className="flex gap-2">
                      <span className="px-2 py-1 rounded-sm text-xs bg-surface-variant text-on-surface-variant border border-outline-variant/30">{filteredProjects[0].status}</span>
                      <span className="px-2 py-1 rounded-sm text-xs bg-primary/10 text-primary border border-primary/20">{filteredProjects[0].priority} Priority</span>
                    </div>
                    <div className="flex -space-x-2">
                      {filteredProjects[0].teamIds?.slice(0, 3).map(tid => {
                        const u = useTeamStore.getState().users.find(u => u.id === tid)
                        return u?.avatar ? (
                          <div key={tid} className="h-8 w-8 rounded-full border-2 border-background bg-surface-variant overflow-hidden">
                            <img className="w-full h-full object-cover" src={u.avatar} alt={u.name} />
                          </div>
                        ) : (
                          <div key={tid} className="h-8 w-8 rounded-full border-2 border-background bg-surface-variant flex items-center justify-center text-xs font-medium text-on-surface-variant">{u?.initials}</div>
                        )
                      })}
                      {(filteredProjects[0].teamIds?.length || 0) > 3 && (
                        <div className="h-8 w-8 rounded-full border-2 border-background bg-surface-variant flex items-center justify-center text-xs font-medium text-on-surface-variant">+{filteredProjects[0].teamIds.length - 3}</div>
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-on-surface-variant">Progress</span>
                      <span className="text-primary font-medium">{filteredProjects[0].progress}%</span>
                    </div>
                    <div className="w-full bg-surface-variant rounded-full h-1.5 overflow-hidden">
                      <div className="bg-primary h-1.5 rounded-full relative" style={{ width: `${filteredProjects[0].progress}%` }}>
                        <div className="absolute inset-0 bg-white/20 w-full animate-shimmer" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Remaining cards */}
            {filteredProjects.slice(1).map(project => (
              <div key={project.id} className={`glass-panel rounded-2xl p-6 flex flex-col glow-hover transition-all duration-300 relative overflow-hidden group ${project.status === 'Archived' ? 'opacity-60' : ''}`}>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-3 items-center">
                    <div className={`h-10 w-10 rounded-xl bg-surface-variant border border-outline-variant/30 flex items-center justify-center shrink-0 ${project.status === 'Archived' ? 'opacity-50' : ''}`}>
                      <span className="material-symbols-outlined text-on-surface-variant text-[20px]">{project.icon}</span>
                    </div>
                    <div>
                      <h3 className={`text-base font-semibold ${project.status === 'Archived' ? 'text-on-surface-variant line-through' : 'text-on-surface'}`}>{project.name}</h3>
                      <p className="text-xs text-on-surface-variant">{project.client || project.category}</p>
                    </div>
                  </div>
                  <button className="text-on-surface-variant hover:text-on-surface"><span className="material-symbols-outlined text-[20px]">more_vert</span></button>
                </div>
                <p className={`text-xs mb-6 line-clamp-3 ${project.status === 'Archived' ? 'text-on-surface-variant/70' : 'text-on-surface-variant'}`}>{project.description}</p>
                <div className="mt-auto">
                  <div className="flex gap-2 mb-4">
                    <span className={`px-2 py-1 rounded-sm text-[10px] border ${project.status === 'Archived' ? 'bg-surface-container-highest text-on-surface-variant border-outline-variant/20' : 'bg-surface-variant text-on-surface-variant border-outline-variant/30'}`}>{project.status}</span>
                    {project.aiOptimized && (
                      <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-sm text-[9px] font-bold uppercase tracking-wider bg-tertiary/10 text-tertiary border border-tertiary/20">
                        <span className="material-symbols-outlined text-[10px]">auto_awesome</span> AI
                      </span>
                    )}
                  </div>
                  <div className={project.status === 'Archived' ? 'opacity-50' : ''}>
                    <div className="flex justify-between text-[10px] mb-1.5">
                      <span className="text-on-surface-variant">Progress</span>
                      <span className={project.progress > 30 ? 'text-primary font-medium' : 'text-on-surface'}>{project.progress}%</span>
                    </div>
                    <div className="w-full bg-surface-variant rounded-full h-1 overflow-hidden">
                      <div className={`h-1 rounded-full ${project.status === 'Archived' ? 'bg-outline-variant' : project.progress > 30 ? 'bg-primary' : 'bg-outline'}`} style={{ width: `${project.progress}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
