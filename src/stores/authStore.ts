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
      const exists = await supabase.from('users').select('id').eq('email', email).maybeSingle()
      if (!exists.data) {
        set({ isLoading: false, error: "This account does not exist. Please check your credentials or contact support", errorCode: 'ACCOUNT_NOT_FOUND' })
        throw new Error('ACCOUNT_NOT_FOUND')
      }
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({ email, password })
      if (signInError) {
        set({ isLoading: false, error: "The password you entered is incorrect. Please try again or click 'Forgot Password'", errorCode: 'INCORRECT_PASSWORD' })
        throw new Error('INCORRECT_PASSWORD')
      }
      const userId = signInData.user?.id || exists.data.id
      const profile = await supabase.from('users').select('*').eq('id', userId).maybeSingle()
      const u = profile.data as unknown as User | null
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
      const profile = await supabase.from('users').select('*').eq('id', authUser.id).maybeSingle()
      const u = profile.data as unknown as User | null
      set({ user: u, isLoading: false })
    } catch {
      set({ user: null, isLoading: false })
    }
  },
}))
