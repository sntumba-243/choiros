import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Users,
  Music,
  Sparkles,
  QrCode,
  Calendar,
  Network,
  Check,
  Menu,
  X,
  ArrowRight,
  Star,
} from 'lucide-react'

function TwitterIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function LinkedinIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.049c.476-.9 1.637-1.852 3.37-1.852 3.601 0 4.267 2.37 4.267 5.455v6.288zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}
import { Logo } from '../components/Logo'
import { PLANS } from '../lib/stripe'

function Navbar() {
  const [open, setOpen] = useState(false)
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Logo />
        <nav className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-gray-600 hover:text-slate-800 text-sm font-medium">Features</a>
          <a href="#pricing" className="text-gray-600 hover:text-slate-800 text-sm font-medium">Pricing</a>
          <a href="#" className="text-gray-600 hover:text-slate-800 text-sm font-medium">Blog</a>
        </nav>
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/login"
            className="px-4 py-2 text-sm font-medium text-slate-800 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
          >
            Log in
          </Link>
          <Link
            to="/register"
            className="px-4 py-2 text-sm font-medium bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition"
          >
            Start Free Trial
          </Link>
        </div>
        <button
          type="button"
          className="md:hidden p-2 text-slate-800"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-3">
          <a href="#features" className="block text-gray-700" onClick={() => setOpen(false)}>Features</a>
          <a href="#pricing" className="block text-gray-700" onClick={() => setOpen(false)}>Pricing</a>
          <a href="#" className="block text-gray-700">Blog</a>
          <div className="pt-3 border-t border-gray-100 space-y-2">
            <Link to="/login" className="block text-center px-4 py-2 text-sm font-medium text-slate-800 border border-gray-200 rounded-lg">Log in</Link>
            <Link to="/register" className="block text-center px-4 py-2 text-sm font-medium bg-slate-800 text-white rounded-lg">Start Free Trial</Link>
          </div>
        </div>
      )}
    </header>
  )
}

function Hero() {
  return (
    <section className="py-24 bg-white text-center">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 text-primary-700 text-sm font-medium">
          <Sparkles className="w-4 h-4" />
          AI-Powered Choir Management
        </span>
        <h1 className="mt-6 text-5xl lg:text-6xl font-bold text-slate-800 tracking-tight leading-tight">
          The Operating System
          <br />
          for Your Choir
        </h1>
        <p className="mt-6 text-xl text-gray-500 max-w-2xl mx-auto">
          Everything your choir needs in one beautiful platform. Members, music, events, attendance, and AI-powered vocal coaching — all in harmony.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/register"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-800 text-white rounded-lg font-medium hover:bg-slate-900 transition"
          >
            Start Free Trial
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="#features"
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-200 text-slate-800 rounded-lg font-medium hover:bg-gray-50 transition"
          >
            Watch Demo
          </a>
        </div>
        <div className="mt-16 flex flex-wrap justify-center gap-8 sm:gap-16 text-center">
          <div>
            <div className="text-3xl font-bold text-slate-800">100K+</div>
            <div className="text-sm text-gray-500 mt-1">Members</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-slate-800">2,000+</div>
            <div className="text-sm text-gray-500 mt-1">Choirs</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-slate-800">50+</div>
            <div className="text-sm text-gray-500 mt-1">Countries</div>
          </div>
        </div>
      </div>
    </section>
  )
}

const FEATURES = [
  { icon: Users, title: 'Members', desc: 'Smart member management with voice parts and section leaders.' },
  { icon: Music, title: 'Sheet Music', desc: 'Upload or import sheet music. Members access it anywhere.' },
  { icon: Sparkles, title: 'AI Coach', desc: 'AI-powered vocal coaching and practice exercises for every member.' },
  { icon: QrCode, title: 'Attendance', desc: 'QR code check-in and detailed attendance tracking and reports.' },
  { icon: Calendar, title: 'Events', desc: 'Event scheduling with RSVP, reminders and calendar sync.' },
  { icon: Network, title: 'Multi-Choir', desc: 'Manage multiple choirs from one account.' },
]

