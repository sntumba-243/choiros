import { ClipboardCheck } from 'lucide-react'

export default function AdminAttendance() {
  return (
    <div className='min-w-0'>
      <header className='sticky top-0 z-20 bg-white border-b border-border h-14 px-5 flex items-center'>
        <h1 className='font-medium text-navy'>Attendance</h1>
      </header>
      <div className='px-4 sm:px-5 py-5 max-w-3xl mx-auto w-full'>
        <section className='bg-white rounded-xl border border-gray-100 shadow-sm p-6 text-center'>
          <div className='w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mx-auto'>
            <ClipboardCheck className='w-7 h-7 text-success' />
          </div>
          <h2 className='mt-4 font-medium text-navy text-lg'>Attendance tracking</h2>
          <p className='mt-2 text-sm text-text-secondary max-w-md mx-auto'>
            Scan QR codes, mark attendance in bulk, and track patterns over time. Coming next.
          </p>
        </section>
        <section className='mt-5 bg-white rounded-xl border border-gray-100 shadow-sm p-5'>
          <h3 className='font-medium text-navy'>Roadmap</h3>
          <ul className='mt-3 space-y-2 text-sm text-text-secondary'>
            <li className='flex items-start gap-2'>
              <span className='w-1.5 h-1.5 rounded-full bg-blue mt-2 flex-shrink-0' />
              <span>QR check-in at rehearsals and performances</span>
            </li>
            <li className='flex items-start gap-2'>
              <span className='w-1.5 h-1.5 rounded-full bg-blue mt-2 flex-shrink-0' />
              <span>Bulk mark attendance for the whole choir</span>
            </li>
            <li className='flex items-start gap-2'>
              <span className='w-1.5 h-1.5 rounded-full bg-blue mt-2 flex-shrink-0' />
              <span>Monthly attendance reports by section</span>
            </li>
          </ul>
        </section>
      </div>
    </div>
  )
}
