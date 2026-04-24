import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Users, UserPlus, Search, Pencil, Trash2, X, ChevronRight } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import {
  getMembersByChoirId,
  createMember,
  deleteMember,
} from '../../services/member.service'
import type { Member, MemberRole, VoicePart } from '../../types/database'
import { MemberAvatar } from '../../components/ui/MemberAvatar'
import { VoicePartBadge } from '../../components/ui/VoicePartBadge'
import { EmptyState } from '../../components/ui/EmptyState'
import { SkeletonLoader } from '../../components/ui/SkeletonLoader'
import { useAdaptiveLayout } from '../../hooks/useAdaptiveLayout'

type FilterKey = 'all' | 'soprano' | 'alto' | 'tenor' | 'bass' | 'unassigned'

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'soprano', label: 'Soprano' },
  { key: 'alto', label: 'Alto' },
  { key: 'tenor', label: 'Tenor' },
  { key: 'bass', label: 'Bass' },
  { key: 'unassigned', label: 'No Part' },
]

const ROLE_BADGE: Record<MemberRole, string> = {
  admin: 'bg-navy text-white',
  section_leader: 'bg-blue-100 text-blue-700',
  member: 'bg-gray-100 text-gray-700',
  guest: 'bg-gray-100 text-gray-500',
}

const STATUS_DOT: Record<string, string> = {
  active: 'bg-success',
  inactive: 'bg-danger',
  pending: 'bg-warning',
}

function relativeDate(iso: string) {
  const d = new Date(iso)
  const diff = Math.floor((Date.now() - d.getTime()) / (24 * 60 * 60 * 1000))
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Yesterday'
  if (diff < 30) return `${diff}d ago`
  if (diff < 365) return `${Math.floor(diff / 30)}mo ago`
  return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short' }).format(d)
}

