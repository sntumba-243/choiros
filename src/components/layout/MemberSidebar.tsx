import { Link, useLocation, useParams } from 'react-router-dom'
import { LayoutDashboard, Calendar, Music, User, LogOut } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { MemberAvatar } from '../ui/MemberAvatar'

interface Item {
  slug: string
  label: string
  icon: typeof LayoutDashboard
  exact?: boolean
}

const ITEMS: Item[] = [
  { slug: '', label: 'Home', icon: LayoutDashboard, exact: true },
  { slug: 'events', label: 'Events', icon: Calendar },
  { slug: 'songs', label: 'Songs', icon: Music },
  { slug: 'profile', label: 'Profile', icon: User },
]

function isActive(pathname: string, to: string, exact?: boolean) {
  return exact ? pathname === to : pathname === to || pathname.startsWith(to + '/')
}

export default function MemberSidebar() {
  const { pathname } = useLocation()
  const { choirId } = useParams<{ choirId: string }>()
  const { member, choir, signOut } = useAuth()

  const base = `/app/choir/${choirId || ''}`

  return (
    <aside className='fixed inset-y-0 left-0 w-[180px] bg-navy text-white flex flex-col'>
      <div className='px-5 py-5'>
        <Link to={base} className='block'>
          <span className='font-bold text-xl'>Choir</span>
          <span className='font-bold text-xl text-blue-light'>OS</span>
        </Link>
        {choir?.name && (
          <div className='mt-1 text-xs text-white/40 truncate'>{choir.name}</div>
        )}
      </div>

      <nav className='flex-1 overflow-y-auto px-3 pb-4'>
        <ul className='space-y-0.5'>
          {ITEMS.map((item) => {
            const to = item.slug ? `${base}/${item.slug}` : base
            const active = isActive(pathname, to, item.exact)
            const Icon = item.icon
            return (
              <li key={item.slug}>
                <Link
                  to={to}
                  className={[
                    'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors min-h-[36px]',
                    active
                      ? 'bg-blue text-white'
                      : 'text-white/70 hover:bg-navy-light hover:text-white',
                  ].join(' ')}
                >
                  <Icon className='w-4 h-4 flex-shrink-0' />
                  <span className='truncate'>{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {member && (
        <div className='border-t border-white/10 px-3 py-3 flex items-center gap-3 min-w-0'>
          <MemberAvatar
            firstName={member.first_name}
            lastName={member.last_name}
            voicePart={member.voice_part}
            size='sm'
          />
          <div className='flex-1 min-w-0'>
            <div className='text-sm font-medium truncate'>
              {member.first_name} {member.last_name}
            </div>
            <div className='text-[10px] uppercase tracking-wide text-white/40 truncate'>
              {member.voice_part || member.role}
            </div>
          </div>
          <button
            type='button'
            onClick={() => signOut()}
            className='text-white/60 hover:text-white p-1.5 rounded'
            aria-label='Sign out'
          >
            <LogOut className='w-4 h-4' />
          </button>
        </div>
      )}
    </aside>
  )
}
