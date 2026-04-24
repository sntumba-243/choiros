import { Link, useLocation, useParams } from 'react-router-dom'
import { LayoutDashboard, Calendar, Music, User } from 'lucide-react'

interface Tab {
  slug: string
  label: string
  icon: typeof LayoutDashboard
  exact?: boolean
}

const TABS: Tab[] = [
  { slug: '', label: 'Home', icon: LayoutDashboard, exact: true },
  { slug: 'events', label: 'Events', icon: Calendar },
  { slug: 'songs', label: 'Songs', icon: Music },
  { slug: 'profile', label: 'Profile', icon: User },
]

function isActive(pathname: string, to: string, exact?: boolean) {
  return exact ? pathname === to : pathname === to || pathname.startsWith(to + '/')
}

export default function MemberTabBar() {
  const { pathname } = useLocation()
  const { choirId } = useParams<{ choirId: string }>()
  const base = `/app/choir/${choirId || ''}`

  return (
    <nav
      className='fixed bottom-0 inset-x-0 bg-white border-t border-border flex items-stretch z-40'
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      {TABS.map((t) => {
        const to = t.slug ? `${base}/${t.slug}` : base
        const active = isActive(pathname, to, t.exact)
        const Icon = t.icon
        return (
          <Link
            key={t.slug}
            to={to}
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
    </nav>
  )
}
