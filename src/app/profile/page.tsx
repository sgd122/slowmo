import { redirect } from 'next/navigation'
import { getCurrentMember } from '@/lib/auth'
import { createServerClient } from '@/lib/supabase/server'
import { User, Clock, Calendar, Github, Mail, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { EditableName } from '@/components/profile/EditableName'

export default async function ProfilePage() {
  const member = await getCurrentMember()

  if (!member) {
    redirect('/login')
  }

  // 참여 통계 조회
  const supabase = await createServerClient()
  const { data: participations } = await supabase
    .from('session_participants')
    .select('study_minutes, join_time')
    .eq('member_id', member.id)

  const totalSessions = participations?.length || 0
  const totalMinutes = participations?.reduce((sum, p) => {
    if (p.study_minutes) return sum + p.study_minutes
    if (p.join_time) {
      const mins = Math.floor((Date.now() - new Date(p.join_time).getTime()) / 60000)
      return sum + Math.max(0, mins)
    }
    return sum
  }, 0) || 0

  const hours = Math.floor(totalMinutes / 60)
  const mins = totalMinutes % 60

  return (
    <main className="min-h-screen bg-slate-950">
      <div className="mx-auto max-w-2xl px-4 py-8">
        {/* Back */}
        <Link
          href="/"
          className="group inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition-colors hover:text-cyan-400 mb-8"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          홈으로 돌아가기
        </Link>

        {/* Profile Card */}
        <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-800 p-8 shadow-xl">
          {/* Avatar & Name */}
          <div className="flex items-center gap-6 mb-8">
            {member.avatar_url ? (
              <Image
                src={member.avatar_url}
                alt={member.name}
                width={80}
                height={80}
                className="rounded-full border-4 border-slate-700"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-700 border-4 border-slate-600">
                <User className="h-10 w-10 text-slate-400" />
              </div>
            )}
            <div>
              <EditableName initialName={member.name} />
              {member.github_username && (
                <p className="text-slate-400 flex items-center gap-1 mt-1">
                  <Github className="h-4 w-4" />
                  @{member.github_username}
                </p>
              )}
              {member.email && (
                <p className="text-slate-500 flex items-center gap-1 mt-1 text-sm">
                  <Mail className="h-3 w-3" />
                  {member.email}
                </p>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-slate-800/50 border border-slate-700 p-4">
              <div className="flex items-center gap-2 text-slate-400 mb-2">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">참여 세션</span>
              </div>
              <p className="text-3xl font-bold text-white">{totalSessions}</p>
            </div>

            <div className="rounded-xl bg-slate-800/50 border border-slate-700 p-4">
              <div className="flex items-center gap-2 text-slate-400 mb-2">
                <Clock className="h-4 w-4" />
                <span className="text-sm">총 공부 시간</span>
              </div>
              <p className="text-3xl font-bold text-white">
                {hours > 0 ? `${hours}시간 ` : ''}{mins}분
              </p>
            </div>
          </div>

          {/* Member Since */}
          <div className="mt-6 pt-6 border-t border-slate-700">
            <p className="text-sm text-slate-500">
              가입일: {new Date(member.created_at).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
