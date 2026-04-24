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
