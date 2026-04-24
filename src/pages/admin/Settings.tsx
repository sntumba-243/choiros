import { useEffect, useState } from 'react'
import { Check, AlertTriangle } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { updateChoir } from '../../services/choir.service'
import { useTheme, type Theme } from '../../hooks/useTheme'

const TIMEZONES = [
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Africa/Lagos',
  'Africa/Johannesburg',
  'Asia/Singapore',
  'Asia/Tokyo',
  'Australia/Sydney',
]

const THEMES: { key: Theme; name: string; swatch: string; description: string }[] = [
  { key: 'classic', name: 'Classic', swatch: '#185FA5', description: 'Navy & ocean blue' },
  { key: 'gospel', name: 'Gospel', swatch: '#C45A2E', description: 'Warm terracotta' },
  { key: 'midnight', name: 'Midnight', swatch: '#6D28D9', description: 'Deep purple' },
  { key: 'forest', name: 'Forest', swatch: '#047857', description: 'Choral green' },
  { key: 'mono', name: 'Mono', swatch: '#111827', description: 'Black & white' },
]

export default function AdminSettings() {
  const { choir, refresh } = useAuth()
  const { theme, setTheme } = useTheme()

  const [name, setName] = useState(choir?.name || '')
  const [timezone, setTimezone] = useState(choir?.timezone || 'America/New_York')
  const [savingProfile, setSavingProfile] = useState(false)
  const [profileStatus, setProfileStatus] = useState<'saved' | 'error' | null>(null)

  const [deleteConfirm, setDeleteConfirm] = useState<string>('')
  const [deleteOpen, setDeleteOpen] = useState(false)

  useEffect(() => {
    if (choir) {
      setName(choir.name)
      setTimezone(choir.timezone || 'America/New_York')
    }
  }, [choir])

  async function saveProfile() {
    if (!choir?.id) return
    if (!name.trim()) {
      setProfileStatus('error')
      return
    }
    setSavingProfile(true)
    setProfileStatus(null)
    const updated = await updateChoir(choir.id, { name: name.trim(), timezone })
    setSavingProfile(false)
    if (!updated) {
      setProfileStatus('error')
      return
    }
    setProfileStatus('saved')
    await refresh()
    setTimeout(() => setProfileStatus(null), 2500)
  }

  return (
    <div className='min-w-0'>
      <header className='sticky top-0 z-20 bg-white border-b border-border h-14 px-5 flex items-center justify-between'>
        <h1 className='font-medium text-navy'>Settings</h1>
      </header>

      <div className='px-4 sm:px-5 py-5 max-w-3xl mx-auto w-full space-y-6'>
        <section className='bg-white rounded-xl border border-gray-100 shadow-sm p-5 min-w-0'>
          <h2 className='font-medium text-navy'>Choir profile</h2>
          <p className='mt-1 text-sm text-text-secondary'>Update your choir's name and timezone.</p>

          <div className='mt-4 space-y-3'>
            <label className='block'>
              <span className='text-xs font-medium text-text-secondary'>Choir name</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className='mt-1 w-full border border-border rounded-lg px-3 py-2 text-sm min-h-[44px] focus:outline-none focus:border-blue'
              />
            </label>
            <label className='block'>
              <span className='text-xs font-medium text-text-secondary'>Timezone</span>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className='mt-1 w-full border border-border rounded-lg px-3 py-2 text-sm min-h-[44px] bg-white focus:outline-none focus:border-blue'
              >
                {TIMEZONES.map((tz) => (
                  <option key={tz} value={tz}>
                    {tz}
                  </option>
                ))}
              </select>
            </label>
            <div className='flex items-center gap-3'>
              <button
                type='button'
                disabled={savingProfile}
                onClick={saveProfile}
                className='bg-blue text-white rounded-lg px-4 py-2 text-sm font-medium min-h-[44px] hover:bg-blue-light transition-colors disabled:opacity-60'
              >
                {savingProfile ? 'Saving…' : 'Save changes'}
              </button>
              {profileStatus === 'saved' && (
                <span className='text-sm text-success inline-flex items-center gap-1'>
                  <Check className='w-4 h-4' />
                  Saved
                </span>
              )}
              {profileStatus === 'error' && (
                <span className='text-sm text-danger'>Could not save. Try again.</span>
              )}
            </div>
          </div>
        </section>

        <section className='bg-white rounded-xl border border-gray-100 shadow-sm p-5 min-w-0'>
          <h2 className='font-medium text-navy'>Theme</h2>
          <p className='mt-1 text-sm text-text-secondary'>
            Choose a theme that fits your choir's personality.
          </p>
          <div className='mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3'>
            {THEMES.map((t) => {
              const selected = theme === t.key
              return (
                <button
                  key={t.key}
                  type='button'
                  onClick={() => setTheme(t.key)}
                  className={[
                    'relative text-left bg-white rounded-xl p-3 border-2 transition-colors min-h-[88px]',
                    selected ? 'border-blue' : 'border-border hover:border-text-muted',
                  ].join(' ')}
                >
                  <span
                    className='block w-full h-10 rounded-lg'
                    style={{ backgroundColor: t.swatch }}
                  />
                  <div className='mt-2 text-sm font-medium text-navy'>{t.name}</div>
                  <div className='text-[10px] text-text-muted truncate'>{t.description}</div>
                  {selected && (
                    <span className='absolute top-2 right-2 w-5 h-5 rounded-full bg-blue text-white flex items-center justify-center'>
                      <Check className='w-3 h-3' />
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </section>

        <section className='bg-white rounded-xl border-2 border-danger/30 p-5 min-w-0'>
          <div className='flex items-start gap-3'>
            <AlertTriangle className='w-5 h-5 text-danger flex-shrink-0 mt-0.5' />
            <div className='flex-1 min-w-0'>
              <h2 className='font-medium text-danger'>Danger zone</h2>
              <p className='mt-1 text-sm text-text-secondary'>
                Deleting your choir will permanently remove all members, events, songs, and attendance records.
              </p>
              {!deleteOpen ? (
                <button
                  type='button'
                  onClick={() => setDeleteOpen(true)}
                  className='mt-3 border border-danger text-danger rounded-lg px-4 py-2 text-sm font-medium min-h-[44px] hover:bg-red-50'
                >
                  Delete Choir
                </button>
              ) : (
                <div className='mt-3 space-y-2'>
                  <p className='text-sm text-navy'>
                    Type <span className='font-mono font-semibold'>{choir?.name}</span> to confirm.
                  </p>
                  <input
                    value={deleteConfirm}
                    onChange={(e) => setDeleteConfirm(e.target.value)}
                    className='w-full border border-border rounded-lg px-3 py-2 text-sm min-h-[44px] focus:outline-none focus:border-danger'
                  />
                  <div className='flex items-center gap-2'>
                    <button
                      type='button'
                      disabled={deleteConfirm !== choir?.name}
                      className='bg-danger text-white rounded-lg px-4 py-2 text-sm font-medium min-h-[44px] disabled:opacity-40'
                    >
                      Permanently delete
                    </button>
                    <button
                      type='button'
                      onClick={() => {
                        setDeleteOpen(false)
                        setDeleteConfirm('')
                      }}
                      className='text-sm text-text-secondary px-4 py-2 rounded-lg min-h-[44px] hover:bg-surface-3'
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
