'use server'

import { createServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createSession(title?: string) {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from('sessions')
    .insert({
      title: title || null,
      date: new Date().toISOString().split('T')[0],
      start_time: new Date().toISOString(),
      status: 'active'
    })
    .select()
    .single()

  if (error) throw new Error(error.message)

  revalidatePath('/')
  return data
}

export async function getActiveSession() {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from('sessions')
    .select(`
      *,
      participants:session_participants(
        *,
        member:members(*)
      )
    `)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) throw new Error(error.message)
  return data
}

export async function getSession(sessionId: string) {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from('sessions')
    .select(`
      *,
      participants:session_participants(
        *,
        member:members(*)
      )
    `)
    .eq('id', sessionId)
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function endSession(sessionId: string) {
  const supabase = await createServerClient()

  await supabase
    .from('session_participants')
    .update({
      leave_time: new Date().toISOString(),
      is_active: false
    })
    .eq('session_id', sessionId)
    .is('leave_time', null)

  const { error } = await supabase
    .from('sessions')
    .update({
      status: 'completed',
      end_time: new Date().toISOString()
    })
    .eq('id', sessionId)

  if (error) throw new Error(error.message)

  revalidatePath('/')
  revalidatePath(`/session/${sessionId}`)
}

export async function getSessionHistory(page = 1, limit = 10) {
  const supabase = await createServerClient()
  const offset = (page - 1) * limit

  const { data, error, count } = await supabase
    .from('sessions')
    .select(`
      *,
      participants:session_participants(id)
    `, { count: 'exact' })
    .eq('status', 'completed')
    .order('date', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) throw new Error(error.message)
  return { sessions: data || [], total: count || 0 }
}
