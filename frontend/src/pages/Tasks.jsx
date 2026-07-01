import { useEffect } from 'react'
import { useTaskStore } from '@/store/taskStore'
import { useTeamStore } from '@/store/teamStore'

const columns = [
  { status: 'BACKLOG', color: 'bg-outline', animate: false, opacity: '' },
  { status: 'IN_PROGRESS', color: 'bg-primary', animate: true, opacity: '' },
  { status: 'AI_REVIEW', color: 'bg-tertiary', animate: false, opacity: '' },
  { status: 'COMPLETED', color: 'bg-outline', animate: false, opacity: 'opacity-60 hover:opacity-100 transition-opacity' },
]

const tagColors = {
  'Design': 'text-tertiary bg-tertiary/10 border-tertiary/20',
  'Frontend': 'text-secondary bg-secondary/10 border-secondary/20',
  'Backend': 'text-secondary bg-secondary/10 border-secondary/20',
  'Security': 'text-on-surface-variant bg-surface-bright border-outline/20',
  'QA': 'text-primary bg-primary/10 border-primary/20',
  'DevOps': 'text-primary bg-primary/10 border-primary/20',
  'AI Suggested': 'text-primary bg-primary/10 border-primary/30',
  'Evaluating': 'text-tertiary bg-tertiary/10 border-tertiary/20',
}

const priorityIcons = { High: 'stat_1', Medium: 'drag_handle', Low: 'stat_minus_1' }
const priorityColors = { High: 'text-error', Medium: 'text-on-surface-variant', Low: 'text-outline' }

