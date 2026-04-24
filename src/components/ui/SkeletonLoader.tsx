interface SkeletonLoaderProps {
  rows?: number
  variant?: 'card' | 'list' | 'stat'
}

export function SkeletonLoader({ rows = 3, variant = 'card' }: SkeletonLoaderProps) {
  if (variant === 'stat') {
    return (
      <div className='grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4'>
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className='bg-white rounded-xl border border-gray-100 p-5 shadow-sm animate-pulse'
          >
            <div className='w-10 h-10 rounded-full bg-surface-3 mb-4' />
            <div className='h-7 bg-surface-3 rounded w-1/2 mb-2' />
            <div className='h-3 bg-surface-3 rounded w-3/4' />
          </div>
        ))}
      </div>
    )
  }

  if (variant === 'list') {
    return (
      <div className='space-y-3'>
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className='flex items-center gap-3 animate-pulse'>
            <div className='w-10 h-10 rounded-full bg-surface-3 flex-shrink-0' />
            <div className='flex-1 min-w-0'>
              <div className='h-3 bg-surface-3 rounded w-1/3 mb-2' />
              <div className='h-3 bg-surface-3 rounded w-1/2' />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className='space-y-3'>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className='bg-white rounded-xl border border-gray-100 p-5 shadow-sm animate-pulse'
        >
          <div className='h-4 bg-surface-3 rounded w-1/3 mb-3' />
          <div className='h-3 bg-surface-3 rounded w-2/3 mb-2' />
          <div className='h-3 bg-surface-3 rounded w-1/2' />
        </div>
      ))}
    </div>
  )
}
