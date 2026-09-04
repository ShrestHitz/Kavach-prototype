import axios from 'axios'
import { useAuthStore } from '../store/authStore'

const api = axios.create({
  baseURL: '/api',
  timeout: 15000,
})

// Attach JWT token from store on every request
api.interceptors.request.use(config => {
  const token = useAuthStore.getState().token
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// On 401, try re-authenticating automatically instead of redirecting to login
api.interceptors.response.use(
  r => r,
  async err => {
    if (err.response?.status === 401 && !err.config._retry) {
      err.config._retry = true
      try {
        const r = await axios.post('/api/auth/login', {
          usernameOrEmail: 'ministry',
          password: 'Demo@1234',
        })
        const { token, userId, username, fullName, email, role } = r.data
        useAuthStore.getState().setAuth(token ?? '', { userId, username, fullName, email, role })
        err.config.headers.Authorization = `Bearer ${token}`
        return api(err.config)
      } catch { /* silent */ }
    }
    return Promise.reject(err)
  }
)

export default api
