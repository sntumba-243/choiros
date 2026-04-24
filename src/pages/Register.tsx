import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Check, Loader2, ArrowRight, ArrowLeft } from 'lucide-react'
import { Logo } from '../components/Logo'
import { PLANS, type PlanId } from '../lib/stripe'
import { api } from '../lib/api'
import { registerSchema, type RegisterForm } from '../schemas/auth.schemas'

const TIMEZONES = [
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Africa/Lagos',
  'Africa/Johannesburg',
  'Asia/Singapore',
  'Asia/Tokyo',
  'Australia/Sydney',
]

const CHOIR_SIZES = ['1-10', '11-25', '26-50', '51-100', '100+']

type AccountForm = RegisterForm

function passwordStrength(pw: string): { label: string; score: number; color: string } {
  let score = 0
  if (pw.length >= 8) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  const labels = ['Too short', 'Weak', 'Fair', 'Good', 'Strong']
  const colors = ['bg-gray-200', 'bg-red-400', 'bg-amber-400', 'bg-primary-500', 'bg-green-500']
  return { label: labels[score], score, color: colors[score] }
}

function Stepper({ step }: { step: 1 | 2 | 3 }) {
  const steps = ['Choose plan', 'Create account', 'Payment']
  return (
    <div className="flex items-center justify-center gap-2 sm:gap-4 mb-10">
      {steps.map((label, i) => {
        const n = i + 1
        const active = step === n
        const done = step > n
        return (
          <div key={label} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${done ? 'bg-primary-600 text-white' : active ? 'bg-slate-800 text-white' : 'bg-gray-200 text-gray-500'}`}>
              {done ? <Check className="w-4 h-4" /> : n}
            </div>
            <span className={`hidden sm:inline text-sm ${active ? 'text-slate-800 font-medium' : 'text-gray-500'}`}>{label}</span>
            {n < steps.length && <div className={`w-8 h-0.5 ${done ? 'bg-primary-600' : 'bg-gray-200'}`} />}
          </div>
        )
      })}
    </div>
  )
}

function PlanCards({ selected, onSelect }: { selected: PlanId | null; onSelect: (id: PlanId) => void }) {
  const order: PlanId[] = ['free', 'starter', 'growth', 'network']
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {order.map((key) => {
        const p = PLANS[key]
        const active = selected === key
        const popular = key === 'growth'
        return (
          <button
            key={p.id}
            type="button"
            onClick={() => onSelect(p.id)}
            className={`relative text-left bg-white rounded-xl p-5 border-2 transition ${active ? 'border-primary-600 ring-2 ring-primary-600/10' : 'border-gray-200 hover:border-gray-300'}`}
          >
            {popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-600 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide">
                Popular
              </span>
            )}
            <div className="text-sm font-semibold text-slate-800">{p.name}</div>
            <div className="mt-2 flex items-baseline">
              <span className="text-3xl font-bold text-slate-800">${p.price}</span>
              <span className="ml-1 text-xs text-gray-500">/mo</span>
            </div>
            <ul className="mt-4 space-y-2">
              {p.features.map((f) => (
                <li key={f} className="flex gap-2 text-xs text-gray-600">
                  <Check className="w-3.5 h-3.5 text-primary-600 flex-shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>
            <div className={`mt-5 text-center text-sm font-medium py-2 rounded-lg ${active ? 'bg-slate-800 text-white' : 'bg-gray-100 text-slate-800'}`}>
              {p.id === 'free' ? 'Get Started Free' : 'Start Free Trial'}
            </div>
          </button>
        )
      })}
    </div>
  )
}

export default function Register() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const initialPlan = params.get('plan') as PlanId | null
  const [step, setStep] = useState<1 | 2 | 3>(initialPlan ? 2 : 1)
  const [plan, setPlan] = useState<PlanId | null>(initialPlan && PLANS[initialPlan] ? initialPlan : null)
  const [account, setAccount] = useState<AccountForm | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)

  const form = useForm<AccountForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      choirName: '',
      adminName: '',
      email: '',
      password: '',
      choirSize: '',
      timezone: 'America/New_York',
    },
  })

  const password = form.watch('password')
  const strength = useMemo(() => passwordStrength(password || ''), [password])

  const selectedPlan = plan ? PLANS[plan] : null

  const handleChoosePlan = (id: PlanId) => {
    setPlan(id)
    setStep(2)
  }

  const onAccountSubmit = (values: AccountForm) => {
    setAccount(values)
    setStep(3)
  }

  useEffect(() => {
    if (step !== 3 || !plan || !account) return
    let cancelled = false

    const run = async () => {
      setProcessing(true)
      setError(null)
      try {
        if (plan === 'free') {
          const { error: apiError } = await api.freeSignup({
            email: account.email,
            password: account.password,
            choirName: account.choirName,
            adminName: account.adminName,
            choirSize: account.choirSize,
            timezone: account.timezone,
          })
          if (apiError) throw new Error(apiError)
          if (!cancelled) navigate('/register/success')
        } else {
          const { data, error: apiError } = await api.createCheckout({
            plan,
            email: account.email,
            choirName: account.choirName,
            adminName: account.adminName,
            choirSize: account.choirSize,
            timezone: account.timezone,
          })
          if (apiError) throw new Error(apiError)
          if (!cancelled && data?.url) {
            window.location.href = data.url
          }
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Something went wrong')
          setProcessing(false)
        }
      }
    }

    run()
    return () => { cancelled = true }
  }, [step, plan, account, navigate])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Logo />
          <Link to="/login" className="text-sm text-gray-500 hover:text-slate-800">
            Already have an account? <span className="font-medium text-primary-600">Log in</span>
          </Link>
        </div>
      </header>

      <div className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Stepper step={step} />

        {step === 1 && (
          <div>
            <div className="text-center max-w-2xl mx-auto">
              <h1 className="text-3xl font-bold text-slate-800">Choose your plan</h1>
              <p className="mt-2 text-gray-500">Start free for 30 days. No credit card required for the Free plan.</p>
            </div>
            <div className="mt-10">
              <PlanCards selected={plan} onSelect={handleChoosePlan} />
            </div>
          </div>
        )}

        {step === 2 && selectedPlan && (
          <div className="max-w-xl mx-auto bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-slate-800"
            >
              <ArrowLeft className="w-4 h-4" />
              Change plan
            </button>
            <div className="mt-4 flex items-center justify-between">
              <h1 className="text-2xl font-bold text-slate-800">Create your choir</h1>
              <span className="text-xs font-medium px-2 py-1 rounded bg-primary-50 text-primary-700">
                {selectedPlan.name} plan
              </span>
            </div>
            <form onSubmit={form.handleSubmit(onAccountSubmit)} noValidate className="mt-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-800">Choir name</label>
                <input
                  className="mt-1 w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-600 focus:ring-1 focus:ring-primary-600"
                  {...form.register('choirName')}
                />
                {form.formState.errors.choirName && <p className="mt-1 text-xs text-red-600">{form.formState.errors.choirName.message}</p>}
              </div>
              <div>
                <label className="text-sm font-medium text-slate-800">Your full name</label>
                <input
                  className="mt-1 w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-600 focus:ring-1 focus:ring-primary-600"
                  {...form.register('adminName')}
                />
                {form.formState.errors.adminName && <p className="mt-1 text-xs text-red-600">{form.formState.errors.adminName.message}</p>}
              </div>
              <div>
                <label className="text-sm font-medium text-slate-800">Email</label>
                <input
                  type="email"
                  className="mt-1 w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-600 focus:ring-1 focus:ring-primary-600"
                  {...form.register('email')}
                />
                {form.formState.errors.email && <p className="mt-1 text-xs text-red-600">{form.formState.errors.email.message}</p>}
              </div>
              <div>
                <label className="text-sm font-medium text-slate-800">Password</label>
                <input
                  type="password"
                  className="mt-1 w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-600 focus:ring-1 focus:ring-primary-600"
                  {...form.register('password')}
                />
                {password && (
                  <div className="mt-2">
                    <div className="flex gap-1">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded ${i < strength.score ? strength.color : 'bg-gray-200'}`}
                        />
                      ))}
                    </div>
                    <div className="mt-1 text-xs text-gray-500">{strength.label}</div>
                  </div>
                )}
                {form.formState.errors.password && <p className="mt-1 text-xs text-red-600">{form.formState.errors.password.message}</p>}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-slate-800">Choir size</label>
                  <select
                    className="mt-1 w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-primary-600 focus:ring-1 focus:ring-primary-600"
                    {...form.register('choirSize')}
                  >
                    <option value="">Select</option>
                    {CHOIR_SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {form.formState.errors.choirSize && <p className="mt-1 text-xs text-red-600">{form.formState.errors.choirSize.message}</p>}
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-800">Timezone</label>
                  <select
                    className="mt-1 w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-primary-600 focus:ring-1 focus:ring-primary-600"
                    {...form.register('timezone')}
                  >
                    {TIMEZONES.map((tz) => <option key={tz} value={tz}>{tz}</option>)}
                  </select>
                </div>
              </div>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800 text-white rounded-lg font-medium text-sm hover:bg-slate-900"
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {step === 3 && selectedPlan && (
          <div className="max-w-md mx-auto bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
            <h1 className="text-2xl font-bold text-slate-800">
              {selectedPlan.id === 'free' ? 'Creating your account' : 'Preparing checkout'}
            </h1>
            <p className="mt-2 text-gray-500 text-sm">
              {selectedPlan.id === 'free'
                ? 'Setting up your free choir workspace...'
                : `Redirecting to secure checkout for the ${selectedPlan.name} plan ($${selectedPlan.price}/mo)...`}
            </p>
            {processing && (
              <div className="mt-8 flex justify-center">
                <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
              </div>
            )}
            {error && (
              <div className="mt-6 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-3">
                {error}
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="mt-2 block w-full text-slate-800 font-medium underline"
                >
                  Try again
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
