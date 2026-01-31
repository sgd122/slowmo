// Database Types
export interface Member {
  id: string
  name: string
  nickname: string | null
  total_study_minutes: number
  session_count: number
  created_at: string
  updated_at: string
  // GitHub OAuth fields
  user_id: string | null
  email: string | null
  avatar_url: string | null
  github_username: string | null
  github_id: number | null
}

export interface AuthUser {
  id: string
  email: string | null
  user_metadata: {
    avatar_url?: string
    full_name?: string
    user_name?: string
    provider_id?: string
  }
}

export interface Session {
  id: string
  title: string | null
  date: string
  start_time: string
  end_time: string | null
  status: 'active' | 'completed'
  max_duration_hours: number
  created_at: string
  updated_at: string
}

export interface SessionParticipant {
  id: string
  session_id: string
  member_id: string
  today_task: string | null
  notes: string | null
  join_time: string
  leave_time: string | null
  study_minutes: number
  is_active: boolean
  created_at: string
  updated_at: string
  member?: Member
}

export interface SessionWithParticipants extends Session {
  participants: (SessionParticipant & { member: Member })[]
}

// Component Props
export interface ParticipantCardProps {
  participant: SessionParticipant & { member: Member }
  isOwner: boolean
  onTaskUpdate: (field: 'today_task' | 'notes', value: string) => void
  onLeave: () => void
}

export interface SessionTimerProps {
  startTime: string
  maxHours?: number
  onExpire?: () => void
}

export interface JoinSessionFormProps {
  sessionId: string
  existingMembers: Member[]
  onJoin: (memberId: string) => void
}
