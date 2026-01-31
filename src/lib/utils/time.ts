export function formatDuration(ms: number): string {
  const hours = Math.floor(ms / 3600000)
  const minutes = Math.floor((ms % 3600000) / 60000)
  const seconds = Math.floor((ms % 60000) / 1000)

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

export function formatMinutesToDisplay(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60

  if (hours === 0) return `${mins}분`
  if (mins === 0) return `${hours}시간`
  return `${hours}시간 ${mins}분`
}

export function calculateStudyMinutes(joinTime: string, leaveTime?: string | null): number {
  const join = new Date(joinTime).getTime()
  const leave = leaveTime ? new Date(leaveTime).getTime() : Date.now()
  return Math.floor((leave - join) / 60000)
}
