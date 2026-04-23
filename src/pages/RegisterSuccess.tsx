import { Link } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'
import { Logo } from '../components/Logo'

export default function RegisterSuccess() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
          <Logo />
        </div>
      </header>
      <div className="flex-1 flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle2 className="w-9 h-9 text-green-600" />
          </div>
          <h1 className="mt-6 text-3xl font-bold text-slate-800">Welcome to ChoirOS!</h1>
          <p className="mt-3 text-gray-500">
            Your 30-day free trial has started. Check your email to set your password and get started.
          </p>
          <Link
            to="/login"
            className="mt-8 inline-block w-full px-4 py-2.5 bg-slate-800 text-white rounded-lg font-medium text-sm hover:bg-slate-900"
          >
            Go to Login
          </Link>
        </div>
      </div>
    </div>
  )
}
