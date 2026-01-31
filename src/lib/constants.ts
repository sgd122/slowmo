export const CONSTRAINTS = {
  TODAY_TASK_MAX_LENGTH: 500,
  NOTES_MAX_LENGTH: 1000,
  NAME_MAX_LENGTH: 50,
  NICKNAME_MAX_LENGTH: 30,
  TITLE_MAX_LENGTH: 100,
  MAX_SESSION_HOURS: 12,
  TASK_UPDATE_DEBOUNCE: 500,
  HISTORY_PAGE_SIZE: 10,
  CHART_COLORS: [
    '#3b82f6', '#10b981', '#f59e0b', '#ef4444',
    '#8b5cf6', '#06b6d4', '#f97316', '#84cc16'
  ]
} as const

export const ROUTES = {
  HOME: '/',
  SESSION: (id: string) => `/session/${id}`,
  HISTORY: '/history',
  STATS: '/stats',
  MEMBERS: '/members'
} as const
