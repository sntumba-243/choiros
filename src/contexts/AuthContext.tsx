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

  const loadProfile = useCallback(async (userId: string) => {
    const { data: memberData } = await supabase
      .from('members')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()

    if (!memberData) {
      setMember(null)
      setOrganization(null)
      setChoir(null)
      return
    }

    setMember(memberData as Member)

    const [{ data: orgData }, { data: choirData }] = await Promise.all([
      supabase
        .from('organizations')
        .select('*')
        .eq('id', memberData.organization_id)
        .maybeSingle(),
      supabase
        .from('choirs')
        .select('*')
        .eq('id', memberData.choir_id)
        .maybeSingle(),
    ])

    setOrganization((orgData as Organization) ?? null)
    setChoir((choirData as Choir) ?? null)
  }, [])

  const refresh = useCallback(async () => {
    if (user) {
      await loadProfile(user.id)
    }
  }, [user, loadProfile])

  useEffect(() => {
    let mounted = true

    supabase.auth.getSession().then(async ({ data }) => {
      if (!mounted) return
      setSession(data.session)
      setUser(data.session?.user ?? null)
      if (data.session?.user) {
        await loadProfile(data.session.user.id)
      }
      setLoading(false)
    })

    const { data: sub } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        if (!mounted) return
        setSession(newSession)
        setUser(newSession?.user ?? null)
        if (newSession?.user) {
          await loadProfile(newSession.user.id)
        } else {
          setMember(null)
          setOrganization(null)
          setChoir(null)
        }
      },
    )

    return () => {
      mounted = false
      sub.subscription.unsubscribe()
    }
  }, [loadProfile])

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
