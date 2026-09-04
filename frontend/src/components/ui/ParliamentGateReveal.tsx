import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Shield, Landmark, Zap, MapPin, Clock, Users,
  ShieldCheck, Activity, Eye, ChevronDown, Award
} from 'lucide-react'

export default function ParliamentGateReveal() {
  const navigate = useNavigate()
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [manualOpen, setManualOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const totalScroll = containerRef.current.offsetHeight - window.innerHeight
      if (totalScroll <= 0) return

      // Progress 0 when top of container reaches top of viewport, 1 when bottom reaches bottom
      const current = -rect.top
      const progress = Math.min(Math.max(current / totalScroll, 0), 1)
      setScrollProgress(progress)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Eased progress for smooth door parting
  const doorProgress = Math.min(Math.max((scrollProgress - 0.05) / 0.85, 0), 1)
  // Smooth cubic ease-in-out
  const easedProgress = doorProgress < 0.5
    ? 2 * doorProgress * doorProgress
    : 1 - Math.pow(-2 * doorProgress + 2, 2) / 2

  // Combine scroll progress and manual click trigger
  const effectiveProgress = manualOpen ? 1 : easedProgress

  const leftDoorTranslate = -effectiveProgress * 105
  const rightDoorTranslate = effectiveProgress * 105
  const sealScale = Math.max(1 - effectiveProgress * 1.3, 0)
  const sealOpacity = Math.max(1 - effectiveProgress * 1.6, 0)

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        height: '240vh',
        background: 'linear-gradient(180deg, #D4F7F2 0%, #0F172A 12%, #0A1424 88%, #F5FCFB 100%)',
      }}
    >
      {/* Sticky Viewport Container */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          width: '100%',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* ================================================================
            LAYER 1: REVEALED INNER CORE (The Autonomous AI Neural Sentinel)
            ================================================================ */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse 80% 65% at 50% 50%, #0D233A 0%, #071322 60%, #040912 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            textAlign: 'center',
            zIndex: 1,
          }}
        >
          {/* Radar Scanner Concentric Circles */}
          <div
            style={{
              position: 'absolute',
              width: 760,
              height: 760,
              borderRadius: '50%',
              border: '1.5px solid rgba(0, 168, 150, 0.18)',
              pointerEvents: 'none',
              animation: 'metro-pulse 3.5s infinite ease-out',
            }}
          />
          <div
            style={{
              position: 'absolute',
              width: 520,
              height: 520,
              borderRadius: '50%',
              border: '1px dashed rgba(0, 210, 196, 0.3)',
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              width: 280,
              height: 280,
              borderRadius: '50%',
              border: '1px solid rgba(0, 168, 150, 0.25)',
              pointerEvents: 'none',
            }}
          />

          {/* Central Metaphor Reveal Content */}
          <div style={{ maxWidth: 940, zIndex: 2 }}>
            {/* Top Security Clearance Tag */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.45rem 1.4rem',
                borderRadius: 999,
                background: 'rgba(0, 168, 150, 0.20)',
                border: '1.5px solid rgba(0, 210, 196, 0.5)',
                color: '#00D2C4',
                fontSize: '0.76rem',
                fontWeight: 800,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                marginBottom: '1.25rem',
                boxShadow: '0 0 25px rgba(0, 168, 150, 0.25)',
              }}
            >
              <Activity size={14} className="animate-spin" />
              Inside the National Sentinel • Autonomous AI Radar
            </div>

            {/* Powerful Metaphor Headline */}
            <h2
              style={{
                fontSize: 'clamp(2.1rem, 4.2vw, 3.4rem)',
                fontWeight: 900,
                color: '#FFFFFF',
                lineHeight: 1.14,
                letterSpacing: '-0.02em',
                margin: '0 0 1.15rem',
              }}
            >
              Behind the Democratic Facade:<br />
              <span
                style={{
                  background: 'linear-gradient(90deg, #00D2C4, #38BDF8)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                The Autonomous AI Sentinel
              </span>
            </h2>

            {/* Clear Metaphor Explanation */}
            <p
              style={{
                fontSize: '1.05rem',
                color: '#CBD5E1',
                lineHeight: 1.75,
                maxWidth: 760,
                margin: '0 auto 2.25rem',
              }}
            >
              While laws and <strong>₹83,180 Crore</strong> are democratically sanctioned within the halls of Parliament, <strong>KAVACH</strong> operates continuously behind the scenes — traversing 543 Lok Sabha constituencies to intercept cost outliers, duplicate geotags, and stalled milestones in real time.
            </p>

            {/* 4 Multi-Signal Live Telemetry Pills */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '1.1rem',
                marginBottom: '2.5rem',
                textAlign: 'left',
              }}
            >
              {[
                { icon: Zap, label: 'Cost Z-Score Radar', val: '≥ 2.5σ Cutoff', col: '#00D2C4' },
                { icon: MapPin, label: 'Haversine Shield', val: '< 50m Proximity', col: '#38BDF8' },
                { icon: Clock, label: 'Stagnation Tracker', val: '> 90d Dormancy', col: '#F59E0B' },
                { icon: Users, label: 'Vendor Cartel Index', val: '> 70% Monopoly', col: '#10B981' },
              ].map((sig, i) => {
                const Icon = sig.icon
                return (
                  <div
                    key={i}
                    style={{
                      background: 'rgba(13, 31, 56, 0.88)',
                      border: '1.5px solid rgba(0, 168, 150, 0.3)',
                      borderRadius: 16,
                      padding: '1.1rem',
                      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.4)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.4rem' }}>
                      <Icon size={15} color={sig.col} />
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94A3B8' }}>{sig.label}</span>
                    </div>
                    <div style={{ fontSize: '0.98rem', fontWeight: 900, color: '#fff', fontFamily: 'monospace' }}>
                      {sig.val}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => navigate('/dashboard')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  padding: '0.95rem 2.75rem',
                  borderRadius: 999,
                  background: 'linear-gradient(135deg, #00A896, #00D2C4)',
                  border: 'none',
                  color: '#07101E',
                  fontSize: '0.94rem',
                  fontWeight: 900,
                  cursor: 'pointer',
                  boxShadow: '0 10px 35px rgba(0, 168, 150, 0.5)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 14px 40px rgba(0, 168, 150, 0.65)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 10px 35px rgba(0, 168, 150, 0.5)'
                }}
              >
                <Eye size={17} />
                Inspect Neural Core in Command Console →
              </button>

              {manualOpen && (
                <button
                  onClick={() => setManualOpen(false)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.95rem 1.8rem',
                    borderRadius: 999,
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1.5px solid rgba(255, 255, 255, 0.3)',
                    color: '#FFFFFF',
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Close Parliament Gates ↺
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ================================================================
            LAYER 2: THE SPLIT PARLIAMENTARY FACADE GATES (Outer Curtains)
            Classical Ivory/Marble Colonnade Facade
            ================================================================ */}

        {/* LEFT DOOR: Western Parliamentary Colonnade */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            width: '50%',
            background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 45%, #F1F5F9 100%)',
            borderRight: '3px solid #00A896',
            boxShadow: '18px 0 50px rgba(15, 23, 42, 0.35), inset -6px 0 25px rgba(0, 168, 150, 0.15)',
            transform: `translateX(${leftDoorTranslate}%)`,
            transition: 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '4.5rem 3.5rem',
            overflow: 'hidden',
          }}
        >
          {/* Architectural Colonnade Shadow Pillars */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'repeating-linear-gradient(90deg, rgba(0,168,150,0.03) 0px, rgba(0,168,150,0.03) 48px, rgba(15,23,42,0.04) 48px, rgba(15,23,42,0.04) 96px)',
              pointerEvents: 'none',
            }}
          />

          {/* Left Door Header */}
          <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
              <div style={{
                width: 34, height: 34, borderRadius: 10,
                background: 'rgba(0, 168, 150, 0.12)', border: '1px solid rgba(0, 168, 150, 0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Landmark size={18} color="#00A896" />
              </div>
              <span style={{ fontSize: '0.78rem', fontWeight: 800, letterSpacing: '0.15em', color: '#00A896', textTransform: 'uppercase' }}>
                House of the People • Lok Sabha
              </span>
            </div>
            <h3 style={{ fontSize: '2.1rem', fontWeight: 900, color: '#0F172A', margin: '0 0 0.5rem', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
              The Sovereign Gates<br />of Parliament
            </h3>
            <p style={{ fontSize: '0.92rem', color: '#475569', margin: 0, fontWeight: 500 }}>
              Democratic Sanction for 543 Parliamentary Constituencies
            </p>
          </div>

          {/* Left Door Technical Readout */}
          <div
            style={{
              position: 'relative',
              zIndex: 2,
              background: '#FFFFFF',
              padding: '1.35rem 1.5rem',
              borderRadius: 18,
              border: '1.5px solid rgba(0, 168, 150, 0.25)',
              boxShadow: '0 10px 25px rgba(0, 168, 150, 0.08)',
              maxWidth: 380,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <Award size={15} color="#00A896" />
              <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#00A896', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Statutory Authority
              </span>
            </div>
            <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#0F172A', marginTop: '0.15rem' }}>
              ₹83,180 Crore Outlay
            </div>
            <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '0.3rem', fontWeight: 600 }}>
              Single Nodal Agency (SNA) Fiscal Mandate
            </div>
          </div>
        </div>

        {/* RIGHT DOOR: Eastern Parliamentary Colonnade */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            width: '50%',
            background: 'linear-gradient(225deg, #FFFFFF 0%, #F8FAFC 45%, #F1F5F9 100%)',
            borderLeft: '3px solid #00A896',
            boxShadow: '-18px 0 50px rgba(15, 23, 42, 0.35), inset 6px 0 25px rgba(0, 168, 150, 0.15)',
            transform: `translateX(${rightDoorTranslate}%)`,
            transition: 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            textAlign: 'right',
            padding: '4.5rem 3.5rem',
            overflow: 'hidden',
          }}
        >
          {/* Architectural Colonnade Shadow Pillars */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'repeating-linear-gradient(90deg, rgba(15,23,42,0.04) 0px, rgba(15,23,42,0.04) 48px, rgba(0,168,150,0.03) 48px, rgba(0,168,150,0.03) 96px)',
              pointerEvents: 'none',
            }}
          />

          {/* Right Door Header */}
          <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.6rem', marginBottom: '0.6rem' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 800, letterSpacing: '0.15em', color: '#00A896', textTransform: 'uppercase' }}>
                MoSPI Vigilance Protocol
              </span>
              <div style={{
                width: 34, height: 34, borderRadius: 10,
                background: 'rgba(0, 168, 150, 0.12)', border: '1px solid rgba(0, 168, 150, 0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <ShieldCheck size={18} color="#00A896" />
              </div>
            </div>
            <h3 style={{ fontSize: '2.1rem', fontWeight: 900, color: '#0F172A', margin: '0 0 0.5rem', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
              The Sentinel AI<br />Inspection Barrier
            </h3>
            <p style={{ fontSize: '0.92rem', color: '#475569', margin: 0, fontWeight: 500 }}>
              Station ST-06: Pre-Disbursement Verification Gate
            </p>
          </div>

          {/* Right Door Technical Readout */}
          <div
            style={{
              position: 'relative',
              zIndex: 2,
              background: '#FFFFFF',
              padding: '1.35rem 1.5rem',
              borderRadius: 18,
              border: '1.5px solid rgba(0, 168, 150, 0.25)',
              boxShadow: '0 10px 25px rgba(0, 168, 150, 0.08)',
              minWidth: 320,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#10B981', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Security Status
              </span>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981' }} />
            </div>
            <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#0F172A', marginTop: '0.15rem' }}>
              4-Signal Shield Active
            </div>
            <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '0.3rem', fontWeight: 600 }}>
              Scroll down or click to part the gates
            </div>
          </div>
        </div>

        {/* CENTRAL ASHOKA / KAVACH STATUTORY SEAL (Splits open with scale & fade) */}
        {sealOpacity > 0.04 && (
          <div
            onClick={() => setManualOpen(m => !m)}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: `translate(-50%, -50%) scale(${sealScale})`,
              zIndex: 20,
              cursor: 'pointer',
              pointerEvents: 'auto',
              transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
              opacity: sealOpacity,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {/* Circular Glowing Seal */}
            <div
              style={{
                width: 150,
                height: 150,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #FFFFFF, #F8FAFC)',
                border: '3.5px solid #00A896',
                boxShadow: '0 15px 45px rgba(0, 168, 150, 0.35), 0 4px 16px rgba(15, 23, 42, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.15rem',
                transition: 'transform 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.06)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <Shield size={70} color="#00A896" strokeWidth={2.3} />
            </div>

            {/* Scroll Indicator Prompt */}
            <div
              style={{
                padding: '0.55rem 1.6rem',
                borderRadius: 999,
                background: '#0F172A',
                border: '1.5px solid #00A896',
                color: '#00D2C4',
                fontSize: '0.78rem',
                fontWeight: 900,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                display: 'flex',
                alignItems: 'center',
                gap: '0.55rem',
                boxShadow: '0 6px 25px rgba(15, 23, 42, 0.4)',
                transition: 'transform 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              <span>Click or Scroll to Part Gates</span>
              <ChevronDown size={16} className="animate-bounce" />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
