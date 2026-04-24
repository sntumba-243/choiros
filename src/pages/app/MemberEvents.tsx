import { useEffect, useMemo, useState } from 'react'
import { Calendar } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { getEventsByChoirId } from '../../services/event.service'
import { getRSVPsByMemberId, upsertRSVP } from '../../services/rsvp.service'
import type { Event } from '../../types/database'
import type { RSVPStatus } from '../../types/rsvp.types'
import { EventCard } from '../../components/ui/EventCard'
import { EmptyState } from '../../components/ui/EmptyState'
import { SkeletonLoader } from '../../components/ui/SkeletonLoader'

type Tab = 'upcoming' | 'past'

export default function MemberEvents() {
  const { member, choir, loading: authLoading } = useAuth()
  const [events, setEvents] = useState<Event[]>([])
  const [rsvpMap, setRsvpMap] = useState<Map<string, RSVPStatus>>(new Map())
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<Tab>('upcoming')

  useEffect(() => {
    if (authLoading) return
    if (!choir?.id || !member?.id) {
      setLoading(false)
      return
    }
    let cancelled = false
    ;(async () => {
      setLoading(true)
      try {
        const [e, rsvps] = await Promise.all([
          getEventsByChoirId(choir.id),
          getRSVPsByMemberId(member.id),
        ])
        if (cancelled) return
        setEvents(e)
        setRsvpMap(new Map(rsvps.map((r) => [r.event_id, r.status])))
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [authLoading, choir?.id, member?.id])

  const { upcoming, past } = useMemo(() => {
    const now = Date.now()
    const upcoming: Event[] = []
    const past: Event[] = []
    for (const e of events) {
      if (new Date(e.end_time).getTime() >= now) upcoming.push(e)
      else past.push(e)
    }
    upcoming.sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
    past.sort((a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime())
    return { upcoming, past }
  }, [events])

  const list = tab === 'upcoming' ? upcoming : past

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

  return (
    <div className='min-w-0'>
      <header className='sticky top-0 z-20 bg-white border-b border-border h-14 px-5 flex items-center justify-between'>
        <div className='min-w-0 flex items-center gap-2'>
          <span className='text-text-secondary text-sm truncate'>{choir?.name}</span>
          <span className='text-text-muted'>/</span>
          <h1 className='font-medium text-navy'>Events</h1>
        </div>
      </header>

      <div className='px-4 sm:px-5 py-5 max-w-3xl mx-auto w-full space-y-5'>
        <div className='flex items-center gap-2'>
          {(['upcoming', 'past'] as Tab[]).map((t) => (
            <button
              key={t}
              type='button'
              onClick={() => setTab(t)}
              className={[
                'text-sm px-4 py-1.5 rounded-full capitalize min-h-[36px] transition-colors',
                tab === t
                  ? 'bg-blue text-white'
                  : 'text-text-secondary bg-white border border-border hover:text-navy',
              ].join(' ')}
            >
              {t === 'upcoming' ? `Upcoming (${upcoming.length})` : `Past (${past.length})`}
            </button>
          ))}
        </div>

        {loading ? (
          <SkeletonLoader variant='card' rows={3} />
        ) : list.length === 0 ? (
          <div className='bg-white rounded-xl border border-gray-100'>
            <EmptyState
              icon={<Calendar className='w-6 h-6' />}
              title={tab === 'upcoming' ? 'No upcoming events' : 'No past events'}
              subtitle={
                tab === 'upcoming'
                  ? 'Your choir director will add rehearsals and performances here.'
                  : 'Past events will show up here once they happen.'
              }
            />
          </div>
        ) : (
          <ul className='space-y-3'>
            {list.map((e) => (
              <li key={e.id}>
                <EventCard
                  event={e}
                  rsvpStatus={rsvpMap.get(e.id) || 'pending'}
                  onRSVP={(s) => handleRSVP(e.id, s)}
                  isPast={tab === 'past'}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
