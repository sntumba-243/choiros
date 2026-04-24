import { supabase } from '../lib/supabase'
import type { Organization } from '../types/database'

export async function getOrganizationById(id: string): Promise<Organization | null> {
  const { data, error } = await supabase
    .from('organizations')
    .select('*')
    .eq('id', id)
    .single()
  if (error) {
    console.error('getOrganizationById:', error.message)
    return null
  }
  return data as Organization
}
