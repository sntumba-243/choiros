import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Users,
  Calendar,
  TrendingUp,
  Music,
  Bell,
  UserPlus,
  CalendarPlus,
  Plus,
  ClipboardCheck,
  Sparkles,
  ArrowRight,
  MapPin,
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { getMembersByChoirId } from '../../services/member.service'
import { getUpcomingEvents } from '../../services/event.service'
import { getSongsByChoirId } from '../../services/song.service'
import { getLastEventAttendanceRate } from '../../services/attendance.service'
import type { Member, Event, Song } from '../../types/database'
import { StatCard } from '../../components/ui/StatCard'
import { MemberAvatar } from '../../components/ui/MemberAvatar'
import { VoicePartBadge } from '../../components/ui/VoicePartBadge'
import { EmptyState } from '../../components/ui/EmptyState'
import { SkeletonLoader } from '../../components/ui/SkeletonLoader'

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

function formatEventDate(iso: string) {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(iso))
}

function formatNextEventShort(iso: string) {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(iso))
}

const EVENT_TYPE_COLORS: Record<string, { dot: string; badge: string; border: string }> = {
  rehearsal: { dot: 'bg-blue', badge: 'bg-blue-100 text-blue-700', border: 'border-blue' },
  performance: { dot: 'bg-purple-500', badge: 'bg-purple-100 text-purple-700', border: 'border-purple-500' },
  service: { dot: 'bg-warning', badge: 'bg-amber-100 text-amber-700', border: 'border-warning' },
  other: { dot: 'bg-gray-400', badge: 'bg-gray-100 text-gray-700', border: 'border-gray-400' },
}

const VOICE_BAR_COLORS: Record<string, string> = {
  soprano: 'bg-soprano',
  alto: 'bg-alto',
  tenor: 'bg-tenor',
  bass: 'bg-bass',
  unassigned: 'bg-gray-300',
}

function voiceDistribution(members: Member[]) {
  const buckets: Record<string, number> = { soprano: 0, alto: 0, tenor: 0, bass: 0, unassigned: 0 }
  for (const m of members) {
    const p = m.voice_part
    if (p === 'soprano' || p === 'mezzo_soprano') buckets.soprano += 1
    else if (p === 'alto') buckets.alto += 1
    else if (p === 'tenor') buckets.tenor += 1
    else if (p === 'bass' || p === 'baritone') buckets.bass += 1
    else buckets.unassigned += 1
  }
  return buckets
}

