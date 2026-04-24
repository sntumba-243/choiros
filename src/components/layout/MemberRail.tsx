import { Link, useLocation, useParams } from 'react-router-dom'
import { LayoutDashboard, Calendar, Music, User } from 'lucide-react'
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

export default function MemberRail() {
  const { pathname } = useLocation()
  const { choirId } = useParams<{ choirId: string }>()
  const { member } = useAuth()

  const base = `/app/choir/${choirId || ''}`

  return (
    <aside className='fixed inset-y-0 left-0 w-16 bg-navy text-white flex flex-col items-center py-3'>
      <Link to={base} className='block mb-4 font-bold text-sm'>
        <span className='text-white'>C</span>
        <span className='text-blue-light'>O</span>
      </Link>

      <nav className='flex-1 w-full overflow-y-auto'>
        <ul className='flex flex-col items-center gap-1 px-1'>
          {ITEMS.map((item) => {
            const to = item.slug ? `${base}/${item.slug}` : base
            const active = isActive(pathname, to, item.exact)
            const Icon = item.icon
            return (
              <li key={item.slug} className='w-full'>
                <Link
                  to={to}
                  className={[
                    'flex flex-col items-center justify-center py-2 rounded-lg min-h-[44px] transition-colors',
                    active
                      ? 'bg-blue/25 text-blue-light'
                      : 'text-white/40 hover:text-white hover:bg-navy-light',
                  ].join(' ')}
                >
                  <Icon className='w-5 h-5' />
                  <span className='text-[10px] mt-0.5 leading-none'>{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {member && (
        <div className='pt-3 border-t border-white/10 w-full flex justify-center'>
          <MemberAvatar
            firstName={member.first_name}
            lastName={member.last_name}
            voicePart={member.voice_part}
            size='sm'
          />
        </div>
      )}
    </aside>
  )
}
