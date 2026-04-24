import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  Calendar,
  Music,
  ClipboardCheck,
  MessageSquare,
  Settings,
  CreditCard,
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { MemberAvatar } from '../ui/MemberAvatar'

interface RailItem {
  to: string
  label: string
  icon: typeof LayoutDashboard
  exact?: boolean
}

const ITEMS: RailItem[] = [
  { to: '/admin', label: 'Home', icon: LayoutDashboard, exact: true },
  { to: '/admin/members', label: 'People', icon: Users },
  { to: '/admin/events', label: 'Events', icon: Calendar },
  { to: '/admin/songs', label: 'Songs', icon: Music },
  { to: '/admin/attendance', label: 'Attend', icon: ClipboardCheck },
  { to: '/admin/messages', label: 'Chat', icon: MessageSquare },
  { to: '/admin/settings', label: 'Setup', icon: Settings },
  { to: '/admin/billing', label: 'Billing', icon: CreditCard },
]

function isActive(pathname: string, to: string, exact?: boolean) {
  return exact ? pathname === to : pathname === to || pathname.startsWith(to + '/')
}

export default function NavigationRail() {
  const { pathname } = useLocation()
  const { member } = useAuth()

  return (
    <aside className='fixed inset-y-0 left-0 w-16 bg-navy text-white flex flex-col items-center py-3'>
      <Link to='/admin' className='block mb-4 font-bold text-sm'>
        <span className='text-white'>C</span>
        <span className='text-blue-light'>O</span>
      </Link>

      <nav className='flex-1 w-full overflow-y-auto'>
        <ul className='flex flex-col items-center gap-1 px-1'>
          {ITEMS.map((item) => {
            const active = isActive(pathname, item.to, item.exact)
            const Icon = item.icon
            return (
              <li key={item.to} className='w-full'>
                <Link
                  to={item.to}
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
