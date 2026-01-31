'use client'

import { createBrowserClient } from '@/lib/supabase/client'
import { Github } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { Logo } from '@/components/ui/Logo'

function LoginContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  const handleGitHubLogin = async () => {
    const supabase = createBrowserClient()

    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        scopes: 'read:org read:user user:email',
      },
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex justify-center">
            <Logo size="lg" />
          </Link>
        </div>

        {/* Login Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">
          <h1 className="text-xl font-semibold text-slate-100 text-center mb-2">
            로그인
          </h1>
          <p className="text-slate-400 text-center mb-8">
            GitHub 계정으로 로그인하세요
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 text-sm text-center">
                로그인 중 오류가 발생했습니다. 다시 시도해주세요.
              </p>
            </div>
          )}

          <button
            onClick={handleGitHubLogin}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-slate-100 font-medium transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Github className="h-5 w-5" />
            GitHub로 계속하기
          </button>

          <p className="mt-6 text-xs text-slate-500 text-center">
            로그인하면 GitHub Organization 멤버십을 기반으로
            <br />
            자동으로 멤버로 등록됩니다.
          </p>
        </div>

        {/* Back to home */}
        <p className="mt-6 text-center">
          <Link
            href="/"
            className="text-sm text-slate-400 hover:text-slate-300 transition-colors"
          >
            ← 홈으로 돌아가기
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-400" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  )
}
