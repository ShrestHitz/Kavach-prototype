/**
 * ProjectsPage — 100% static demo data, no API needed
 * Seamlessly connects to all 30 projects with deep-dive detail views
 */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Filter, ChevronLeft, ChevronRight, ChevronRight as RowArrow, Eye } from 'lucide-react'
import { ALL_PROJECTS, DetailedProject } from '../data/projectsData'

const PAGE_SIZE = 10
const STATUSES = ['', 'IN_PROGRESS', 'COMPLETED', 'STALLED', 'SANCTIONED', 'CANCELLED']
const STATUS_COLORS: Record<string, string> = {
  COMPLETED: '#10b981', IN_PROGRESS: '#3b82f6', STALLED: '#f97316',
  SANCTIONED: '#0d9488', CANCELLED: '#6b7280',
}
const RISK_COLORS: Record<string, string> = {
  CRITICAL: '#ef4444', HIGH: '#f97316', MEDIUM: '#f59e0b', LOW: '#10b981',
}

function RiskBadge({ level }: { level?: string }) {
  if (!level) return <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>—</span>
  const col = RISK_COLORS[level] || '#6b7280'
  return (
    <span style={{
      padding: '0.2rem 0.6rem', borderRadius: 999, fontSize: '0.65rem', fontWeight: 800,
      background: `${col}18`, color: col, border: `1px solid ${col}35`, letterSpacing: '0.06em'
    }}>
      {level}
    </span>
  )
}

function StatusBadge({ status }: { status: string }) {
  const col = STATUS_COLORS[status] || '#6b7280'
  return (
    <span style={{
      padding: '0.2rem 0.6rem', borderRadius: 999, fontSize: '0.68rem', fontWeight: 700,
      background: `${col}20`, color: col, border: `1px solid ${col}40`
    }}>
      {status.replace('_', ' ')}
    </span>
  )
}

export default function ProjectsPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [sortDir, setSortDir] = useState<'DESC' | 'ASC'>('DESC')
  const [page, setPage] = useState(0)

  // Filter + search across all 30 rich projects
  let filtered = ALL_PROJECTS
  if (statusFilter) filtered = filtered.filter(p => p.status === statusFilter)
  if (search) filtered = filtered.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.projectCode.toLowerCase().includes(search.toLowerCase()) ||
    p.stateName.toLowerCase().includes(search.toLowerCase()) ||
    p.district.toLowerCase().includes(search.toLowerCase()) ||
    p.categoryName.toLowerCase().includes(search.toLowerCase())
  )
  if (sortDir === 'ASC') filtered = [...filtered].reverse()

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const pageProjects = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  return (
    <div className="fade-in">
      <div className="page-header">
        <div className="demo-banner">⚠ DEMO DATA — Synthetic Projects • Not Real Government Records</div>
        <h1>Projects</h1>
        <p className="page-subtitle">{filtered.length} projects across India • Click any row to view full project audit details</p>
      </div>

      {/* ── Filters ── */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div className="search-bar" style={{ flex: 1, minWidth: 240 }}>
          <Search size={16} color="var(--text-muted)" />
          <input
            placeholder="Search by name, code, state or district..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(0) }}
          />
        </div>
        <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(0) }}>
          <option value="">All Statuses</option>
          {STATUSES.filter(Boolean).map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
        </select>
        <select value={sortDir} onChange={e => setSortDir(e.target.value as 'ASC' | 'DESC')}>
          <option value="DESC">Newest First</option>
          <option value="ASC">Oldest First</option>
        </select>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
          <Filter size={14} /> {filtered.length} results
        </div>
      </div>

      {/* ── Table ── */}
      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Project Code</th>
              <th>Name</th>
              <th>State</th>
              <th>Category</th>
              <th>Status</th>
              <th>Sanctioned (₹ Cr)</th>
              <th>Utilization %</th>
              <th>Risk</th>
              <th style={{ textAlign: 'right', paddingRight: '1.25rem' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {pageProjects.map(p => (
              <tr
                key={p.id}
                onClick={() => navigate(`/projects/${p.id}`)}
                style={{ cursor: 'pointer', transition: 'background 0.15s ease' }}
                className="hover-row"
              >
                <td>
                  <code style={{
                    fontSize: '0.72rem', background: 'rgba(59,130,246,0.12)',
                    padding: '0.2rem 0.45rem', borderRadius: 4, color: '#60a5fa', fontWeight: 700
                  }}>
                    {p.projectCode}
                  </code>
                </td>
                <td>
                  <div style={{ maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 600, color: 'var(--text)' }}>
                    {p.name}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 2 }}>
                    {p.constituency} · MP: {p.mpName}
                  </div>
                </td>
                <td style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>{p.stateName}</td>
                <td style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>{p.categoryName}</td>
                <td><StatusBadge status={p.status} /></td>
                <td style={{ fontWeight: 700, color: 'var(--gold)' }}>₹{p.sanctionedCr.toFixed(2)}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ flex: 1, background: 'rgba(255,255,255,0.07)', borderRadius: 999, height: 5, overflow: 'hidden' }}>
                      <div style={{
                        width: `${Math.min(p.utilizationPct, 100)}%`, height: '100%', borderRadius: 999,
                        background: p.utilizationPct > 90 ? '#ef4444' : p.utilizationPct > 60 ? '#10b981' : '#f59e0b'
                      }} />
                    </div>
                    <span style={{ fontSize: '0.72rem', minWidth: 32, color: 'var(--text-dim)' }}>{p.utilizationPct}%</span>
                  </div>
                </td>
                <td><RiskBadge level={p.riskLevel} /></td>
                <td style={{ textAlign: 'right', paddingRight: '1.25rem' }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      navigate(`/projects/${p.id}`)
                    }}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
                      background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.25)',
                      borderRadius: 6, color: '#60a5fa', padding: '0.25rem 0.55rem',
                      fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer'
                    }}
                  >
                    <Eye size={12} /> Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1.25rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Page {page + 1} of {totalPages || 1} · {filtered.length} total
          </span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn btn-ghost" style={{ padding: '0.35rem 0.6rem' }} disabled={page === 0} onClick={() => setPage(p => p - 1)}>
              <ChevronLeft size={14} />
            </button>
            <button className="btn btn-ghost" style={{ padding: '0.35rem 0.6rem' }} disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
