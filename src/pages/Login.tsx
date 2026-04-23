import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { Logo } from '../components/Logo'

const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})
type LoginForm = z.infer<typeof loginSchema>

const resetSchema = z.object({
  email: z.string().email('Enter a valid email address'),
})
type ResetForm = z.infer<typeof resetSchema>

export default function Login() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [mode, setMode] = useState<'login' | 'reset'>('login')
  const [resetSent, setResetSent] = useState(false)

  const loginForm = useForm<LoginForm>({ resolver: zodResolver(loginSchema) })
  const resetForm = useForm<ResetForm>({ resolver: zodResolver(resetSchema) })

  const onLogin = async (values: LoginForm) => {
    setError(null)
    setSubmitting(true)
    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    })
    setSubmitting(false)
    if (error) {
      setError(error.message)
      return
    }
    navigate('/dashboard')
  }

  const onReset = async (values: ResetForm) => {
    setError(null)
    setSubmitting(true)
    const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
      redirectTo: `${window.location.origin}/login`,
    })
    setSubmitting(false)
    if (error) {
      setError(error.message)
      return
    }
    setResetSent(true)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
          <Logo />
        </div>
      </header>
      <div className="flex-1 flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {mode === 'login' ? (
            <>
              <h1 className="text-2xl font-bold text-slate-800">Welcome back</h1>
              <p className="mt-2 text-gray-500 text-sm">Sign in to your ChoirOS account.</p>
              <form className="mt-6 space-y-4" onSubmit={loginForm.handleSubmit(onLogin)} noValidate>
                <div>
                  <label className="text-sm font-medium text-slate-800">Email</label>
                  <input
                    type="email"
                    autoComplete="email"
                    className="mt-1 w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-600 focus:ring-1 focus:ring-primary-600"
                    {...loginForm.register('email')}
                  />
                  {loginForm.formState.errors.email && (
                    <p className="mt-1 text-xs text-red-600">{loginForm.formState.errors.email.message}</p>
                  )}
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-slate-800">Password</label>
                    <button
                      type="button"
                      onClick={() => { setMode('reset'); setError(null) }}
                      className="text-xs font-medium text-primary-600 hover:text-primary-700"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="mt-1 relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      className="w-full px-3 py-2.5 pr-10 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-600 focus:ring-1 focus:ring-primary-600"
                      {...loginForm.register('password')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {loginForm.formState.errors.password && (
                    <p className="mt-1 text-xs text-red-600">{loginForm.formState.errors.password.message}</p>
                  )}
                </div>
                {error && (
                  <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                    {error}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800 text-white rounded-lg font-medium text-sm hover:bg-slate-900 disabled:opacity-60"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  Sign In
                </button>
              </form>
              <p className="mt-6 text-center text-sm text-gray-500">
                No account?{' '}
                <Link to="/register" className="font-medium text-primary-600 hover:text-primary-700">
                  Start free trial
                </Link>
              </p>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => { setMode('login'); setResetSent(false); setError(null) }}
                className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-slate-800"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to login
              </button>
              <h1 className="mt-4 text-2xl font-bold text-slate-800">Reset password</h1>
              <p className="mt-2 text-gray-500 text-sm">
                Enter your email and we&rsquo;ll send you a reset link.
              </p>
              {resetSent ? (
                <div className="mt-6 text-sm text-green-700 bg-green-50 border border-green-100 rounded-lg px-3 py-3">
                  Check your inbox for a password reset link.
                </div>
              ) : (
                <form className="mt-6 space-y-4" onSubmit={resetForm.handleSubmit(onReset)} noValidate>
                  <div>
                    <label className="text-sm font-medium text-slate-800">Email</label>
                    <input
                      type="email"
                      className="mt-1 w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-600 focus:ring-1 focus:ring-primary-600"
                      {...resetForm.register('email')}
                    />
                    {resetForm.formState.errors.email && (
                      <p className="mt-1 text-xs text-red-600">{resetForm.formState.errors.email.message}</p>
                    )}
                  </div>
                  {error && (
                    <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                      {error}
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800 text-white rounded-lg font-medium text-sm hover:bg-slate-900 disabled:opacity-60"
                  >
                    {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                    Send reset link
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
