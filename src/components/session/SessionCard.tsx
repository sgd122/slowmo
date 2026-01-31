import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Calendar, Users, Clock } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import type { Session } from '@/types'

interface SessionCardProps {
  session: Session
  participantCount: number
  onClick?: () => void
}

export function SessionCard({ session, participantCount, onClick }: SessionCardProps) {
  const isActive = session.status === 'active'
  const date = new Date(session.date)
  const formattedDate = date.toLocaleDateString('ko-KR', {
    month: 'short',
    day: 'numeric',
    weekday: 'short'
  })

  const startTime = new Date(session.start_time).toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit'
  })

  return (
    <Card
      onClick={onClick}
      className={cn(
        "cursor-pointer transition-all duration-200 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700",
        isActive && "ring-2 ring-emerald-500 ring-offset-2 ring-offset-slate-950"
      )}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 space-y-3">
            {/* Title or Default */}
            <h3 className="text-lg font-semibold text-white line-clamp-1">
              {session.title || '무제 세션'}
            </h3>

            {/* Date and Time */}
            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-300">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-slate-400" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-slate-400" />
                <span>{startTime}</span>
              </div>
            </div>

            {/* Participants */}
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-slate-400" />
              <span className="text-sm font-medium text-slate-300">
                {participantCount}명 참여중
              </span>
            </div>
          </div>

          {/* Status Badge */}
          <Badge variant={isActive ? 'active' : 'completed'}>
            {isActive ? '진행중' : '완료'}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}
