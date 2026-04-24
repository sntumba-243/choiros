import { supabase } from '../lib/supabase'
import type { Choir } from '../types/database'

export async function getChoirById(id: string): Promise<Choir | null> {
  const { data, error } = await supabase
    .from('choirs')
    .select('*')
    .eq('id', id)
    .single()
  if (error) {
    console.error('getChoirById:', error.message)
    return null
  }
  return data as Choir
}

export async function updateChoir(id: string, updates: Partial<Choir>): Promise<Choir | null> {
  const { data, error } = await supabase
    .from('choirs')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) {
    console.error('updateChoir:', error.message)
    return null
  }
  return data as Choir
}
