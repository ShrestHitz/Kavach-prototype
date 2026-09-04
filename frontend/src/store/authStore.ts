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

const DEFAULT_USER: AuthUser = {
  userId: 1,
  username: 'ministry',
  fullName: 'Ministry Admin',
  email: 'ministry@sentinel.gov.in',
  role: 'MINISTRY',
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: 'sentinel-demo-token',
      user: DEFAULT_USER,
      setAuth: (token, user) => set({ token, user }),
      clearAuth: () => set({ token: 'sentinel-demo-token', user: DEFAULT_USER }),
      isAuthenticated: () => true,
    }),
    { name: 'sentinel_auth' }
  )
)
