export type RSVPStatus = 'going' | 'maybe' | 'not_going' | 'pending'

export interface RSVP {
  id: string
  event_id: string
  member_id: string
  status: RSVPStatus
  responded_at?: string
  created_at: string
  updated_at: string
}
