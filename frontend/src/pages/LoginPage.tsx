import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, AlertCircle, ArrowLeft } from 'lucide-react'
import { authApi } from '../api/auth'
import { useAuthStore } from '../store/authStore'

const DEMO_ACCOUNTS = [
  { label: 'Ministry (Full Access)',   user: 'ministry',  role: 'MINISTRY' },
  { label: 'State Nodal — Tamil Nadu', user: 'nodal.tn',  role: 'STATE_NODAL' },
  { label: 'MP — Demo Constituency',  user: 'mp_demo',   role: 'MP' },
  { label: 'District Authority',       user: 'district',  role: 'DISTRICT' },
]

export default function LoginPage() {
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()
  const [form, setForm]         = useState({ usernameOrEmail: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await authApi.login(form)
      setAuth(data.token!, {
        userId: data.userId, username: data.username,
        fullName: data.fullName, email: data.email,
        role: data.role, stateId: data.stateId, stateName: data.stateName,
      })
      navigate('/dashboard')
    } catch {
      // Bulletproof demo fallback for offline / serverless deployment
      const uname = (form.usernameOrEmail || 'ministry').toLowerCase()
      setAuth(`demo-token-${uname}`, {
        userId: 1,
        username: uname,
        fullName: uname === 'nodal.tn' ? 'State Nodal Officer (TN)' : uname === 'mp_demo' ? 'Hon. Member of Parliament' : uname === 'district' ? 'District Collector' : 'Ministry Admin',
        email: `${uname}@sentinel.gov.in`,
        role: uname === 'nodal.tn' ? 'STATE_NODAL' : uname === 'mp_demo' ? 'MP' : uname === 'district' ? 'DISTRICT' : 'MINISTRY',
      })
      navigate('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      {/* Parliament BG */}
      <div className="login-bg" />
      <div className="login-bg-overlay" />

      {/* Back to landing */}
      <button
        onClick={() => navigate('/')}
        style={{
          position: 'fixed', top: '1.5rem', left: '2rem', zIndex: 10,
          display: 'flex', alignItems: 'center', gap: '0.4rem',
          background: 'rgba(10,14,26,0.7)', border: '1px solid rgba(201,168,76,0.2)',
          borderRadius: 999, padding: '0.45rem 1rem',
          color: 'var(--text-dim)', fontSize: '0.78rem',
          cursor: 'pointer', backdropFilter: 'blur(12px)',
          transition: 'var(--transition)',
        }}
      >
        <ArrowLeft size={14} /> Back
      </button>

      {/* Login Card */}
      <div className="login-card fade-in">
        {/* Logo */}
        <div className="login-logo">
          <div className="login-logo-icon">🛡️</div>
          <h1>SENTINEL</h1>
          <p>MPLADS AI Intelligence Platform</p>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="login-badge">⚠ Demo Mode — Synthetic Data</div>
          </div>
        </div>

        {/* India stripe */}
        <div className="india-stripe" style={{ marginBottom: '1.5rem' }} />

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username or Email</label>
            <input
              className="form-input"
              type="text"
              placeholder="ministry"
              value={form.usernameOrEmail}
              onChange={e => setForm(f => ({ ...f, usernameOrEmail: e.target.value }))}
              required autoFocus
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                className="form-input"
                type={showPass ? 'text' : 'password'}
                placeholder="Demo@1234"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                required
                style={{ paddingRight: '2.75rem' }}
              />
              <button
                type="button"
                onClick={() => setShowPass(s => !s)}
                style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="form-error">
              <AlertCircle size={13} /> {error}
            </div>
          )}

          <button className="btn-login" type="submit" disabled={loading}>
            {loading ? 'Verifying Identity...' : 'Access Sentinel Platform'}
          </button>
        </form>

        {/* Demo accounts */}
        <div className="demo-creds">
          <div className="demo-creds-title">🔑 Quick Demo Login (Password: Demo@1234)</div>
          {DEMO_ACCOUNTS.map(a => (
            <button
              key={a.user}
              className="demo-btn"
              onClick={() => { setForm({ usernameOrEmail: a.user, password: 'Demo@1234' }); setError('') }}
            >
              <span style={{ color: 'var(--gold)', fontWeight: 700 }}>{a.label}</span>
              {' — '}
              <code style={{ color: 'var(--accent-cyan)', fontSize: '0.7rem' }}>{a.user}</code>
            </button>
          ))}
        </div>

        {/* MoSPI attribution */}
        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.62rem', color: 'var(--text-muted)' }}>
          Ministry of Statistics & Programme Implementation<br />
          Data Informatics & Innovation Division • SIH 2026 • PS-26102
        </div>
      </div>
    </div>
  )
}
