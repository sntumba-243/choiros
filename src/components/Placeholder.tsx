import { Link } from 'react-router-dom'
import { ArrowLeft, LogOut } from 'lucide-react'
import { Logo } from './Logo'
import { useAuth } from '../contexts/AuthContext'

export function Placeholder({ title }: { title: string }) {
  const { signOut } = useAuth()
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="text-sm text-gray-500 hover:text-slate-800 inline-flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" />
              Back to dashboard
            </Link>
            <button
              type="button"
              onClick={() => signOut()}
              className="text-sm text-gray-500 hover:text-slate-800 inline-flex items-center gap-1"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </div>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="text-center max-w-lg">
          <span className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold uppercase tracking-wide">
            Coming Soon
          </span>
          <h1 className="mt-6 text-4xl font-bold text-slate-800">{title}</h1>
          <p className="mt-3 text-gray-500">
            This section is under active development and will be available in your next session.
          </p>
        </div>
      </main>
    </div>
  )
}
