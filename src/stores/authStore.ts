import { create } from 'zustand'
import { api } from '@/lib/api'
import { supabase } from '@/lib/supabase'
import { User } from '@/types/database'

interface AuthState {
  user: User | null
  isLoading: boolean
  error: string | null
  errorCode?: string | null
  
  login: (email: string, password: string, cfToken?: string) => Promise<void>
  register: (email: string, password: string, fullName: string) => Promise<void>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  error: null,
  errorCode: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null, errorCode: null })
    try {
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({ email, password })
      if (signInError) {
        set({ isLoading: false, error: "The password you entered is incorrect. Please try again or click 'Forgot Password'", errorCode: 'INCORRECT_PASSWORD' })
        throw new Error('INCORRECT_PASSWORD')
      }
      const authUser = signInData.user
      if (!authUser) { set({ isLoading: false, error: 'Login failed', errorCode: 'GENERIC_AUTH_FAILURE' }); return }
      let { data: profileData } = await supabase.from('users').select('*').eq('id', authUser.id).maybeSingle()
      if (!profileData) {
        const defaultRole = email.toLowerCase() === 'admin@wahl.sa' ? 'admin' : 'shipper'
        const defaultName = authUser.user_metadata?.full_name || email.split('@')[0]
        try {
          const created = await api.profiles.provision(email, defaultName, defaultRole)
          if (created && typeof created === 'object') {
            profileData = created as unknown as User
          }
        } catch {
          /* noop */
        }
        if (!profileData) {
          const fallback = { id: authUser.id, email, full_name: defaultName, role: defaultRole } as unknown as User
          set({ user: fallback, isLoading: false, error: null, errorCode: null })
          return
        }
      }
      const u = profileData as unknown as User | null
      set({ user: u, isLoading: false, error: null, errorCode: null })
    } catch (error) {
      if ((error as Error).message === 'ACCOUNT_NOT_FOUND' || (error as Error).message === 'INCORRECT_PASSWORD') return
      set({ error: (error as Error).message, errorCode: (error as (Error & { code?: string }))?.code || null, isLoading: false })
      throw error
    }
  },

  register: async (email: string, password: string, fullName: string) => {
    set({ isLoading: true, error: null })
    try {
      const resp = await api.auth.register(email, password, fullName)
      if (resp?.user) {
        set({ user: resp.user, isLoading: false })
      } else {
        set({ isLoading: false })
      }
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false })
      throw error
    }
  },

  logout: async () => {
    set({ isLoading: true })
    api.auth.logout()
    set({ user: null, isLoading: false, error: null, errorCode: null })
  },

  checkAuth: async () => {
    set({ isLoading: true })
    try {
      const { data } = await supabase.auth.getUser()
      const authUser = data.user
      if (!authUser) { set({ user: null, isLoading: false }); return }
      let { data: profileData } = await supabase.from('users').select('*').eq('id', authUser.id).maybeSingle()
      if (!profileData) {
        const email = authUser.email || ''
        const defaultRole = email.toLowerCase() === 'admin@wahl.sa' ? 'admin' : 'shipper'
        const defaultName = authUser.user_metadata?.full_name || email.split('@')[0]
        try {
          const created = await api.profiles.provision(email, defaultName, defaultRole)
          if (created && typeof created === 'object') {
            profileData = created as unknown as User
          }
        } catch {
          /* noop */
        }
        if (!profileData) {
          const fallback = { id: authUser.id, email, full_name: defaultName, role: defaultRole } as unknown as User
          set({ user: fallback, isLoading: false })
          return
        }
      }
      const u = profileData as unknown as User | null
      set({ user: u, isLoading: false })
    } catch {
      set({ user: null, isLoading: false })
    }
  },
}))
