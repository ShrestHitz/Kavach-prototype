import { Link, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import {
  LayoutDashboard, Map, FolderOpen, AlertTriangle,
  Shield, ChevronRight, Activity, Camera
} from 'lucide-react'
import api from '../../api/client'

const NAV = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/projects',  icon: FolderOpen,      label: 'Projects' },
  { to: '/map',       icon: Map,             label: 'Risk Map' },
  { to: '/anomalies', icon: AlertTriangle,   label: 'Anomalies' },
  { to: '/photos',    icon: Camera,          label: 'Photo Verification' },
]

export default function Sidebar() {
  const { pathname } = useLocation()
  const [mlStatus, setMlStatus] = useState<'UP' | 'DOWN' | 'CHECKING'>('CHECKING')

  // Ping ML health every 30s
  useEffect(() => {
    const check = async () => {
      try {
        const r = await api.get('/ml/health', { timeout: 3000 })
        setMlStatus(r.data?.status === 'UP' ? 'UP' : 'DOWN')
      } catch { setMlStatus('DOWN') }
    }
    check()
    const t = setInterval(check, 30_000)
    return () => clearInterval(t)
  }, [])

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
          <div style={{ width: 32, height: 32, borderRadius: '8px', background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Shield size={16} color="#fff" />
          </div>
          <h2>Kavach 2.0</h2>
        </div>
        <p>MPLADS AI Platform · SIH 2026</p>
      </div>

      {/* Nav */}
      <div className="nav-section">
        <div className="nav-section-label">Navigation</div>
        {NAV.map(({ to, icon: Icon, label }) => (
          <Link
            key={to}
            to={to}
            className={`nav-item ${pathname.startsWith(to) ? 'active' : ''}`}
            style={{ textDecoration: 'none' }}
          >
            <Icon size={18} />
            <span style={{ flex: 1 }}>{label}</span>
            {pathname.startsWith(to) && <ChevronRight size={14} />}
          </Link>
        ))}
      </div>

      {/* ML Status */}
      <div style={{ padding: '0 1rem', margin: '0.5rem 0' }}>
        <div style={{
          background: mlStatus === 'UP' ? 'rgba(16,185,129,0.08)' : mlStatus === 'DOWN' ? 'rgba(239,68,68,0.08)' : 'rgba(200,149,44,0.08)',
          border: `1px solid ${mlStatus === 'UP' ? 'rgba(16,185,129,0.2)' : mlStatus === 'DOWN' ? 'rgba(239,68,68,0.2)' : 'rgba(200,149,44,0.2)'}`,
          borderRadius: '8px', padding: '0.6rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
        }}>
          <Activity size={14} color={mlStatus === 'UP' ? '#10b981' : mlStatus === 'DOWN' ? '#ef4444' : '#f59e0b'} />
          <div>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, color: mlStatus === 'UP' ? '#10b981' : mlStatus === 'DOWN' ? '#ef4444' : '#f59e0b' }}>
              AI Engine {mlStatus === 'CHECKING' ? 'CHECKING…' : mlStatus}
            </div>
            <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>FastAPI :8001 · 4 Models loaded</div>
          </div>
        </div>
      </div>

      {/* Demo badge */}
      <div style={{ padding: '0 1rem' }}>
        <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '8px', padding: '0.5rem 0.75rem', fontSize: '0.65rem', color: '#f59e0b' }}>
          ⚠ DEMO MODE — Synthetic Data
        </div>
      </div>

      {/* Footer — Ministry label */}
      <div className="sidebar-footer">
        <div className="user-chip">
          <div className="user-avatar">MA</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="user-name">Ministry Admin</div>
            <div className="user-role">MINISTRY · MoSPI</div>
          </div>
        </div>
      </div>
    </aside>
  )
}
