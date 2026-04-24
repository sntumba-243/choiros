import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  Calendar,
  Music,
  MoreHorizontal,
  ClipboardCheck,
  MessageSquare,
  Settings,
  CreditCard,
  LogOut,
  X,
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

interface Tab {
  to: string
  label: string
  icon: typeof LayoutDashboard
  exact?: boolean
}

const TABS: Tab[] = [
  { to: '/admin', label: 'Home', icon: LayoutDashboard, exact: true },
  { to: '/admin/members', label: 'Members', icon: Users },
  { to: '/admin/events', label: 'Events', icon: Calendar },
  { to: '/admin/songs', label: 'Songs', icon: Music },
]

const MORE_ITEMS = [
  { to: '/admin/attendance', label: 'Attendance', icon: ClipboardCheck },
  { to: '/admin/messages', label: 'Messages', icon: MessageSquare },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
  { to: '/admin/billing', label: 'Billing', icon: CreditCard },
]

const MORE_PATHS = MORE_ITEMS.map((i) => i.to)

function isActive(pathname: string, to: string, exact?: boolean) {
  return exact ? pathname === to : pathname === to || pathname.startsWith(to + '/')
}

export default function BottomTabBar() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { signOut } = useAuth()
  const [moreOpen, setMoreOpen] = useState(false)

  const moreActive = MORE_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/'))

  return (
    <>
      <nav
        className='fixed bottom-0 inset-x-0 bg-white border-t border-border flex items-stretch z-40'
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        {TABS.map((t) => {
          const active = isActive(pathname, t.to, t.exact)
          const Icon = t.icon
          return (
            <Link
              key={t.to}
              to={t.to}
              className={[
                'flex-1 flex flex-col items-center justify-center min-h-[60px] py-1.5 min-w-[44px]',
                active ? 'text-blue' : 'text-text-muted',
              ].join(' ')}
            >
              <Icon className={['w-5 h-5', active ? 'fill-blue/10' : ''].join(' ')} />
              <span className='text-[10px] font-medium mt-0.5'>{t.label}</span>
            </Link>
          )
        })}
        <button
          type='button'
          onClick={() => setMoreOpen(true)}
          className={[
            'flex-1 flex flex-col items-center justify-center min-h-[60px] py-1.5 min-w-[44px]',
            moreActive ? 'text-blue' : 'text-text-muted',
          ].join(' ')}
        >
          <MoreHorizontal className='w-5 h-5' />
          <span className='text-[10px] font-medium mt-0.5'>More</span>
        </button>
      </nav>

      {moreOpen && (
        <div
          className='fixed inset-0 bg-black/40 z-50 flex flex-col justify-end'
          onClick={() => setMoreOpen(false)}
        >
          <div
            className='bg-white rounded-t-2xl px-4 pt-2 pb-6'
            style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 1.5rem)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className='flex items-center justify-between pb-3 border-b border-border'>
              <div className='text-sm font-semibold text-navy'>More</div>
              <button
                type='button'
                onClick={() => setMoreOpen(false)}
                className='p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-text-secondary'
                aria-label='Close'
              >
                <X className='w-5 h-5' />
              </button>
            </div>
            <ul className='py-2'>
              {MORE_ITEMS.map((item) => {
                const Icon = item.icon
                return (
                  <li key={item.to}>
                    <button
                      type='button'
                      onClick={() => {
                        setMoreOpen(false)
                        navigate(item.to)
                      }}
                      className='w-full flex items-center gap-3 px-2 py-3 text-left min-h-[44px] text-navy hover:bg-surface-3 rounded-lg'
                    >
                      <Icon className='w-5 h-5 text-text-secondary' />
                      <span className='text-sm font-medium'>{item.label}</span>
                    </button>
                  </li>
                )
              })}
              <li>
                <button
                  type='button'
                  onClick={async () => {
                    setMoreOpen(false)
                    await signOut()
                  }}
                  className='w-full flex items-center gap-3 px-2 py-3 text-left min-h-[44px] text-danger hover:bg-surface-3 rounded-lg'
                >
                  <LogOut className='w-5 h-5' />
                  <span className='text-sm font-medium'>Sign out</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}
    </>
  )
}
