import { Music, FileText } from 'lucide-react'
import type { Song } from '../../types/database'

interface SongCardProps {
  song: Song
  voicePartMatch?: boolean
  onOpenSheet?: (url: string) => void
}

const VOICE_DOT: Record<string, string> = {
  soprano: 'bg-soprano',
  alto: 'bg-alto',
  tenor: 'bg-tenor',
  bass: 'bg-bass',
}

export function SongCard({ song, voicePartMatch = false, onOpenSheet }: SongCardProps) {
  function handleSheetClick() {
    if (!song.partition_url) return
    if (onOpenSheet) onOpenSheet(song.partition_url)
    else window.open(song.partition_url, '_blank', 'noopener,noreferrer')
  }

  return (
    <article
      className={[
        'bg-white rounded-xl border shadow-sm p-4 flex flex-col min-w-0',
        voicePartMatch ? 'border-blue-200 bg-blue-50/30' : 'border-gray-100',
      ].join(' ')}
    >
      <div className='flex items-start gap-3'>
        <div className='w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0'>
          <Music className='w-5 h-5 text-warning' />
        </div>
        <div className='flex-1 min-w-0'>
          <h3 className='font-semibold text-navy truncate'>{song.title}</h3>
          {song.composer && (
            <p className='mt-0.5 text-sm text-text-secondary truncate'>{song.composer}</p>
          )}
        </div>
        {song.partition_url && (
          <button
            type='button'
            onClick={handleSheetClick}
            className='p-2 min-h-[36px] min-w-[36px] text-blue hover:bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0'
            aria-label='Open sheet music'
          >
            <FileText className='w-4 h-4' />
          </button>
        )}
      </div>

      <div className='mt-3 flex items-center gap-2 flex-wrap'>
        {song.language && (
          <span className='text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600'>
            {song.language}
          </span>
        )}
        {song.voice_parts && song.voice_parts.length > 0 && (
          <div className='flex items-center gap-1'>
            {song.voice_parts.map((vp) => (
              <span
                key={vp}
                className={['w-2 h-2 rounded-full', VOICE_DOT[vp] || 'bg-gray-300'].join(' ')}
                title={vp}
              />
            ))}
          </div>
        )}
      </div>
    </article>
  )
}
