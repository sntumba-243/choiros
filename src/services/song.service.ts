import { supabase } from '../lib/supabase'
import type { Song } from '../types/database'

export async function getSongsByChoirId(choirId: string): Promise<Song[]> {
  const { data, error } = await supabase
    .from('songs')
    .select('*')
    .eq('choir_id', choirId)
    .order('created_at', { ascending: false })
  if (error) {
    console.error('getSongsByChoirId:', error.message)
    return []
  }
  return (data as Song[]) || []
}

export async function createSong(song: Omit<Song, 'id' | 'created_at'>): Promise<Song | null> {
  const { data, error } = await supabase
    .from('songs')
    .insert(song)
    .select()
    .single()
  if (error) {
    console.error('createSong:', error.message)
    return null
  }
  return data as Song
}

export async function updateSong(id: string, updates: Partial<Song>): Promise<Song | null> {
  const { data, error } = await supabase
    .from('songs')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) {
    console.error('updateSong:', error.message)
    return null
  }
  return data as Song
}

export async function deleteSong(id: string): Promise<boolean> {
  const { error } = await supabase.from('songs').delete().eq('id', id)
  if (error) {
    console.error('deleteSong:', error.message)
    return false
  }
  return true
}

export async function uploadPartition(choirId: string, file: File): Promise<string | null> {
  const ext = file.name.split('.').pop()
  const path = choirId + '/' + Date.now() + '.' + ext
  const { error } = await supabase.storage
    .from('partitions')
    .upload(path, file, { upsert: false })
  if (error) {
    console.error('uploadPartition:', error.message)
    return null
  }
  const { data } = supabase.storage.from('partitions').getPublicUrl(path)
  return data.publicUrl
}
