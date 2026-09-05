import axios, { AxiosResponse } from 'axios'
import { useAuthStore } from '../store/authStore'
import { handleMockApi } from './mockData'

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
})

// Attach JWT token from store on every request
api.interceptors.request.use(config => {
  const token = useAuthStore.getState().token
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Intercept responses: if backend returned HTML (due to Vercel SPA rewrite) or 401/404/5xx
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // If backend returns an HTML string instead of JSON (common when Vercel rewrites /api/* to index.html)
    if (
      typeof response.data === 'string' &&
      response.data.trim().toLowerCase().startsWith('<!doctype')
    ) {
      const url = response.config.url || ''
      const method = response.config.method || 'GET'
      let body = null
      try {
        body = typeof response.config.data === 'string' ? JSON.parse(response.config.data) : response.config.data
      } catch {}

      const mock = handleMockApi(url, method, body)
      if (mock) {
        response.data = mock.data
        return response
      }
    }
    return response
  },
  async err => {
    const config = err.config || {}
    const url = config.url || ''
    const method = config.method || 'GET'
    let body = null
    try {
      body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data
    } catch {}

    // Check if we have a mock response for this endpoint
    const mock = handleMockApi(url, method, body)
    if (mock) {
      return {
        data: mock.data,
        status: mock.status,
        statusText: 'OK (Mock)',
        headers: mock.headers || {},
        config,
      }
    }

    // On 401, attempt re-authentication
    if (err.response?.status === 401 && !config._retry) {
      config._retry = true
      try {
        const r = await api.post('/auth/login', {
          usernameOrEmail: 'ministry',
          password: 'Demo@1234',
        })
        const { token, userId, username, fullName, email, role } = r.data
        useAuthStore.getState().setAuth(token ?? '', { userId, username, fullName, email, role })
        config.headers.Authorization = `Bearer ${token}`
        return api(config)
      } catch { /* silent */ }
    }

    return Promise.reject(err)
  }
)

export default api
