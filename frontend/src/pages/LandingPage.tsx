import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import parliamentImg from '../assets/parliament.jpg'

/* ─── Kavach Loading Screen ──────────────────────────────────────────────── */
function KavachLoader({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<'shield' | 'text' | 'exit'>('shield')

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('text'),   900)
    const t2 = setTimeout(() => setPhase('exit'),  2600)
    const t3 = setTimeout(() => onDone(),           3300)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [onDone])

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: '#0a0a0a',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      transition: 'opacity 0.6s ease, transform 0.6s ease',
      opacity: phase === 'exit' ? 0 : 1,
      transform: phase === 'exit' ? 'scale(1.04)' : 'scale(1)',
    }}>
      {/* Animated shield */}
      <div style={{
        position: 'relative',
        width: 120, height: 120,
        marginBottom: '1.5rem',
      }}>
        {/* Outer ring pulse */}
        <div style={{
          position: 'absolute', inset: -16,
          borderRadius: '50%',
          border: '2px solid rgba(200,149,44,0.3)',
          animation: 'kavach-pulse 1.4s ease-out infinite',
        }} />
        <div style={{
          position: 'absolute', inset: -8,
          borderRadius: '50%',
          border: '1px solid rgba(200,149,44,0.15)',
          animation: 'kavach-pulse 1.4s ease-out 0.3s infinite',
        }} />
        {/* Shield SVG */}
        <svg viewBox="0 0 100 120" width="120" height="120" style={{
          filter: 'drop-shadow(0 0 20px rgba(200,149,44,0.6))',
          animation: 'kavach-shield-in 0.8s cubic-bezier(0.34,1.56,0.64,1) forwards',
          opacity: 0,
        }}>
          <defs>
            <linearGradient id="sg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%"   stopColor="#C8952C" />
              <stop offset="100%" stopColor="#FF6600" />
            </linearGradient>
            <linearGradient id="sg2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="rgba(255,255,255,0.15)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>
          </defs>
          <path d="M50 5 L90 20 L90 55 Q90 85 50 110 Q10 85 10 55 L10 20 Z"
            fill="url(#sg)" />
          <path d="M50 5 L90 20 L90 55 Q90 85 50 110 Q10 85 10 55 L10 20 Z"
            fill="url(#sg2)" />
          {/* K letter */}
          <text x="50" y="72" textAnchor="middle"
            fontFamily="'Bebas Neue',sans-serif"
            fontSize="46" fill="white" fontWeight="700"
            style={{ letterSpacing: '-1px' }}>K</text>
        </svg>
      </div>

      {/* KAVACH text */}
      <div style={{
        overflow: 'hidden',
        transition: 'max-height 0.6s ease, opacity 0.6s ease',
        maxHeight: phase === 'shield' ? 0 : 120,
        opacity: phase === 'shield' ? 0 : 1,
      }}>
        <h1 style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 'clamp(3rem, 8vw, 5rem)',
          letterSpacing: '0.25em',
          background: 'linear-gradient(135deg, #C8952C 0%, #FF6600 50%, #FFD700 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          margin: 0, lineHeight: 1,
          animation: 'kavach-text-in 0.5s ease forwards',
        }}>KAVACH 2.0</h1>
        <p style={{
          textAlign: 'center', fontSize: '0.75rem', letterSpacing: '0.3em',
          color: 'rgba(255,255,255,0.4)', margin: '0.5rem 0 0', textTransform: 'uppercase',
        }}>Guarding Every Rupee</p>
      </div>

      {/* Loading bar */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 3,
        background: 'rgba(200,149,44,0.15)',
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          background: 'linear-gradient(90deg, #C8952C, #FF6600)',
          animation: 'kavach-bar 2.5s ease forwards',
        }} />
      </div>
    </div>
  )
}

/* ─── Intersection Observer Hook ─────────────────────────────────────────── */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.15 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return { ref, visible }
}