export default function Tasks() {
  const { tasks, fetchTasks, moveTask } = useTaskStore()

  useEffect(() => { fetchTasks() }, [])

  const getTasksByStatus = (status) => tasks.filter(t => t.status === status)

  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('taskId', taskId.toString())
  }

  const handleDrop = (e, status) => {
    e.preventDefault()
    const taskId = parseInt(e.dataTransfer.getData('taskId'))
    if (taskId) moveTask(taskId, status)
  }

  const handleDragOver = (e) => e.preventDefault()

  return (
    <div className="flex flex-col h-full overflow-hidden animate-fade-in">
      {/* Header */}
      <header className="flex justify-between items-center px-8 py-6 shrink-0 z-10 relative">
        <div>
          <h1 className="text-2xl font-semibold text-on-surface tracking-tight">Sprint Tasks</h1>
          <p className="text-sm text-on-surface-variant mt-1">Project: Quantum Core Rebuild</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative group hidden sm:block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
            <input className="glass-panel w-64 pl-9 pr-4 py-2 rounded-full text-sm text-on-surface placeholder-on-surface-variant/50 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all" placeholder="Search tasks..." type="text" />
          </div>
          <div className="flex -space-x-2 mr-2">
            {useTeamStore.getState().users.slice(0, 2).map(u => (
              <img key={u.id} className="w-8 h-8 rounded-full border-2 border-background object-cover" src={u.avatar} alt={u.name} />
            ))}
            <div className="w-8 h-8 rounded-full border-2 border-background bg-surface-bright flex items-center justify-center text-xs text-primary font-medium">+3</div>
          </div>
          <button className="glass-elevated p-2 rounded-full text-primary hover:bg-primary/10 transition-colors">
            <span className="material-symbols-outlined">filter_list</span>
          </button>
        </div>
      </header>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden px-8 pb-8 z-10 relative snap-x snap-mandatory">
        <div className="flex gap-6 h-full items-start min-w-max pb-4">
          {columns.map(col => {
            const colTasks = getTasksByStatus(col.status)
            return (
              <div
                key={col.status}
                className="w-80 h-full flex flex-col snap-center"
                onDrop={(e) => handleDrop(e, col.status)}
                onDragOver={handleDragOver}
              >
                {/* Column Header */}
                <div className={`flex items-center justify-between mb-4 px-2 ${col.opacity}`}>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${col.color} ${col.animate ? 'animate-pulse' : ''}`} />
                    <h2 className="font-medium text-sm text-on-surface">{col.status}</h2>
                    <span className="text-xs text-on-surface-variant bg-surface-bright px-1.5 py-0.5 rounded-sm">{colTasks.length}</span>
                  </div>
                  <button className="text-on-surface-variant hover:text-primary transition-colors"><span className="material-symbols-outlined text-sm">more_horiz</span></button>
                </div>

                {/* Cards */}
                <div className={`flex-1 overflow-y-auto space-y-3 pr-2 pb-2 ${col.opacity}`}>
                  {colTasks.map(task => {
                    const assignee = task.assigneeId ? useTeamStore.getState().users.find(u => u.id === task.assigneeId) : null
                    const isActiveGlow = task.tag === 'AI Suggested' || task.priority === 'High'
                    const isAIReview = task.aiReview

                    return (
                      <div
                        key={task.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, task.id)}
                        className={`p-4 rounded-lg cursor-pointer transition-all duration-300 group ${
                          isActiveGlow
                            ? 'glass-elevated glow-active hover:-translate-y-1'
                            : isAIReview
                            ? 'glass-elevated border-tertiary/20 hover:bg-tertiary/5 relative overflow-hidden'
                            : task.status === 'Completed'
                            ? 'glass-panel'
                            : 'glass-panel hover:bg-surface-bright/40'
                        }`}
                      >
                        {/* Shimmer for AI Review */}
                        {isAIReview && (
                          <div className="absolute inset-0 bg-linear-to-r from-transparent via-tertiary/5 to-transparent -translate-x-full group-hover:animate-shimmer" />
                        )}

                        {/* Tags */}
                        <div className="flex justify-between items-start mb-2 relative z-10">
                          <div className="flex gap-1.5 flex-wrap">
                            <span className={`text-[10px] uppercase tracking-wider font-medium px-1.5 py-0.5 rounded-sm border flex items-center gap-1 ${tagColors[task.tag] || 'text-on-surface-variant bg-surface-bright border-outline/20'}`}>
                              {(task.tag === 'AI Suggested' || task.tag === 'Evaluating') && <span className="material-symbols-outlined text-[10px]">{task.tag === 'AI Suggested' ? 'auto_awesome' : 'smart_toy'}</span>}
                              {task.tag}
                            </span>
                            {task.priority === 'High' && task.tag !== 'AI Suggested' && (
                              <span className="text-[10px] uppercase tracking-wider font-medium text-error bg-error/10 border border-error/20 px-1.5 py-0.5 rounded-sm">Urgent</span>
                            )}
                          </div>
                          {task.status === 'Completed' && <span className="material-symbols-outlined text-primary text-sm">check_circle</span>}
                          {task.status === 'Backlog' && !task.assigneeId && <span className="material-symbols-outlined text-on-surface-variant text-sm">bookmark_border</span>}
                        </div>

                        {/* Title */}
                        <h3 className={`text-sm font-medium mb-3 relative z-10 ${
                          task.status === 'Completed' ? 'text-on-surface-variant line-through' :
                          isActiveGlow ? 'font-semibold text-on-surface' :
                          isAIReview ? 'text-on-surface group-hover:text-tertiary' :
                          'text-on-surface group-hover:text-primary'
                        } transition-colors`}>
                          {task.title}
                        </h3>

                        {/* AI Review description */}
                        {isAIReview && task.description && (
                          <p className="text-xs text-on-surface-variant mb-3 line-clamp-2 relative z-10">{task.description}</p>
                        )}

                        {/* Progress bar for active tasks */}
                        {task.progress && (
                          <div className="w-full bg-surface-bright rounded-full h-1 mb-3">
                            <div className="bg-primary h-1 rounded-full shadow-[0_0_8px_rgba(125,211,252,0.8)]" style={{ width: `${task.progress}%` }} />
                          </div>
                        )}

                        {/* Footer */}
                        <div className="flex items-center justify-between relative z-10">
                          <div className="flex items-center gap-3">
                            <span className={`material-symbols-outlined text-sm ${priorityColors[task.priority]}`} title={`${task.priority} Priority`}>{priorityIcons[task.priority]}</span>
                            {task.comments > 0 && (
                              <span className="text-xs text-on-surface-variant flex items-center gap-1">
                                <span className="material-symbols-outlined text-[12px]">chat_bubble</span> {task.comments}
                              </span>
                            )}
                          </div>
                          {assignee ? (
                            assignee.avatar ? (
                              <img className={`w-6 h-6 rounded-full border object-cover ${isActiveGlow ? 'border-primary/50 shadow-[0_0_10px_rgba(125,211,252,0.3)]' : 'border-outline/30'} ${task.status === 'Completed' ? 'grayscale' : ''}`} src={assignee.avatar} alt={assignee.name} />
                            ) : (
                              <div className="w-6 h-6 rounded-full border border-outline/30 bg-surface-container-highest flex items-center justify-center text-[10px] text-on-surface-variant">{assignee.initials}</div>
                            )
                          ) : isAIReview ? (
                            <div className="w-6 h-6 rounded-full bg-tertiary/20 flex items-center justify-center border border-tertiary/40">
                              <span className="material-symbols-outlined text-tertiary text-[12px]">smart_toy</span>
                            </div>
                          ) : (
                            <div className="w-6 h-6 rounded-full border border-dashed border-outline/50 flex items-center justify-center text-outline text-xs">
                              <span className="material-symbols-outlined text-[10px]">person_add</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Quick Create */}
                <button className="mt-3 flex items-center gap-2 text-sm text-on-surface-variant hover:text-primary hover:bg-primary/5 py-2 px-3 rounded-lg border border-transparent hover:border-primary/20 transition-all text-left w-full group">
                  <span className="material-symbols-outlined text-sm group-hover:scale-110 transition-transform">add</span>
                  Quick Create
                </button>
              </div>
            )
          })}

          {/* Add Column */}
          <div className="w-12 h-full flex pt-10 snap-center">
            <button className="w-10 h-10 rounded-lg glass-panel flex items-center justify-center text-on-surface-variant hover:text-primary hover:border-primary/30 transition-colors">
              <span className="material-symbols-outlined">add</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
