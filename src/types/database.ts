export interface Organization {
  id: string
  name: string
  slug: string
  plan: 'free' | 'starter' | 'growth' | 'network'
  subscription_status: 'trialing' | 'active' | 'past_due' | 'canceled'
  stripe_customer_id?: string
  stripe_subscription_id?: string
  trial_ends_at?: string
  member_limit?: number
  choir_limit: number
  created_at: string
}

export interface Choir {
  id: string
  organization_id: string
  name: string
  description?: string
  logo_url?: string
  timezone: string
  created_at: string
}

export type VoicePart =
  | 'soprano'
  | 'mezzo_soprano'
  | 'alto'
  | 'tenor'
  | 'baritone'
  | 'bass'

export type MemberRole = 'admin' | 'section_leader' | 'member' | 'guest'
export type MemberStatus = 'active' | 'inactive' | 'pending'

export interface Member {
  id: string
  choir_id: string
  organization_id: string
  user_id?: string
  first_name: string
  last_name: string
  email: string
  phone?: string
  voice_part?: VoicePart
  role: MemberRole
  status: MemberStatus
  avatar_url?: string
  joined_at: string
  created_at: string
}

export type EventType = 'rehearsal' | 'performance' | 'service' | 'other'

export interface Event {
  id: string
  choir_id: string
  title: string
  description?: string
  event_type: EventType
  start_time: string
  end_time: string
  location?: string
  is_mandatory: boolean
  created_at: string
}

export interface Song {
  id: string
  choir_id?: string
  title: string
  composer?: string
  arranger?: string
  language?: string
  voice_parts?: string[]
  partition_url?: string
  audio_url?: string
  tags?: string[]
  created_at: string
}

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused'

export interface Attendance {
  id: string
  event_id: string
  member_id: string
  status: AttendanceStatus
  checked_in_at?: string
  notes?: string
}