/* ─── Feature Card ───────────────────────────────────────────────────────── */
const FEATURES = [
  {
    icon: '🛡️',
    title: 'Financial Anomaly Detection',
    subtitle: 'Isolation Forest AI',
    desc: 'Detects payment spikes, fund over-utilization, and irregular expenditure patterns across 558+ MPLADS projects in real-time.',
    stats: [{ label: 'Accuracy', value: '97%' }, { label: 'Projects Scored', value: '558' }, { label: 'Anomalies Found', value: '39' }],
    color: '#ef4444',
    gradient: 'linear-gradient(135deg, rgba(239,68,68,0.12), rgba(239,68,68,0.02))',
  },
  {
    icon: '📊',
    title: 'Delay & Cost Prediction',
    subtitle: 'XGBoost Classifier',
    desc: 'Predicts project delays and cost overruns with 99.2% confidence using SHAP explainability — tells you exactly which factor drives the risk.',
    stats: [{ label: 'Confidence', value: '99.2%' }, { label: 'Features Used', value: '11' }, { label: 'Model', value: 'XGBoost' }],
    color: '#f59e0b',
    gradient: 'linear-gradient(135deg, rgba(245,158,11,0.12), rgba(245,158,11,0.02))',
  },
  {
    icon: '🔍',
    title: 'Duplicate Project Detection',
    subtitle: 'Sentence Transformers',
    desc: 'Semantic NLP similarity scan across project names and descriptions. Detects double-billing for the same work across different entries.',
    stats: [{ label: 'Engine', value: 'NLP' }, { label: 'Threshold', value: '75%' }, { label: 'Geo Check', value: '2 km' }],
    color: '#8b5cf6',
    gradient: 'linear-gradient(135deg, rgba(139,92,246,0.12), rgba(139,92,246,0.02))',
  },
  {
    icon: '📸',
    title: 'Photo Verification',
    subtitle: 'EXIF GPS + Timestamp',
    desc: 'Validates completion photos by comparing GPS coordinates with project location and checking timestamps against sanction dates.',
    stats: [{ label: 'GPS Tolerance', value: '2 km' }, { label: 'Timestamp', value: 'Pre-date' }, { label: 'Duplicate', value: 'Hash check' }],
    color: '#10b981',
    gradient: 'linear-gradient(135deg, rgba(16,185,129,0.12), rgba(16,185,129,0.02))',
  },
  {
    icon: '🗺️',
    title: 'Geo-tagged Risk Map',
    subtitle: 'Leaflet + PostGIS',
    desc: 'Live choropleth map of all 558 projects coloured by risk level. Cluster view, drill-down, and satellite toggle for field verification.',
    stats: [{ label: 'Projects', value: '558' }, { label: 'States', value: '28+' }, { label: 'Layers', value: '4' }],
    color: '#3b82f6',
    gradient: 'linear-gradient(135deg, rgba(59,130,246,0.12), rgba(59,130,246,0.02))',
  },
  {
    icon: '📄',
    title: 'PDF Investigation Report',
    subtitle: 'ReportLab Generator',
    desc: 'One-click official investigation report with risk scores, financial summary, AI findings, and recommendations. Ready for DVC submission.',
    stats: [{ label: 'Format', value: 'A4 PDF' }, { label: 'Sections', value: '6' }, { label: 'Style', value: 'GoI' }],
    color: '#C8952C',
    gradient: 'linear-gradient(135deg, rgba(200,149,44,0.12), rgba(200,149,44,0.02))',
  },
]

