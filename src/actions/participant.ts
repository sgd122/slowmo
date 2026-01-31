'use server'

import { createServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function joinSession(sessionId: string) {
  const supabase = await createServerClient()

  // 현재 인증된 사용자 확인
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('로그인이 필요합니다.')
  }

  // 사용자의 member 레코드 조회
  const { data: member } = await supabase
    .from('members')
    .select()
    .eq('user_id', user.id)
    .single()

  if (!member) {
    throw new Error('멤버 정보를 찾을 수 없습니다.')
  }

  // 이미 참여중인지 확인
  const { data: existing } = await supabase
    .from('session_participants')
    .select()
    .eq('session_id', sessionId)
    .eq('member_id', member.id)
    .maybeSingle()

  if (existing) {
    // 기존 참여 정보 업데이트 (재참여)
    const { data, error } = await supabase
      .from('session_participants')
      .update({
        is_active: true,
        join_time: new Date().toISOString(),
        leave_time: null
      })
      .eq('id', existing.id)
      .select(`*, member:members(*)`)
      .single()

    if (error) throw new Error(error.message)
    revalidatePath(`/session/${sessionId}`)
    return data
  }

  // 새로 참여
  const { data, error } = await supabase
    .from('session_participants')
    .insert({
      session_id: sessionId,
      member_id: member.id,
      join_time: new Date().toISOString(),
      is_active: true
    })
    .select(`*, member:members(*)`)
    .single()

  if (error) throw new Error(error.message)

  revalidatePath(`/session/${sessionId}`)
  return data
}

export async function updateParticipantTask(
  participantId: string,
  field: 'today_task' | 'notes',
  value: string
) {
  const supabase = await createServerClient()

  const maxLength = field === 'today_task' ? 500 : 1000
  if (value.length > maxLength) {
    throw new Error(`${maxLength}자를 초과할 수 없습니다.`)
  }

  const { error } = await supabase
    .from('session_participants')
    .update({ [field]: value })
    .eq('id', participantId)

  if (error) throw new Error(error.message)
}

export async function leaveSession(participantId: string) {
  const supabase = await createServerClient()

  const { data: participant } = await supabase
    .from('session_participants')
    .select('join_time, member_id, session_id')
    .eq('id', participantId)
    .single()

  if (!participant) throw new Error('참여 정보를 찾을 수 없습니다.')

  const leaveTime = new Date()
  const joinTime = new Date(participant.join_time)
  const studyMinutes = Math.floor((leaveTime.getTime() - joinTime.getTime()) / 60000)

  const { error } = await supabase
    .from('session_participants')
    .update({
      leave_time: leaveTime.toISOString(),
      study_minutes: studyMinutes,
      is_active: false
    })
    .eq('id', participantId)

  if (error) throw new Error(error.message)

  // Update member stats
  const { data: stats } = await supabase
    .from('session_participants')
    .select('study_minutes')
    .eq('member_id', participant.member_id)

  const totalMinutes = stats?.reduce((sum, p) => sum + (p.study_minutes || 0), 0) || 0

  await supabase
    .from('members')
    .update({
      total_study_minutes: totalMinutes,
      session_count: stats?.length || 0
    })
    .eq('id', participant.member_id)

  revalidatePath(`/session/${participant.session_id}`)
}
