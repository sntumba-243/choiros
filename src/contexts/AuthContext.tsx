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
import { signOut as signOutService } from '../services/auth.service'
import { getOrganizationById } from '../services/organization.service'
import { getChoirById } from '../services/choir.service'
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
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error || !memberData) {
        console.error('fetchProfile: no member found for user', userId, error?.message)
        return
      }

      setMember(memberData as Member)

      const [orgData, choirData] = await Promise.all([
        getOrganizationById(memberData.organization_id),
        getChoirById(memberData.choir_id),
      ])

      if (orgData) setOrganization(orgData)
      if (choirData) setChoir(choirData)
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

    const safetyTimeout = setTimeout(() => {
      if (mounted) {
        console.warn('Auth loading timeout — forcing loading=false after 5s')
        setLoading(false)
      }
    }, 5000)

    supabase.auth
      .getSession()
      .then(async ({ data }) => {
        clearTimeout(safetyTimeout)
        if (!mounted) return
        setSession(data.session)
        setUser(data.session?.user ?? null)
        if (data.session?.user) {
          await fetchProfile(data.session.user.id)
        } else {
          setLoading(false)
        }
      })
      .catch((err) => {
        clearTimeout(safetyTimeout)
        console.error('getSession error:', err)
        if (mounted) setLoading(false)
      })

    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
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
    })

    return () => {
      mounted = false
      clearTimeout(safetyTimeout)
      sub.subscription.unsubscribe()
    }
  }, [fetchProfile])

  const signOut = async () => {
    await signOutService()
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
