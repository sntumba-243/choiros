import { CreditCard } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

export default function Billing() {
  const { organization } = useAuth()
  return (
    <div className='min-w-0'>
      <header className='sticky top-0 z-20 bg-white border-b border-border h-14 px-5 flex items-center'>
        <h1 className='font-medium text-navy'>Billing</h1>
      </header>
      <div className='px-4 sm:px-5 py-5 max-w-3xl mx-auto w-full space-y-5'>
        <section className='bg-white rounded-xl border border-gray-100 shadow-sm p-5'>
          <div className='flex items-center justify-between flex-wrap gap-3'>
            <div className='flex items-center gap-3 min-w-0'>
              <div className='w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0'>
                <CreditCard className='w-5 h-5 text-blue' />
              </div>
              <div className='min-w-0'>
                <div className='text-xs uppercase tracking-wide text-text-muted'>Current plan</div>
                <div className='font-medium text-navy capitalize'>{organization?.plan || '—'}</div>
              </div>
            </div>
            <span
              className={[
                'text-[10px] uppercase tracking-wide font-medium px-2 py-0.5 rounded-full',
                organization?.subscription_status === 'active'
                  ? 'bg-green-50 text-success'
                  : organization?.subscription_status === 'trialing'
                    ? 'bg-blue-50 text-blue'
                    : 'bg-gray-100 text-text-secondary',
              ].join(' ')}
            >
              {organization?.subscription_status || 'unknown'}
            </span>
          </div>
        </section>

        <section className='bg-white rounded-xl border border-gray-100 shadow-sm p-6 text-center'>
          <h2 className='font-medium text-navy text-lg'>Billing portal</h2>
          <p className='mt-2 text-sm text-text-secondary max-w-md mx-auto'>
            Self-serve plan changes, invoices, and payment methods will be available here. Contact
            support to change plans for now.
          </p>
        </section>

        <section className='bg-white rounded-xl border border-gray-100 shadow-sm p-5'>
          <h3 className='font-medium text-navy'>Roadmap</h3>
          <ul className='mt-3 space-y-2 text-sm text-text-secondary'>
            <li className='flex items-start gap-2'>
              <span className='w-1.5 h-1.5 rounded-full bg-blue mt-2 flex-shrink-0' />
              <span>Upgrade, downgrade, or cancel your subscription</span>
            </li>
            <li className='flex items-start gap-2'>
              <span className='w-1.5 h-1.5 rounded-full bg-blue mt-2 flex-shrink-0' />
              <span>Download invoices and update payment methods</span>
            </li>
            <li className='flex items-start gap-2'>
              <span className='w-1.5 h-1.5 rounded-full bg-blue mt-2 flex-shrink-0' />
              <span>Apply promo codes and view billing history</span>
            </li>
          </ul>
        </section>
      </div>
    </div>
  )
}
