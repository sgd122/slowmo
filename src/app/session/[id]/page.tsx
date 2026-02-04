import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { getSession } from '@/actions/session'
import { getCurrentMember } from '@/lib/auth'
import { SessionDetailClient } from '@/components/session/SessionDetailClient'
import { Skeleton } from '@/components/ui/Skeleton'

// ISR: 10초마다 재검증 (실시간 느낌 유지하면서 Edge Request 절약)
export const revalidate = 10

interface SessionPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function SessionPage({ params }: SessionPageProps) {
  const { id } = await params
  const [session, currentMember] = await Promise.all([
    getSession(id),
    getCurrentMember()
  ])

  if (!session) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <Suspense fallback={<SessionDetailSkeleton />}>
        <SessionDetailClient initialSession={session} currentMember={currentMember} />
      </Suspense>
    </div>
  )
}

function SessionDetailSkeleton() {
  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-12 sm:px-6 lg:px-8">
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-64 w-full" />
      <Skeleton className="h-48 w-full" />
    </div>
  )
}
