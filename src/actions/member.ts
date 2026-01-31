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

  const { data, error } = await supabase
    .from('members')
    .select()
    .order('total_study_minutes', { ascending: false })

  if (error) throw new Error(error.message)
  return data || []
}
