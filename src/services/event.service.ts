import { supabase } from '../lib/supabase'
import type { Event } from '../types/database'

export async function getUpcomingEvents(choirId: string, limit = 5): Promise<Event[]> {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('choir_id', choirId)
    .gte('start_time', new Date().toISOString())
    .order('start_time', { ascending: true })
    .limit(limit)
  if (error) {
    console.error('getUpcomingEvents:', error.message)
    return []
  }
  return (data as Event[]) || []
}

export async function getEventsByChoirId(choirId: string): Promise<Event[]> {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('choir_id', choirId)
    .order('start_time', { ascending: false })
    .limit(100)
  if (error) {
    console.error('getEventsByChoirId:', error.message)
    return []
  }
  return (data as Event[]) || []
}

export async function createEvent(event: Omit<Event, 'id' | 'created_at'>): Promise<Event | null> {
  const { data, error } = await supabase
    .from('events')
    .insert(event)
    .select()
    .single()
  if (error) {
    console.error('createEvent:', error.message)
    return null
  }
  return data as Event
}

export async function updateEvent(id: string, updates: Partial<Event>): Promise<Event | null> {
  const { data, error } = await supabase
    .from('events')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) {
    console.error('updateEvent:', error.message)
    return null
  }
  return data as Event
}

export async function deleteEvent(id: string): Promise<boolean> {
  const { error } = await supabase.from('events').delete().eq('id', id)
  if (error) {
    console.error('deleteEvent:', error.message)
    return false
  }
  return true
}
