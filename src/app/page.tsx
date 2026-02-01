import Link from 'next/link'
import { ArrowRight, History, Zap } from 'lucide-react'
import { getActiveSession, getSessionHistory } from '@/actions/session'
import { getUser } from '@/lib/auth'
import { SessionCard } from '@/components/session/SessionCard'
import { CreateSessionButton } from '@/components/home/CreateSessionButton'
import { RecentSessions } from '@/components/home/RecentSessions'

export default async function HomePage() {
  // 모든 데이터를 서버에서 병렬로 fetch (SSR)
  const [activeSession, user, { sessions: recentSessions }] = await Promise.all([
    getActiveSession(),
    getUser(),
    getSessionHistory(1, 3)
  ])

  const isLoggedIn = !!user
  const activeSessionCount = activeSession ? 1 : 0

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(6,182,212,0.1),transparent_50%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {/* Title */}
            <div className="space-y-4">
              <h1 className="text-6xl font-black uppercase tracking-tight text-white sm:text-7xl lg:text-8xl">
                나태한
                <br />
                <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  모각코
                </span>
              </h1>
              <p className="max-w-2xl text-lg text-slate-400 sm:text-xl">
                느리지만 꾸준하게. 함께 성장하는 습관 추적 플랫폼
              </p>
            </div>

            {/* Live Stats */}
            <div className="flex gap-8 border-l-4 border-cyan-500 pl-6">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-white">
                    {activeSessionCount}
                  </span>
                  <span className="text-sm font-medium uppercase tracking-wide text-slate-500">
                    활성 세션
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Active Session or Create CTA */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <ActiveSessionSection session={activeSession} isLoggedIn={isLoggedIn} />
      </section>

      {/* Recent Sessions */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold uppercase tracking-tight text-white">
                최근 세션
              </h2>
              <p className="text-sm text-slate-400">지난 활동 기록</p>
            </div>
            <Link
              href="/history"
              className="group flex items-center gap-2 text-sm font-medium text-cyan-400 transition-colors hover:text-cyan-300"
            >
              <History className="h-4 w-4" />
              전체 보기
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <RecentSessions sessions={recentSessions} />
        </div>
      </section>
    </div>
  )
}

interface ActiveSessionSectionProps {
  session: Awaited<ReturnType<typeof getActiveSession>>
  isLoggedIn: boolean
}

function ActiveSessionSection({ session, isLoggedIn }: ActiveSessionSectionProps) {
  if (session) {
    const participantCount = session.participants?.length || 0
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20">
            <Zap className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold uppercase tracking-tight text-white">
              진행중인 세션
            </h2>
            <p className="text-sm text-slate-400">지금 바로 참여하세요</p>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Link href={`/session/${session.id}`} className="block">
            <SessionCard
              session={session}
              participantCount={participantCount}
            />
          </Link>
          <div className="flex items-center justify-center rounded-xl border-2 border-dashed border-slate-700 bg-slate-900/50 p-8">
            <Link
              href={`/session/${session.id}`}
              className="group flex flex-col items-center gap-4 text-center"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-cyan-500/10 transition-colors group-hover:bg-cyan-500/20">
                <ArrowRight className="h-8 w-8 text-cyan-400 transition-transform group-hover:translate-x-1" />
              </div>
              <div>
                <p className="text-lg font-bold text-white">참여하기</p>
                <p className="text-sm text-slate-400">
                  {participantCount}명이 함께하고 있어요
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return <CreateSessionButton isLoggedIn={isLoggedIn} />
}
