import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Bell,
  MapPin,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Clock as ClockIcon,
  XCircle,
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { getUpcomingEvents } from '../../services/event.service'
import { getSongsByChoirId } from '../../services/song.service'
import { getRSVPsByMemberId, upsertRSVP } from '../../services/rsvp.service'
import type { Event, Song } from '../../types/database'
import type { RSVPStatus } from '../../types/rsvp.types'
import { MemberAvatar } from '../../components/ui/MemberAvatar'
import { VoicePartBadge } from '../../components/ui/VoicePartBadge'
import { SongCard } from '../../components/ui/SongCard'
import { RSVPBadge } from '../../components/ui/RSVPBadge'
import { BottomSheet } from '../../components/ui/BottomSheet'
import { SkeletonLoader } from '../../components/ui/SkeletonLoader'
import { EmptyState } from '../../components/ui/EmptyState'
import { Calendar, Music } from 'lucide-react'

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

function formatDay(iso: string) {
  return new Intl.DateTimeFormat('en-US', { day: 'numeric' }).format(new Date(iso))
}

function formatMonth(iso: string) {
  return new Intl.DateTimeFormat('en-US', { month: 'short' }).format(new Date(iso)).toUpperCase()
}

function formatFullDate(iso: string) {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(iso))
}

function formatShortDate(iso: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(iso))
}

const EVENT_BORDER: Record<string, string> = {
  rehearsal: 'border-t-blue',
  performance: 'border-t-purple-500',
  service: 'border-t-warning',
  other: 'border-t-gray-300',
}

