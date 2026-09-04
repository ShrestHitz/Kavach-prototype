import api from './client'

export interface ProjectSummary {
  id: number; projectCode: string; name: string
  stateName: string; categoryName: string; status: string
  sanctionedAmountRs: number; utilizationPct: number
  riskLevel?: string; riskScore?: number
}

export interface ProjectFilters {
  page?: number; size?: number; status?: string
  sortBy?: string; sortDir?: 'ASC' | 'DESC'
  stateId?: number; categoryId?: number
}

export const projectsApi = {
  list: async (filters: ProjectFilters = {}) => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([k, v]) => { if (v !== undefined && v !== '') params.append(k, String(v)) })
    const r = await api.get(`/projects?${params}`)
    return r.data
  },
  get: async (id: number) => {
    const r = await api.get(`/projects/${id}`)
    return r.data
  },
  highRisk: async () => {
    const r = await api.get('/projects/high-risk')
    return r.data
  },
}
