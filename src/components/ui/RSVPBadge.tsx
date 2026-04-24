import { CheckCircle, Clock, XCircle, Circle } from 'lucide-react'
import type { RSVPStatus } from '../../types/rsvp.types'

interface RSVPBadgeProps {
  status: RSVPStatus
  size?: 'sm' | 'md'
  onClick?: () => void
}

const META: Record<
  RSVPStatus,
  { label: string; classes: string; icon: typeof CheckCircle }
> = {
  going: {
    label: 'Going',
    classes: 'bg-green-100 text-green-700 border-green-200',
    icon: CheckCircle,
  },
  maybe: {
    label: 'Maybe',
    classes: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    icon: Clock,
  },
  not_going: {
    label: "Can't go",
    classes: 'bg-red-100 text-red-700 border-red-200',
    icon: XCircle,
  },
  pending: {
    label: 'Respond',
    classes: 'bg-gray-100 text-gray-500 border-gray-200',
    icon: Circle,
  },
}

export function RSVPBadge({ status, size = 'md', onClick }: RSVPBadgeProps) {
  const meta = META[status]
  const Icon = meta.icon
  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1'
  const iconSize = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'
  const common = [
    'inline-flex items-center gap-1.5 font-medium rounded-full border',
    meta.classes,
    sizeClasses,
    onClick ? 'cursor-pointer hover:brightness-95 transition' : '',
  ].join(' ')

  if (onClick) {
    return (
      <button type='button' onClick={onClick} className={[common, 'min-h-[32px]'].join(' ')}>
        <Icon className={iconSize} />
        <span>{meta.label}</span>
      </button>
    )
  }
  return (
    <span className={common}>
      <Icon className={iconSize} />
      <span>{meta.label}</span>
    </span>
  )
}
