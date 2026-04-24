import { useState } from 'react'
import { Clock, MapPin, CheckCircle, Clock as ClockIcon, XCircle } from 'lucide-react'
import type { Event, EventType } from '../../types/database'
import type { RSVPStatus } from '../../types/rsvp.types'
import { RSVPBadge } from './RSVPBadge'
import { BottomSheet } from './BottomSheet'

interface EventCardProps {
  event: Event
  rsvpStatus?: RSVPStatus
  onRSVP: (status: 'going' | 'maybe' | 'not_going') => void
  isPast?: boolean
}

const DATE_BADGE: Record<EventType, string> = {
  rehearsal: 'bg-blue-100 text-blue-800',
  performance: 'bg-purple-100 text-purple-800',
  service: 'bg-amber-100 text-amber-800',
  other: 'bg-gray-100 text-gray-700',
}

const TYPE_BADGE: Record<EventType, string> = {
  rehearsal: 'bg-blue-50 text-blue-700',
  performance: 'bg-purple-50 text-purple-700',
  service: 'bg-amber-50 text-amber-700',
  other: 'bg-gray-50 text-gray-600',
}

function formatDay(iso: string) {
  return new Intl.DateTimeFormat('en-US', { day: 'numeric' }).format(new Date(iso))
}

function formatMonth(iso: string) {
  return new Intl.DateTimeFormat('en-US', { month: 'short' }).format(new Date(iso)).toUpperCase()
}

function formatTimeRange(start: string, end: string) {
  const s = new Date(start)
  const e = new Date(end)
  const t1 = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' }).format(s)
  const t2 = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' }).format(e)
  return `${t1} – ${t2}`
}

export function EventCard({ event, rsvpStatus = 'pending', onRSVP, isPast = false }: EventCardProps) {
  const [sheetOpen, setSheetOpen] = useState(false)

  function handleSelect(status: 'going' | 'maybe' | 'not_going') {
    onRSVP(status)
    setSheetOpen(false)
  }

  return (
    <article
      className={[
        'bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col sm:flex-row gap-4 min-w-0',
        isPast ? 'opacity-60' : '',
      ].join(' ')}
    >
      <div
        className={[
          'flex-shrink-0 flex flex-col items-center justify-center rounded-xl w-16 h-16 sm:w-20 sm:h-20',
          DATE_BADGE[event.event_type],
        ].join(' ')}
      >
        <span className='font-serif text-3xl leading-none'>{formatDay(event.start_time)}</span>
        <span className='text-[10px] font-medium tracking-wider mt-1'>{formatMonth(event.start_time)}</span>
      </div>

      <div className='flex-1 min-w-0'>
        <div className='flex items-center gap-2 flex-wrap'>
          <h3 className='font-semibold text-navy truncate'>{event.title}</h3>
          <span
            className={[
              'text-[10px] font-medium px-2 py-0.5 rounded-full capitalize flex-shrink-0',
              TYPE_BADGE[event.event_type],
            ].join(' ')}
          >
            {event.event_type}
          </span>
          {event.is_mandatory && (
            <span className='text-[10px] font-medium px-2 py-0.5 rounded-full bg-red-50 text-danger flex-shrink-0'>
              Mandatory
            </span>
          )}
        </div>
        <div className='mt-1 flex items-center gap-1 text-sm text-text-secondary min-w-0'>
          <Clock className='w-3.5 h-3.5 flex-shrink-0' />
          <span className='truncate'>{formatTimeRange(event.start_time, event.end_time)}</span>
        </div>
        {event.location && (
          <div className='mt-0.5 flex items-center gap-1 text-sm text-text-secondary min-w-0'>
            <MapPin className='w-3.5 h-3.5 flex-shrink-0' />
            <span className='truncate'>{event.location}</span>
          </div>
        )}
      </div>

      <div className='flex-shrink-0 flex sm:flex-col items-stretch justify-end sm:justify-center gap-2 sm:min-w-[120px]'>
        {isPast ? (
          <span className='text-xs text-text-muted italic'>Past</span>
        ) : (
          <RSVPBadge status={rsvpStatus} onClick={() => setSheetOpen(true)} />
        )}
      </div>

      <BottomSheet open={sheetOpen} onClose={() => setSheetOpen(false)} title={event.title}>
        <div className='p-4 space-y-2'>
          <button
            type='button'
            onClick={() => handleSelect('going')}
            className={[
              'w-full flex items-center gap-3 p-4 rounded-xl border-2 transition min-h-[56px]',
              rsvpStatus === 'going'
                ? 'border-success bg-green-50'
                : 'border-border hover:border-success hover:bg-green-50/50',
            ].join(' ')}
          >
            <CheckCircle className='w-5 h-5 text-success flex-shrink-0' />
            <span className='font-medium text-navy'>Going</span>
          </button>
          <button
            type='button'
            onClick={() => handleSelect('maybe')}
            className={[
              'w-full flex items-center gap-3 p-4 rounded-xl border-2 transition min-h-[56px]',
              rsvpStatus === 'maybe'
                ? 'border-warning bg-yellow-50'
                : 'border-border hover:border-warning hover:bg-yellow-50/50',
            ].join(' ')}
          >
            <ClockIcon className='w-5 h-5 text-warning flex-shrink-0' />
            <span className='font-medium text-navy'>Maybe</span>
          </button>
          <button
            type='button'
            onClick={() => handleSelect('not_going')}
            className={[
              'w-full flex items-center gap-3 p-4 rounded-xl border-2 transition min-h-[56px]',
              rsvpStatus === 'not_going'
                ? 'border-danger bg-red-50'
                : 'border-border hover:border-danger hover:bg-red-50/50',
            ].join(' ')}
          >
            <XCircle className='w-5 h-5 text-danger flex-shrink-0' />
            <span className='font-medium text-navy'>Can&rsquo;t make it</span>
          </button>
        </div>
      </BottomSheet>
    </article>
  )
}