export default function AdminMembers() {
  const { choir } = useAuth()
  const location = useLocation()
  const sizeClass = useAdaptiveLayout()

  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<FilterKey>('all')
  const [addOpen, setAddOpen] = useState<boolean>(
    () => (location.state as { openAdd?: boolean } | null)?.openAdd === true,
  )

  async function loadMembers() {
    if (!choir?.id) return
    setLoading(true)
    const data = await getMembersByChoirId(choir.id)
    setMembers(data)
    setLoading(false)
  }

  useEffect(() => {
    loadMembers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [choir?.id])

  const filtered = useMemo(() => {
    let list = members
    if (filter !== 'all') {
      list = list.filter((m) => {
        if (filter === 'unassigned') return !m.voice_part
        if (filter === 'soprano') return m.voice_part === 'soprano' || m.voice_part === 'mezzo_soprano'
        if (filter === 'bass') return m.voice_part === 'bass' || m.voice_part === 'baritone'
        return m.voice_part === filter
      })
    }
    if (query.trim()) {
      const q = query.toLowerCase()
      list = list.filter(
        (m) =>
          `${m.first_name} ${m.last_name}`.toLowerCase().includes(q) ||
          m.email.toLowerCase().includes(q),
      )
    }
    return list
  }, [members, filter, query])

  async function handleDelete(m: Member) {
    if (!confirm(`Remove ${m.first_name} ${m.last_name}?`)) return
    const ok = await deleteMember(m.id)
    if (ok) setMembers((prev) => prev.filter((x) => x.id !== m.id))
  }

  const isCompact = sizeClass === 'compact'

  return (
    <div className='min-w-0'>
      <header className='sticky top-0 z-20 bg-white border-b border-border h-14 px-5 flex items-center justify-between gap-3'>
        <div className='flex items-center gap-2 min-w-0'>
          <h1 className='font-medium text-navy truncate'>Members</h1>
          <span className='text-xs bg-surface-3 text-text-secondary px-2 py-0.5 rounded-full flex-shrink-0'>
            {members.length}
          </span>
        </div>
        <div className='flex items-center gap-2'>
          {!isCompact && (
            <div className='relative'>
              <Search className='w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted' />
              <input
                type='search'
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder='Search...'
                className='w-48 pl-9 pr-3 py-2 border border-border rounded-lg text-sm min-h-[44px] focus:outline-none focus:border-blue'
              />
            </div>
          )}
          <button
            type='button'
            onClick={() => setAddOpen(true)}
            className='inline-flex items-center gap-2 bg-blue text-white rounded-lg px-4 py-2 text-sm font-medium min-h-[44px] hover:bg-blue-light transition-colors'
          >
            <UserPlus className='w-4 h-4' />
            <span className='hidden sm:inline'>Add Member</span>
            <span className='sm:hidden'>Add</span>
          </button>
        </div>
      </header>

      <div className='px-4 sm:px-5 py-4 max-w-7xl mx-auto w-full space-y-4'>
        {isCompact && (
          <div className='relative'>
            <Search className='w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted' />
            <input
              type='search'
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder='Search members...'
              className='w-full pl-9 pr-3 py-2 border border-border rounded-lg text-sm min-h-[44px] focus:outline-none focus:border-blue'
            />
          </div>
        )}

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
          <div className='bg-white rounded-xl border border-gray-100 p-5'>
            <SkeletonLoader variant='list' rows={5} />
          </div>
        ) : filtered.length === 0 ? (
          <div className='bg-white rounded-xl border border-gray-100'>
            <EmptyState
              icon={<Users className='w-6 h-6' />}
              title={query || filter !== 'all' ? 'No matches' : 'No members yet'}
              subtitle={
                query
                  ? `No results for "${query}"`
                  : filter !== 'all'
                    ? 'Try a different filter.'
                    : 'Add your first member to start building your choir.'
              }
              action={
                !query && filter === 'all'
                  ? { label: 'Add your first member', onClick: () => setAddOpen(true) }
                  : undefined
              }
            />
          </div>
        ) : isCompact ? (
          <ul className='space-y-2'>
            {filtered.map((m) => (
              <li
                key={m.id}
                className='bg-white rounded-xl border border-gray-100 p-3 flex items-center gap-3 min-w-0'
              >
                <MemberAvatar firstName={m.first_name} lastName={m.last_name} voicePart={m.voice_part} size='md' />
                <div className='flex-1 min-w-0'>
                  <div className='font-medium text-navy text-sm truncate'>
                    {m.first_name} {m.last_name}
                  </div>
                  <div className='text-xs text-text-muted truncate'>{m.email}</div>
                  <div className='mt-1'>
                    <VoicePartBadge part={m.voice_part} />
                  </div>
                </div>
                <ChevronRight className='w-4 h-4 text-text-muted flex-shrink-0' />
              </li>
            ))}
          </ul>
        ) : (
          <div className='bg-white rounded-xl border border-gray-100 overflow-x-auto'>
            <table className='w-full'>
              <thead className='bg-surface-2 border-b border-border'>
                <tr className='text-left text-xs uppercase tracking-wide text-text-muted'>
                  <th className='font-medium px-4 py-3'>Name</th>
                  <th className='font-medium px-4 py-3'>Voice Part</th>
                  <th className='font-medium px-4 py-3'>Role</th>
                  <th className='font-medium px-4 py-3'>Status</th>
                  <th className='font-medium px-4 py-3'>Joined</th>
                  <th className='font-medium px-4 py-3 text-right'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((m) => (
                  <tr key={m.id} className='border-t border-border hover:bg-surface-2'>
                    <td className='px-4 py-3 min-w-0'>
                      <div className='flex items-center gap-3 min-w-0'>
                        <MemberAvatar firstName={m.first_name} lastName={m.last_name} voicePart={m.voice_part} size='sm' />
                        <div className='min-w-0'>
                          <div className='font-medium text-navy text-sm truncate'>
                            {m.first_name} {m.last_name}
                          </div>
                          <div className='text-xs text-text-muted truncate'>{m.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className='px-4 py-3'>
                      <VoicePartBadge part={m.voice_part} />
                    </td>
                    <td className='px-4 py-3'>
                      <span className={['text-[10px] uppercase tracking-wide font-medium px-2 py-0.5 rounded-full', ROLE_BADGE[m.role]].join(' ')}>
                        {m.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td className='px-4 py-3'>
                      <div className='flex items-center gap-2 text-xs text-text-secondary'>
                        <span className={['w-2 h-2 rounded-full', STATUS_DOT[m.status] || 'bg-gray-400'].join(' ')} />
                        <span className='capitalize'>{m.status}</span>
                      </div>
                    </td>
                    <td className='px-4 py-3 text-xs text-text-secondary'>
                      {relativeDate(m.joined_at || m.created_at)}
                    </td>
                    <td className='px-4 py-3'>
                      <div className='flex items-center justify-end gap-1'>
                        <button
                          type='button'
                          className='p-2 min-h-[36px] min-w-[36px] text-text-muted hover:text-navy hover:bg-surface-3 rounded-lg'
                          aria-label='Edit'
                        >
                          <Pencil className='w-4 h-4' />
                        </button>
                        <button
                          type='button'
                          onClick={() => handleDelete(m)}
                          className='p-2 min-h-[36px] min-w-[36px] text-text-muted hover:text-danger hover:bg-red-50 rounded-lg'
                          aria-label='Delete'
                        >
                          <Trash2 className='w-4 h-4' />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {addOpen && (
        <AddMemberPanel
          onClose={() => setAddOpen(false)}
          onCreated={async () => {
            await loadMembers()
            setAddOpen(false)
          }}
        />
      )}
    </div>
  )
}

function AddMemberPanel({
  onClose,
  onCreated,
}: {
  onClose: () => void
  onCreated: () => void | Promise<void>
}) {
  const { choir, organization } = useAuth()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [voicePart, setVoicePart] = useState<VoicePart | ''>('')
  const [role, setRole] = useState<MemberRole>('member')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      setError('First name, last name, and email are required.')
      return
    }
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError('Enter a valid email address.')
      return
    }
    if (!choir?.id || !organization?.id) {
      setError('No choir selected.')
      return
    }
    setSubmitting(true)
    const created = await createMember({
      choir_id: choir.id,
      organization_id: organization.id,
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      email: email.trim(),
      phone: phone.trim() || undefined,
      voice_part: voicePart || undefined,
      role,
      status: 'pending',
    } as any)
    setSubmitting(false)
    if (!created) {
      setError('Could not add member. Try again.')
      return
    }
    await onCreated()
  }

  return (
    <div className='fixed inset-0 z-50 flex'>
      <div className='absolute inset-0 bg-black/40 backdrop-blur-sm' onClick={onClose} />
      <div className='ml-auto relative bg-white w-full sm:w-[480px] h-full flex flex-col shadow-xl'>
        <div className='h-14 px-5 border-b border-border flex items-center justify-between flex-shrink-0'>
          <h2 className='font-medium text-navy'>Add Member</h2>
          <button
            type='button'
            onClick={onClose}
            className='p-2 min-h-[44px] min-w-[44px] text-text-muted hover:text-navy hover:bg-surface-3 rounded-lg flex items-center justify-center'
            aria-label='Close'
          >
            <X className='w-5 h-5' />
          </button>
        </div>
        <form onSubmit={onSubmit} className='flex-1 overflow-y-auto px-5 py-5 space-y-4'>
          <div className='grid grid-cols-2 gap-3'>
            <Field label='First name'>
              <input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className='w-full border border-border rounded-lg px-3 py-2 text-sm min-h-[44px] focus:outline-none focus:border-blue'
              />
            </Field>
            <Field label='Last name'>
              <input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className='w-full border border-border rounded-lg px-3 py-2 text-sm min-h-[44px] focus:outline-none focus:border-blue'
              />
            </Field>
          </div>
          <Field label='Email'>
            <input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='w-full border border-border rounded-lg px-3 py-2 text-sm min-h-[44px] focus:outline-none focus:border-blue'
            />
          </Field>
          <Field label='Phone'>
            <input
              type='tel'
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className='w-full border border-border rounded-lg px-3 py-2 text-sm min-h-[44px] focus:outline-none focus:border-blue'
            />
          </Field>
          <Field label='Voice part'>
            <select
              value={voicePart}
              onChange={(e) => setVoicePart(e.target.value as VoicePart | '')}
              className='w-full border border-border rounded-lg px-3 py-2 text-sm min-h-[44px] bg-white focus:outline-none focus:border-blue'
            >
              <option value=''>Unassigned</option>
              <option value='soprano'>Soprano</option>
              <option value='mezzo_soprano'>Mezzo-soprano</option>
              <option value='alto'>Alto</option>
              <option value='tenor'>Tenor</option>
              <option value='baritone'>Baritone</option>
              <option value='bass'>Bass</option>
            </select>
          </Field>
          <Field label='Role'>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as MemberRole)}
              className='w-full border border-border rounded-lg px-3 py-2 text-sm min-h-[44px] bg-white focus:outline-none focus:border-blue'
            >
              <option value='member'>Member</option>
              <option value='section_leader'>Section Leader</option>
              <option value='admin'>Admin</option>
            </select>
          </Field>
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
            {submitting ? 'Adding…' : 'Add Member'}
          </button>
        </div>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className='block'>
      <span className='text-xs font-medium text-text-secondary'>{label}</span>
      <div className='mt-1'>{children}</div>
    </label>
  )
}
