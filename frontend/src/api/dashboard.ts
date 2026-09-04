import api from './client'

export const dashboardApi = {
  kpis: async () => {
    const r = await api.get('/dashboard/kpis')
    return r.data
  },
  riskDistribution: async () => {
    const r = await api.get('/dashboard/risk-distribution')
    return r.data
  },
  statusDistribution: async () => {
    const r = await api.get('/dashboard/status-distribution')
    return r.data
  },
  topRisk: async (size = 5) => {
    const r = await api.get(`/projects/high-risk?size=${size}`)
    return r.data
  },
}

export const mlApi = {
  health: async () => {
    const r = await api.get('/ml/health')
    return r.data
  },
  anomalies: async () => {
    const r = await api.get('/ml/anomalies')
    return r.data
  },
  scoreAll: async () => {
    const r = await api.post('/ml/score-all')
    return r.data
  },
  predictDelay: async (payload: Record<string, unknown>) => {
    const r = await api.post('/ml/predict-delay', payload)
    return r.data
  },
  detectAnomaly: async (payload: Record<string, unknown>) => {
    const r = await api.post('/ml/detect-anomaly', payload)
    return r.data
  },
  reportPreview: (projectCode: string) =>
    `/api/ml/report/${projectCode}`,
}
