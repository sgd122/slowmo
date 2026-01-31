'use server'

import { createServerClient } from '@/lib/supabase/server'
import type { Session, Member, SessionWithParticipants } from '@/types'

// Get session history with participant counts
export async function getSessionHistory(page = 1, limit = 10) {
  const supabase = await createServerClient()
  const offset = (page - 1) * limit

  const { data: sessions, error, count } = await supabase
    .from('sessions')
    .select('*, session_participants(count)', { count: 'exact' })
    .order('date', { ascending: false })
    .order('start_time', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) throw error

  return {
    sessions: sessions as unknown as (Session & { session_participants: { count: number }[] })[],
    total: count || 0,
    page,
    limit
  }
}

// Get all members
export async function getMembers() {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from('members')
    .select('*')
    .order('name', { ascending: true })

  if (error) throw error

  return data as Member[]
}

// Get member statistics
export async function getMemberStats(memberId: string) {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from('members')
    .select('total_study_minutes, session_count')
    .eq('id', memberId)
    .single()

  if (error) throw error

  return data
}
