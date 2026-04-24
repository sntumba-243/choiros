import { supabase } from '../lib/supabase'
import type { Member } from '../types/database'

export async function getMemberByUserId(userId: string): Promise<Member | null> {
  const { data, error } = await supabase
    .from('members')
    .select('*')
    .eq('user_id', userId)
    .single()
  if (error) {
    console.error('getMemberByUserId:', error.message)
    return null
  }
  return data as Member
}

export async function updateMember(id: string, updates: Partial<Member>): Promise<Member | null> {
  const { data, error } = await supabase
    .from('members')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) {
    console.error('updateMember:', error.message)
    return null
  }
  return data as Member
}
