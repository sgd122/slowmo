'use client'

import { useState, useEffect } from 'react'
import { formatDuration } from '@/lib/utils/time'

interface UseTimerOptions {
  startTime: string
  maxHours?: number
  onExpire?: () => void
}

export function useTimer({ startTime, maxHours = 12, onExpire }: UseTimerOptions) {
  const [elapsed, setElapsed] = useState(0)
  const [isExpired, setIsExpired] = useState(false)

  useEffect(() => {
    const start = new Date(startTime).getTime()
    const maxMs = maxHours * 60 * 60 * 1000

    const tick = () => {
      const now = Date.now()
      const elapsedMs = now - start

      if (elapsedMs >= maxMs) {
        setIsExpired(true)
        setElapsed(maxMs)
        onExpire?.()
      } else {
        setElapsed(elapsedMs)
      }
    }

    tick()
    const interval = setInterval(tick, 1000)

    return () => clearInterval(interval)
  }, [startTime, maxHours, onExpire])

  return {
    elapsed,
    isExpired,
    formatted: formatDuration(elapsed),
    minutes: Math.floor(elapsed / 60000)
  }
}
