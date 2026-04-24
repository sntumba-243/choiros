import { MessageSquare } from 'lucide-react'

export default function AdminMessages() {
  return (
    <div className='min-w-0'>
      <header className='sticky top-0 z-20 bg-white border-b border-border h-14 px-5 flex items-center'>
        <h1 className='font-medium text-navy'>Messages</h1>
      </header>
      <div className='px-4 sm:px-5 py-5 max-w-3xl mx-auto w-full'>
        <section className='bg-white rounded-xl border border-gray-100 shadow-sm p-6 text-center'>
          <div className='w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center mx-auto'>
            <MessageSquare className='w-7 h-7 text-blue' />
          </div>
          <h2 className='mt-4 font-medium text-navy text-lg'>Choir messaging</h2>
          <p className='mt-2 text-sm text-text-secondary max-w-md mx-auto'>
            Send announcements to the whole choir, specific sections, or individuals. Coming soon.
          </p>
        </section>
        <section className='mt-5 bg-white rounded-xl border border-gray-100 shadow-sm p-5'>
          <h3 className='font-medium text-navy'>Roadmap</h3>
          <ul className='mt-3 space-y-2 text-sm text-text-secondary'>
            <li className='flex items-start gap-2'>
              <span className='w-1.5 h-1.5 rounded-full bg-blue mt-2 flex-shrink-0' />
              <span>Email + SMS announcements to all members or by section</span>
            </li>
            <li className='flex items-start gap-2'>
              <span className='w-1.5 h-1.5 rounded-full bg-blue mt-2 flex-shrink-0' />
              <span>Event reminders and schedule change alerts</span>
            </li>
            <li className='flex items-start gap-2'>
              <span className='w-1.5 h-1.5 rounded-full bg-blue mt-2 flex-shrink-0' />
              <span>Direct messages between admin and members</span>
            </li>
          </ul>
        </section>
      </div>
    </div>
  )
}
