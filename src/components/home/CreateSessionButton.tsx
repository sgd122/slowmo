'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PlusCircle, LogIn } from 'lucide-react'
import Link from 'next/link'
import { CreateSessionModal } from '@/components/session/CreateSessionModal'
import { createSession } from '@/actions/session'

interface CreateSessionButtonProps {
  isLoggedIn: boolean
}

export function CreateSessionButton({ isLoggedIn }: CreateSessionButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const router = useRouter()

  const handleCreate = async (title: string | null) => {
    try {
      const session = await createSession(title || undefined)
      router.push(`/session/${session.id}`)
    } catch (error) {
      if (error instanceof Error && error.message === '로그인이 필요합니다.') {
        router.push('/login')
      } else {
        alert(error instanceof Error ? error.message : '세션 생성에 실패했습니다.')
      }
    }
  }

  const handleClick = () => {
    if (isLoggedIn) {
      setIsModalOpen(true)
    }
  }

  return (
    <>
      <div className="group relative overflow-hidden rounded-2xl border border-slate-700 bg-gradient-to-br from-slate-900 to-slate-800 p-12 transition-all hover:border-cyan-500/50 hover:shadow-2xl hover:shadow-cyan-500/10">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 opacity-0 transition-opacity group-hover:opacity-100" />
        <div className="relative flex flex-col items-center gap-6 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20 transition-transform group-hover:scale-110">
            <PlusCircle className="h-10 w-10 text-white" />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-black uppercase tracking-tight text-white">
              새 세션 시작
            </h2>
            <p className="text-slate-400">
              지금 바로 공부 세션을 시작하세요
            </p>
          </div>

          {isLoggedIn ? (
            <button
              onClick={handleClick}
              className="rounded-lg bg-cyan-500 px-8 py-3 font-bold text-white transition-all hover:bg-cyan-400 active:scale-95"
            >
              시작하기
            </button>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-2 rounded-lg bg-slate-700 px-8 py-3 font-bold text-white transition-all hover:bg-slate-600 active:scale-95"
            >
              <LogIn className="h-4 w-4" />
              로그인 후 시작하기
            </Link>
          )}
        </div>
      </div>

      <CreateSessionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreated={handleCreate}
      />
    </>
  )
}
