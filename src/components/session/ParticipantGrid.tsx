import { ParticipantCard } from './ParticipantCard'
import type { SessionParticipant, Member } from '@/types'

interface ParticipantGridProps {
  participants: (SessionParticipant & { member: Member })[]
  currentUserId?: string
  onTaskUpdate: (participantId: string, field: 'today_task' | 'notes', value: string) => void
  onLeave: (participantId: string) => void
  isSessionActive?: boolean
}

export function ParticipantGrid({
  participants,
  currentUserId,
  onTaskUpdate,
  onLeave,
  isSessionActive = true
}: ParticipantGridProps) {
  if (participants.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 text-slate-400">
        <p>참여자가 없습니다</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {participants.map((participant) => (
        <ParticipantCard
          key={participant.id}
          participant={participant}
          isOwner={participant.member_id === currentUserId && isSessionActive}
          onTaskUpdate={(field, value) => onTaskUpdate(participant.id, field, value)}
          onLeave={() => onLeave(participant.id)}
          isReadOnly={!isSessionActive}
        />
      ))}
    </div>
  )
}
