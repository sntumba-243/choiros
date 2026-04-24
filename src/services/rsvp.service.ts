import { supabase } from '../lib/supabase'
import type { RSVP, RSVPStatus } from '../types/rsvp.types'

export async function getRSVPsByMemberId(memberId: string): Promise<RSVP[]> {
  const { data, error } = await supabase
    .from('rsvps')
    .select('*')
    .eq('member_id', memberId)
  if (error) {
    console.error('getRSVPsByMemberId:', error.message)
    return []
  }
  return (data as RSVP[]) || []
}

export async function getRSVPsByEventId(eventId: string): Promise<RSVP[]> {
  const { data, error } = await supabase
    .from('rsvps')
    .select('*')
    .eq('event_id', eventId)
  if (error) {
    console.error('getRSVPsByEventId:', error.message)
    return []
  }
  return (data as RSVP[]) || []
}

export async function upsertRSVP(
  eventId: string,
  memberId: string,
  status: RSVPStatus,
): Promise<RSVP | null> {
  const now = new Date().toISOString()
  const { data, error } = await supabase
    .from('rsvps')
    .upsert(
      {
        event_id: eventId,
        member_id: memberId,
        status,
        responded_at: now,
        updated_at: now,
      },
      { onConflict: 'event_id,member_id' },
    )
    .select()
    .single()
  if (error) {
    console.error('upsertRSVP:', error.message)
    return null
  }
  return data as RSVP
}

export async function deleteRSVP(eventId: string, memberId: string): Promise<boolean> {
  const { error } = await supabase
    .from('rsvps')
    .delete()
    .eq('event_id', eventId)
    .eq('member_id', memberId)
  if (error) {
    console.error('deleteRSVP:', error.message)
    return false
  }
  return true
}
