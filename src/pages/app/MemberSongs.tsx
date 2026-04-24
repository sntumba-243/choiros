import { useEffect, useMemo, useState } from 'react'
import { Music, Search } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { getSongsByChoirId } from '../../services/song.service'
import type { Song } from '../../types/database'
import { SongCard } from '../../components/ui/SongCard'
import { EmptyState } from '../../components/ui/EmptyState'
import { SkeletonLoader } from '../../components/ui/SkeletonLoader'

type PartFilter = 'all' | 'soprano' | 'alto' | 'tenor' | 'bass'

const FILTERS: { key: PartFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'soprano', label: 'Soprano' },
  { key: 'alto', label: 'Alto' },
  { key: 'tenor', label: 'Tenor' },
  { key: 'bass', label: 'Bass' },
]

function memberPartKey(voicePart?: string): PartFilter | null {
  if (!voicePart) return null
  if (voicePart === 'mezzo_soprano') return 'soprano'
  if (voicePart === 'baritone') return 'bass'
  if (voicePart === 'soprano' || voicePart === 'alto' || voicePart === 'tenor' || voicePart === 'bass')
    return voicePart
  return null
}

export default function MemberSongs() {
  const { member, choir, loading: authLoading } = useAuth()
  const [songs, setSongs] = useState<Song[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<PartFilter>('all')

  useEffect(() => {
    if (authLoading) return
    if (!choir?.id) {
      setLoading(false)
      return
    }
    let cancelled = false
    ;(async () => {
      setLoading(true)
      const data = await getSongsByChoirId(choir.id)
      if (!cancelled) {
        setSongs(data)
        setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [authLoading, choir?.id])

  const memberPart = memberPartKey(member?.voice_part)

  const filtered = useMemo(() => {
    let list = songs
    if (filter !== 'all') {
      list = list.filter((s) => s.voice_parts && s.voice_parts.includes(filter))
    }
    if (query.trim()) {
      const q = query.toLowerCase()
      list = list.filter(
        (s) =>
          s.title.toLowerCase().includes(q) || (s.composer || '').toLowerCase().includes(q),
      )
    }
    return list
  }, [songs, filter, query])

  return (
    <div className='min-w-0'>
      <header className='sticky top-0 z-20 bg-white border-b border-border h-14 px-5 flex items-center justify-between'>
        <div className='min-w-0 flex items-center gap-2'>
          <span className='text-text-secondary text-sm truncate'>{choir?.name}</span>
          <span className='text-text-muted'>/</span>
          <h1 className='font-medium text-navy'>Songs</h1>
        </div>
      </header>

      <div className='px-4 sm:px-5 py-5 max-w-5xl mx-auto w-full space-y-4'>
        <div className='relative'>
          <Search className='w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted' />
          <input
            type='search'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='Search songs...'
            className='w-full pl-9 pr-3 py-2 border border-border rounded-lg text-sm min-h-[44px] bg-white focus:outline-none focus:border-blue'
          />
        </div>

        <div className='flex gap-2 overflow-x-auto -mx-1 px-1 pb-1'>
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type='button'
              onClick={() => setFilter(f.key)}
              className={[
                'text-sm px-4 py-1.5 rounded-full whitespace-nowrap transition-colors min-h-[36px]',
                filter === f.key
                  ? 'bg-blue text-white'
                  : 'text-text-secondary bg-white border border-border hover:text-navy',
              ].join(' ')}
            >
              {f.label}
            </button>
          ))}
        </div>

        {loading ? (
          <SkeletonLoader variant='card' rows={3} />
        ) : filtered.length === 0 ? (
          <div className='bg-white rounded-xl border border-gray-100'>
            <EmptyState
              icon={<Music className='w-6 h-6' />}
              title={query || filter !== 'all' ? 'No matches' : 'No songs in your library yet'}
              subtitle={
                query
                  ? `No results for "${query}"`
                  : filter !== 'all'
                    ? 'Try a different voice part filter.'
                    : 'Sheet music will appear here once your director adds songs.'
              }
            />
          </div>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3'>
            {filtered.map((s) => {
              const match =
                !!memberPart && !!s.voice_parts && s.voice_parts.includes(memberPart)
              return <SongCard key={s.id} song={s} voicePartMatch={match} />
            })}
          </div>
        )}
      </div>
    </div>
  )
}
