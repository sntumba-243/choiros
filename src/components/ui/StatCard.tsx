import type { ReactNode } from 'react'

interface StatCardProps {
  label: string
  value: string | number
  icon: ReactNode
  iconBg: string
  trend?: string
  trendUp?: boolean
  subtitle?: string
}

export function StatCard({ label, value, icon, iconBg, trend, trendUp, subtitle }: StatCardProps) {
  return (
    <div className='bg-white rounded-xl border border-gray-100 shadow-sm p-5 min-w-0'>
      <div className={['w-10 h-10 rounded-full flex items-center justify-center mb-4', iconBg].join(' ')}>
        {icon}
      </div>
      <div className='font-serif text-3xl text-navy leading-none truncate'>{value}</div>
      <div className='mt-2 text-xs uppercase tracking-wide text-text-muted truncate'>{label}</div>
      {trend && (
        <div
          className={[
            'mt-2 inline-block text-xs font-medium px-2 py-0.5 rounded-full',
            trendUp ? 'bg-green-50 text-success' : 'bg-gray-100 text-text-secondary',
          ].join(' ')}
        >
          {trend}
        </div>
      )}
      {subtitle && <div className='mt-2 text-xs text-text-muted truncate'>{subtitle}</div>}
    </div>
  )
}
