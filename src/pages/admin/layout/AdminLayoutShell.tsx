import { Outlet } from 'react-router-dom'

export default function AdminLayoutShell() {
  return (
    <div className='min-h-screen bg-surface-2'>
      <Outlet />
    </div>
  )
}
