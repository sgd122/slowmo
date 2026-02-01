import Link from 'next/link'
import { SessionCard } from '@/components/session/SessionCard'
import type { SessionWithParticipants } from '@/types'

interface RecentSessionsProps {
  sessions: SessionWithParticipants[]
}

export function RecentSessions({ sessions }: RecentSessionsProps) {
  if (sessions.length === 0) {
    return (
      <div className="flex min-h-[200px] items-center justify-center rounded-xl border-2 border-dashed border-slate-800 bg-slate-900/30 p-8">
        <p className="text-center text-slate-500">
          아직 완료된 세션이 없습니다
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {sessions.map((session) => {
        const participantCount = session.participants?.length || 0
        return (
          <Link key={session.id} href={`/session/${session.id}`}>
            <SessionCard
              session={session}
              participantCount={participantCount}
            />
          </Link>
        )
      })}
    </div>
  )
}
