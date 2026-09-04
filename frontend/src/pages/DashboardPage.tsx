import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Clock, IndianRupee, Zap, Activity, Landmark } from 'lucide-react'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'

import PlantedAnomalyInspector from '../components/ui/PlantedAnomalyInspector'

// ── Static demo KPIs — no API needed ─────────────────────────
const DEMO_KPIS = {
  totalProjects: 558,
  completedProjects: 137,
  inProgressProjects: 322,
  stalledProjects: 47,
  completionRatePct: 24.6,
  totalSanctionedCrore: 125.78,
  totalExpenditureCrore: 89.43,
  overallUtilizationPct: 71.1,
  highRiskProjects: 224,
  criticalProjects: 1,
  statusDistribution: { IN_PROGRESS: 322, CANCELLED: 12, COMPLETED: 137, SANCTIONED: 40, STALLED: 47 },
  riskDistribution: { CRITICAL: 1, HIGH: 224, MEDIUM: 39, LOW: 294 },
  dataNote: '⚠ DEMO DATA — Synthetic Projects · Not Real Government Records · SIH 2026',
}

// ── Trend sparkline data ─────────────────────────────────────
const TREND_DATA = [
  { month: 'Jan', projects: 420, risk: 180 },
  { month: 'Feb', projects: 445, risk: 210 },
  { month: 'Mar', projects: 470, risk: 195 },
  { month: 'Apr', projects: 490, risk: 230 },
  { month: 'May', projects: 510, risk: 220 },
  { month: 'Jun', projects: 528, risk: 240 },
  { month: 'Jul', projects: 541, risk: 235 },
  { month: 'Aug', projects: 558, risk: 265 },
]

const RISK_COLORS: Record<string, string> = {
  CRITICAL: '#ef4444', HIGH: '#f97316', MEDIUM: '#f59e0b', LOW: '#10b981'
}
const STATUS_COLORS: Record<string, string> = {
  COMPLETED: '#10b981', IN_PROGRESS: '#3b82f6', STALLED: '#f97316',
  SANCTIONED: '#0d9488', CANCELLED: '#6b7280'
}

const CUSTOM_TOOLTIP = ({ active, payload }: any) => {
  if (active && payload?.length) {
    return (
      <div style={{
        background: '#FFFFFF',
        border: '1.5px solid rgba(0, 168, 150, 0.25)',
        boxShadow: '0 8px 24px rgba(15, 23, 42, 0.1)',
        borderRadius: 10,
        padding: '0.6rem 0.85rem',
        fontSize: '0.78rem',
        color: '#0F172A'
      }}>
        <div style={{ fontWeight: 800, color: '#0F172A', marginBottom: 2 }}>{payload[0].name}</div>
        <div style={{ color: payload[0].fill || payload[0].color, fontWeight: 700 }}>{payload[0].value}</div>
      </div>
    )
  }
  return null
}

// ── Animated counter ─────────────────────────────────────────
function AnimatedNumber({ value, prefix = '', suffix = '', decimals = 0 }: { value: number; prefix?: string; suffix?: string; decimals?: number }) {
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    const start = Date.now()
    const duration = 1200
    const tick = () => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(parseFloat((eased * value).toFixed(decimals)))
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [value])
  return <>{prefix}{display.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}</>
}

// ── State breakdown table data ────────────────────────────────
const STATE_DATA = [
  { state: 'Uttar Pradesh', total: 89, high: 34, completed: 18, amount: '₹22.4 Cr' },
  { state: 'Maharashtra',   total: 72, high: 28, completed: 21, amount: '₹19.8 Cr' },
  { state: 'Bihar',         total: 61, high: 31, completed: 9,  amount: '₹15.2 Cr' },
  { state: 'West Bengal',   total: 54, high: 22, completed: 15, amount: '₹13.9 Cr' },
  { state: 'Rajasthan',     total: 48, high: 19, completed: 12, amount: '₹12.1 Cr' },
  { state: 'Tamil Nadu',    total: 44, high: 14, completed: 16, amount: '₹11.7 Cr' },
]

