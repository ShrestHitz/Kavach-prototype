import React, { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import api from './api/client'
import DashboardPage         from './pages/DashboardPage'
import ProjectsPage          from './pages/ProjectsPage'
import ProjectDetailPage     from './pages/ProjectDetailPage'
import MapPage               from './pages/MapPage'
import AnomalyPage           from './pages/AnomalyPage'
import PhotoVerificationPage from './pages/PhotoVerificationPage'
import TopNav                from './components/layout/TopNav'

// ── Scroll progress bar ──────────────────────────────────────
function ScrollProgress() {
  const [pct, setPct] = useState(0)
  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement
      const scrolled = el.scrollTop
      const total = el.scrollHeight - el.clientHeight
      setPct(total > 0 ? (scrolled / total) * 100 : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, height: 3,
      zIndex: 9999, pointerEvents: 'none',
    }}>
      <div style={{
        height: '100%',
        width: `${pct}%`,
        background: 'linear-gradient(90deg, var(--gold), var(--saffron))',
        transition: 'width 0.1s linear',
        boxShadow: '0 0 10px rgba(201,168,76,0.6)',
      }} />
    </div>
  )
}

// ── Scroll-reveal observer ────────────────────────────────────
function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )
    const revealEls = document.querySelectorAll('.reveal')
    revealEls.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  })
}

// ── Parliament background canvas (persists on all pages) ─────
function ParliamentCanvas() {
  return (
    <div id="parliament-canvas">
      <div className="parl-img" />
      <div className="parl-vignette" />
      <div className="parl-scanlines" />
    </div>
  )
}

// ── App layout ───────────────────────────────────────────────
function AppLayout({ children }: { children: React.ReactNode }) {
  useScrollReveal()
  return (
    <>
      <ParliamentCanvas />
      <div className="page-wrapper">
        <TopNav />
        <ScrollProgress />
        <main className="page-content">{children}</main>
      </div>
    </>
  )
}

// ── Kavach loading screen ─────────────────────────────────────
function KavachLoader() {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: '1.5rem',
    }}>
      {/* Parliament bg */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'url(/parliament.jpg) center/cover no-repeat',
        filter: 'brightness(0.22) saturate(0.5)',
        animation: 'parliamentPan 20s ease-in-out infinite alternate',
      }} />
      {/* Overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to bottom, rgba(10,14,26,0.7) 0%, rgba(10,14,26,0.4) 50%, rgba(10,14,26,0.8) 100%)',
      }} />

      {/* Content */}
      <div style={{ position: 'relative', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.2rem' }}>
        {/* Shield SVG */}
        <svg width="72" height="72" viewBox="0 0 80 80" fill="none" style={{ filter: 'drop-shadow(0 0 20px rgba(201,168,76,0.5))', animation: 'pulse 1.8s ease-in-out infinite' }}>
          <path d="M40 8 L68 20 L68 44 C68 60 40 72 40 72 C40 72 12 60 12 44 L12 20 Z"
            fill="url(#shieldG)" stroke="rgba(201,168,76,0.4)" strokeWidth="1.5" />
          <defs>
            <linearGradient id="shieldG" x1="40" y1="8" x2="40" y2="72" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="rgba(201,168,76,0.3)" />
              <stop offset="100%" stopColor="rgba(255,153,51,0.15)" />
            </linearGradient>
          </defs>
          <path d="M28 40 L36 48 L52 32" stroke="#c9a84c" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>

        <div>
          <div style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '2.5rem', fontWeight: 900,
            letterSpacing: '0.15em', color: '#FFFFFF',
            textShadow: '0 0 30px rgba(0,210,196,0.5)',
            lineHeight: 1,
          }}>KAVACH</div>
          <div style={{ fontSize: '0.68rem', color: 'var(--km-cyan)', letterSpacing: '0.2em', marginTop: '0.5rem', textTransform: 'uppercase', fontWeight: 700 }}>
            GOVERNMENT OF INDIA · MOSPI · MPLADS AI VIGILANCE SYSTEM
          </div>
        </div>

        {/* Teal progress bar */}
        <div style={{ width: 190, height: 3, background: 'rgba(0,168,150,0.2)', borderRadius: 999, overflow: 'hidden' }}>
          <div style={{
            height: '100%', borderRadius: 999,
            background: 'linear-gradient(90deg, #00A896, #00D2C4, #38BDF8)',
            animation: 'loadbar 1.3s ease-in-out forwards',
          }} />
        </div>
        <div style={{ fontSize: '0.65rem', color: 'rgba(245,240,232,0.3)', letterSpacing: '0.15em' }}>
          Initialising AI systems…
        </div>
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.07)} }
        @keyframes loadbar { 0%{width:0%} 100%{width:100%} }
        @keyframes parliamentPan {
          0%   { transform: scale(1.06) translateX(-1%); }
          100% { transform: scale(1.1)  translateX( 1%); }
        }
      `}</style>
    </div>
  )
}

// ── Root App ─────────────────────────────────────────────────
export default function App() {
  const { setAuth, isAuthenticated } = useAuthStore()
  const [booting, setBooting] = useState(!isAuthenticated())

  useEffect(() => {
    if (isAuthenticated()) { setBooting(false); return }

    // Auto-login with demo ministry credentials
    api.post('/auth/login', { usernameOrEmail: 'ministry', password: 'Demo@1234' })
      .then(r => {
        const d = r.data
        setAuth(d.token ?? '', {
          userId:    d.userId,
          username:  d.username,
          fullName:  d.fullName  ?? 'Ministry Admin',
          email:     d.email     ?? 'ministry@sentinel.gov.in',
          role:      d.role      ?? 'MINISTRY',
        })
      })
      .catch(console.error)
      .finally(() => {
        // Show loader for at least 1.4s (matches animation)
        setTimeout(() => setBooting(false), 1400)
      })
  }, [])

  if (booting) return <KavachLoader />

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<Navigate to="/dashboard" replace />} />

        <Route path="/dashboard" element={<AppLayout><DashboardPage /></AppLayout>} />
        <Route path="/projects"  element={<AppLayout><ProjectsPage /></AppLayout>} />
        <Route path="/projects/:id" element={<AppLayout><ProjectDetailPage /></AppLayout>} />
        <Route path="/map"       element={<AppLayout><MapPage /></AppLayout>} />
        <Route path="/anomalies" element={<AppLayout><AnomalyPage /></AppLayout>} />
        <Route path="/photos"    element={<AppLayout><PhotoVerificationPage /></AppLayout>} />

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
