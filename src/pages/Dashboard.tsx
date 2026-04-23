import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function Dashboard() {
  const { member, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (loading) return
    if (!member) {
      navigate('/register/success', { replace: true })
      return
    }
    if (member.role === 'admin') {
      navigate('/admin', { replace: true })
    } else {
      navigate(`/app/choir/${member.choir_id}`, { replace: true })
    }
  }, [member, loading, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
    </div>
  )
}
