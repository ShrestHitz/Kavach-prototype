import { Link, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import {
  LayoutDashboard, Map, FolderOpen, AlertTriangle,
  Shield, Activity, Camera, Landmark
} from 'lucide-react'

const NAV = [
  { to: '/',          icon: Landmark,        label: 'Parliament Gate' },
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/projects',  icon: FolderOpen,      label: 'Projects' },
  { to: '/map',       icon: Map,             label: 'Risk Map' },
  { to: '/anomalies', icon: AlertTriangle,   label: 'Anomalies' },
  { to: '/photos',    icon: Camera,          label: 'Photo Verify' },
]

export default function TopNav() {
  const { pathname } = useLocation()
  const [mlStatus, setMlStatus] = useState<'UP' | 'DOWN' | 'CHECKING'>('CHECKING')
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const check = async () => {
      try {
        // Ping ML FastAPI directly — bypasses Spring Boot backend
        const r = await fetch('http://localhost:8001/health', { signal: AbortSignal.timeout(3000) })
        const data = await r.json()
        setMlStatus(data?.status === 'UP' ? 'UP' : 'DOWN')
      } catch { setMlStatus('DOWN') }
    }
    check()
    const t = setInterval(check, 30_000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`top-nav${scrolled ? ' scrolled' : ''}`}>
      {/* Brand */}
      <Link to="/" className="nav-brand">
        <div className="nav-brand-mark">
          <Shield size={18} color="#fff" strokeWidth={2.5} />
        </div>
        <div className="nav-brand-text">
          <div className="nav-brand-name">KAVACH</div>
          <div className="nav-brand-sub">MoSPI · MPLADS AI Vigilance System</div>
        </div>
      </Link>

      {/* Nav links */}
      <div className="nav-links">
        {NAV.map(({ to, icon: Icon, label }) => {
          const isActive = to === '/' ? pathname === '/' : pathname.startsWith(to)
          return (
            <Link
              key={to}
              to={to}
              className={`nav-link${isActive ? ' active' : ''}`}
            >
              <Icon size={15} />
              {label}
            </Link>
          )
        })}
      </div>

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {/* AI Status */}
        <div className={`nav-status${mlStatus === 'DOWN' ? ' down' : ''}`}>
          <div className="nav-status-dot" />
          <Activity size={12} />
          AI {mlStatus === 'CHECKING' ? '…' : mlStatus}
        </div>

        {/* User chip */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          padding: '0.3rem 0.7rem', borderRadius: 999,
          background: 'rgba(201,168,76,0.07)',
          border: '1px solid rgba(201,168,76,0.18)',
          fontSize: '0.72rem', color: 'var(--text-dim)',
          cursor: 'pointer',
        }}>
          <div style={{
            width: 24, height: 24, borderRadius: '50%',
            background: 'linear-gradient(135deg,var(--gold),var(--saffron))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.6rem', fontWeight: 800, color: '#fff',
          }}>MA</div>
          <span style={{ fontWeight: 600, letterSpacing: '0.02em' }}>Ministry Admin</span>
        </div>
      </div>
    </nav>
  )
}
