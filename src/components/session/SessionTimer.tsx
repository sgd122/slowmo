import { useEffect, useState } from 'react'
import { Clock } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface SessionTimerProps {
  startTime: string
  maxHours?: number
  onExpire?: () => void
}

export function SessionTimer({ startTime, maxHours = 24, onExpire }: SessionTimerProps) {
  const [elapsed, setElapsed] = useState(0)
  const [isExpired, setIsExpired] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now()
      const start = new Date(startTime).getTime()
      const elapsedMs = now - start
      const elapsedSeconds = Math.floor(elapsedMs / 1000)

      setElapsed(elapsedSeconds)

      const maxSeconds = maxHours * 60 * 60
      if (elapsedSeconds >= maxSeconds && !isExpired) {
        setIsExpired(true)
        onExpire?.()
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [startTime, maxHours, isExpired, onExpire])

  const hours = Math.floor(elapsed / 3600)
  const minutes = Math.floor((elapsed % 3600) / 60)
  const seconds = elapsed % 60

  const formatTime = (value: number) => value.toString().padStart(2, '0')

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center gap-2 text-slate-500">
        <Clock className="h-4 w-4" />
        <span className="text-sm font-medium">Session Time</span>
      </div>

      <div className={cn(
        "font-mono text-5xl font-bold tabular-nums tracking-tight transition-colors",
        isExpired ? "text-red-600" : "text-slate-900"
      )}>
        {formatTime(hours)}:{formatTime(minutes)}:{formatTime(seconds)}
      </div>

      {isExpired && (
        <div className="text-sm font-medium text-red-600 animate-pulse">
          Session time expired
        </div>
      )}
    </div>
  )
}
