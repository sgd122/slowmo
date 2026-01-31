'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Calendar, Clock, Users, Power, Zap, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { SessionTimer } from './SessionTimer'
import { ParticipantGrid } from './ParticipantGrid'
import { JoinSessionForm } from './JoinSessionForm'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { useRealtime } from '@/hooks/useRealtime'
import { useLocalUser } from '@/hooks/useLocalUser'
import { joinSession, updateParticipantTask, leaveSession } from '@/actions/participant'
import { endSession } from '@/actions/session'
import type { SessionWithParticipants, SessionParticipant, Member } from '@/types'
import { cn } from '@/lib/utils/cn'

interface SessionDetailClientProps {
  initialSession: SessionWithParticipants
  existingMembers: Member[]
}

export function SessionDetailClient({ initialSession, existingMembers }: SessionDetailClientProps) {
  const [session, setSession] = useState(initialSession)
  const [isEnding, setIsEnding] = useState(false)
  const router = useRouter()
  const { user, saveUser, clearUser } = useLocalUser()
  const localUserId = user?.memberId || null

  const handleParticipantChange = useCallback(
    (event: 'INSERT' | 'UPDATE' | 'DELETE', participant: SessionParticipant) => {
      setSession((prev) => {
        const participants = [...(prev.participants || [])]
        const index = participants.findIndex((p) => p.id === participant.id)

        if (event === 'DELETE' || !participant.is_active) {
          if (index !== -1) participants.splice(index, 1)
        } else if (event === 'INSERT') {
          if (index === -1) participants.push(participant as any)
        } else if (event === 'UPDATE') {
          if (index !== -1) participants[index] = participant as any
        }

        return { ...prev, participants }
      })
    },
    []
  )

  useRealtime({
    sessionId: session.id,
    onParticipantChange: handleParticipantChange,
  })

  const currentParticipant = session.participants?.find(
    (p) => p.member_id === localUserId && p.is_active
  )

  const handleJoin = async (memberId: string, name: string) => {
    const participant = await joinSession(session.id, name)
    saveUser({
      memberId: participant.member_id,
      memberName: name,
      currentParticipantId: participant.id,
    })
    router.refresh()
  }

  const handleTaskUpdate = async (
    participantId: string,
    field: 'today_task' | 'notes',
    value: string
  ) => {
    await updateParticipantTask(participantId, field, value)
  }

  const handleLeave = async (participantId: string) => {
    await leaveSession(participantId)
    if (participantId === currentParticipant?.id) {
      clearUser()
    }
    router.refresh()
  }

  const handleEndSession = async () => {
    if (!confirm('세션을 종료하시겠습니까?')) return

    setIsEnding(true)
    try {
      await endSession(session.id)
      router.push('/')
    } finally {
      setIsEnding(false)
    }
  }

  const isActive = session.status === 'active'
  const activeParticipants = session.participants?.filter((p) => p.is_active) || []

  const date = new Date(session.date)
  const formattedDate = date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  })

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      {/* Back Button */}
      <Link
        href="/"
        className="group inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition-colors hover:text-cyan-400"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        홈으로 돌아가기
      </Link>

      {/* Session Header */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-800 p-8 shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(6,182,212,0.1),transparent_70%)]" />
        <div className="relative space-y-6">
          {/* Title and Status */}
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <h1 className="text-4xl font-black uppercase tracking-tight text-white">
                  {session.title || '무제 세션'}
                </h1>
                <Badge
                  variant={isActive ? 'active' : 'completed'}
                  className="text-sm"
                >
                  {isActive ? '진행중' : '완료'}
                </Badge>
              </div>
              <p className="text-lg text-slate-400">{formattedDate}</p>
            </div>

            {/* Timer */}
            {isActive && (
              <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-4 backdrop-blur-sm">
                <SessionTimer
                  startTime={session.start_time}
                  maxHours={session.max_duration_hours}
                />
              </div>
            )}
          </div>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-6 border-l-4 border-cyan-500 pl-6">
            <div className="flex items-center gap-2 text-slate-300">
              <Calendar className="h-5 w-5 text-slate-400" />
              <span className="font-medium">
                {new Date(session.start_time).toLocaleTimeString('ko-KR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
                시작
              </span>
            </div>
            {session.end_time && (
              <div className="flex items-center gap-2 text-slate-300">
                <Clock className="h-5 w-5 text-slate-400" />
                <span className="font-medium">
                  {new Date(session.end_time).toLocaleTimeString('ko-KR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                  종료
                </span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-slate-400" />
              <span className="font-bold text-white">
                {activeParticipants.length}
              </span>
              <span className="text-slate-400">명 참여중</span>
            </div>
          </div>

          {/* Actions */}
          {isActive && (
            <div className="flex gap-3 pt-4">
              {currentParticipant && (
                <Button
                  variant="outline"
                  onClick={() => handleLeave(currentParticipant.id)}
                  className="border-slate-600 bg-slate-800/50 text-slate-300 hover:border-red-500 hover:bg-red-500/10 hover:text-red-400"
                >
                  <Power className="mr-2 h-4 w-4" />
                  세션 나가기
                </Button>
              )}
              <Button
                onClick={handleEndSession}
                loading={isEnding}
                variant="outline"
                className="border-slate-600 bg-slate-800/50 text-slate-300 hover:border-cyan-500 hover:bg-cyan-500/10 hover:text-cyan-400"
              >
                <Zap className="mr-2 h-4 w-4" />
                세션 종료
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Participants Grid */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500/20">
            <Users className="h-5 w-5 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold uppercase tracking-tight text-white">
              참여자
            </h2>
            <p className="text-sm text-slate-400">
              현재 {activeParticipants.length}명이 함께하고 있어요
            </p>
          </div>
        </div>

        <ParticipantGrid
          participants={activeParticipants}
          currentUserId={localUserId || undefined}
          onTaskUpdate={handleTaskUpdate}
          onLeave={handleLeave}
        />
      </div>

      {/* Join Form */}
      {isActive && !currentParticipant && (
        <div className="space-y-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-dashed border-slate-800" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-slate-950 px-4 text-sm font-medium uppercase tracking-wide text-slate-500">
                아직 참여하지 않으셨나요?
              </span>
            </div>
          </div>

          <JoinSessionForm
            sessionId={session.id}
            existingMembers={existingMembers}
            onJoin={handleJoin}
          />
        </div>
      )}

      {/* Current User Status */}
      {currentParticipant && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20">
              <Zap className="h-6 w-6 text-emerald-400" />
            </div>
            <div>
              <p className="font-bold text-white">
                {currentParticipant.member?.name}님, 참여중입니다
              </p>
              <p className="text-sm text-slate-400">
                열심히 공부하고 계시네요! 화이팅!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
