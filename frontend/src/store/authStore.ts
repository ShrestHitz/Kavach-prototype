// Auth store — simple token + user state
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface AuthUser {
  userId: number
  username: string
  fullName: string
  email: string
  role: string
  stateId?: number
  stateName?: string
}

interface AuthState {
  token: string | null
  user: AuthUser | null
  setAuth: (token: string, user: AuthUser) => void
  clearAuth: () => void
  isAuthenticated: () => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      setAuth: (token, user) => set({ token, user }),
      clearAuth: () => set({ token: null, user: null }),
      isAuthenticated: () => !!get().token,
    }),
    { name: 'sentinel_auth' }
  )
)
