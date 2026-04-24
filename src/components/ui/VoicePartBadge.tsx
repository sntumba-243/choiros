interface VoicePartBadgeProps {
  part?: string
}

const STYLES: Record<string, string> = {
  soprano: 'bg-pink-100 text-pink-700',
  mezzo_soprano: 'bg-pink-100 text-pink-700',
  alto: 'bg-purple-100 text-purple-700',
  tenor: 'bg-blue-100 text-blue-700',
  baritone: 'bg-green-100 text-green-700',
  bass: 'bg-green-100 text-green-700',
}

function humanize(p?: string) {
  if (!p) return 'Unassigned'
  return p.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

export function VoicePartBadge({ part }: VoicePartBadgeProps) {
  const style = (part && STYLES[part]) || 'bg-gray-100 text-gray-600'
  return (
    <span className={['text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap', style].join(' ')}>
      {humanize(part)}
    </span>
  )
}
