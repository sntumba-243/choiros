import type { ReactNode } from 'react'

interface EmptyStateProps {
  icon: ReactNode
  title: string
  subtitle: string
  action?: { label: string; onClick: () => void }
}

export function EmptyState({ icon, title, subtitle, action }: EmptyStateProps) {
  return (
    <div className='py-16 flex flex-col items-center text-center px-4'>
      <div className='w-16 h-16 rounded-full bg-surface-3 flex items-center justify-center text-text-muted mb-4'>
        {icon}
      </div>
      <h3 className='font-medium text-navy text-lg'>{title}</h3>
      <p className='mt-1 text-sm text-text-secondary max-w-sm'>{subtitle}</p>
      {action && (
        <button
          type='button'
          onClick={action.onClick}
          className='mt-5 inline-flex items-center gap-2 bg-blue text-white rounded-lg px-4 py-2 text-sm font-medium min-h-[44px] hover:bg-blue-light transition-colors'
        >
          {action.label}
        </button>
      )}
    </div>
  )
}
