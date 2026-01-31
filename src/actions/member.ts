'use server'

import { createServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateMemberName(name: string) {
  const supabase = await createServerClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('로그인이 필요합니다.')
  }

  if (!name.trim() || name.length > 50) {
    throw new Error('이름은 1~50자여야 합니다.')
  }

  const { error } = await supabase
    .from('members')
    .update({ name: name.trim() })
    .eq('user_id', user.id)

  if (error) throw new Error(error.message)

  revalidatePath('/profile')
  revalidatePath('/members')
}

export async function getOrCreateMember(name: string, nickname?: string) {
  const supabase = await createServerClient()

  let query = supabase
    .from('members')
    .select()
    .eq('name', name.trim())

  if (nickname) {
    query = query.eq('nickname', nickname.trim())
  } else {
    query = query.is('nickname', null)
  }

  const { data: existing } = await query.maybeSingle()

  if (existing) return existing

  const { data, error } = await supabase
    .from('members')
    .insert({
      name: name.trim(),
      nickname: nickname?.trim() || null
    })
    .select()
    .single()

  if (error) throw new Error(error.message)

  revalidatePath('/members')
  return data
}

export async function getMembers() {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from('members')
    .select()
    .order('name')

  if (error) throw new Error(error.message)
  return data || []
}

export async function getMemberStats() {
  const supabase = await createServerClient()

  // 단일 쿼리로 멤버와 참여 정보를 함께 조회
  const { data: members, error: membersError } = await supabase
    .from('members')
    .select(`
      *,
      participations:session_participants(
        study_minutes,
        is_active,
        join_time
      )
    `)

  if (membersError) throw new Error(membersError.message)

  // 통계 계산
  const memberStats = (members || []).map(member => {
    const participations = member.participations || []
    const sessionCount = participations.length

    // 총 공부 시간 계산 (활성 세션 포함)
    const totalStudyMinutes = participations.reduce((sum: number, p: { study_minutes: number | null, is_active: boolean, join_time: string | null }) => {
      if (p.study_minutes && p.study_minutes > 0) {
        return sum + p.study_minutes
      }
      if (p.join_time) {
        const now = new Date()
        const joinTime = new Date(p.join_time)
        const calculatedMinutes = Math.floor((now.getTime() - joinTime.getTime()) / 60000)
        return sum + Math.max(0, calculatedMinutes)
      }
      return sum
    }, 0)

    // participations 필드 제거하고 반환
    const { participations: _, ...memberData } = member
    return {
      ...memberData,
      session_count: sessionCount,
      total_study_minutes: totalStudyMinutes
    }
  })

  return memberStats.sort((a, b) => b.total_study_minutes - a.total_study_minutes)
}
