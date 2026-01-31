'use server'

import { createServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

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

  // Get all members with their participation data calculated from session_participants
  const { data: members, error: membersError } = await supabase
    .from('members')
    .select('id, name, nickname')

  if (membersError) throw new Error(membersError.message)

  // Get participation stats from session_participants
  const { data: participations, error: partError } = await supabase
    .from('session_participants')
    .select('member_id, study_minutes, is_active, join_time')

  if (partError) throw new Error(partError.message)

  // Calculate stats for each member
  const memberStats = (members || []).map(member => {
    const memberParticipations = (participations || []).filter(p => p.member_id === member.id)
    const sessionCount = memberParticipations.length

    // Calculate total study minutes (including active sessions)
    const totalStudyMinutes = memberParticipations.reduce((sum, p) => {
      // For completed sessions with recorded study_minutes
      if (p.study_minutes && p.study_minutes > 0) {
        return sum + p.study_minutes
      }
      // For active sessions OR sessions without study_minutes, calculate from join_time
      if (p.join_time) {
        const now = new Date()
        const joinTime = new Date(p.join_time)
        const calculatedMinutes = Math.floor((now.getTime() - joinTime.getTime()) / 60000)
        return sum + Math.max(0, calculatedMinutes)
      }
      return sum
    }, 0)

    return {
      ...member,
      session_count: sessionCount,
      total_study_minutes: totalStudyMinutes
    }
  })

  // Sort by total study minutes descending
  return memberStats.sort((a, b) => b.total_study_minutes - a.total_study_minutes)
}