export default function MemberHome() {
  const { member, choir, loading: authLoading } = useAuth()
  const navigate = useNavigate()

  const [events, setEvents] = useState<Event[]>([])
  const [songs, setSongs] = useState<Song[]>([])
  const [rsvpMap, setRsvpMap] = useState<Map<string, RSVPStatus>>(new Map())
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [heroSheetOpen, setHeroSheetOpen] = useState(false)

  useEffect(() => {
    if (authLoading) return
    if (!choir?.id || !member?.id) {
      setLoading(false)
      return
    }
    let cancelled = false
    ;(async () => {
      setLoading(true)
      setFetchError(null)
      try {
        const [e, s, rsvps] = await Promise.all([
          getUpcomingEvents(choir.id, 4),
          getSongsByChoirId(choir.id),
          getRSVPsByMemberId(member.id),
        ])
        if (cancelled) return
        setEvents(e)
        setSongs(s.slice(0, 4))
        setRsvpMap(new Map(rsvps.map((r) => [r.event_id, r.status])))
      } catch (err: any) {
        if (!cancelled) setFetchError(err?.message || 'Could not load your dashboard.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [authLoading, choir?.id, member?.id])

  async function handleRSVP(eventId: string, status: RSVPStatus) {
    if (!member?.id) return
    setRsvpMap((prev) => new Map(prev).set(eventId, status))
    const updated = await upsertRSVP(eventId, member.id, status)
    if (!updated) {
      setRsvpMap((prev) => {
        const next = new Map(prev)
        next.delete(eventId)
        return next
      })
    }
  }

  const heroEvent = events[0]
  const restEvents = events.slice(1, 4)

  return (
    <div className='min-w-0'>
      <header className='sticky top-0 z-20 bg-white border-b border-border h-14 px-5 flex items-center justify-between'>
        <div className='font-serif text-navy text-lg truncate min-w-0'>
          {choir?.name || 'ChoirOS'}
        </div>
        <div className='flex items-center gap-2'>
          <button
            type='button'
            className='p-2 min-h-[44px] min-w-[44px] rounded-lg text-text-secondary hover:bg-surface-3 flex items-center justify-center'
            aria-label='Notifications'
          >
            <Bell className='w-5 h-5' />
          </button>
          {member && (
            <Link to='profile' aria-label='Profile'>
              <MemberAvatar
                firstName={member.first_name}
                lastName={member.last_name}
                voicePart={member.voice_part}
                size='md'
              />
            </Link>
          )}
        </div>
      </header>

      <div className='px-4 sm:px-5 py-6 max-w-4xl mx-auto w-full space-y-6'>
        <section className='rounded-2xl bg-gradient-to-br from-white to-surface-2 p-5 sm:p-6 border border-gray-100'>
          <h1 className='font-serif italic text-2xl sm:text-3xl text-navy'>
            {greeting()}
            {authLoading ? '…' : `, ${member?.first_name || 'there'}`}
          </h1>
          {member?.voice_part && (
            <div className='mt-3'>
              <VoicePartBadge part={member.voice_part} />
            </div>
          )}
        </section>

        {fetchError && (
          <div className='bg-red-50 border border-red-100 rounded-xl p-4 flex items-center justify-between'>
            <span className='text-sm text-danger'>{fetchError}</span>
            <button
              type='button'
              onClick={() => window.location.reload()}
              className='text-sm font-medium text-danger underline min-h-[44px] px-2'
            >
              Retry
            </button>
          </div>
        )}

        {loading ? (
          <SkeletonLoader variant='card' rows={2} />
        ) : heroEvent ? (
          <section
            className={[
              'bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6 border-t-4',
              EVENT_BORDER[heroEvent.event_type] || 'border-t-gray-300',
            ].join(' ')}
          >
            <div className='text-xs uppercase tracking-wide text-text-muted font-medium'>
              Next event
            </div>
            <div className='mt-2 flex items-start gap-4 min-w-0'>
              <div className='flex-shrink-0 flex flex-col items-center justify-center w-16 sm:w-20'>
                <span className='font-serif text-4xl sm:text-5xl text-navy leading-none'>
                  {formatDay(heroEvent.start_time)}
                </span>
                <span className='text-xs font-medium text-text-secondary tracking-wide mt-1'>
                  {formatMonth(heroEvent.start_time)}
                </span>
              </div>
              <div className='flex-1 min-w-0'>
                <h2 className='font-serif text-xl sm:text-2xl text-navy truncate'>
                  {heroEvent.title}
                </h2>
                <div className='mt-1 text-sm text-text-secondary truncate'>
                  {formatFullDate(heroEvent.start_time)}
                </div>
                {heroEvent.location && (
                  <div className='mt-1 flex items-center gap-1 text-sm text-text-muted truncate'>
                    <MapPin className='w-3.5 h-3.5 flex-shrink-0' />
                    <span className='truncate'>{heroEvent.location}</span>
                  </div>
                )}
                {heroEvent.is_mandatory && (
                  <span className='mt-2 inline-block text-[10px] font-medium px-2 py-0.5 rounded-full bg-red-50 text-danger'>
                    Mandatory
                  </span>
                )}
              </div>
            </div>
            <div className='mt-4'>
              <RSVPBadge
                status={rsvpMap.get(heroEvent.id) || 'pending'}
                onClick={() => setHeroSheetOpen(true)}
              />
            </div>
            <BottomSheet
              open={heroSheetOpen}
              onClose={() => setHeroSheetOpen(false)}
              title={heroEvent.title}
            >
              <div className='p-4 space-y-2'>
                {(
                  [
                    { status: 'going' as const, label: 'Going', Icon: CheckCircle, iconClass: 'text-success', selectedClass: 'border-success bg-green-50' },
                    { status: 'maybe' as const, label: 'Maybe', Icon: ClockIcon, iconClass: 'text-warning', selectedClass: 'border-warning bg-yellow-50' },
                    { status: 'not_going' as const, label: "Can't make it", Icon: XCircle, iconClass: 'text-danger', selectedClass: 'border-danger bg-red-50' },
                  ]
                ).map((opt) => {
                  const selected = rsvpMap.get(heroEvent.id) === opt.status
                  return (
                    <button
                      key={opt.status}
                      type='button'
                      onClick={async () => {
                        await handleRSVP(heroEvent.id, opt.status)
                        setHeroSheetOpen(false)
                      }}
                      className={[
                        'w-full flex items-center gap-3 p-4 rounded-xl border-2 transition min-h-[56px]',
                        selected ? opt.selectedClass : 'border-border hover:border-text-muted',
                      ].join(' ')}
                    >
                      <opt.Icon className={['w-5 h-5 flex-shrink-0', opt.iconClass].join(' ')} />
                      <span className='font-medium text-navy'>{opt.label}</span>
                    </button>
                  )
                })}
              </div>
            </BottomSheet>
          </section>
        ) : (
          <section className='bg-white rounded-2xl border border-gray-100 shadow-sm'>
            <EmptyState
              icon={<Calendar className='w-6 h-6' />}
              title='No events scheduled'
              subtitle='Your choir director will add rehearsals and performances here.'
            />
          </section>
        )}

        {restEvents.length > 0 && (
          <section>
            <div className='flex items-center justify-between mb-3'>
              <h2 className='font-medium text-navy'>Coming up</h2>
              <Link to='events' className='text-xs font-medium text-blue hover:underline'>
                View all
              </Link>
            </div>
            <ul className='space-y-2'>
              {restEvents.map((e) => {
                const status = rsvpMap.get(e.id) || 'pending'
                return (
                  <li key={e.id}>
                    <Link
                      to='events'
                      className='flex items-center gap-3 bg-white rounded-xl border border-gray-100 p-3 hover:border-blue-200 transition min-w-0'
                    >
                      <div className='flex-shrink-0 flex flex-col items-center justify-center w-12 h-12 rounded-lg bg-surface-2'>
                        <span className='font-serif text-lg text-navy leading-none'>
                          {formatDay(e.start_time)}
                        </span>
                        <span className='text-[9px] font-medium text-text-muted tracking-wide'>
                          {formatMonth(e.start_time)}
                        </span>
                      </div>
                      <div className='flex-1 min-w-0'>
                        <div className='font-medium text-navy text-sm truncate'>{e.title}</div>
                        <div className='text-xs text-text-muted truncate'>
                          {formatShortDate(e.start_time)}
                        </div>
                      </div>
                      <RSVPBadge status={status} size='sm' />
                    </Link>
                  </li>
                )
              })}
            </ul>
          </section>
        )}

        {songs.length > 0 && (
          <section>
            <div className='flex items-center justify-between mb-3'>
              <h2 className='font-medium text-navy'>Recent songs</h2>
              <Link to='songs' className='text-xs font-medium text-blue hover:underline'>
                View all
              </Link>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
              {songs.map((s) => {
                const match =
                  !!member?.voice_part &&
                  !!s.voice_parts &&
                  s.voice_parts.includes(
                    member.voice_part === 'mezzo_soprano'
                      ? 'soprano'
                      : member.voice_part === 'baritone'
                        ? 'bass'
                        : member.voice_part,
                  )
                return <SongCard key={s.id} song={s} voicePartMatch={match} />
              })}
            </div>
          </section>
        )}

        {songs.length === 0 && !loading && (
          <section className='bg-white rounded-2xl border border-gray-100 shadow-sm'>
            <EmptyState
              icon={<Music className='w-6 h-6' />}
              title='No songs in your library yet'
              subtitle='Sheet music and practice tracks will appear here once your director adds them.'
            />
          </section>
        )}

        <section className='relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100'>
          <div className='flex flex-col sm:flex-row items-start sm:items-center gap-4'>
            <div className='w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0'>
              <Sparkles className='w-6 h-6 text-white' />
            </div>
            <div className='flex-1 min-w-0'>
              <h3 className='font-serif text-lg text-navy'>Your AI Practice Coach</h3>
              <p className='mt-1 text-sm text-text-secondary'>
                Personalized exercises tuned to your voice. Coming soon.
              </p>
            </div>
            <button
              type='button'
              onClick={() => navigate('profile')}
              className='inline-flex items-center gap-2 border border-warning text-warning rounded-lg px-4 py-2 text-sm font-medium min-h-[44px] hover:bg-warning hover:text-white transition-colors'
            >
              Learn more
              <ArrowRight className='w-4 h-4' />
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}