function FeatureCard({ f, index }: { f: typeof FEATURES[0]; index: number }) {
  const { ref, visible } = useReveal()
  return (
    <div ref={ref} style={{
      background: f.gradient,
      border: `1px solid ${f.color}25`,
      borderRadius: 20,
      padding: '2rem',
      transition: 'all 0.6s cubic-bezier(0.34,1.2,0.64,1)',
      transitionDelay: `${index * 0.08}s`,
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0) scale(1)' : 'translateY(48px) scale(0.96)',
      cursor: 'default',
      position: 'relative', overflow: 'hidden',
    }}
    onMouseEnter={e => {
      const el = e.currentTarget as HTMLElement
      el.style.transform = 'translateY(-4px) scale(1.01)'
      el.style.boxShadow = `0 20px 60px ${f.color}20`
      el.style.borderColor = `${f.color}50`
    }}
    onMouseLeave={e => {
      const el = e.currentTarget as HTMLElement
      el.style.transform = 'translateY(0) scale(1)'
      el.style.boxShadow = 'none'
      el.style.borderColor = `${f.color}25`
    }}>
      {/* Glow blob */}
      <div style={{
        position: 'absolute', top: -40, right: -40,
        width: 120, height: 120, borderRadius: '50%',
        background: f.color, filter: 'blur(60px)', opacity: 0.08,
        pointerEvents: 'none',
      }} />

      <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{f.icon}</div>

      <div style={{
        fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.15em',
        color: f.color, textTransform: 'uppercase', marginBottom: '0.4rem',
      }}>{f.subtitle}</div>

      <h3 style={{
        fontFamily: "'Outfit', sans-serif",
        fontSize: '1.15rem', fontWeight: 700,
        color: '#fff', margin: '0 0 0.75rem',
      }}>{f.title}</h3>

      <p style={{
        fontSize: '0.85rem', color: 'rgba(255,255,255,0.55)',
        lineHeight: 1.7, margin: '0 0 1.25rem',
      }}>{f.desc}</p>

      {/* Stats row */}
      <div style={{ display: 'flex', gap: '1rem', borderTop: `1px solid ${f.color}15`, paddingTop: '1rem' }}>
        {f.stats.map((s, i) => (
          <div key={i} style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: f.color, fontFamily: "'Outfit', sans-serif" }}>{s.value}</div>
            <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── How It Works step ──────────────────────────────────────────────────── */
const STEPS = [
  { num: '01', title: 'Data Ingestion', desc: 'MPLADS project data from Lok Sabha portal mapped to financial, geographic, and progress records.', icon: '📥' },
  { num: '02', title: 'Feature Engineering', desc: '11 risk signals computed: utilization %, cost ratio, payment spike, progress gap, timeline overrun.', icon: '⚙️' },
  { num: '03', title: 'AI Scoring', desc: 'Isolation Forest + XGBoost + NLP + EXIF engines run in parallel. Results composed into a 0–100 risk score.', icon: '🤖' },
  { num: '04', title: 'Alert & Report', desc: 'High-risk projects surface on the dashboard. One-click PDF investigation report generated for DVC submission.', icon: '📋' },
]

function StepCard({ s, index }: { s: typeof STEPS[0]; index: number }) {
  const { ref, visible } = useReveal()
  return (
    <div ref={ref} style={{
      display: 'flex', gap: '1.5rem', alignItems: 'flex-start',
      transition: 'all 0.7s ease',
      transitionDelay: `${index * 0.12}s`,
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateX(0)' : 'translateX(-40px)',
    }}>
      <div style={{
        width: 52, height: 52, borderRadius: 14, flexShrink: 0,
        background: 'linear-gradient(135deg,#C8952C22,#FF660011)',
        border: '1px solid rgba(200,149,44,0.3)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.5rem',
      }}>{s.icon}</div>
      <div>
        <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '0.85rem', color: 'rgba(200,149,44,0.6)', letterSpacing: '0.1em' }}>STEP {s.num}</div>
        <h4 style={{ margin: '0.2rem 0 0.4rem', fontSize: '1rem', fontWeight: 700, color: '#fff' }}>{s.title}</h4>
        <p style={{ margin: 0, fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.65 }}>{s.desc}</p>
      </div>
    </div>
  )
}