function Features() {
  return (
    <section id="features" className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-800">
            Everything you need to run a world-class choir
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            One platform. Every tool. Built for directors, loved by members.
          </p>
        </div>
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f) => (
            <div key={f.title} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition">
              <div className="w-11 h-11 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center">
                <f.icon className="w-5 h-5" />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-slate-800">{f.title}</h3>
              <p className="mt-2 text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function HowItWorks() {
  const steps = [
    { n: 1, title: 'Create your choir', desc: 'Sign up, name your choir, and set the basics in under 2 minutes.' },
    { n: 2, title: 'Invite your members', desc: 'Import from CSV or send email invites with assigned voice parts.' },
    { n: 3, title: 'Rehearse smarter', desc: 'Schedule events, share sheet music, track attendance, and grow together.' },
  ]
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-800">
            Up and running in minutes
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            No complicated setup. No training required.
          </p>
        </div>
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 items-start">
          {steps.map((s, i) => (
            <div key={s.n} className="relative flex flex-col items-center text-center px-4">
              <div className="w-16 h-16 rounded-full bg-primary-600 text-white flex items-center justify-center text-2xl font-bold">
                {s.n}
              </div>
              <h3 className="mt-5 text-xl font-semibold text-slate-800">{s.title}</h3>
              <p className="mt-2 text-gray-500">{s.desc}</p>
              {i < steps.length - 1 && (
                <ArrowRight className="hidden md:block absolute top-6 -right-4 w-6 h-6 text-gray-300" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Pricing() {
  const order: Array<keyof typeof PLANS> = ['free', 'starter', 'growth', 'network']
  return (
    <section id="pricing" className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-800">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            Start free. Upgrade when you outgrow it. Cancel any time.
          </p>
        </div>
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {order.map((key) => {
            const p = PLANS[key]
            const popular = key === 'growth'
            return (
              <div
                key={p.id}
                className={`bg-white rounded-xl p-6 border ${popular ? 'border-primary-600 ring-2 ring-primary-600/20 relative' : 'border-gray-200'}`}
              >
                {popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                )}
                <h3 className="text-lg font-semibold text-slate-800">{p.name}</h3>
                <div className="mt-3 flex items-baseline">
                  <span className="text-4xl font-bold text-slate-800">${p.price}</span>
                  <span className="ml-1 text-gray-500 text-sm">/month</span>
                </div>
                <ul className="mt-5 space-y-3">
                  {p.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2 text-sm text-gray-600">
                      <Check className="w-4 h-4 text-primary-600 mt-0.5 flex-shrink-0" />
                      {feat}
                    </li>
                  ))}
                </ul>
                <Link
                  to={`/register?plan=${p.id}`}
                  className={`mt-6 block text-center px-4 py-2.5 rounded-lg font-medium text-sm transition ${
                    popular
                      ? 'bg-primary-600 text-white hover:bg-primary-700'
                      : 'bg-slate-800 text-white hover:bg-slate-900'
                  }`}
                >
                  {p.id === 'free' ? 'Get Started Free' : 'Start Free Trial'}
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function Testimonials() {
  const items = [
    {
      quote: 'ChoirOS replaced three separate tools and saved us hours every week. The members love the app.',
      name: 'Sarah Mbeki',
      role: 'Music Director, Grace Cathedral',
    },
    {
      quote: 'The AI vocal coach has helped our new members grow faster than any method we’ve tried.',
      name: 'David Oluwale',
      role: 'Conductor, Harmony Ensemble',
    },
    {
      quote: 'Clean, fast, and built exactly for how a modern church choir actually works. Finally.',
      name: 'Priscilla Nguyen',
      role: 'Worship Lead, Living Water Church',
    },
  ]
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-800">
            Loved by choirs worldwide
          </h2>
        </div>
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((t) => (
            <div key={t.name} className="bg-gray-50 rounded-xl p-6 border border-gray-100">
              <div className="flex gap-1 text-amber-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="mt-4 text-gray-700 leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
              <div className="mt-5 pt-4 border-t border-gray-200">
                <div className="text-sm font-semibold text-slate-800">{t.name}</div>
                <div className="text-xs text-gray-500">{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FinalCTA() {
  return (
    <section className="bg-slate-800 text-white py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold">
          Ready to transform your choir?
        </h2>
        <p className="mt-4 text-lg text-gray-300">
          Join thousands of choir directors already using ChoirOS. Free 30-day trial, no credit card required.
        </p>
        <Link
          to="/register"
          className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-800 rounded-lg font-medium hover:bg-gray-100 transition"
        >
          Start Free Trial
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2">
            <Logo />
            <p className="mt-3 text-sm text-gray-500 max-w-xs">
              The operating system for your choir. Built with care by iSpeed Tech.
            </p>
            <div className="mt-4 flex gap-3">
              <a href="#" className="text-gray-400 hover:text-slate-800" aria-label="Twitter"><TwitterIcon className="w-5 h-5" /></a>
              <a href="#" className="text-gray-400 hover:text-slate-800" aria-label="LinkedIn"><LinkedinIcon className="w-5 h-5" /></a>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-800">Product</h4>
            <ul className="mt-4 space-y-2 text-sm text-gray-500">
              <li><a href="#features" className="hover:text-slate-800">Features</a></li>
              <li><a href="#pricing" className="hover:text-slate-800">Pricing</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-800">Company</h4>
            <ul className="mt-4 space-y-2 text-sm text-gray-500">
              <li><a href="#" className="hover:text-slate-800">About</a></li>
              <li><a href="#" className="hover:text-slate-800">Blog</a></li>
            </ul>
          </div>
          <div className="col-span-2 md:col-span-1">
            <h4 className="text-sm font-semibold text-slate-800">Legal</h4>
            <ul className="mt-4 space-y-2 text-sm text-gray-500">
              <li><Link to="/privacy" className="hover:text-slate-800">Privacy</Link></li>
              <li><Link to="/terms" className="hover:text-slate-800">Terms</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-gray-100 text-sm text-gray-400 text-center">
          &copy; 2026 ChoirOS by iSpeed Tech. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Pricing />
      <Testimonials />
      <FinalCTA />
      <Footer />
    </div>
  )
}
