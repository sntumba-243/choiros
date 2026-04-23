import { Link } from 'react-router-dom'

export function Logo({ className = '' }: { className?: string }) {
  return (
    <Link to="/" className={`font-bold text-xl text-slate-800 ${className}`}>
      Choir<span className="text-primary-600">OS</span>
    </Link>
  )
}
