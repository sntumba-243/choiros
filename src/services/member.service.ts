import { supabase } from '../lib/supabase'
import type { Member } from '../types/database'

export async function getMembersByChoirId(choirId: string): Promise<Member[]> {
  const { data, error } = await supabase
    .from('members')
    .select('*')
    .eq('choir_id', choirId)
    .order('created_at', { ascending: false })
  if (error) {
    console.error('getMembersByChoirId:', error.message)
    return []
  }
  return (data as Member[]) || []
}

export async function deleteMember(id: string): Promise<boolean> {
  const { error } = await supabase.from('members').delete().eq('id', id)
  if (error) {
    console.error('deleteMember:', error.message)
    return false
  }
  return true
}

export async function createMember(
  member: Omit<Member, 'id' | 'created_at' | 'joined_at'>,
): Promise<Member | null> {
  const { data, error } = await supabase
    .from('members')
    .insert(member)
    .select()
    .single()
  if (error) {
    console.error('createMember:', error.message)
    return null
  }
  return data as Member
}

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
