import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { TaskEditor } from './TaskEditor'
import { User, Clock, LogOut, Edit3, FileText } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import type { SessionParticipant, Member } from '@/types'

interface ParticipantCardProps {
  participant: SessionParticipant & { member: Member }
  isOwner: boolean
  onTaskUpdate: (field: 'today_task' | 'notes', value: string) => void
  onLeave: () => void
}

export function ParticipantCard({
  participant,
  isOwner,
  onTaskUpdate,
  onLeave
}: ParticipantCardProps) {
  const joinTime = new Date(participant.join_time)
  const formattedJoinTime = joinTime.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit'
  })

  const displayName = participant.member?.nickname || participant.member?.name || '참여자'

  return (
    <Card className={cn(
      "transition-all duration-200",
      isOwner && "ring-2 ring-blue-500 ring-offset-2"
    )}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold text-lg shadow-md">
              {displayName.charAt(0).toUpperCase()}
            </div>

            <div className="space-y-1">
              <CardTitle className="text-lg">{displayName}</CardTitle>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Clock className="h-3 w-3" />
                <span>{formattedJoinTime} 참여</span>
              </div>
            </div>
          </div>

          {isOwner && (
            <Badge variant="default" className="flex items-center gap-1">
              <User className="h-3 w-3" />
              나
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Today's Task */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <Edit3 className="h-4 w-4 text-blue-500" />
            <span>오늘 할 일</span>
          </div>
          <TaskEditor
            value={participant.today_task || ''}
            onChange={(value) => onTaskUpdate('today_task', value)}
            placeholder="오늘 무엇을 공부하시나요?"
            disabled={!isOwner}
            rows={3}
            maxLength={500}
          />
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <FileText className="h-4 w-4 text-purple-500" />
            <span>메모</span>
          </div>
          <TaskEditor
            value={participant.notes || ''}
            onChange={(value) => onTaskUpdate('notes', value)}
            placeholder="공부하면서 메모를 남겨보세요"
            disabled={!isOwner}
            rows={4}
            maxLength={1000}
          />
        </div>

        {/* Leave Button */}
        {isOwner && (
          <div className="pt-2">
            <Button
              variant="destructive"
              size="sm"
              onClick={onLeave}
              className="w-full"
            >
              <LogOut className="h-4 w-4" />
              세션 나가기
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
