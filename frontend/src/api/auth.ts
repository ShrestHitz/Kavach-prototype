import api from './client'

export interface LoginRequest { usernameOrEmail: string; password: string }
export interface LoginResponse {
  token?: string; userId: number; username: string
  fullName: string; email: string; role: string
  stateId?: number; stateName?: string
}

export const authApi = {
  login: async (req: LoginRequest): Promise<LoginResponse> => {
    const r = await api.post('/auth/login', req)
    return r.data
  },
  me: async () => {
    const r = await api.get('/auth/me')
    return r.data
  },
  logout: async () => {
    try { await api.post('/auth/logout') } catch {}
  },
}
