/**
 * ProjectsPage — 100% static demo data, no API needed
 */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Filter, ChevronLeft, ChevronRight, FileText, TrendingUp, TrendingDown } from 'lucide-react'

// ── 30 demo projects ─────────────────────────────────────────
const DEMO_PROJECTS = [
  { id: 1,  projectCode: 'MP-UP-RD-001', name: 'NH-24 Road Widening — Lucknow to Unnao',         stateName: 'Uttar Pradesh',  categoryName: 'Roads',         status: 'IN_PROGRESS',  sanctionedCr: 4.50, utilizationPct: 82, riskLevel: 'HIGH'     },
  { id: 2,  projectCode: 'MP-MH-SC-002', name: 'Govt Primary School — Nagpur Rural Block',        stateName: 'Maharashtra',    categoryName: 'Education',     status: 'COMPLETED',    sanctionedCr: 2.10, utilizationPct: 97, riskLevel: 'LOW'      },
  { id: 3,  projectCode: 'MP-BR-HW-003', name: 'Community Health Centre — Patna District',        stateName: 'Bihar',          categoryName: 'Health',        status: 'STALLED',      sanctionedCr: 3.20, utilizationPct: 34, riskLevel: 'CRITICAL' },
  { id: 4,  projectCode: 'MP-WB-WS-004', name: 'Rural Water Supply Scheme — Hooghly',            stateName: 'West Bengal',    categoryName: 'Water Supply',  status: 'IN_PROGRESS',  sanctionedCr: 1.80, utilizationPct: 61, riskLevel: 'MEDIUM'   },
  { id: 5,  projectCode: 'MP-RJ-RD-005', name: 'Desert Highway Connectivity — Jodhpur',          stateName: 'Rajasthan',      categoryName: 'Roads',         status: 'SANCTIONED',   sanctionedCr: 5.40, utilizationPct: 12, riskLevel: 'HIGH'     },
  { id: 6,  projectCode: 'MP-TN-SC-006', name: 'Model School Building — Chennai Suburbs',         stateName: 'Tamil Nadu',     categoryName: 'Education',     status: 'COMPLETED',    sanctionedCr: 2.75, utilizationPct: 100, riskLevel: 'LOW'     },
  { id: 7,  projectCode: 'MP-KA-HW-007', name: 'Primary Health Centre — Mysuru Taluk',           stateName: 'Karnataka',      categoryName: 'Health',        status: 'IN_PROGRESS',  sanctionedCr: 1.95, utilizationPct: 55, riskLevel: 'MEDIUM'   },
  { id: 8,  projectCode: 'MP-MP-WS-008', name: 'Narmada Pipeline Extension — Jabalpur',          stateName: 'Madhya Pradesh', categoryName: 'Water Supply',  status: 'STALLED',      sanctionedCr: 3.60, utilizationPct: 29, riskLevel: 'HIGH'     },
  { id: 9,  projectCode: 'MP-GJ-RD-009', name: 'Industrial Road Upgrade — Surat GIDC',           stateName: 'Gujarat',        categoryName: 'Roads',         status: 'COMPLETED',    sanctionedCr: 3.80, utilizationPct: 94, riskLevel: 'LOW'      },
  { id: 10, projectCode: 'MP-AP-SC-010', name: 'Digital Classroom — Vijayawada Municipal',       stateName: 'Andhra Pradesh', categoryName: 'Education',     status: 'IN_PROGRESS',  sanctionedCr: 1.40, utilizationPct: 71, riskLevel: 'MEDIUM'   },
  { id: 11, projectCode: 'MP-UP-RD-011', name: 'Agra-Mathura Rural Link Road',                   stateName: 'Uttar Pradesh',  categoryName: 'Roads',         status: 'IN_PROGRESS',  sanctionedCr: 2.90, utilizationPct: 48, riskLevel: 'HIGH'     },
  { id: 12, projectCode: 'MP-MH-HW-012', name: 'Sub-district Hospital — Pune Hinterland',        stateName: 'Maharashtra',    categoryName: 'Health',        status: 'SANCTIONED',   sanctionedCr: 4.20, utilizationPct: 8,  riskLevel: 'MEDIUM'   },
  { id: 13, projectCode: 'MP-BR-RD-013', name: 'Kosi River Embankment Road — Supaul',            stateName: 'Bihar',          categoryName: 'Roads',         status: 'STALLED',      sanctionedCr: 3.10, utilizationPct: 41, riskLevel: 'HIGH'     },
  { id: 14, projectCode: 'MP-HR-SC-014', name: 'Skill Development Centre — Gurugram',            stateName: 'Haryana',        categoryName: 'Education',     status: 'COMPLETED',    sanctionedCr: 2.30, utilizationPct: 99, riskLevel: 'LOW'      },
  { id: 15, projectCode: 'MP-PB-WS-015', name: 'Groundwater Recharge Project — Amritsar',        stateName: 'Punjab',         categoryName: 'Water Supply',  status: 'IN_PROGRESS',  sanctionedCr: 1.65, utilizationPct: 67, riskLevel: 'LOW'      },
  { id: 16, projectCode: 'MP-OR-RD-016', name: 'Coastal Highway — Puri to Konark',               stateName: 'Odisha',         categoryName: 'Roads',         status: 'IN_PROGRESS',  sanctionedCr: 4.80, utilizationPct: 53, riskLevel: 'MEDIUM'   },
  { id: 17, projectCode: 'MP-CG-HW-017', name: 'Tribal Health Post — Bastar District',           stateName: 'Chhattisgarh',   categoryName: 'Health',        status: 'SANCTIONED',   sanctionedCr: 1.20, utilizationPct: 5,  riskLevel: 'HIGH'     },
  { id: 18, projectCode: 'MP-JH-SC-018', name: 'Govt High School — Ranchi Block East',           stateName: 'Jharkhand',      categoryName: 'Education',     status: 'COMPLETED',    sanctionedCr: 1.85, utilizationPct: 96, riskLevel: 'LOW'      },
  { id: 19, projectCode: 'MP-AS-WS-019', name: 'Brahmaputra Flood Relief Drainage — Guwahati',  stateName: 'Assam',          categoryName: 'Water Supply',  status: 'STALLED',      sanctionedCr: 2.70, utilizationPct: 22, riskLevel: 'CRITICAL' },
  { id: 20, projectCode: 'MP-KL-RD-020', name: 'Backwater Bridge — Alappuzha Sector 4',          stateName: 'Kerala',         categoryName: 'Roads',         status: 'COMPLETED',    sanctionedCr: 2.40, utilizationPct: 101, riskLevel: 'LOW'     },
  { id: 21, projectCode: 'MP-TL-HW-021', name: 'PHC Renovation — Warangal Rural',                stateName: 'Telangana',      categoryName: 'Health',        status: 'IN_PROGRESS',  sanctionedCr: 1.55, utilizationPct: 59, riskLevel: 'MEDIUM'   },
  { id: 22, projectCode: 'MP-UP-SC-022', name: 'Digital Library — Varanasi Central',             stateName: 'Uttar Pradesh',  categoryName: 'Education',     status: 'IN_PROGRESS',  sanctionedCr: 1.10, utilizationPct: 44, riskLevel: 'HIGH'     },
  { id: 23, projectCode: 'MP-MH-WS-023', name: 'Smart Water Metering — Thane Municipal',         stateName: 'Maharashtra',    categoryName: 'Water Supply',  status: 'SANCTIONED',   sanctionedCr: 3.30, utilizationPct: 15, riskLevel: 'LOW'      },
  { id: 24, projectCode: 'MP-BR-SC-024', name: 'Anganwadi Centre Cluster — Muzaffarpur',         stateName: 'Bihar',          categoryName: 'Education',     status: 'STALLED',      sanctionedCr: 0.90, utilizationPct: 31, riskLevel: 'HIGH'     },
  { id: 25, projectCode: 'MP-RJ-HW-025', name: 'Desert Medical Unit — Barmer Block',             stateName: 'Rajasthan',      categoryName: 'Health',        status: 'IN_PROGRESS',  sanctionedCr: 2.05, utilizationPct: 63, riskLevel: 'MEDIUM'   },
  { id: 26, projectCode: 'MP-TN-WS-026', name: 'Chennai Metro Water Augmentation',               stateName: 'Tamil Nadu',     categoryName: 'Water Supply',  status: 'COMPLETED',    sanctionedCr: 4.10, utilizationPct: 98, riskLevel: 'LOW'      },
  { id: 27, projectCode: 'MP-KA-RD-027', name: 'Bengaluru Peripheral Ring Road Segment 7',       stateName: 'Karnataka',      categoryName: 'Roads',         status: 'IN_PROGRESS',  sanctionedCr: 5.20, utilizationPct: 77, riskLevel: 'HIGH'     },
  { id: 28, projectCode: 'MP-MP-SC-028', name: 'Science Laboratory — Bhopal Block D Schools',   stateName: 'Madhya Pradesh', categoryName: 'Education',     status: 'COMPLETED',    sanctionedCr: 1.75, utilizationPct: 93, riskLevel: 'LOW'      },
  { id: 29, projectCode: 'MP-GJ-HW-029', name: 'Trauma Care Centre — Ahmedabad GIDC',            stateName: 'Gujarat',        categoryName: 'Health',        status: 'SANCTIONED',   sanctionedCr: 3.70, utilizationPct: 9,  riskLevel: 'MEDIUM'   },
  { id: 30, projectCode: 'MP-WB-RD-030', name: 'Kolkata Suburb Connectivity — Barasat NH12',     stateName: 'West Bengal',    categoryName: 'Roads',         status: 'IN_PROGRESS',  sanctionedCr: 3.95, utilizationPct: 58, riskLevel: 'HIGH'     },
]

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
    <span style={{ padding: '0.2rem 0.6rem', borderRadius: 999, fontSize: '0.65rem', fontWeight: 800,
      background: `${col}18`, color: col, border: `1px solid ${col}35`, letterSpacing: '0.06em' }}>
      {level}
    </span>
  )
}

