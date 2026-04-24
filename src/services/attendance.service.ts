import { supabase } from '../lib/supabase'
import type { Attendance } from '../types/database'

export async function getAttendanceByEventId(eventId: string): Promise<Attendance[]> {
  const { data, error } = await supabase
    .from('attendance')
    .select('*')
    .eq('event_id', eventId)
  if (error) {
    console.error('getAttendanceByEventId:', error.message)
    return []
  }
  return (data as Attendance[]) || []
}

export async function markAttendance(
  eventId: string,
  memberId: string,
  status: 'present' | 'absent' | 'late' | 'excused',
): Promise<Attendance | null> {
  const { data, error } = await supabase
    .from('attendance')
    .upsert(
      {
        event_id: eventId,
        member_id: memberId,
        status,
        checked_in_at: status === 'present' ? new Date().toISOString() : null,
      },
      { onConflict: 'event_id,member_id' },
    )
    .select()
    .single()
  if (error) {
    console.error('markAttendance:', error.message)
    return null
  }
  return data as Attendance
}

export async function bulkMarkAttendance(
  eventId: string,
  records: { memberId: string; status: 'present' | 'absent' | 'late' | 'excused' }[],
): Promise<boolean> {
  const rows = records.map((r) => ({
    event_id: eventId,
    member_id: r.memberId,
    status: r.status,
    checked_in_at: r.status === 'present' ? new Date().toISOString() : null,
  }))
  const { error } = await supabase
    .from('attendance')
    .upsert(rows, { onConflict: 'event_id,member_id' })
  if (error) {
    console.error('bulkMarkAttendance:', error.message)
    return false
  }
  return true
}

export async function getLastEventAttendanceRate(choirId: string): Promise<number> {
  const { data: events } = await supabase
    .from('events')
    .select('id')
    .eq('choir_id', choirId)
    .lt('start_time', new Date().toISOString())
    .order('start_time', { ascending: false })
    .limit(1)
  if (!events || events.length === 0) return 0
  const { data: attendance } = await supabase
    .from('attendance')
    .select('status')
    .eq('event_id', events[0].id)
  if (!attendance || attendance.length === 0) return 0
  const present = attendance.filter(
    (a: { status: string }) => a.status === 'present' || a.status === 'late',
  ).length
  return Math.round((present / attendance.length) * 100)
}
