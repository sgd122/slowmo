'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { UserPlus, User, LogIn } from 'lucide-react'
import { joinSession } from '@/actions/participant'
import type { Member } from '@/types'

interface JoinSessionButtonProps {
  sessionId: string
  currentMember: Member | null
}

export function JoinSessionButton({ sessionId, currentMember }: JoinSessionButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleJoin = async () => {
    setIsLoading(true)
    try {
      await joinSession(sessionId)
      router.refresh()
    } catch (error) {
      alert(error instanceof Error ? error.message : '참여에 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  // 비로그인 상태
  if (!currentMember) {
    return (
      <Card className="max-w-md mx-auto border-slate-700 bg-gradient-to-br from-slate-900 to-slate-800">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-700">
              <LogIn className="h-6 w-6 text-slate-400" />
            </div>
            <div>
              <p className="font-bold text-white">로그인이 필요합니다</p>
              <p className="text-sm text-slate-400">
                세션에 참여하려면 먼저 로그인해주세요
              </p>
            </div>
          </div>

          <Link href="/login" className="block">
            <Button variant="outline" className="w-full">
              <LogIn className="mr-2 h-4 w-4" />
              로그인하고 참여하기
            </Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  // 로그인 상태
  return (
    <Card className="max-w-md mx-auto border-cyan-500/30 bg-gradient-to-br from-slate-900 to-slate-800">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center gap-3">
          {currentMember.avatar_url ? (
            <Image
              src={currentMember.avatar_url}
              alt={currentMember.name}
              width={48}
              height={48}
              className="rounded-full"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-700">
              <User className="h-6 w-6 text-slate-400" />
            </div>
          )}
          <div>
            <p className="font-bold text-white">
              {currentMember.github_username || currentMember.name}님
            </p>
            <p className="text-sm text-slate-400">
              세션에 참여하시겠어요?
            </p>
          </div>
        </div>

        <Button
          onClick={handleJoin}
          loading={isLoading}
          className="w-full"
        >
          <UserPlus className="mr-2 h-4 w-4" />
          세션 참여하기
        </Button>
      </CardContent>
    </Card>
  )
}