/* ─── Stat counter ───────────────────────────────────────────────────────── */
function StatBadge({ value, label, color }: { value: string; label: string; color: string }) {
  const { ref, visible } = useReveal()
  return (
    <div ref={ref} style={{
      textAlign: 'center',
      transition: 'all 0.6s ease',
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(24px)',
    }}>
      <div style={{
        fontFamily: "'Bebas Neue',sans-serif",
        fontSize: 'clamp(2rem, 5vw, 3.5rem)',
        color, lineHeight: 1,
        textShadow: `0 0 30px ${color}40`,
      }}>{value}</div>
      <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: '0.25rem' }}>{label}</div>
    </div>
  )
}

/* ─── Diagram Item (pipeline visual) ─────────────────────────────────────── */
function DiagramItem({ label, index }: { label: string; index: number }) {
  const { ref, visible } = useReveal()
  const emoji = label.split(' ')[0]
  const text  = label.split(' ').slice(1).join(' ')
  return (
    <div ref={ref} style={{
      width: '100%', maxWidth: 300,
      background: 'linear-gradient(135deg, rgba(200,149,44,0.1), rgba(200,149,44,0.04))',
      border: '1px solid rgba(200,149,44,0.2)',
      borderRadius: 14, padding: '1rem 1.5rem',
      display: 'flex', alignItems: 'center', gap: '1rem',
      transition: 'all 0.5s ease',
      transitionDelay: `${index * 0.15}s`,
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateX(0)' : 'translateX(40px)',
      animation: visible ? `float-y 4s ease ${index * 0.5}s infinite` : 'none',
    }}>
      <span style={{ fontSize: '1.5rem' }}>{emoji}</span>
      <span style={{ fontWeight: 600, color: '#fff', fontSize: '0.9rem' }}>{text}</span>
      {index < 3 && <span style={{ marginLeft: 'auto', color: '#C8952C', fontSize: '1.2rem' }}>↓</span>}
    </div>
  )
}

/* ─── Tech Stack Card ────────────────────────────────────────────────────── */
function TechCard({ layer, items, color }: { layer: string; items: string[]; color: string }) {
  const { ref, visible } = useReveal()
  return (
    <div ref={ref} style={{
      background: `linear-gradient(135deg, ${color}12, ${color}04)`,
      border: `1px solid ${color}20`,
      borderRadius: 18, padding: '2rem',
      transition: 'all 0.6s ease',
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(32px)',
    }}>
      <div style={{ color, fontWeight: 700, letterSpacing: '0.1em', fontSize: '0.7rem', textTransform: 'uppercase', marginBottom: '1rem' }}>{layer}</div>
      {items.map((item, ii) => (
        <div key={ii} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.4rem 0', borderBottom: ii < items.length - 1 ? `1px solid ${color}10` : 'none' }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: color, flexShrink: 0 }} />
          <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>{item}</span>
        </div>
      ))}
    </div>
  )
}