export default function DashboardPage() {
  const kpis = DEMO_KPIS
  const riskData = Object.entries(kpis.riskDistribution).map(([name, value]) => ({ name, value }))
  const statusData = Object.entries(kpis.statusDistribution).map(([name, value]) => ({
    name: name.replace('_', ' '), value, fill: STATUS_COLORS[name] || '#6b7280'
  }))

  return (
    <div className="fade-in">
      {/* ── Header ── */}
      <div className="page-header">
        <div className="demo-banner">⚠ DEMO DATA — Synthetic Projects • Not Real Government Records</div>
        <h1>National Dashboard</h1>
        <p className="page-subtitle">Real-time MPLADS project intelligence across all 32 states &amp; UTs</p>
      </div>

      {/* ── India stripe ── */}
      <div className="india-stripe" style={{ marginBottom: '1.5rem' }} />

      {/* ── 1-Click Planted Anomaly Inspector ── */}
      <PlantedAnomalyInspector />

      {/* ── Sovereign Parliament Gate Scrollytelling Reveal Banner ── */}
      <div
        className="metro-card"
        style={{
          background: 'linear-gradient(135deg, #FFFFFF 0%, #F0FDFB 100%)',
          border: '1.5px solid rgba(0, 168, 150, 0.35)',
          borderRadius: 18,
          padding: '1.15rem 1.6rem',
          marginBottom: '1.75rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.25rem',
          boxShadow: '0 6px 25px rgba(0, 168, 150, 0.08)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: 46, height: 46, borderRadius: 14,
            background: 'linear-gradient(135deg, #00A896, #028090)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', boxShadow: '0 4px 15px rgba(0, 168, 150, 0.35)',
            flexShrink: 0,
          }}>
            <Landmark size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.96rem', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>The Sovereign Parliament Gate &amp; Neural Radar Reveal</span>
              <span style={{ fontSize: '0.65rem', background: '#DCFCE7', color: '#166534', padding: '0.15rem 0.5rem', borderRadius: 999, fontWeight: 800, border: '1px solid #BBF7D0' }}>
                SCROLLYTELLING CURTAIN
              </span>
            </div>
            <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '0.2rem' }}>
              Democratic mandate on the outside (₹83,180 Cr across 543 constituencies) · Autonomous AI Sentinel Core on the inside
            </div>
          </div>
        </div>
        <Link
          to="/#gate-reveal"
          className="btn-metro-primary"
          style={{ padding: '0.65rem 1.5rem', fontSize: '0.82rem', textDecoration: 'none', flexShrink: 0 }}
        >
          Inspect Gate Reveal →
        </Link>
      </div>

      {/* ── KPI Cards ── */}
      <div className="kpi-grid stagger-children" style={{ marginBottom: '1.5rem' }}>
        <div className="kpi-card blue reveal">
          <div className="kpi-label">Total Projects</div>
          <div className="kpi-value"><AnimatedNumber value={kpis.totalProjects} /></div>
          <div className="kpi-sub">Across all states</div>
        </div>
        <div className="kpi-card green reveal">
          <div className="kpi-label">Completed</div>
          <div className="kpi-value"><AnimatedNumber value={kpis.completedProjects} /></div>
          <div className="kpi-sub" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <TrendingUp size={12} /> <AnimatedNumber value={kpis.completionRatePct} decimals={1} />% rate
          </div>
        </div>
        <div className="kpi-card blue reveal">
          <div className="kpi-label">In Progress</div>
          <div className="kpi-value"><AnimatedNumber value={kpis.inProgressProjects} /></div>
          <div className="kpi-sub" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Clock size={12} /> Active
          </div>
        </div>
        <div className="kpi-card yellow reveal">
          <div className="kpi-label">Stalled</div>
          <div className="kpi-value"><AnimatedNumber value={kpis.stalledProjects} /></div>
          <div className="kpi-sub" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <AlertTriangle size={12} /> Needs attention
          </div>
        </div>
        <div className="kpi-card teal reveal">
          <div className="kpi-label">Sanctioned (Cr)</div>
          <div className="kpi-value" style={{ fontSize: '1.8rem' }}>
            ₹<AnimatedNumber value={kpis.totalSanctionedCrore} decimals={2} />
          </div>
          <div className="kpi-sub" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <IndianRupee size={12} /> Total allocation
          </div>
        </div>
        <div className="kpi-card red reveal">
          <div className="kpi-label">High / Critical Risk</div>
          <div className="kpi-value" style={{ color: 'var(--risk-crit)' }}>
            <AnimatedNumber value={kpis.criticalProjects} />
          </div>
          <div className="kpi-sub" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Zap size={12} /> <AnimatedNumber value={kpis.highRiskProjects} /> high risk total
          </div>
        </div>
      </div>

      {/* ── Charts row ── */}
      <div className="charts-grid">
        <div className="chart-card reveal">
          <div className="chart-title">Project Status Distribution</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={statusData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fill: '#64748B', fontSize: 11, fontWeight: 600 }} />
              <YAxis tick={{ fill: '#64748B', fontSize: 11, fontWeight: 600 }} />
              <Tooltip content={<CUSTOM_TOOLTIP />} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {statusData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card reveal reveal-delay-2">
          <div className="chart-title">AI Risk Level Distribution</div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={riskData} dataKey="value" nameKey="name"
                cx="50%" cy="50%" outerRadius={80} paddingAngle={3}
                label={({ name, value }) => `${name}: ${value}`}
                labelLine={{ stroke: '#94A3B8' }}
              >
                {riskData.map((entry, i) => <Cell key={i} fill={RISK_COLORS[entry.name] || '#6b7280'} />)}
              </Pie>
              <Tooltip content={<CUSTOM_TOOLTIP />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Trend chart ── */}
      <div className="chart-card reveal" style={{ marginBottom: '1.5rem' }}>
        <div className="chart-title">Project Growth &amp; Risk Trend (2026)</div>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={TREND_DATA} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="projectGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00A896" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#00A896" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="month" tick={{ fill: '#64748B', fontSize: 11, fontWeight: 600 }} />
            <YAxis tick={{ fill: '#64748B', fontSize: 11, fontWeight: 600 }} />
            <Tooltip content={<CUSTOM_TOOLTIP />} />
            <Area type="monotone" dataKey="projects" name="Total Projects" stroke="#00A896" fill="url(#projectGrad)" strokeWidth={2} />
            <Area type="monotone" dataKey="risk" name="At-Risk Projects" stroke="#ef4444" fill="url(#riskGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* ── Fund utilization ── */}
      <div className="card reveal" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Fund Utilization</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-disp)', marginTop: '0.2rem' }}>
              ₹{kpis.totalExpenditureCrore} Cr <span style={{ fontSize: '0.9rem', color: 'var(--text-dim)', fontWeight: 400 }}>of ₹{kpis.totalSanctionedCrore} Cr sanctioned</span>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, fontFamily: 'var(--font-disp)', color: '#10b981' }}>
              <AnimatedNumber value={kpis.overallUtilizationPct} decimals={1} suffix="%" />
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>utilization rate</div>
          </div>
        </div>
        <div className="risk-bar-bg" style={{ height: 10, background: '#E2E8F0', borderRadius: 999, overflow: 'hidden' }}>
          <div className="risk-bar-fill" style={{ width: `${kpis.overallUtilizationPct}%`, background: 'linear-gradient(90deg, #00A896, #028090)', height: '10px' }} />
        </div>
      </div>

      {/* ── State breakdown ── */}
      <div className="table-card reveal">
        <div className="table-header">
          <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Top States by Project Count
          </div>
          <div className="demo-banner" style={{ margin: 0 }}>Synthetic Data</div>
        </div>
        <table>
          <thead>
            <tr>
              <th>State</th>
              <th>Total Projects</th>
              <th>High Risk</th>
              <th>Completed</th>
              <th>Allocated</th>
              <th>Risk Ratio</th>
            </tr>
          </thead>
          <tbody>
            {STATE_DATA.map((row, i) => {
              const riskPct = Math.round((row.high / row.total) * 100)
              return (
                <tr key={i}>
                  <td style={{ fontWeight: 600, color: 'var(--text)' }}>{row.state}</td>
                  <td>{row.total}</td>
                  <td>
                    <span style={{ color: riskPct > 45 ? 'var(--risk-crit)' : riskPct > 35 ? 'var(--risk-high)' : 'var(--risk-med)', fontWeight: 600 }}>
                      {row.high}
                    </span>
                  </td>
                  <td style={{ color: 'var(--risk-low)' }}>{row.completed}</td>
                  <td>{row.amount}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ flex: 1, height: 5, background: '#E2E8F0', borderRadius: 999, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${riskPct}%`, background: riskPct > 45 ? 'var(--risk-crit)' : riskPct > 35 ? 'var(--risk-high)' : 'var(--risk-med)', borderRadius: 999 }} />
                      </div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', minWidth: 30 }}>{riskPct}%</span>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* ── Data note ── */}
      <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.72rem', padding: '1.5rem 1rem 0' }}>
        {kpis.dataNote}
      </div>
    </div>
  )
}
