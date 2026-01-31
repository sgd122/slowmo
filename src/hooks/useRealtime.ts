'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { SessionParticipant } from '@/types'

type RealtimeEvent = 'INSERT' | 'UPDATE' | 'DELETE'

interface UseRealtimeOptions {
  sessionId: string
  onParticipantChange: (event: RealtimeEvent, participant: SessionParticipant) => void
}

export function useRealtime({ sessionId, onParticipantChange }: UseRealtimeOptions) {
  useEffect(() => {
    const supabase = createClient()

    const channel = supabase
      .channel(`session-${sessionId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'session_participants',
          filter: `session_id=eq.${sessionId}`
        },
        (payload) => {
          const event = payload.eventType.toUpperCase() as RealtimeEvent
          const participant = (payload.new || payload.old) as SessionParticipant
          onParticipantChange(event, participant)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [sessionId, onParticipantChange])
}
