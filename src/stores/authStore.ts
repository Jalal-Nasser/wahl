import { create } from 'zustand'
import { api } from '@/lib/api'
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

  login: async (email: string, password: string, cfToken?: string) => {
    set({ isLoading: true, error: null, errorCode: null })
    try {
      const resp = await api.auth.login(email, password, cfToken)
      if (resp?.user) {
        set({ user: resp.user, isLoading: false, error: null, errorCode: null })
      } else {
        set({ isLoading: false })
      }
    } catch (error) {
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
      const me = await api.auth.me()
      const isValid = typeof me === 'object' && me !== null && 'id' in (me as Record<string, unknown>) && 'email' in (me as Record<string, unknown>)
      set({ user: isValid ? (me as User) : null, isLoading: false })
    } catch {
      set({ user: null, isLoading: false })
    }
  },
}))
