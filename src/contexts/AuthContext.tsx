import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import type { Member, Organization, Choir } from '../types/database'

interface AuthContextValue {
  user: User | null
  session: Session | null
  member: Member | null
  organization: Organization | null
  choir: Choir | null
  loading: boolean
  signOut: () => Promise<void>
  refresh: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [member, setMember] = useState<Member | null>(null)
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [choir, setChoir] = useState<Choir | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const { data: memberData, error } = await supabase
        .from('members')
        .select('*, organizations:organization_id(*), choirs:choir_id(*)')
        .eq('user_id', userId)
        .single()

      if (error || !memberData) {
        setLoading(false)
        return
      }

      const { organizations, choirs, ...member } = memberData
      setMember(member as Member)
      if (organizations) setOrganization(organizations as any)
      if (choirs) setChoir(choirs as any)
    } catch (err) {
      console.error('fetchProfile error:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const refresh = useCallback(async () => {
    if (user) {
      await fetchProfile(user.id)
    }
  }, [user, fetchProfile])

  useEffect(() => {
    let mounted = true

    supabase.auth.getSession().then(async ({ data }) => {
      if (!mounted) return
      setSession(data.session)
      setUser(data.session?.user ?? null)
      if (data.session?.user) {
        await fetchProfile(data.session.user.id)
      } else {
        setLoading(false)
      }
    })

    const { data: sub } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        if (!mounted) return
        setSession(newSession)
        setUser(newSession?.user ?? null)
        if (newSession?.user) {
          await fetchProfile(newSession.user.id)
        } else {
          setMember(null)
          setOrganization(null)
          setChoir(null)
          setLoading(false)
        }
      },
    )

    return () => {
      mounted = false
      sub.subscription.unsubscribe()
    }
  }, [fetchProfile])

  const signOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        member,
        organization,
        choir,
        loading,
        signOut,
        refresh,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