export default function Overview() {
  const { member, choir, organization, loading: authLoading } = useAuth()
  const navigate = useNavigate()

  const [members, setMembers] = useState<Member[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [songs, setSongs] = useState<Song[]>([])
  const [attendanceRate, setAttendanceRate] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)

  useEffect(() => {
    if (authLoading) return
    if (!choir?.id) {
      setLoading(false)
      return
    }
    let cancelled = false
    ;(async () => {
      setLoading(true)
      setFetchError(null)
      try {
        const [m, e, s, rate] = await Promise.all([
          getMembersByChoirId(choir.id),
          getUpcomingEvents(choir.id, 5),
          getSongsByChoirId(choir.id),
          getLastEventAttendanceRate(choir.id),
        ])
        if (cancelled) return
        setMembers(m)
        setEvents(e)
        setSongs(s)
        setAttendanceRate(rate)
      } catch (err: any) {
        if (!cancelled) setFetchError(err?.message || 'Could not load data. Try again.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [authLoading, choir?.id])

  const voice = voiceDistribution(members)
  const totalMembers = members.length
  const membersThisMonth = members.filter((m) => {
    const d = new Date(m.created_at)
    const now = new Date()
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  }).length

  return (
    <div className='min-w-0'>
      <header className='sticky top-0 z-20 bg-white border-b border-border h-14 px-5 flex items-center justify-between'>
        <div className='min-w-0 flex items-center gap-2'>
          <span className='text-text-secondary text-sm'>Overview</span>
          {choir?.name && (
            <>
              <span className='text-text-muted'>/</span>
              <span className='font-medium text-navy text-sm truncate'>{choir.name}</span>
            </>
          )}
        </div>
        <div className='flex items-center gap-2'>
          <button
            type='button'
            className='p-2 min-h-[44px] min-w-[44px] rounded-lg text-text-secondary hover:bg-surface-3 flex items-center justify-center'
            aria-label='Notifications'
          >
            <Bell className='w-5 h-5' />
          </button>
          <button
            type='button'
            onClick={() => navigate('/admin/members', { state: { openAdd: true } })}
            className='inline-flex items-center gap-2 bg-blue text-white rounded-lg px-4 py-2 text-sm font-medium min-h-[44px] hover:bg-blue-light transition-colors'
          >
            <UserPlus className='w-4 h-4' />
            <span className='hidden sm:inline'>Invite Members</span>
            <span className='sm:hidden'>Invite</span>
          </button>
        </div>
      </header>

      <div className='px-4 sm:px-5 py-5 space-y-5 max-w-7xl mx-auto w-full'>
        <div>
          <h1 className='font-serif text-2xl sm:text-3xl text-navy'>
            {greeting()}
            {authLoading ? '…' : `, ${member?.first_name || organization?.name || 'there'}`}
          </h1>
          <div className='mt-1 flex flex-wrap items-center gap-2 text-sm text-text-secondary'>
            <span className='truncate'>{choir?.name || 'Your choir'}</span>
            {organization?.plan && (
              <span className='inline-block text-[10px] uppercase tracking-wide font-medium bg-surface-3 text-text-secondary px-2 py-0.5 rounded-full'>
                {organization.plan}
              </span>
            )}
          </div>
        </div>

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
          <SkeletonLoader variant='stat' />
        ) : (
          <div className='grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4'>
            <StatCard
              label='Total members'
              value={totalMembers}
              icon={<Users className='w-5 h-5 text-blue' />}
              iconBg='bg-blue-50'
              trend={membersThisMonth > 0 ? `+${membersThisMonth} this month` : undefined}
              trendUp={membersThisMonth > 0}
            />
            <StatCard
              label='Upcoming events'
              value={events.length}
              icon={<Calendar className='w-5 h-5 text-purple-600' />}
              iconBg='bg-purple-50'
              subtitle={events[0] ? `Next: ${formatNextEventShort(events[0].start_time)}` : 'None scheduled'}
            />
            <StatCard
              label='Attendance rate'
              value={`${attendanceRate}%`}
              icon={<TrendingUp className='w-5 h-5 text-success' />}
              iconBg='bg-green-50'
              subtitle='Last event'
            />
            <StatCard
              label='Songs in library'
              value={songs.length}
              icon={<Music className='w-5 h-5 text-warning' />}
              iconBg='bg-amber-50'
            />
          </div>
        )}

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
          <section className='bg-white rounded-xl border border-gray-100 shadow-sm p-5 min-w-0 lg:col-span-1'>
            <div className='flex items-center justify-between mb-4'>
              <h2 className='font-medium text-navy'>Voice distribution</h2>
              {totalMembers > 0 && (
                <span className='text-xs text-text-muted'>{totalMembers} total</span>
              )}
            </div>
            {totalMembers === 0 ? (
              <EmptyState
                icon={<Users className='w-6 h-6' />}
                title='No members yet'
                subtitle='Add members and assign voice parts to see distribution.'
              />
            ) : (
              <ul className='space-y-3'>
                {(['soprano', 'alto', 'tenor', 'bass', 'unassigned'] as const).map((p) => {
                  const count = voice[p]
                  const pct = totalMembers === 0 ? 0 : Math.round((count / totalMembers) * 100)
                  return (
                    <li key={p} className='min-w-0'>
                      <div className='flex items-center justify-between text-xs mb-1'>
                        <span className='font-medium text-navy capitalize'>{p}</span>
                        <span className='text-text-muted'>
                          {count} · {pct}%
                        </span>
                      </div>
                      <div className='h-2 bg-surface-3 rounded-full overflow-hidden'>
                        <div
                          className={['h-full rounded-full', VOICE_BAR_COLORS[p]].join(' ')}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </section>

          <section className='bg-white rounded-xl border border-gray-100 shadow-sm p-5 min-w-0 lg:col-span-2'>
            <div className='flex items-center justify-between mb-4'>
              <h2 className='font-medium text-navy'>Upcoming events</h2>
              <Link to='/admin/events' className='text-xs font-medium text-blue hover:underline'>
                View all
              </Link>
            </div>
            {events.length === 0 ? (
              <EmptyState
                icon={<Calendar className='w-6 h-6' />}
                title='No events scheduled'
                subtitle='Plan your next rehearsal or performance.'
                action={{ label: 'Create your first event', onClick: () => navigate('/admin/events', { state: { openAdd: true } }) }}
              />
            ) : (
              <ul className='space-y-3'>
                {events.slice(0, 3).map((e) => {
                  const colors = EVENT_TYPE_COLORS[e.event_type] || EVENT_TYPE_COLORS.other
                  return (
                    <li
                      key={e.id}
                      className='flex items-start gap-3 p-3 rounded-lg hover:bg-surface-2 transition-colors min-w-0'
                    >
                      <span className={['w-2 h-2 rounded-full mt-2 flex-shrink-0', colors.dot].join(' ')} />
                      <div className='flex-1 min-w-0'>
                        <div className='flex items-center gap-2 min-w-0'>
                          <span className='font-medium text-navy text-sm truncate'>{e.title}</span>
                          <span className={['text-[10px] font-medium px-2 py-0.5 rounded-full flex-shrink-0', colors.badge].join(' ')}>
                            {e.event_type}
                          </span>
                        </div>
                        <div className='mt-0.5 text-xs text-text-secondary truncate'>
                          {formatEventDate(e.start_time)}
                        </div>
                        {e.location && (
                          <div className='mt-0.5 text-xs text-text-muted flex items-center gap-1 truncate'>
                            <MapPin className='w-3 h-3 flex-shrink-0' />
                            <span className='truncate'>{e.location}</span>
                          </div>
                        )}
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </section>
        </div>

        <section className='bg-white rounded-xl border border-gray-100 shadow-sm p-5 min-w-0'>
          <div className='flex items-center justify-between mb-4'>
            <h2 className='font-medium text-navy'>Recent members</h2>
            <Link to='/admin/members' className='text-xs font-medium text-blue hover:underline'>
              View all
            </Link>
          </div>
          {members.length === 0 ? (
            <EmptyState
              icon={<Users className='w-6 h-6' />}
              title='No members yet'
              subtitle='Invite people to get started.'
              action={{ label: 'Add your first member', onClick: () => navigate('/admin/members', { state: { openAdd: true } }) }}
            />
          ) : (
            <div className='flex gap-3 overflow-x-auto pb-1 -mx-1 px-1'>
              {members.slice(0, 5).map((m) => (
                <div
                  key={m.id}
                  className='flex-shrink-0 w-32 bg-surface-2 rounded-lg p-3 flex flex-col items-center text-center'
                >
                  <MemberAvatar firstName={m.first_name} lastName={m.last_name} voicePart={m.voice_part} size='lg' />
                  <div className='mt-2 text-xs font-medium text-navy truncate w-full'>
                    {m.first_name} {m.last_name}
                  </div>
                  <div className='mt-1'>
                    <VoicePartBadge part={m.voice_part} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className='font-medium text-navy mb-3'>Quick actions</h2>
          <div className='grid grid-cols-2 lg:grid-cols-4 gap-3'>
            {[
              {
                label: 'Add Member',
                icon: UserPlus,
                onClick: () => navigate('/admin/members', { state: { openAdd: true } }),
                bg: 'bg-blue-50',
                fg: 'text-blue',
              },
              {
                label: 'Create Event',
                icon: CalendarPlus,
                onClick: () => navigate('/admin/events', { state: { openAdd: true } }),
                bg: 'bg-purple-50',
                fg: 'text-purple-600',
              },
              {
                label: 'Add Song',
                icon: Plus,
                onClick: () => navigate('/admin/songs', { state: { openAdd: true } }),
                bg: 'bg-amber-50',
                fg: 'text-warning',
              },
              {
                label: 'Take Attendance',
                icon: ClipboardCheck,
                onClick: () => navigate('/admin/attendance'),
                bg: 'bg-green-50',
                fg: 'text-success',
              },
            ].map((a) => {
              const Icon = a.icon
              return (
                <button
                  key={a.label}
                  type='button'
                  onClick={a.onClick}
                  className='bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-left hover:border-blue hover:shadow-md transition-all min-h-[44px]'
                >
                  <div
                    className={['w-9 h-9 rounded-lg flex items-center justify-center mb-2', a.bg].join(' ')}
                  >
                    <Icon className={['w-4 h-4', a.fg].join(' ')} />
                  </div>
                  <div className='text-sm font-medium text-navy'>{a.label}</div>
                </button>
              )
            })}
          </div>
        </section>

        <section className='relative overflow-hidden rounded-xl p-5 bg-gradient-to-br from-blue/5 via-white to-purple-50 border border-blue/20'>
          <div className='flex flex-col sm:flex-row items-start sm:items-center gap-4'>
            <div className='w-12 h-12 rounded-xl bg-gradient-to-br from-blue to-purple-500 flex items-center justify-center flex-shrink-0'>
              <Sparkles className='w-6 h-6 text-white' />
            </div>
            <div className='flex-1 min-w-0'>
              <h3 className='font-medium text-navy'>AI Vocal Coach</h3>
              <p className='mt-1 text-sm text-text-secondary'>
                Give every member a personal AI practice coach. Coming soon for Growth plan.
              </p>
            </div>
            <button
              type='button'
              className='inline-flex items-center gap-2 border border-blue text-blue rounded-lg px-4 py-2 text-sm font-medium min-h-[44px] hover:bg-blue hover:text-white transition-colors'
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
