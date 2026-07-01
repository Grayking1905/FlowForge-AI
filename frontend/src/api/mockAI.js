// Mock AI response service for FlowForge AI

const AI_RESPONSES = {
  roadmap: {
    content: "I've analyzed the parameters and generated a structured roadmap for your project.",
    roadmap: [
      { phase: 'Phase 1 (Weeks 1-2)', description: 'Requirements gathering, stakeholder alignment, and initial architecture design.', done: true },
      { phase: 'Phase 2 (Weeks 3-5)', description: 'Core feature development, API integration, and database schema finalization.', done: true },
      { phase: 'Phase 3 (Weeks 6-8)', description: 'UI/UX refinement, testing suite development, and performance optimization.', done: false },
      { phase: 'Phase 4 (Weeks 9-10)', description: 'Security audit, deployment pipeline setup, and launch preparation.', done: false },
    ],
    bottlenecks: [
      { title: 'API Dependencies', description: 'External service integrations may introduce latency bottlenecks during Phase 2.', severity: 'error' },
      { title: 'Design Review', description: 'Cross-team design approval typically adds 3-5 days to delivery timeline.', severity: 'tertiary' },
    ],
  },
  tasks: {
    content: "Based on your project description, I've generated a task breakdown. These tasks follow industry best practices for the described workflow.",
    tasks: [
      { title: 'Set up project repository and CI/CD pipeline', priority: 'High', tag: 'DevOps' },
      { title: 'Design database schema and entity relationships', priority: 'High', tag: 'Backend' },
      { title: 'Implement user authentication with JWT', priority: 'High', tag: 'Backend' },
      { title: 'Create responsive dashboard layout', priority: 'Medium', tag: 'Frontend' },
      { title: 'Build REST API endpoints for core CRUD operations', priority: 'High', tag: 'Backend' },
      { title: 'Implement real-time notifications with WebSocket', priority: 'Medium', tag: 'Frontend' },
      { title: 'Write unit and integration test suites', priority: 'Medium', tag: 'QA' },
      { title: 'Security review and penetration testing', priority: 'High', tag: 'Security' },
    ],
  },
  summary: {
    content: "Here's your project status summary based on current data.",
    metrics: {
      velocity: '+12% compared to last sprint',
      health: 'Excellent',
      blockers: 0,
      onTrack: '94% of tasks on schedule',
    },
  },
  simulation: {
    content: "Based on the current team velocity and scope analysis, here are the timeline projections.",
    scenarios: [
      { name: 'Optimistic', weeks: 8, confidence: '75%' },
      { name: 'Most Likely', weeks: 10, confidence: '90%' },
      { name: 'Pessimistic', weeks: 14, confidence: '95%' },
    ],
  },
}

const GENERIC_RESPONSES = [
  "I've analyzed your request and here are my recommendations based on the current project context.",
  "Based on the project data and team performance metrics, I can provide the following insights.",
  "Great question! Let me break this down based on FlowForge's analytics engine.",
]

function detectIntent(message) {
  const lower = message.toLowerCase()
  if (lower.includes('roadmap') || lower.includes('plan') || lower.includes('timeline')) return 'roadmap'
  if (lower.includes('task') || lower.includes('generate') || lower.includes('create') || lower.includes('breakdown')) return 'tasks'
  if (lower.includes('summary') || lower.includes('status') || lower.includes('progress') || lower.includes('report')) return 'summary'
  if (lower.includes('simulate') || lower.includes('what if') || lower.includes('estimate') || lower.includes('forecast')) return 'simulation'
  return 'generic'
}

export async function generateAIResponse(message) {
  // Simulate typing delay
  await new Promise(r => setTimeout(r, 1000 + Math.random() * 1500))

  const intent = detectIntent(message)

  if (intent === 'generic') {
    return {
      role: 'assistant',
      content: GENERIC_RESPONSES[Math.floor(Math.random() * GENERIC_RESPONSES.length)] +
        " I can help you generate project roadmaps, create task breakdowns, summarize project status, or run what-if simulations. Just ask!",
    }
  }

  const template = AI_RESPONSES[intent]
  return {
    role: 'assistant',
    content: template.content,
    ...(template.roadmap && { roadmap: template.roadmap, bottlenecks: template.bottlenecks }),
    ...(template.tasks && { generatedTasks: template.tasks }),
    ...(template.metrics && { metrics: template.metrics }),
    ...(template.scenarios && { scenarios: template.scenarios }),
  }
}
