import { Card, CardContent } from '@/components/ui/Card'
import { Clock, Calendar, User } from 'lucide-react'
import Image from 'next/image'
import type { Member } from '@/types'

interface MemberCardProps {
  member: Member
}

export function MemberCard({ member }: MemberCardProps) {
  const displayName = member.nickname || member.name
  const initial = displayName.charAt(0).toUpperCase()
  const hours = Math.floor(member.total_study_minutes / 60)
  const minutes = member.total_study_minutes % 60

  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="shrink-0">
            {member.avatar_url ? (
              <Image
                src={member.avatar_url}
                alt={displayName}
                width={56}
                height={56}
                className="rounded-full ring-2 ring-violet-400/30"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-xl font-bold shadow-lg ring-2 ring-violet-400/30">
                {initial}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 space-y-3">
            {/* Name */}
            <div>
              <h3 className="text-lg font-bold text-white truncate">
                {displayName}
              </h3>
              {member.github_username && (
                <p className="text-sm text-slate-400 truncate">
                  @{member.github_username}
                </p>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              {/* Study Time */}
              <div className="flex items-center gap-2 bg-slate-800/50 rounded-lg p-2 border border-slate-700/50">
                <Clock className="h-4 w-4 text-emerald-400 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-slate-400">총 학습시간</p>
                  <p className="text-sm font-semibold text-white truncate">
                    {hours > 0 ? `${hours}시간 ${minutes}분` : `${minutes}분`}
                  </p>
                </div>
              </div>

              {/* Session Count */}
              <div className="flex items-center gap-2 bg-slate-800/50 rounded-lg p-2 border border-slate-700/50">
                <Calendar className="h-4 w-4 text-blue-400 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-slate-400">참여 횟수</p>
                  <p className="text-sm font-semibold text-white truncate">
                    {member.session_count}회
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
