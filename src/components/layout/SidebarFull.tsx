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
  LogOut,
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { MemberAvatar } from '../ui/MemberAvatar'

interface NavItem {
  to: string
  label: string
  icon: typeof LayoutDashboard
  exact?: boolean
}

const SECTIONS: { label: string; items: NavItem[] }[] = [
  {
    label: 'Manage',
    items: [
      { to: '/admin', label: 'Overview', icon: LayoutDashboard, exact: true },
      { to: '/admin/members', label: 'Members', icon: Users },
      { to: '/admin/events', label: 'Events', icon: Calendar },
    ],
  },
  {
    label: 'Music',
    items: [
      { to: '/admin/songs', label: 'Songs', icon: Music },
      { to: '/admin/attendance', label: 'Attendance', icon: ClipboardCheck },
      { to: '/admin/messages', label: 'Messages', icon: MessageSquare },
    ],
  },
  {
    label: 'Settings',
    items: [
      { to: '/admin/settings', label: 'Settings', icon: Settings },
      { to: '/admin/billing', label: 'Billing', icon: CreditCard },
    ],
  },
]

function isActive(pathname: string, to: string, exact?: boolean) {
  return exact ? pathname === to : pathname === to || pathname.startsWith(to + '/')
}

export default function SidebarFull() {
  const { pathname } = useLocation()
  const { member, choir, signOut } = useAuth()

  return (
    <aside className='fixed inset-y-0 left-0 w-[200px] bg-navy text-white flex flex-col'>
      <div className='px-5 py-5'>
        <Link to='/admin' className='block'>
          <span className='font-bold text-xl'>Choir</span>
          <span className='font-bold text-xl text-blue-light'>OS</span>
        </Link>
        {choir?.name && (
          <div className='mt-1 text-xs text-white/40 truncate'>{choir.name}</div>
        )}
      </div>

      <nav className='flex-1 overflow-y-auto px-3 pb-4'>
        {SECTIONS.map((section) => (
          <div key={section.label} className='mb-5'>
            <div className='px-2 pb-1 text-[10px] uppercase tracking-wider text-white/40'>
              {section.label}
            </div>
            <ul className='space-y-0.5'>
              {section.items.map((item) => {
                const active = isActive(pathname, item.to, item.exact)
                const Icon = item.icon
                return (
                  <li key={item.to}>
                    <Link
                      to={item.to}
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
          </div>
        ))}
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
              {member.role}
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
