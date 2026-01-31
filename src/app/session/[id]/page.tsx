import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { getSession } from '@/actions/session'
import { getMembers } from '@/actions/member'
import { SessionDetailClient } from '@/components/session/SessionDetailClient'
import { Skeleton } from '@/components/ui/Skeleton'

interface SessionPageProps {
  params: {
    id: string
  }
}

export default async function SessionPage({ params }: SessionPageProps) {
  const session = await getSession(params.id)
  const members = await getMembers()

  if (!session) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <Suspense fallback={<SessionDetailSkeleton />}>
        <SessionDetailClient initialSession={session} existingMembers={members} />
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
