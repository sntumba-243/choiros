interface MemberAvatarProps {
  firstName: string
  lastName: string
  voicePart?: string
  size?: 'sm' | 'md' | 'lg'
}

const VOICE_COLORS: Record<string, string> = {
  soprano: '#EC4899',
  mezzo_soprano: '#EC4899',
  alto: '#8B5CF6',
  tenor: '#3B82F6',
  baritone: '#10B981',
  bass: '#10B981',
}

const SIZE_CLASSES: Record<string, string> = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
}

export function MemberAvatar({ firstName, lastName, voicePart, size = 'md' }: MemberAvatarProps) {
  const initials = ((firstName?.[0] || '') + (lastName?.[0] || '')).toUpperCase() || '?'
  const bg = (voicePart && VOICE_COLORS[voicePart]) || '#6B7A8D'
  return (
    <div
      className={[
        'rounded-full flex items-center justify-center text-white font-medium flex-shrink-0',
        SIZE_CLASSES[size],
      ].join(' ')}
      style={{ backgroundColor: bg }}
    >
      {initials}
    </div>
  )
}