function StatusBadge({ status }: { status: string }) {
  const col = STATUS_COLORS[status] || '#6b7280'
  return (
    <span style={{ padding: '0.2rem 0.6rem', borderRadius: 999, fontSize: '0.68rem', fontWeight: 700,
      background: `${col}20`, color: col, border: `1px solid ${col}40` }}>
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

  // Filter + search
  let filtered = DEMO_PROJECTS
  if (statusFilter) filtered = filtered.filter(p => p.status === statusFilter)
  if (search) filtered = filtered.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.projectCode.toLowerCase().includes(search.toLowerCase()) ||
    p.stateName.toLowerCase().includes(search.toLowerCase())
  )
  if (sortDir === 'ASC') filtered = [...filtered].reverse()

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const pageProjects = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  return (
    <div className="fade-in">
      <div className="page-header">
        <div className="demo-banner">⚠ DEMO DATA — Synthetic Projects • Not Real Government Records</div>
        <h1>Projects</h1>
        <p className="page-subtitle">{filtered.length} projects across India</p>
      </div>

      {/* ── Filters ── */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div className="search-bar" style={{ flex: 1, minWidth: 240 }}>
          <Search size={16} color="var(--text-muted)" />
          <input
            placeholder="Search by name, code or state..."
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
            </tr>
          </thead>
          <tbody>
            {pageProjects.map(p => (
              <tr key={p.id} onClick={() => navigate(`/projects/${p.id}`)} style={{ cursor: 'pointer' }}>
                <td>
                  <code style={{ fontSize: '0.7rem', background: 'rgba(59,130,246,0.1)', padding: '0.15rem 0.4rem', borderRadius: 4, color: '#60a5fa' }}>
                    {p.projectCode}
                  </code>
                </td>
                <td>
                  <div style={{ maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 500, color: 'var(--text)' }}>
                    {p.name}
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
