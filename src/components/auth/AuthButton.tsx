import { createServerClient } from '@/lib/supabase/server'
import { UserMenu } from './UserMenu'
import Link from 'next/link'
import { LogIn } from 'lucide-react'
import type { Member } from '@/types'

export async function AuthButton() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return (
      <Link
        href="/login"
        className="flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-slate-100 transition-colors hover:bg-slate-700"
      >
        <LogIn className="h-4 w-4" />
        로그인
      </Link>
    )
  }

  // 현재 사용자의 member 정보 조회
  let { data: member } = await supabase
    .from('members')
    .select('*')
    .eq('user_id', user.id)
    .single()

  // member가 없으면 자동 생성
  if (!member) {
    const { data: newMember } = await supabase
      .from('members')
      .insert({
        user_id: user.id,
        email: user.email,
        name: user.user_metadata?.full_name || user.user_metadata?.user_name || user.email?.split('@')[0] || 'User',
        nickname: user.user_metadata?.user_name || null,
        avatar_url: user.user_metadata?.avatar_url || null,
        github_username: user.user_metadata?.user_name || null,
      })
      .select()
      .single()

    member = newMember
  }

  // 그래도 없으면 user 정보로 임시 member 객체 생성
  if (!member) {
    const tempMember: Member = {
      id: user.id,
      user_id: user.id,
      email: user.email || null,
      name: user.user_metadata?.full_name || user.user_metadata?.user_name || 'User',
      nickname: user.user_metadata?.user_name || null,
      avatar_url: user.user_metadata?.avatar_url || null,
      github_username: user.user_metadata?.user_name || null,
      github_id: null,
      total_study_minutes: 0,
      session_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    return <UserMenu member={tempMember} />
  }

  return <UserMenu member={member} />
}
