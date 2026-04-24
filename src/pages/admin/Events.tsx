import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Calendar, CalendarPlus, MapPin, Trash2, Pencil, X } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { getEventsByChoirId, createEvent, deleteEvent } from '../../services/event.service'
import type { Event, EventType } from '../../types/database'
import { EmptyState } from '../../components/ui/EmptyState'
import { SkeletonLoader } from '../../components/ui/SkeletonLoader'

const TYPE_META: Record<EventType, { border: string; badge: string; label: string }> = {
  rehearsal: { border: 'border-l-blue', badge: 'bg-blue-100 text-blue-700', label: 'Rehearsal' },
  performance: { border: 'border-l-purple-500', badge: 'bg-purple-100 text-purple-700', label: 'Performance' },
  service: { border: 'border-l-warning', badge: 'bg-amber-100 text-amber-700', label: 'Service' },
  other: { border: 'border-l-gray-400', badge: 'bg-gray-100 text-gray-700', label: 'Other' },
}

function monthKey(iso: string) {
  const d = new Date(iso)
  return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(d)
}

function formatRange(start: string, end: string) {
  const s = new Date(start)
  const e = new Date(end)
  const day = new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'short', day: 'numeric' }).format(s)
  const t1 = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' }).format(s)
  const t2 = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' }).format(e)
  return `${day} · ${t1} – ${t2}`
}

