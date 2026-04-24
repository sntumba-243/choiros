import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut, Check, Calendar } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { updateMember, getMemberStats } from '../../services/member.service'
import type { VoicePart } from '../../types/database'
import { MemberAvatar } from '../../components/ui/MemberAvatar'
import { VoicePartBadge } from '../../components/ui/VoicePartBadge'

function formatJoinedDate(iso?: string) {
  if (!iso) return '—'
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
  }).format(new Date(iso))
}

export default function MemberProfile() {
  const { member, choir, refresh, signOut } = useAuth()
  const navigate = useNavigate()

  const [firstName, setFirstName] = useState(member?.first_name || '')
  const [lastName, setLastName] = useState(member?.last_name || '')
  const [phone, setPhone] = useState(member?.phone || '')
  const [voicePart, setVoicePart] = useState<VoicePart | ''>(member?.voice_part || '')
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState<'saved' | 'error' | null>(null)

  const [stats, setStats] = useState<{ attended: number; rsvps: number }>({ attended: 0, rsvps: 0 })

  useEffect(() => {
    if (member) {
      setFirstName(member.first_name)
      setLastName(member.last_name)
      setPhone(member.phone || '')
      setVoicePart(member.voice_part || '')
    }
  }, [member])

  useEffect(() => {
    if (!member?.id) return
    let cancelled = false
    ;(async () => {
      const s = await getMemberStats(member.id)
      if (!cancelled) setStats(s)
    })()
    return () => {
      cancelled = true
    }
  }, [member?.id])

  async function saveProfile() {
    if (!member?.id) return
    setSaving(true)
    setStatus(null)
    const updated = await updateMember(member.id, {
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      phone: phone.trim() || undefined,
      voice_part: (voicePart || undefined) as VoicePart | undefined,
    })
    setSaving(false)
    if (!updated) {
      setStatus('error')
      return
    }
    setStatus('saved')
    await refresh()
    setTimeout(() => setStatus(null), 2500)
  }

  async function handleSignOut() {
    await signOut()
    navigate('/')
  }

  return (
    <div className='min-w-0'>
      <header className='sticky top-0 z-20 bg-white border-b border-border h-14 px-5 flex items-center justify-between'>
        <div className='min-w-0 flex items-center gap-2'>
          <span className='text-text-secondary text-sm truncate'>{choir?.name}</span>
          <span className='text-text-muted'>/</span>
          <h1 className='font-medium text-navy'>Profile</h1>
        </div>
      </header>

      <div className='px-4 sm:px-5 py-5 max-w-2xl mx-auto w-full space-y-5'>
        <section className='bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left'>
          {member && (
            <MemberAvatar
              firstName={member.first_name}
              lastName={member.last_name}
              voicePart={member.voice_part}
              size='xl'
            />
          )}
          <div className='flex-1 min-w-0'>
            <h2 className='font-serif text-2xl text-navy truncate'>
              {member ? `${member.first_name} ${member.last_name}` : 'Loading…'}
            </h2>
            <div className='mt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2'>
              <VoicePartBadge part={member?.voice_part} />
              {member?.role && (
                <span className='text-[10px] uppercase tracking-wide font-medium bg-surface-3 text-text-secondary px-2 py-0.5 rounded-full'>
                  {member.role.replace('_', ' ')}
                </span>
              )}
            </div>
            {member?.email && (
              <p className='mt-2 text-sm text-text-secondary truncate'>{member.email}</p>
            )}
          </div>
        </section>

        <section className='grid grid-cols-2 sm:grid-cols-3 gap-3'>
          <div className='bg-white rounded-xl border border-gray-100 p-4 min-w-0'>
            <div className='font-serif text-3xl text-navy leading-none'>{stats.attended}</div>
            <div className='mt-2 text-xs uppercase tracking-wide text-text-muted'>Events attended</div>
          </div>
          <div className='bg-white rounded-xl border border-gray-100 p-4 min-w-0'>
            <div className='font-serif text-3xl text-navy leading-none'>{stats.rsvps}</div>
            <div className='mt-2 text-xs uppercase tracking-wide text-text-muted'>RSVPs made</div>
          </div>
          <div className='bg-white rounded-xl border border-gray-100 p-4 min-w-0 col-span-2 sm:col-span-1'>
            <div className='flex items-center gap-2'>
              <Calendar className='w-4 h-4 text-text-muted' />
              <div className='text-sm font-medium text-navy truncate'>
                {formatJoinedDate(member?.joined_at || member?.created_at)}
              </div>
            </div>
            <div className='mt-2 text-xs uppercase tracking-wide text-text-muted'>Joined</div>
          </div>
        </section>

        <section className='bg-white rounded-2xl border border-gray-100 shadow-sm p-5'>
          <h3 className='font-medium text-navy'>Edit profile</h3>
          <div className='mt-4 space-y-3'>
            <div className='grid grid-cols-2 gap-3'>
              <label className='block'>
                <span className='text-xs font-medium text-text-secondary'>First name</span>
                <input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className='mt-1 w-full border border-border rounded-lg px-3 py-2 text-sm min-h-[44px] focus:outline-none focus:border-blue'
                />
              </label>
              <label className='block'>
                <span className='text-xs font-medium text-text-secondary'>Last name</span>
                <input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className='mt-1 w-full border border-border rounded-lg px-3 py-2 text-sm min-h-[44px] focus:outline-none focus:border-blue'
                />
              </label>
            </div>
            <label className='block'>
              <span className='text-xs font-medium text-text-secondary'>Phone</span>
              <input
                type='tel'
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className='mt-1 w-full border border-border rounded-lg px-3 py-2 text-sm min-h-[44px] focus:outline-none focus:border-blue'
              />
            </label>
            <label className='block'>
              <span className='text-xs font-medium text-text-secondary'>Voice part</span>
              <select
                value={voicePart}
                onChange={(e) => setVoicePart(e.target.value as VoicePart | '')}
                className='mt-1 w-full border border-border rounded-lg px-3 py-2 text-sm min-h-[44px] bg-white focus:outline-none focus:border-blue'
              >
                <option value=''>Unassigned</option>
                <option value='soprano'>Soprano</option>
                <option value='mezzo_soprano'>Mezzo-soprano</option>
                <option value='alto'>Alto</option>
                <option value='tenor'>Tenor</option>
                <option value='baritone'>Baritone</option>
                <option value='bass'>Bass</option>
              </select>
            </label>
            <div className='flex items-center gap-3 pt-2'>
              <button
                type='button'
                disabled={saving}
                onClick={saveProfile}
                className='bg-blue text-white rounded-lg px-4 py-2 text-sm font-medium min-h-[44px] hover:bg-blue-light transition-colors disabled:opacity-60'
              >
                {saving ? 'Saving…' : 'Save changes'}
              </button>
              {status === 'saved' && (
                <span className='text-sm text-success inline-flex items-center gap-1'>
                  <Check className='w-4 h-4' />
                  Saved
                </span>
              )}
              {status === 'error' && (
                <span className='text-sm text-danger'>Could not save. Try again.</span>
              )}
            </div>
          </div>
        </section>

        <section className='bg-white rounded-2xl border border-gray-100 shadow-sm p-5'>
          <button
            type='button'
            onClick={handleSignOut}
            className='w-full flex items-center justify-center gap-2 border border-border text-danger rounded-lg px-4 py-3 text-sm font-medium min-h-[44px] hover:bg-red-50 transition-colors'
          >
            <LogOut className='w-4 h-4' />
            Sign out
          </button>
        </section>
      </div>
    </div>
  )
}
