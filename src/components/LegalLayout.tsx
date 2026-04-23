import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'
import { Logo } from './Logo'

export function LegalLayout({ title, updated, children }: { title: string; updated: string; children: ReactNode }) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Logo />
          <Link to="/" className="text-sm text-gray-500 hover:text-slate-800">Back to site</Link>
        </div>
      </header>
      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-slate-800">{title}</h1>
        <p className="mt-2 text-sm text-gray-500">Last updated: {updated}</p>
        <div className="mt-8 prose prose-slate max-w-none text-gray-700 leading-relaxed space-y-6">
          {children}
        </div>
      </main>
      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-400">
          &copy; 2026 ChoirOS by iSpeed Tech.
        </div>
      </footer>
    </div>
  )
}