export default function AdminEvents() {
  const { choir } = useAuth()
  const location = useLocation()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState<boolean>(
    () => (location.state as { openAdd?: boolean } | null)?.openAdd === true,
  )

  async function load() {
    if (!choir?.id) return
    setLoading(true)
    const data = await getEventsByChoirId(choir.id)
    setEvents(data)
    setLoading(false)
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [choir?.id])

  const grouped = useMemo(() => {
    const map = new Map<string, Event[]>()
    const sorted = [...events].sort(
      (a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime(),
    )
    for (const e of sorted) {
      const key = monthKey(e.start_time)
      const list = map.get(key) || []
      list.push(e)
      map.set(key, list)
    }
    return Array.from(map.entries())
  }, [events])

  async function handleDelete(e: Event) {
    if (!confirm(`Delete event "${e.title}"?`)) return
    const ok = await deleteEvent(e.id)
    if (ok) setEvents((prev) => prev.filter((x) => x.id !== e.id))
  }

  return (
    <div className='min-w-0'>
      <header className='sticky top-0 z-20 bg-white border-b border-border h-14 px-5 flex items-center justify-between'>
        <div className='flex items-center gap-2 min-w-0'>
          <h1 className='font-medium text-navy truncate'>Events</h1>
          <span className='text-xs bg-surface-3 text-text-secondary px-2 py-0.5 rounded-full flex-shrink-0'>
            {events.length}
          </span>
        </div>
        <button
          type='button'
          onClick={() => setModalOpen(true)}
          className='inline-flex items-center gap-2 bg-blue text-white rounded-lg px-4 py-2 text-sm font-medium min-h-[44px] hover:bg-blue-light transition-colors'
        >
          <CalendarPlus className='w-4 h-4' />
          <span className='hidden sm:inline'>Create Event</span>
          <span className='sm:hidden'>Create</span>
        </button>
      </header>

      <div className='px-4 sm:px-5 py-4 max-w-5xl mx-auto w-full space-y-6'>
        {loading ? (
          <SkeletonLoader variant='card' rows={3} />
        ) : events.length === 0 ? (
          <div className='bg-white rounded-xl border border-gray-100'>
            <EmptyState
              icon={<Calendar className='w-6 h-6' />}
              title='No events scheduled'
              subtitle='Create your first event to get started.'
              action={{ label: 'Create your first event', onClick: () => setModalOpen(true) }}
            />
          </div>
        ) : (
          grouped.map(([month, list]) => (
            <div key={month}>
              <h2 className='text-xs uppercase tracking-wide text-text-muted font-medium mb-2'>
                {month}
              </h2>
              <ul className='space-y-3'>
                {list.map((e) => {
                  const meta = TYPE_META[e.event_type]
                  const isPast = new Date(e.end_time).getTime() < Date.now()
                  return (
                    <li
                      key={e.id}
                      className={['bg-white rounded-xl border border-gray-100 shadow-sm p-4 border-l-4', meta.border].join(' ')}
                    >
                      <div className='flex items-start justify-between gap-3 min-w-0'>
                        <div className='flex-1 min-w-0'>
                          <div className='flex items-center gap-2 flex-wrap'>
                            <h3 className='font-semibold text-navy truncate'>{e.title}</h3>
                            <span className={['text-[10px] font-medium px-2 py-0.5 rounded-full flex-shrink-0', meta.badge].join(' ')}>
                              {meta.label}
                            </span>
                            {e.is_mandatory && (
                              <span className='text-[10px] font-medium px-2 py-0.5 rounded-full bg-red-50 text-danger flex-shrink-0'>
                                Mandatory
                              </span>
                            )}
                          </div>
                          <div className='mt-1 text-sm text-text-secondary truncate'>
                            {formatRange(e.start_time, e.end_time)}
                          </div>
                          {e.location && (
                            <div className='mt-1 text-xs text-text-muted flex items-center gap-1 truncate'>
                              <MapPin className='w-3 h-3 flex-shrink-0' />
                              <span className='truncate'>{e.location}</span>
                            </div>
                          )}
                          {e.description && (
                            <p className='mt-2 text-sm text-text-secondary line-clamp-2'>
                              {e.description}
                            </p>
                          )}
                          <div className='mt-2 text-xs text-text-muted'>
                            {isPast ? 'Past event' : 'Upcoming'}
                          </div>
                        </div>
                        <div className='flex items-center gap-1 flex-shrink-0'>
                          <button
                            type='button'
                            className='p-2 min-h-[36px] min-w-[36px] text-text-muted hover:text-navy hover:bg-surface-3 rounded-lg'
                            aria-label='Edit'
                          >
                            <Pencil className='w-4 h-4' />
                          </button>
                          <button
                            type='button'
                            onClick={() => handleDelete(e)}
                            className='p-2 min-h-[36px] min-w-[36px] text-text-muted hover:text-danger hover:bg-red-50 rounded-lg'
                            aria-label='Delete'
                          >
                            <Trash2 className='w-4 h-4' />
                          </button>
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))
        )}
      </div>

      {modalOpen && (
        <CreateEventModal
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

function CreateEventModal({
  onClose,
  onCreated,
}: {
  onClose: () => void
  onCreated: () => void | Promise<void>
}) {
  const { choir } = useAuth()
  const [title, setTitle] = useState('')
  const [eventType, setEventType] = useState<EventType>('rehearsal')
  const [startDate, setStartDate] = useState('')
  const [startTime, setStartTime] = useState('19:00')
  const [endDate, setEndDate] = useState('')
  const [endTime, setEndTime] = useState('21:00')
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')
  const [mandatory, setMandatory] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!title.trim() || !startDate || !startTime || !endDate || !endTime) {
      setError('Title, start, and end are required.')
      return
    }
    const start = new Date(`${startDate}T${startTime}`).toISOString()
    const end = new Date(`${endDate}T${endTime}`).toISOString()
    if (new Date(end) <= new Date(start)) {
      setError('End must be after start.')
      return
    }
    if (!choir?.id) {
      setError('No choir selected.')
      return
    }
    setSubmitting(true)
    const created = await createEvent({
      choir_id: choir.id,
      title: title.trim(),
      description: description.trim() || undefined,
      event_type: eventType,
      start_time: start,
      end_time: end,
      location: location.trim() || undefined,
      is_mandatory: mandatory,
    } as any)
    setSubmitting(false)
    if (!created) {
      setError('Could not create event. Try again.')
      return
    }
    await onCreated()
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
      <div className='absolute inset-0 bg-black/40 backdrop-blur-sm' onClick={onClose} />
      <div className='relative bg-white w-full max-w-lg rounded-2xl shadow-xl flex flex-col max-h-full'>
        <div className='h-14 px-5 border-b border-border flex items-center justify-between flex-shrink-0'>
          <h2 className='font-medium text-navy'>Create Event</h2>
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
            <span className='text-xs font-medium text-text-secondary'>Event title</span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className='mt-1 w-full border border-border rounded-lg px-3 py-2 text-sm min-h-[44px] focus:outline-none focus:border-blue'
            />
          </label>
          <div>
            <span className='text-xs font-medium text-text-secondary'>Type</span>
            <div className='mt-1 grid grid-cols-2 sm:grid-cols-4 gap-2'>
              {(['rehearsal', 'performance', 'service', 'other'] as EventType[]).map((t) => (
                <button
                  key={t}
                  type='button'
                  onClick={() => setEventType(t)}
                  className={[
                    'text-sm px-3 py-2 rounded-lg min-h-[44px] capitalize border',
                    eventType === t
                      ? 'bg-blue text-white border-blue'
                      : 'bg-white text-text-secondary border-border hover:text-navy',
                  ].join(' ')}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className='grid grid-cols-2 gap-3'>
            <label className='block'>
              <span className='text-xs font-medium text-text-secondary'>Start date</span>
              <input
                type='date'
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className='mt-1 w-full border border-border rounded-lg px-3 py-2 text-sm min-h-[44px] focus:outline-none focus:border-blue'
              />
            </label>
            <label className='block'>
              <span className='text-xs font-medium text-text-secondary'>Start time</span>
              <input
                type='time'
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className='mt-1 w-full border border-border rounded-lg px-3 py-2 text-sm min-h-[44px] focus:outline-none focus:border-blue'
              />
            </label>
            <label className='block'>
              <span className='text-xs font-medium text-text-secondary'>End date</span>
              <input
                type='date'
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className='mt-1 w-full border border-border rounded-lg px-3 py-2 text-sm min-h-[44px] focus:outline-none focus:border-blue'
              />
            </label>
            <label className='block'>
              <span className='text-xs font-medium text-text-secondary'>End time</span>
              <input
                type='time'
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className='mt-1 w-full border border-border rounded-lg px-3 py-2 text-sm min-h-[44px] focus:outline-none focus:border-blue'
              />
            </label>
          </div>
          <label className='block'>
            <span className='text-xs font-medium text-text-secondary'>Location (optional)</span>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className='mt-1 w-full border border-border rounded-lg px-3 py-2 text-sm min-h-[44px] focus:outline-none focus:border-blue'
            />
          </label>
          <label className='block'>
            <span className='text-xs font-medium text-text-secondary'>Description (optional)</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className='mt-1 w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue resize-none'
            />
          </label>
          <label className='flex items-center gap-2 text-sm text-text-secondary'>
            <input
              type='checkbox'
              checked={mandatory}
              onChange={(e) => setMandatory(e.target.checked)}
              className='rounded'
            />
            Mandatory attendance
          </label>
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
            {submitting ? 'Creating…' : 'Create Event'}
          </button>
        </div>
      </div>
    </div>
  )
}
