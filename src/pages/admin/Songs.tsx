import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Music, Plus, Search, X, FileText, Trash2 } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { getSongsByChoirId, createSong, deleteSong, uploadPartition } from '../../services/song.service'
import type { Song } from '../../types/database'
import { EmptyState } from '../../components/ui/EmptyState'
import { SkeletonLoader } from '../../components/ui/SkeletonLoader'

const LANGUAGES = ['English', 'French', 'Latin', 'Spanish', 'Kikongo', 'Other']

const VOICE_DOT: Record<string, string> = {
  soprano: 'bg-soprano',
  alto: 'bg-alto',
  tenor: 'bg-tenor',
  bass: 'bg-bass',
}

export default function AdminSongs() {
  const { choir } = useAuth()
  const location = useLocation()
  const [songs, setSongs] = useState<Song[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [modalOpen, setModalOpen] = useState<boolean>(
    () => (location.state as { openAdd?: boolean } | null)?.openAdd === true,
  )

  async function load() {
    if (!choir?.id) return
    setLoading(true)
    const data = await getSongsByChoirId(choir.id)
    setSongs(data)
    setLoading(false)
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [choir?.id])

  const filtered = useMemo(() => {
    if (!query.trim()) return songs
    const q = query.toLowerCase()
    return songs.filter(
      (s) =>
        s.title.toLowerCase().includes(q) || (s.composer || '').toLowerCase().includes(q),
    )
  }, [songs, query])

  async function handleDelete(s: Song) {
    if (!confirm(`Delete "${s.title}"?`)) return
    const ok = await deleteSong(s.id)
    if (ok) setSongs((prev) => prev.filter((x) => x.id !== s.id))
  }

  return (
    <div className='min-w-0'>
      <header className='sticky top-0 z-20 bg-white border-b border-border h-14 px-5 flex items-center justify-between gap-3'>
        <div className='flex items-center gap-2 min-w-0'>
          <h1 className='font-medium text-navy truncate'>Song Library</h1>
          <span className='text-xs bg-surface-3 text-text-secondary px-2 py-0.5 rounded-full flex-shrink-0'>
            {songs.length}
          </span>
        </div>
        <div className='flex items-center gap-2'>
          <div className='relative hidden sm:block'>
            <Search className='w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted' />
            <input
              type='search'
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder='Search...'
              className='w-48 pl-9 pr-3 py-2 border border-border rounded-lg text-sm min-h-[44px] focus:outline-none focus:border-blue'
            />
          </div>
          <button
            type='button'
            onClick={() => setModalOpen(true)}
            className='inline-flex items-center gap-2 bg-blue text-white rounded-lg px-4 py-2 text-sm font-medium min-h-[44px] hover:bg-blue-light transition-colors'
          >
            <Plus className='w-4 h-4' />
            <span className='hidden sm:inline'>Add Song</span>
            <span className='sm:hidden'>Add</span>
          </button>
        </div>
      </header>

      <div className='px-4 sm:px-5 py-4 max-w-7xl mx-auto w-full space-y-4'>
        <div className='relative sm:hidden'>
          <Search className='w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted' />
          <input
            type='search'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='Search songs...'
            className='w-full pl-9 pr-3 py-2 border border-border rounded-lg text-sm min-h-[44px] focus:outline-none focus:border-blue'
          />
        </div>

        {loading ? (
          <SkeletonLoader variant='card' rows={3} />
        ) : filtered.length === 0 ? (
          <div className='bg-white rounded-xl border border-gray-100'>
            <EmptyState
              icon={<Music className='w-6 h-6' />}
              title={query ? 'No matches' : 'No songs in your library'}
              subtitle={
                query ? `No results for "${query}"` : 'Start building your repertoire by adding a song.'
              }
              action={
                !query ? { label: 'Add your first song', onClick: () => setModalOpen(true) } : undefined
              }
            />
          </div>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3'>
            {filtered.map((s) => (
              <div
                key={s.id}
                className='bg-white rounded-xl border border-gray-100 shadow-sm p-5 min-w-0 flex flex-col'
              >
                <div className='flex items-start justify-between gap-3'>
                  <div className='w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0'>
                    <Music className='w-5 h-5 text-warning' />
                  </div>
                  <div className='flex items-center gap-1'>
                    {s.partition_url && (
                      <a
                        href={s.partition_url}
                        target='_blank'
                        rel='noreferrer'
                        className='p-2 min-h-[36px] min-w-[36px] text-blue hover:bg-blue-50 rounded-lg flex items-center justify-center'
                        aria-label='Open sheet music'
                      >
                        <FileText className='w-4 h-4' />
                      </a>
                    )}
                    <button
                      type='button'
                      onClick={() => handleDelete(s)}
                      className='p-2 min-h-[36px] min-w-[36px] text-text-muted hover:text-danger hover:bg-red-50 rounded-lg'
                      aria-label='Delete'
                    >
                      <Trash2 className='w-4 h-4' />
                    </button>
                  </div>
                </div>
                <h3 className='mt-3 font-semibold text-navy truncate'>{s.title}</h3>
                {s.composer && (
                  <p className='mt-0.5 text-sm text-text-secondary truncate'>{s.composer}</p>
                )}
                <div className='mt-3 flex items-center gap-2 flex-wrap'>
                  {s.language && (
                    <span className='text-[10px] font-medium px-2 py-0.5 rounded-full bg-surface-3 text-text-secondary'>
                      {s.language}
                    </span>
                  )}
                  {s.voice_parts && s.voice_parts.length > 0 && (
                    <div className='flex items-center gap-1'>
                      {s.voice_parts.map((vp) => (
                        <span
                          key={vp}
                          className={['w-2 h-2 rounded-full', VOICE_DOT[vp] || 'bg-gray-300'].join(' ')}
                          title={vp}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {modalOpen && (
        <AddSongModal
          onClose={() => setModalOpen(false)}
          onCreated={async () => {
            await load()
            setModalOpen(false)
          }}
        />
      )}
    </div>
  )
}

function AddSongModal({
  onClose,
  onCreated,
}: {
  onClose: () => void
  onCreated: () => void | Promise<void>
}) {
  const { choir } = useAuth()
  const [title, setTitle] = useState('')
  const [composer, setComposer] = useState('')
  const [language, setLanguage] = useState<string>('')
  const [voiceParts, setVoiceParts] = useState<string[]>([])
  const [sheetMode, setSheetMode] = useState<'none' | 'upload' | 'url'>('none')
  const [file, setFile] = useState<File | null>(null)
  const [url, setUrl] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  function toggleVoice(v: string) {
    setVoiceParts((prev) => (prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]))
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!title.trim()) {
      setError('Title is required.')
      return
    }
    if (!choir?.id) {
      setError('No choir selected.')
      return
    }
    setSubmitting(true)
    let partitionUrl: string | undefined
    if (sheetMode === 'upload' && file) {
      const uploaded = await uploadPartition(choir.id, file)
      if (!uploaded) {
        setError('Upload failed. Try again.')
        setSubmitting(false)
        return
      }
      partitionUrl = uploaded
    } else if (sheetMode === 'url' && url.trim()) {
      partitionUrl = url.trim()
    }
    const created = await createSong({
      choir_id: choir.id,
      title: title.trim(),
      composer: composer.trim() || undefined,
      language: language || undefined,
      voice_parts: voiceParts.length > 0 ? voiceParts : undefined,
      partition_url: partitionUrl,
    } as any)
    setSubmitting(false)
    if (!created) {
      setError('Could not add song. Try again.')
      return
    }
    await onCreated()
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
      <div className='absolute inset-0 bg-black/40 backdrop-blur-sm' onClick={onClose} />
      <div className='relative bg-white w-full max-w-lg rounded-2xl shadow-xl flex flex-col max-h-full'>
        <div className='h-14 px-5 border-b border-border flex items-center justify-between flex-shrink-0'>
          <h2 className='font-medium text-navy'>Add Song</h2>
          <button
            type='button'
            onClick={onClose}
            className='p-2 min-h-[44px] min-w-[44px] text-text-muted hover:text-navy hover:bg-surface-3 rounded-lg flex items-center justify-center'
            aria-label='Close'
          >
            <X className='w-5 h-5' />
          </button>
        </div>
        <form onSubmit={onSubmit} className='overflow-y-auto px-5 py-5 space-y-4'>
          <label className='block'>
            <span className='text-xs font-medium text-text-secondary'>Title</span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className='mt-1 w-full border border-border rounded-lg px-3 py-2 text-sm min-h-[44px] focus:outline-none focus:border-blue'
            />
          </label>
          <label className='block'>
            <span className='text-xs font-medium text-text-secondary'>Composer (optional)</span>
            <input
              value={composer}
              onChange={(e) => setComposer(e.target.value)}
              className='mt-1 w-full border border-border rounded-lg px-3 py-2 text-sm min-h-[44px] focus:outline-none focus:border-blue'
            />
          </label>
          <label className='block'>
            <span className='text-xs font-medium text-text-secondary'>Language</span>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className='mt-1 w-full border border-border rounded-lg px-3 py-2 text-sm min-h-[44px] bg-white focus:outline-none focus:border-blue'
            >
              <option value=''>Select…</option>
              {LANGUAGES.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </label>
          <div>
            <span className='text-xs font-medium text-text-secondary'>Voice parts</span>
            <div className='mt-1 grid grid-cols-2 sm:grid-cols-4 gap-2'>
              {(['soprano', 'alto', 'tenor', 'bass'] as const).map((v) => (
                <label
                  key={v}
                  className='flex items-center gap-2 text-sm text-navy border border-border rounded-lg px-3 py-2 min-h-[44px] cursor-pointer capitalize'
                >
                  <input
                    type='checkbox'
                    checked={voiceParts.includes(v)}
                    onChange={() => toggleVoice(v)}
                    className='rounded'
                  />
                  <span className={['w-2 h-2 rounded-full', VOICE_DOT[v]].join(' ')} />
                  {v}
                </label>
              ))}
            </div>
          </div>
          <div>
            <span className='text-xs font-medium text-text-secondary'>Sheet music</span>
            <div className='mt-1 space-y-2'>
              {(['none', 'upload', 'url'] as const).map((opt) => (
                <label key={opt} className='flex items-center gap-2 text-sm text-navy'>
                  <input
                    type='radio'
                    checked={sheetMode === opt}
                    onChange={() => setSheetMode(opt)}
                  />
                  {opt === 'none' ? 'No sheet music' : opt === 'upload' ? 'Upload file' : 'Paste URL'}
                </label>
              ))}
              {sheetMode === 'upload' && (
                <input
                  type='file'
                  accept='.pdf,.png,.jpg,.jpeg,.xml'
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className='w-full border border-border rounded-lg px-3 py-2 text-sm'
                />
              )}
              {sheetMode === 'url' && (
                <input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder='https://...'
                  className='w-full border border-border rounded-lg px-3 py-2 text-sm min-h-[44px] focus:outline-none focus:border-blue'
                />
              )}
            </div>
          </div>
          {error && (
            <div className='bg-red-50 border border-red-100 rounded-lg px-3 py-2 text-sm text-danger'>
              {error}
            </div>
          )}
        </form>
        <div className='h-16 px-5 border-t border-border flex items-center justify-end gap-2 flex-shrink-0'>
          <button
            type='button'
            onClick={onClose}
            className='text-sm text-text-secondary px-4 py-2 rounded-lg min-h-[44px] hover:bg-surface-3'
          >
            Cancel
          </button>
          <button
            type='button'
            disabled={submitting}
            onClick={(e) => onSubmit(e as any)}
            className='bg-blue text-white rounded-lg px-4 py-2 text-sm font-medium min-h-[44px] hover:bg-blue-light transition-colors disabled:opacity-60'
          >
            {submitting ? 'Adding…' : 'Add Song'}
          </button>
        </div>
      </div>
    </div>
  )
}