/* ─── Main Landing Page ──────────────────────────────────────────────────── */
export default function LandingPage() {
  const navigate = useNavigate()
  const [loaded, setLoaded] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const heroRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const heroOpacity = Math.max(0, 1 - scrollY / 500)
  const heroPush    = scrollY * 0.35

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@400;500;600;700;800&display=swap');

        @keyframes kavach-shield-in {
          from { opacity:0; transform: scale(0.4) rotate(-20deg); }
          to   { opacity:1; transform: scale(1) rotate(0deg); }
        }
        @keyframes kavach-text-in {
          from { opacity:0; transform: translateY(12px) skewX(-4deg); }
          to   { opacity:1; transform: translateY(0) skewX(0); }
        }
        @keyframes kavach-pulse {
          0%   { transform: scale(1);    opacity: 1; }
          100% { transform: scale(1.6);  opacity: 0; }
        }
        @keyframes kavach-bar {
          from { width: 0; }
          to   { width: 100%; }
        }
        @keyframes float-y {
          0%,100% { transform: translateY(0); }
          50%     { transform: translateY(-12px); }
        }
        @keyframes scroll-bounce {
          0%,100% { transform: translateY(0); opacity: 0.6; }
          50%     { transform: translateY(6px); opacity: 1; }
        }
        @keyframes stripe-slide {
          from { transform: translateX(-100%); }
          to   { transform: translateX(100%); }
        }
        @keyframes hero-fade-in {
          from { opacity:0; transform: translateY(30px); }
          to   { opacity:1; transform: translateY(0); }
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0a0a0a; color: #fff; font-family: 'Outfit', sans-serif; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #111; }
        ::-webkit-scrollbar-thumb { background: rgba(200,149,44,0.4); border-radius: 2px; }
      `}</style>

      {/* ── Kavach Loader ── */}
      {!loaded && <KavachLoader onDone={() => setLoaded(true)} />}

      {/* ── Navbar ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '1rem 3rem',
        background: scrollY > 60 ? 'rgba(10,10,10,0.92)' : 'transparent',
        backdropFilter: scrollY > 60 ? 'blur(20px)' : 'none',
        borderBottom: scrollY > 60 ? '1px solid rgba(200,149,44,0.1)' : 'none',
        transition: 'all 0.4s ease',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{ fontSize: '1.4rem' }}>🛡️</span>
          <div>
            <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '1.3rem', color: '#C8952C', letterSpacing: '0.05em' }}>KAVACH</span>
            <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '1.3rem', color: '#fff', letterSpacing: '0.05em' }}> 2.0</span>
            <div style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>MPLADS Sentinel · SIH 2026</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
          {['Features', 'How It Works', 'Technology'].map(item => (
            <button key={item} onClick={() => {
              if (item === 'Features') featuresRef.current?.scrollIntoView({ behavior: 'smooth' })
              else if (item === 'How It Works') document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })
              else document.getElementById('tech')?.scrollIntoView({ behavior: 'smooth' })
            }} style={{
              background: 'none', border: 'none', color: 'rgba(255,255,255,0.65)',
              fontSize: '0.88rem', cursor: 'pointer', fontFamily: "'Outfit',sans-serif",
              fontWeight: 500, transition: 'color 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#C8952C')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.65)')}
            >{item}</button>
          ))}
          <button
            onClick={() => navigate('/login')}
            style={{
              background: 'linear-gradient(135deg,#C8952C,#FF6600)',
              border: 'none', borderRadius: 50, color: '#fff',
              padding: '0.55rem 1.5rem', fontSize: '0.85rem',
              fontFamily: "'Outfit',sans-serif", fontWeight: 700,
              cursor: 'pointer', letterSpacing: '0.02em',
              boxShadow: '0 4px 20px rgba(200,149,44,0.35)',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.04)'; e.currentTarget.style.boxShadow = '0 6px 30px rgba(200,149,44,0.55)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(200,149,44,0.35)' }}
          >Access Platform →</button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <div ref={heroRef} style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
        {/* Parliament BG */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${parliamentImg})`,
          backgroundSize: 'cover', backgroundPosition: 'center top',
          transform: `translateY(${heroPush}px) scale(1.08)`,
          transition: 'none',
          filter: 'brightness(0.45)',
        }} />

        {/* Gradient overlays */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #0a0a0a 0%, rgba(10,10,10,0.3) 50%, rgba(10,10,10,0.1) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(200,149,44,0.08) 0%, transparent 70%)' }} />

        {/* India flag stripe */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3 }}>
          <div style={{ height: '33%', background: '#FF6600' }} />
          <div style={{ height: '33%', background: '#fff' }} />
          <div style={{ height: '34%', background: '#138808' }} />
        </div>

        {/* Hero content */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          textAlign: 'center', padding: '0 2rem',
          opacity: heroOpacity,
          animation: loaded ? 'hero-fade-in 1s ease 0.2s both' : 'none',
        }}>
          <div style={{ fontSize: '0.7rem', letterSpacing: '0.3em', color: '#C8952C', textTransform: 'uppercase', marginBottom: '1.25rem', fontWeight: 600 }}>
            Smart India Hackathon 2026 · Problem Statement 26102
          </div>

          <h1 style={{ fontFamily: "'Bebas Neue',sans-serif", lineHeight: 0.9, marginBottom: '1.5rem' }}>
            <span style={{ display: 'block', fontSize: 'clamp(4rem, 12vw, 9rem)', color: '#fff', letterSpacing: '0.02em' }}>GUARDING</span>
            <span style={{ display: 'block', fontSize: 'clamp(4rem, 12vw, 9rem)', letterSpacing: '0.02em' }}>
              <span style={{ color: '#C8952C' }}>EVERY </span>
              <span style={{ color: '#FF6600' }}>RUPEE</span>
            </span>
          </h1>

          <p style={{ fontSize: 'clamp(0.85rem, 2vw, 1rem)', color: 'rgba(255,255,255,0.6)', marginBottom: '2.5rem', lineHeight: 1.7, maxWidth: 540 }}>
            AI-powered anomaly detection for MPLADS scheme implementation<br />
            Protecting public funds · Accelerating transparency · MoSPI DIID
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button onClick={() => featuresRef.current?.scrollIntoView({ behavior: 'smooth' })}
              style={{
                background: 'linear-gradient(135deg,#C8952C,#FF6600)',
                border: 'none', borderRadius: 50, color: '#fff',
                padding: '0.85rem 2.5rem', fontSize: '0.95rem',
                fontFamily: "'Outfit',sans-serif", fontWeight: 700,
                cursor: 'pointer', letterSpacing: '0.02em',
                boxShadow: '0 4px 30px rgba(200,149,44,0.4)',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 8px 40px rgba(200,149,44,0.6)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 30px rgba(200,149,44,0.4)' }}
            >Explore Features →</button>

            <button onClick={() => navigate('/login')}
              style={{
                background: 'transparent',
                border: '1.5px solid rgba(255,255,255,0.25)',
                borderRadius: 50, color: '#fff',
                padding: '0.85rem 2.5rem', fontSize: '0.95rem',
                fontFamily: "'Outfit',sans-serif", fontWeight: 600,
                cursor: 'pointer', backdropFilter: 'blur(10px)',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(200,149,44,0.6)'; e.currentTarget.style.background = 'rgba(200,149,44,0.08)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; e.currentTarget.style.background = 'transparent' }}
            >Launch Platform</button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem',
          opacity: Math.max(0, 1 - scrollY / 200),
        }}>
          <div style={{ width: 24, height: 38, borderRadius: 12, border: '2px solid rgba(200,149,44,0.5)', display: 'flex', justifyContent: 'center', paddingTop: 6 }}>
            <div style={{ width: 3, height: 8, background: '#C8952C', borderRadius: 2, animation: 'scroll-bounce 1.8s ease infinite' }} />
          </div>
          <span style={{ fontSize: '0.6rem', letterSpacing: '0.25em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase' }}>SCROLL</span>
        </div>
      </div>

      {/* ── Stats Band ── */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(200,149,44,0.06), rgba(255,102,0,0.04))',
        borderTop: '1px solid rgba(200,149,44,0.1)',
        borderBottom: '1px solid rgba(200,149,44,0.1)',
        padding: '3rem 2rem',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Animated shimmer stripe */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(200,149,44,0.04), transparent)',
          animation: 'stripe-slide 4s ease infinite',
        }} />
        <div style={{
          maxWidth: 1000, margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '2rem',
        }}>
          <StatBadge value="558" label="Projects Monitored" color="#C8952C" />
          <StatBadge value="231" label="MPs Covered" color="#FF6600" />
          <StatBadge value="97%" label="Model Accuracy" color="#10b981" />
          <StatBadge value="6" label="AI Engines" color="#8b5cf6" />
          <StatBadge value="39" label="Anomalies Found" color="#ef4444" />
        </div>
      </div>

      {/* ── Features Grid ── */}
      <section ref={featuresRef} style={{ padding: '6rem 2rem', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div style={{ fontSize: '0.7rem', letterSpacing: '0.3em', color: '#C8952C', textTransform: 'uppercase', marginBottom: '0.75rem', fontWeight: 600 }}>AI-Powered Engines</div>
          <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 'clamp(2.5rem, 6vw, 4rem)', color: '#fff', letterSpacing: '0.03em', marginBottom: '1rem' }}>
            6 DETECTION SYSTEMS
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '1rem', maxWidth: 500, margin: '0 auto', lineHeight: 1.7 }}>
            End-to-end fraud detection pipeline — from raw data to actionable risk scores
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {FEATURES.map((f, i) => <FeatureCard key={i} f={f} index={i} />)}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" style={{ padding: '6rem 2rem', background: 'rgba(255,255,255,0.015)', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.3em', color: '#C8952C', textTransform: 'uppercase', marginBottom: '0.75rem', fontWeight: 600 }}>Pipeline</div>
            <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: '#fff', letterSpacing: '0.03em', marginBottom: '2.5rem' }}>
              HOW IT WORKS
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {STEPS.map((s, i) => <StepCard key={i} s={s} index={i} />)}
            </div>
          </div>

          {/* Visual diagram */}
          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
            {['📥 Data Ingestion', '⚙️ Feature Engineering', '🤖 AI Models', '📋 Investigation Report'].map((label, i) => (
              <DiagramItem key={i} label={label} index={i} />
            ))}
          </div>

        </div>
      </section>

      {/* ── Technology Stack ── */}
      <section id="tech" style={{ padding: '6rem 2rem', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div style={{ fontSize: '0.7rem', letterSpacing: '0.3em', color: '#C8952C', textTransform: 'uppercase', marginBottom: '0.75rem', fontWeight: 600 }}>Stack</div>
          <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: '#fff', letterSpacing: '0.03em' }}>TECHNOLOGY</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
          <TechCard layer="Frontend" color="#3b82f6" items={['React 18', 'Vite 8', 'TypeScript', 'Recharts', 'Leaflet']} />
          <TechCard layer="Backend"  color="#10b981" items={['Spring Boot 3.4', 'PostgreSQL 18', 'Spring Security JWT', 'JPA/Hibernate']} />
          <TechCard layer="ML Service" color="#C8952C" items={['FastAPI', 'XGBoost', 'Isolation Forest', 'Sentence Transformers', 'ReportLab']} />
        </div>
      </section>

      {/* ── Footer CTA ── */}
      <div style={{
        padding: '5rem 2rem', textAlign: 'center',
        background: 'linear-gradient(180deg, transparent, rgba(200,149,44,0.04))',
        borderTop: '1px solid rgba(200,149,44,0.1)',
      }}>
        <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 'clamp(2rem, 6vw, 4rem)', color: '#fff', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
          READY TO EXPLORE?
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.45)', marginBottom: '2rem', fontSize: '0.95rem' }}>
          Login with a demo account to see all 6 AI engines live
        </p>
        <button onClick={() => navigate('/login')} style={{
          background: 'linear-gradient(135deg,#C8952C,#FF6600)',
          border: 'none', borderRadius: 50, color: '#fff',
          padding: '1rem 3rem', fontSize: '1rem',
          fontFamily: "'Outfit',sans-serif", fontWeight: 700,
          cursor: 'pointer', letterSpacing: '0.03em',
          boxShadow: '0 8px 40px rgba(200,149,44,0.4)',
          transition: 'all 0.2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 12px 60px rgba(200,149,44,0.6)' }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 8px 40px rgba(200,149,44,0.4)' }}
        >Access Platform →</button>
        <div style={{ marginTop: '3rem', fontSize: '0.7rem', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em' }}>
          MINISTRY OF STATISTICS & PROGRAMME IMPLEMENTATION · MOSPI · SIH 2026 · SYNTHETIC DEMO DATA
        </div>
      </div>
    </>
  )
}
