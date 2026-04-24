import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getSession } from '../services/auth.service'
import { getMemberByUserId } from '../services/member.service'

export default function Dashboard() {
  const navigate = useNavigate()
  const [, setChecking] = useState(true)

  useEffect(() => {
    async function redirect() {
      const session = await getSession()
      if (!session) { navigate('/login'); return }

      const member = await getMemberByUserId(session.user.id)

      if (!member) { navigate('/register/success'); return }
      if (member.role === 'admin') { navigate('/admin'); return }
      if (member.choir_id) { navigate('/app/choir/' + member.choir_id); return }
      navigate('/register/success')
    }
    redirect().finally(() => setChecking(false))
  }, [navigate])

  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin' />
    </div>
  )
}
