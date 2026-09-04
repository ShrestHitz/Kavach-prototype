import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Shield, Activity, ArrowRight, CheckCircle2, AlertTriangle,
  Zap, MapPin, Clock, Users, IndianRupee, FileText,
  ExternalLink, RotateCcw, X, Layers, Building2, Landmark,
  ShieldCheck, Eye
} from 'lucide-react'
import ParliamentGateReveal from '../components/ui/ParliamentGateReveal'
import WorldMapWatermark from '../components/ui/WorldMapWatermark'

/* ─── 1. KAVACH Loader Screen ─────────────────────────────────────────────── */
function KavachLoader({ onDone }: { onDone: () => void }) {
  const [percent, setPercent] = useState(15)
  const [phase, setPhase] = useState<'loading' | 'exit'>('loading')

  useEffect(() => {
    const interval = setInterval(() => {
      setPercent(p => {
        if (p >= 100) {
          clearInterval(interval)
          setTimeout(() => setPhase('exit'), 350)
          setTimeout(() => onDone(), 800)
          return 100
        }
        return p + 20 > 100 ? 100 : p + 20
      })
    }, 160)
    return () => clearInterval(interval)
  }, [onDone])

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 99999,
      background: '#07101E',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      transition: 'opacity 0.5s ease, transform 0.5s ease',
      opacity: phase === 'exit' ? 0 : 1,
      transform: phase === 'exit' ? 'scale(1.02)' : 'scale(1)',
      backgroundImage: 'radial-gradient(circle at center, rgba(0, 168, 150, 0.15) 0%, transparent 70%)',
    }}>
      <div style={{ position: 'relative', width: 120, height: 120, marginBottom: '1.75rem' }}>
        <div style={{
          position: 'absolute', inset: -16, borderRadius: '50%',
          border: '1.5px solid rgba(0, 210, 196, 0.3)',
          animation: 'metro-pulse 2s infinite ease-out'
        }} />
        <svg viewBox="0 0 100 120" width="120" height="120" style={{
          filter: 'drop-shadow(0 0 25px rgba(0, 210, 196, 0.65))',
        }}>
          <defs>
            <linearGradient id="shieldGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#00D2C4" />
              <stop offset="100%" stopColor="#00A896" />
            </linearGradient>
            <linearGradient id="shieldBg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(14, 26, 48, 0.85)" />
              <stop offset="100%" stopColor="rgba(7, 16, 30, 0.95)" />
            </linearGradient>
          </defs>
          <path d="M50 8 L88 24 L88 64 C88 90 50 112 50 112 C50 112 12 90 12 64 L12 24 Z"
            fill="url(#shieldBg)" stroke="url(#shieldGrad)" strokeWidth="3.5" strokeDasharray="3 3" />
          <line x1="50" y1="36" x2="50" y2="76" stroke="#00D2C4" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="30" y1="56" x2="70" y2="56" stroke="#00D2C4" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="50" cy="56" r="5" fill="#00D2C4" />
        </svg>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
        <h1 style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
          fontWeight: 900,
          letterSpacing: '0.4em',
          margin: 0, lineHeight: 1,
          color: '#fff',
          textIndent: '0.4em',
        }}>
          <span style={{ color: '#00D2C4' }}>K</span>AVACH
        </h1>
        <div style={{
          marginTop: '1rem',
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          padding: '0.3rem 1rem', borderRadius: 999,
          background: '#0E1A30', border: '1px solid rgba(0, 168, 150, 0.35)',
          fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.1em',
          color: '#00D2C4', textTransform: 'uppercase',
        }}>
          Government of India • MoSPI • MPLADS AI Vigilance System
        </div>
      </div>

      <div style={{ width: '100%', maxWidth: 320, margin: '1rem 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', fontFamily: 'monospace', color: '#00D2C4', marginBottom: '0.35rem', fontWeight: 700 }}>
          <span>INITIALIZING SENTINEL RADAR</span>
          <span>{percent}%</span>
        </div>
        <div style={{ height: 4, background: 'rgba(255, 255, 255, 0.1)', borderRadius: 99, overflow: 'hidden' }}>
          <div style={{
            height: '100%', width: `${percent}%`,
            background: 'linear-gradient(90deg, #00A896, #00D2C4)',
            transition: 'width 0.15s ease',
            boxShadow: '0 0 10px #00D2C4',
          }} />
        </div>
      </div>

      <button
        onClick={onDone}
        style={{
          position: 'absolute', bottom: '2rem', right: '2rem',
          background: 'rgba(14, 26, 48, 0.85)',
          border: '1px solid rgba(0, 168, 150, 0.3)',
          borderRadius: 999, padding: '0.45rem 1.15rem',
          color: '#00D2C4', fontSize: '0.75rem', fontWeight: 700,
          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem',
        }}
      >
        Enter Platform <ArrowRight size={13} />
      </button>
    </div>
  )
}

/* ─── 2. Data Constants ───────────────────────────────────────────────────── */
const FOUR_LAYERS = [
  {
    layerNumber: '01',
    title: 'Statistical Cost Outlier Radar',
    hindiTag: 'लागत विसंगति रडार',
    metric: 'Z-Score ≥ 2.5σ',
    phrase: 'Detects. Flags. Quantifies.',
    description: 'Calculates dynamic per-category IQR distributions across 543 constituencies. Flags works where sanctioned costs exceed statistical norms by more than 2.5 standard deviations.',
    icon: Zap,
    color: '#00A896',
    bg: '#F0FDFB',
  },
  {
    layerNumber: '02',
    title: 'Geospatial Duplicate Shield',
    hindiTag: 'जीपीएस दोहराव ढाल',
    metric: 'Haversine < 50m',
    phrase: 'Overlaps discovered. Instantly.',
    description: 'Executes high-speed pairwise geodesic proximity sweeps within each district. Surfaces overlapping or double-billed civil works sharing identical physical GPS coordinates.',
    icon: MapPin,
    color: '#028090',
    bg: '#F0FDFB',
  },
  {
    layerNumber: '03',
    title: 'Timeline & Stagnation Tracker',
    hindiTag: 'कार्य प्रगति एवं निष्क्रियता ट्रैकर',
    metric: '> 90 Days Dormancy',
    phrase: 'Frozen progress. Exposed.',
    description: 'Tracks temporal gaps between fund disbursement tranches and physical ground milestone uploads. Alerts authorities when works stall with substantial advance capital locked.',
    icon: Clock,
    color: '#F59E0B',
    bg: '#FFFBEB',
  },
  {
    layerNumber: '04',
    title: 'Vendor Monopoly & Collusion Index',
    hindiTag: 'ठेकेदार सिंडिकेट विश्लेषण',
    metric: '> 70% Category Allocation',
    phrase: 'Syndicates unveiled. Verified.',
    description: 'Analyzes contracting network graphs across contiguous constituencies to detect bidding cartels, single-bidder awards, and shell-agency fund diversions.',
    icon: Users,
    color: '#10B981',
    bg: '#F0FDF4',
  },
]

const FUND_JOURNEY_STAGES = [
  {
    id: 1, code: 'ST-01', name: 'MP Recommendation', hindiName: 'सांसद अनुशंसा',
    actor: 'Hon’ble Member of Parliament',
    description: 'Recommends community works within the statutory ₹5.00 Crore annual allocation ceiling via the MoSPI portal.',
    status: 'COMPLETED', icon: Landmark,
  },
  {
    id: 2, code: 'ST-02', name: 'Central Tranche Release', hindiName: 'केंद्रीय किस्त निर्गमन',
    actor: 'MoSPI & State Nodal Agency',
    description: 'Central treasury disburses funds to the District Nodal Account under Single Nodal Agency (SNA) guidelines.',
    status: 'COMPLETED', icon: IndianRupee,
  },
  {
    id: 3, code: 'ST-03', name: 'Administrative Sanction', hindiName: 'प्रशासनिक स्वीकृति',
    actor: 'District Magistrate / Collector',
    description: 'District Planning Cell verifies land title, feasibility, and tenders work through GeM / State e-Procurement.',
    status: 'COMPLETED', icon: Building2,
  },
  {
    id: 4, code: 'ST-04', name: 'Milestone Execution', hindiName: 'निर्माण एवं कार्य प्रगति',
    actor: 'Registered Implementing Agency',
    description: 'Contractor conducts civil works and submits milestone bills with mandatory time-stamped geotag photos.',
    status: 'COMPLETED', icon: Clock,
  },
  {
    id: 5, code: 'ST-05', name: 'NIC GeoTag Verification', hindiName: 'जीपीएस जियोटैग सत्यापन',
    actor: 'NIC Mobile Sentinel Core',
    description: 'Field officer captures high-accuracy GPS coordinates, altitude, and physical site evidence on the ground.',
    status: 'COMPLETED', icon: MapPin,
  },
  {
    id: 6, code: 'ST-06', name: 'KAVACH AI Inspection Gate', hindiName: 'कवच एआई सुरक्षा गेट',
    actor: 'Autonomous Neural Vigilance Engine',
    description: 'Simultaneous 4-signal verification: Haversine distance, Z-score cost baseline, timeline drift, and vendor monopoly.',
    status: 'ACTIVE_GATE', icon: ShieldCheck, isGate: true,
  },
  {
    id: 7, code: 'ST-07', name: 'Public Asset Commissioned', hindiName: 'सार्वजनिक संपत्ति लोकार्पण',
    actor: 'Citizens & Statutory Audit Portal',
    description: '100% reconciled digital asset register published with transparent public audit trail and electronic UC.',
    status: 'FINAL', icon: CheckCircle2,
  },
]

const CONSTITUENCIES = [
  {
    id: 'varanasi', code: 'UP-VAR', name: 'Varanasi', nativeName: 'वाराणसी',
    state: 'Uttar Pradesh', mp: 'Shri Narendra Modi',
    sanctioned: '₹24.80 Cr', actual: '₹21.40 Cr',
    worksCount: 48, flaggedCount: 3, status: 'ALERT',
    alertDesc: 'Geo-Duplicate Triplet detected in Solar Lighting project (28.4m overlap)',
    badgeColor: '#00A896',
    topWork: 'Solar Street Light Grid - Sector 4',
  },
  {
    id: 'gandhinagar', code: 'GJ-GAN', name: 'Gandhinagar', nativeName: 'ગાંધીનગર',
    state: 'Gujarat', mp: 'Shri Amit Shah',
    sanctioned: '₹23.50 Cr', actual: '₹19.80 Cr',
    worksCount: 42, flaggedCount: 2, status: 'ALERT',
    alertDesc: '210-Day Stagnation & 80% advance disbursement with 0% field milestone',
    badgeColor: '#F59E0B',
    topWork: 'Multi-Purpose Community Hall - Shanti Nagar',
  },
  {
    id: 'bangalore_south', code: 'KA-BLR', name: 'Bangalore South', nativeName: 'ಬೆಂಗಳೂರು ದಕ್ಷಿಣ',
    state: 'Karnataka', mp: 'Shri Tejasvi Surya',
    sanctioned: '₹24.20 Cr', actual: '₹22.10 Cr',
    worksCount: 52, flaggedCount: 0, status: 'VERIFIED',
    alertDesc: '100% Works verified with tamper-proof GPS coordinates and audit vouchers',
    badgeColor: '#10B981',
    topWork: 'Government High School Digital STEM Lab',
  },
  {
    id: 'chennai_central', code: 'TN-CHE', name: 'Chennai Central', nativeName: 'சென்னை மத்திய',
    state: 'Tamil Nadu', mp: 'Shri Dayanidhi Maran',
    sanctioned: '₹22.90 Cr', actual: '₹21.00 Cr',
    worksCount: 38, flaggedCount: 2, status: 'ALERT',
    alertDesc: '3.8x Unit Cost Deviation in concrete stormwater drainage pipeline',
    badgeColor: '#EF4444',
    topWork: 'Concrete Stormwater Drainage Channel',
  },
  {
    id: 'lucknow', code: 'UP-LUC', name: 'Lucknow', nativeName: 'लखनऊ',
    state: 'Uttar Pradesh', mp: 'Shri Rajnath Singh',
    sanctioned: '₹24.00 Cr', actual: '₹20.50 Cr',
    worksCount: 44, flaggedCount: 2, status: 'ALERT',
    alertDesc: 'Monopoly vendor award pattern & 3.24σ cost outlier on community hall roof',
    badgeColor: '#F59E0B',
    topWork: 'District Community Hall Renovation',
  },
  {
    id: 'pune', code: 'MH-PUN', name: 'Pune', nativeName: 'पुणे',
    state: 'Maharashtra', mp: 'Shri Murlidhar Mohol',
    sanctioned: '₹23.80 Cr', actual: '₹19.20 Cr',
    worksCount: 40, flaggedCount: 1, status: 'ALERT',
    alertDesc: '18m Geotag proximity overlap with previously sanctioned municipal work',
    badgeColor: '#00A896',
    topWork: 'Ambedkar Road Pavement & LED Installation',
  },
  {
    id: 'wayanad', code: 'KL-WAY', name: 'Wayanad', nativeName: 'വയനാട്',
    state: 'Kerala', mp: 'Smt. Priyanka Gandhi Vadra',
    sanctioned: '₹22.50 Cr', actual: '₹18.90 Cr',
    worksCount: 36, flaggedCount: 1, status: 'ALERT',
    alertDesc: 'Disbursement > 85% with reported completion stagnant at 12%',
    badgeColor: '#F59E0B',
    topWork: 'Tribal Community Center Water Purification',
  },
  {
    id: 'new_delhi', code: 'DL-DEL', name: 'New Delhi', nativeName: 'नई दिल्ली',
    state: 'Delhi (UT)', mp: 'Smt. Bansuri Swaraj',
    sanctioned: '₹25.00 Cr', actual: '₹23.80 Cr',
    worksCount: 50, flaggedCount: 0, status: 'VERIFIED',
    alertDesc: 'Full electronic UC reconciliation with verified physical asset tags',
    badgeColor: '#10B981',
    topWork: 'Lodhi Colony Public Health Center Upgradation',
  },
]

/* ─── 3. Main Landing Page ────────────────────────────────────────────────── */
export default function LandingPage() {
  const navigate = useNavigate()
  const [loaded, setLoaded] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeStage, setActiveStage] = useState(5)
  const [activeConstId, setActiveConstId] = useState('varanasi')
  const [showDossierModal, setShowDossierModal] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const selectedConstituency = CONSTITUENCIES.find(c => c.id === activeConstId) || CONSTITUENCIES[0]
  const currentStage = FUND_JOURNEY_STAGES[activeStage]

  return (
    <div style={{ background: '#FFFFFF', color: '#0F172A', minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* ── Kavach Splash Loader ── */}
      {!loaded && <KavachLoader onDone={() => setLoaded(true)} />}

      {/* ── Top Navbar (Frosted White, Kochi Metro Style) ── */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        transition: 'all 0.3s ease',
        background: scrolled ? 'rgba(255, 255, 255, 0.94)' : 'rgba(255, 255, 255, 0.86)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(0, 168, 150, 0.18)',
        padding: '0.85rem 2.5rem',
        boxShadow: scrolled ? '0 4px 20px rgba(0, 168, 150, 0.08)' : 'none',
      }}>
        <div style={{
          maxWidth: 1480, margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem',
        }}>
          {/* Brand */}
          <a href="#hero" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
            <div style={{
              width: 38, height: 38, borderRadius: 12,
              background: 'linear-gradient(135deg, #00A896, #028090)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 15px rgba(0, 168, 150, 0.3)'
            }}>
              <Shield size={19} color="#FFFFFF" strokeWidth={2.5} />
            </div>
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 900, letterSpacing: '0.04em', color: '#0F172A' }}>
                KAVACH
              </div>
              <div style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.12em', color: '#00A896', textTransform: 'uppercase' }}>
                MoSPI • MPLADS AI Vigilance System
              </div>
            </div>
          </a>

          {/* Navigation Links */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '2rem' }} className="hidden lg:flex">
            {[
              { label: 'OVERVIEW', href: '#hero' },
              { label: 'PARLIAMENT GATEWAY', href: '#gate-reveal' },
              { label: 'EXPLORE NETWORK', href: '#explore-network' },
              { label: 'FUND JOURNEY', href: '#fund-journey' },
              { label: 'DETECTION RADAR', href: '#how-it-works' },
            ].map(item => (
              <a
                key={item.label}
                href={item.href}
                style={{
                  color: '#334155',
                  fontSize: '0.76rem',
                  fontWeight: 800,
                  letterSpacing: '0.08em',
                  textDecoration: 'none',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = '#00A896')}
                onMouseLeave={e => (e.currentTarget.style.color = '#334155')}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Action CTAs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <button
              onClick={() => setShowDossierModal(true)}
              className="btn-metro-outline"
              style={{ padding: '0.55rem 1.25rem', fontSize: '0.78rem' }}
            >
              <FileText size={14} />
              Audit Dossier
            </button>

            <button
              onClick={() => navigate('/dashboard')}
              className="btn-metro-primary"
              style={{ padding: '0.6rem 1.4rem', fontSize: '0.82rem' }}
            >
              <Layers size={14} />
              Launch AI Console →
            </button>
          </div>
        </div>
      </header>

      {/* ── 4. Hero Section (Blended White & Luminous Teal, Matches Screenshot 1) ── */}
      <section
        id="hero"
        style={{
          paddingTop: '8.5rem',
          paddingBottom: '5rem',
          paddingLeft: '2rem',
          paddingRight: '2rem',
          background: 'linear-gradient(180deg, #FFFFFF 0%, #F5FCFB 40%, #E6FAF8 85%, #D4F7F2 100%)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ maxWidth: 1440, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.95fr', gap: '3.5rem', alignItems: 'center' }}>
            {/* Left Column: Hero Text */}
            <div>
              {/* Pill Tag */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
                padding: '0.4rem 1.15rem', borderRadius: 999,
                background: '#FFFFFF', border: '1.5px solid rgba(0, 168, 150, 0.35)',
                fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.12em',
                color: '#00A896', textTransform: 'uppercase', marginBottom: '1.75rem',
                boxShadow: '0 2px 10px rgba(0, 168, 150, 0.1)'
              }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#00A896' }} />
                The Heartbeat of MPLADS Vigilance
              </div>

              {/* Bold Headline (Matches "CONNECTING Kochi" in Screenshot 1) */}
              <h1 style={{
                fontSize: 'clamp(2.8rem, 5.5vw, 4.8rem)',
                fontWeight: 900,
                lineHeight: 1.06,
                letterSpacing: '-0.03em',
                color: '#0F172A',
                margin: '0 0 1.5rem',
              }}>
                CONNECTING <span style={{ color: '#00A896' }}>Citizens</span><br />
                SHIELDING <span style={{
                  background: 'linear-gradient(90deg, #00A896, #028090)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                }}>Funds</span>
              </h1>

              {/* Subtitle */}
              <p style={{
                fontSize: '1.08rem', color: '#475569', lineHeight: 1.7,
                maxWidth: 580, margin: '0 0 2.25rem', fontWeight: 500
              }}>
                Autonomous multi-signal AI vigilance platform for India's <strong style={{ color: '#0F172A', fontWeight: 800 }}>₹83,180 Crore</strong> MPLADS scheme across <strong style={{ color: '#00A896', fontWeight: 800 }}>543 Lok Sabha constituencies</strong>. Detecting cost outliers, GPS duplicates, and milestone delays in real time.
              </p>

              {/* CTAs (Matching "Book tickets" & "Plan your journey" in Screenshot 1) */}
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '3.5rem' }}>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="btn-metro-primary"
                  style={{ padding: '0.9rem 2.25rem', fontSize: '0.92rem' }}
                >
                  <Shield size={17} strokeWidth={2.5} />
                  Launch AI Command Console →
                </button>

                <button
                  onClick={() => {
                    const el = document.getElementById('gate-reveal')
                    if (el) el.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="btn-metro-outline"
                  style={{ padding: '0.9rem 2rem', fontSize: '0.92rem' }}
                >
                  Inspect Parliamentary Gate
                </button>
              </div>

              {/* Metric Counters */}
              <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '1.5rem', borderTop: '1px solid rgba(0, 168, 150, 0.2)', paddingTop: '2rem'
              }}>
                <div>
                  <div style={{ fontSize: '2.4rem', fontWeight: 900, color: '#0F172A', lineHeight: 1 }}>543</div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#00A896', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '0.4rem' }}>
                    Constituencies
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '2.4rem', fontWeight: 900, color: '#0F172A', lineHeight: 1 }}>
                    ₹83,180 <span style={{ fontSize: '1.2rem', color: '#64748B' }}>Cr</span>
                  </div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#00A896', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '0.4rem' }}>
                    Scheme Outlay
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '2.4rem', fontWeight: 900, color: '#0F172A', lineHeight: 1 }}>
                    &lt; 50 <span style={{ fontSize: '1.2rem', color: '#64748B' }}>m</span>
                  </div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#00A896', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '0.4rem' }}>
                    Geo-Precision
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Floating Clean White National Sentinel Card */}
            <div>
              <div
                className="metro-card"
                style={{
                  padding: '2rem',
                  border: '1.5px solid rgba(0, 168, 150, 0.25)',
                  boxShadow: '0 25px 60px -10px rgba(0, 168, 150, 0.18), 0 8px 24px rgba(15, 23, 42, 0.05)',
                  background: '#FFFFFF',
                }}
              >
                {/* Header */}
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  paddingBottom: '1.25rem', marginBottom: '1.25rem',
                  borderBottom: '1px solid #E2E8F0',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#10B981', boxShadow: '0 0 10px #10B981' }} />
                    <span style={{ fontSize: '0.8rem', fontWeight: 900, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#0F172A' }}>
                      National Sentinel Mesh
                    </span>
                  </div>
                  <span style={{
                    fontSize: '0.72rem', fontWeight: 800, fontFamily: 'monospace',
                    color: '#00A896', background: 'rgba(0, 168, 150, 0.1)',
                    padding: '0.25rem 0.65rem', borderRadius: 999, border: '1px solid rgba(0, 168, 150, 0.25)'
                  }}>
                    1,269 Works Active
                  </span>
                </div>

                {/* Alert Item 1: Varanasi (Red) */}
                <div style={{
                  background: '#FEF2F2', border: '1px solid #FECACA',
                  borderRadius: 14, padding: '1rem 1.15rem', marginBottom: '0.85rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 10,
                      background: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <AlertTriangle size={18} color="#EF4444" />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#991B1B' }}>
                        Varanasi • Solar Street Light Grid
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#B91C1C', marginTop: '0.15rem' }}>
                        Geo-Duplicate Triplet (28.4m overlap)
                      </div>
                    </div>
                  </div>
                  <span style={{
                    padding: '0.25rem 0.65rem', borderRadius: 8,
                    background: '#EF4444', color: '#FFFFFF',
                    fontSize: '0.76rem', fontWeight: 800, fontFamily: 'monospace', flexShrink: 0
                  }}>
                    93/100
                  </span>
                </div>

                {/* Alert Item 2: Lucknow (Amber) */}
                <div style={{
                  background: '#FFFBEB', border: '1px solid #FDE68A',
                  borderRadius: 14, padding: '1rem 1.15rem', marginBottom: '0.85rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 10,
                      background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <Zap size={18} color="#D97706" />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#92400E' }}>
                        Lucknow • Community Hall Roof
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#B45309', marginTop: '0.15rem' }}>
                        Cost Z-Score Outlier (3.24σ baseline)
                      </div>
                    </div>
                  </div>
                  <span style={{
                    padding: '0.25rem 0.65rem', borderRadius: 8,
                    background: '#F59E0B', color: '#FFFFFF',
                    fontSize: '0.76rem', fontWeight: 800, fontFamily: 'monospace', flexShrink: 0
                  }}>
                    78/100
                  </span>
                </div>

                {/* Alert Item 3: Bangalore South (Green) */}
                <div style={{
                  background: '#F0FDF4', border: '1px solid #BBF7D0',
                  borderRadius: 14, padding: '1rem 1.15rem', marginBottom: '1.25rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 10,
                      background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <CheckCircle2 size={18} color="#10B981" />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#166534' }}>
                        Bangalore South • High School Lab
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#15803D', marginTop: '0.15rem' }}>
                        Milestone Verified • UC Reconciled
                      </div>
                    </div>
                  </div>
                  <span style={{
                    padding: '0.25rem 0.65rem', borderRadius: 8,
                    background: '#10B981', color: '#FFFFFF',
                    fontSize: '0.74rem', fontWeight: 800, fontFamily: 'monospace', flexShrink: 0
                  }}>
                    CLEAR
                  </span>
                </div>

                {/* Card Footer */}
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  paddingTop: '1rem', borderTop: '1px solid #E2E8F0',
                }}>
                  <span style={{ fontSize: '0.75rem', color: '#64748B', fontFamily: 'monospace', fontWeight: 600 }}>
                    Haversine + Z-Score Engine
                  </span>
                  <button
                    onClick={() => navigate('/dashboard')}
                    style={{
                      background: 'none', border: 'none', color: '#00A896',
                      fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: '0.3rem',
                    }}
                  >
                    Inspect in Live Console →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. CONCEPT 4: PINNED SCROLL CURTAIN / PARLIAMENT GATE REVEAL ── */}
      <section id="gate-reveal">
        <ParliamentGateReveal />
      </section>

      {/* ── 6. Explore the Network Section (Matches Screenshot 2 with World Map Watermark) ── */}
      <section
        id="explore-network"
        style={{
          padding: '6rem 2rem',
          background: 'linear-gradient(180deg, #FFFFFF 0%, #F5FCFB 50%, #EBFBF8 100%)',
          position: 'relative',
          overflow: 'hidden',
          borderTop: '1px solid rgba(0, 168, 150, 0.15)',
          borderBottom: '1px solid rgba(0, 168, 150, 0.15)',
        }}
      >
        {/* Fading World Map Watermark Silhouette in Background (Exact match to Screenshot 2) */}
        <WorldMapWatermark opacity={0.16} />

        <div style={{ maxWidth: 1440, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2 style={{
              fontSize: 'clamp(2.4rem, 4.5vw, 3.4rem)',
              fontWeight: 900,
              letterSpacing: '-0.02em',
              color: '#0F172A',
              margin: '0 0 0.75rem',
            }}>
              Explore the Network
            </h2>
            <p style={{ fontSize: '1rem', color: '#64748B', maxWidth: 650, margin: '0 auto', fontWeight: 500 }}>
              Click or hover any constituency marker to inspect active works, fund utilization &amp; anomaly status.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.95fr', gap: '2.5rem', alignItems: 'stretch' }}>
            {/* Left Box: National Vigilance Corridors Map Card */}
            <div
              className="metro-card"
              style={{
                background: '#FFFFFF',
                borderRadius: 24,
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: 480,
                border: '1.5px solid rgba(0, 168, 150, 0.25)',
                boxShadow: '0 20px 50px rgba(0, 168, 150, 0.08), 0 4px 12px rgba(15, 23, 42, 0.03)',
                position: 'relative',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#00A896' }} />
                  <span style={{ fontSize: '0.78rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#0F172A' }}>
                    National Vigilance Corridors
                  </span>
                </div>
                <span style={{ fontSize: '0.74rem', color: '#64748B', fontFamily: 'monospace', fontWeight: 600 }}>
                  543 Constituencies • 28 States
                </span>
              </div>

              {/* Interactive Node Graph */}
              <div style={{ position: 'relative', flex: 1, minHeight: 340, background: '#F8FAFC', borderRadius: 16, border: '1px solid #E2E8F0', overflow: 'hidden' }}>
                <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                  <line x1="28%" y1="25%" x2="52%" y2="35%" stroke="#00A896" strokeWidth="2.5" strokeDasharray="4 4" />
                  <line x1="52%" y1="35%" x2="65%" y2="40%" stroke="#00A896" strokeWidth="3" />
                  <line x1="28%" y1="25%" x2="25%" y2="50%" stroke="#00A896" strokeWidth="2.5" />
                  <line x1="25%" y1="50%" x2="35%" y2="65%" stroke="#00A896" strokeWidth="2.5" />
                  <line x1="35%" y1="65%" x2="48%" y2="80%" stroke="#10B981" strokeWidth="3" />
                  <line x1="48%" y1="80%" x2="60%" y2="82%" stroke="#EF4444" strokeWidth="2.5" strokeDasharray="4 4" />
                  <line x1="48%" y1="80%" x2="42%" y2="90%" stroke="#F59E0B" strokeWidth="2.5" />
                </svg>

                {[
                  { id: 'new_delhi', top: '25%', left: '28%', name: 'New Delhi' },
                  { id: 'lucknow', top: '35%', left: '52%', name: 'Lucknow' },
                  { id: 'varanasi', top: '40%', left: '65%', name: 'Varanasi' },
                  { id: 'gandhinagar', top: '50%', left: '25%', name: 'Gandhinagar' },
                  { id: 'pune', top: '65%', left: '35%', name: 'Pune' },
                  { id: 'bangalore_south', top: '80%', left: '48%', name: 'Bangalore South' },
                  { id: 'chennai_central', top: '82%', left: '60%', name: 'Chennai Central' },
                  { id: 'wayanad', top: '90%', left: '42%', name: 'Wayanad' },
                ].map(node => {
                  const constData = CONSTITUENCIES.find(c => c.id === node.id)
                  const isSelected = activeConstId === node.id
                  const isAlert = constData?.status === 'ALERT'

                  return (
                    <button
                      key={node.id}
                      onClick={() => setActiveConstId(node.id)}
                      style={{
                        position: 'absolute',
                        top: node.top,
                        left: node.left,
                        transform: 'translate(-50%, -50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.25rem',
                        zIndex: isSelected ? 30 : 20,
                        transition: 'transform 0.2s',
                      }}
                    >
                      <div style={{
                        width: isSelected ? 38 : 28,
                        height: isSelected ? 38 : 28,
                        borderRadius: '50%',
                        background: isSelected
                          ? '#00A896'
                          : isAlert ? '#FEE2E2' : '#DCFCE7',
                        border: isSelected
                          ? '3px solid #0F172A'
                          : isAlert ? '2px solid #EF4444' : '2px solid #10B981',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: isSelected ? '#FFFFFF' : isAlert ? '#EF4444' : '#10B981',
                        boxShadow: isSelected ? '0 4px 15px rgba(0, 168, 150, 0.4)' : 'none',
                      }}>
                        <MapPin size={isSelected ? 18 : 14} />
                      </div>
                      <span style={{
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        padding: '0.2rem 0.55rem',
                        borderRadius: 6,
                        background: isSelected ? '#0F172A' : '#FFFFFF',
                        color: isSelected ? '#FFFFFF' : '#0F172A',
                        border: isSelected ? 'none' : '1px solid #CBD5E1',
                        whiteSpace: 'nowrap',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
                      }}>
                        {node.name}
                      </span>
                    </button>
                  )
                })}
              </div>

              {/* Legend */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                paddingTop: '1rem', borderTop: '1px solid #E2E8F0',
                fontSize: '0.75rem', color: '#64748B', marginTop: '1rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#EF4444' }} />
                    <span>Flagged Anomaly</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981' }} />
                    <span>100% Verified Clear</span>
                  </div>
                </div>
                <span style={{ color: '#00A896', fontWeight: 800 }}>Click pin to inspect</span>
              </div>
            </div>

            {/* Right Box: Constituency Audit Card (Exact Style of Screenshot 2) */}
            <div
              className="metro-card"
              style={{
                background: '#FFFFFF',
                borderRadius: 24,
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 20px 50px rgba(0, 168, 150, 0.08), 0 4px 12px rgba(15, 23, 42, 0.03)',
                border: '1.5px solid rgba(0, 168, 150, 0.25)',
              }}
            >
              <div>
                {/* Station Banner (Matching Yellow/Green Banner in Screenshot 2) */}
                <div style={{
                  background: selectedConstituency.status === 'ALERT'
                    ? 'linear-gradient(135deg, #00A896, #008E80)'
                    : 'linear-gradient(135deg, #A3E635, #84CC16)',
                  color: selectedConstituency.status === 'ALERT' ? '#FFFFFF' : '#0F172A',
                  borderRadius: 16,
                  padding: '1.15rem 1.4rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '1.5rem',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.08)'
                }}>
                  <div>
                    <span style={{
                      fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase',
                      padding: '0.2rem 0.55rem', borderRadius: 6,
                      background: selectedConstituency.status === 'ALERT' ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.4)',
                    }}>
                      {selectedConstituency.code} • {selectedConstituency.state}
                    </span>
                    <div style={{ fontSize: '1.75rem', fontWeight: 900, marginTop: '0.35rem' }}>
                      {selectedConstituency.nativeName}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{
                      padding: '0.4rem 0.9rem', borderRadius: 999,
                      background: '#0F172A', color: '#FFFFFF',
                      fontSize: '0.75rem', fontWeight: 800,
                    }}>
                      {selectedConstituency.flaggedCount > 0 ? `🛡️ ${selectedConstituency.flaggedCount} Flagged` : '✓ 100% Clear'}
                    </span>
                  </div>
                </div>

                {/* Constituency Details */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                    <h3 style={{ fontSize: '1.85rem', fontWeight: 900, color: '#0F172A', margin: 0 }}>
                      {selectedConstituency.name}
                    </h3>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748B' }}>
                      MP: {selectedConstituency.mp}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#64748B', marginTop: '0.2rem' }}>
                    {selectedConstituency.nativeName}
                  </div>
                </div>

                {/* Metrics */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 14, padding: '1rem' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Sanctioned Funds
                    </div>
                    <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#0F172A', marginTop: '0.25rem' }}>
                      {selectedConstituency.sanctioned}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.2rem' }}>
                      Actual: {selectedConstituency.actual}
                    </div>
                  </div>

                  <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 14, padding: '1rem' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Total Works
                    </div>
                    <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#0F172A', marginTop: '0.25rem' }}>
                      {selectedConstituency.worksCount} Works
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: 800, marginTop: '0.2rem' }}>
                      GPS Geotagged: 100%
                    </div>
                  </div>
                </div>

                {/* Alert Box */}
                <div style={{
                  background: selectedConstituency.status === 'ALERT' ? '#FEF2F2' : '#F0FDF4',
                  border: selectedConstituency.status === 'ALERT' ? '1px solid #FECACA' : '1px solid #BBF7D0',
                  borderRadius: 14, padding: '1.1rem', marginBottom: '1.5rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                    {selectedConstituency.status === 'ALERT' ? (
                      <AlertTriangle size={18} color="#EF4444" style={{ marginTop: 2, flexShrink: 0 }} />
                    ) : (
                      <CheckCircle2 size={18} color="#10B981" style={{ marginTop: 2, flexShrink: 0 }} />
                    )}
                    <div>
                      <div style={{
                        fontSize: '0.78rem', fontWeight: 900,
                        color: selectedConstituency.status === 'ALERT' ? '#B91C1C' : '#15803D'
                      }}>
                        {selectedConstituency.status === 'ALERT' ? 'Active Anomaly Finding' : 'Audit Reconciled'}
                      </div>
                      <p style={{
                        fontSize: '0.82rem',
                        color: selectedConstituency.status === 'ALERT' ? '#991B1B' : '#166534',
                        margin: '0.25rem 0 0', lineHeight: 1.5
                      }}>
                        {selectedConstituency.alertDesc}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dark Pill Action Button (Matches "View on Google Maps" in Screenshot 2) */}
              <button
                onClick={() => navigate('/dashboard')}
                className="btn-metro-dark"
                style={{
                  width: '100%',
                  padding: '1rem',
                  fontSize: '0.88rem',
                  fontWeight: 800,
                  letterSpacing: '0.05em',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                }}
              >
                INSPECT IN LIVE CONSOLE →
              </button>
            </div>
          </div>

          {/* Bottom Pill Carousel (Exact match to Station Pills in Screenshot 2) */}
          <div style={{
            marginTop: '3rem',
            background: '#FFFFFF',
            border: '1px solid rgba(0, 168, 150, 0.25)',
            borderRadius: 999,
            padding: '0.65rem 1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            overflowX: 'auto',
            boxShadow: '0 8px 24px rgba(0, 168, 150, 0.08)'
          }}>
            {CONSTITUENCIES.map(c => {
              const isSelected = activeConstId === c.id
              return (
                <button
                  key={c.id}
                  onClick={() => setActiveConstId(c.id)}
                  style={{
                    flexShrink: 0,
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    padding: '0.55rem 1.25rem', borderRadius: 999,
                    background: isSelected ? '#0F172A' : '#F8FAFC',
                    color: isSelected ? '#FFFFFF' : '#334155',
                    border: isSelected ? 'none' : '1px solid #E2E8F0',
                    fontSize: '0.78rem', fontWeight: 800,
                    cursor: 'pointer', transition: 'all 0.15s'
                  }}
                >
                  <span style={{
                    width: 7, height: 7, borderRadius: '50%',
                    background: c.status === 'ALERT' ? '#EF4444' : '#10B981'
                  }} />
                  <span>{c.name}</span>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── 7. Fund Journey Section ── */}
      <section id="fund-journey" style={{ padding: '6rem 2rem', background: '#FFFFFF' }}>
        <div style={{ maxWidth: 1440, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.35rem 1.1rem', borderRadius: 999,
              background: '#F0FDFB', border: '1px solid rgba(0, 168, 150, 0.3)',
              fontSize: '0.72rem', fontWeight: 800, color: '#00A896', textTransform: 'uppercase',
              marginBottom: '1rem', letterSpacing: '0.1em'
            }}>
              Corridor Transit Lifecycle
            </div>
            <h2 style={{
              fontSize: 'clamp(2.4rem, 4.5vw, 3.4rem)', fontWeight: 900,
              letterSpacing: '-0.02em', color: '#0F172A', margin: '0 0 0.75rem',
            }}>
              The Fund's Journey
            </h2>
            <p style={{ fontSize: '1rem', color: '#64748B', maxWidth: 650, margin: '0 auto', fontWeight: 500 }}>
              From initial MP sanction to final citizen asset — every transit station monitored in real time.
            </p>
          </div>

          {/* 7-Station Progress Rail */}
          <div style={{ position: 'relative', marginBottom: '2.5rem' }}>
            <div style={{
              position: 'absolute', top: 24, left: 30, right: 30, height: 4,
              background: '#E2E8F0', borderRadius: 99, zIndex: 0
            }}>
              <div style={{
                height: '100%',
                width: `${((activeStage + 1) / FUND_JOURNEY_STAGES.length) * 100}%`,
                background: 'linear-gradient(90deg, #00A896, #028090)',
                borderRadius: 99, transition: 'width 0.3s ease',
              }} />
            </div>

            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)',
              gap: '0.75rem', position: 'relative', zIndex: 10
            }}>
              {FUND_JOURNEY_STAGES.map((st, idx) => {
                const isSelected = activeStage === idx
                const isGate = st.isGate
                const Icon = st.icon

                return (
                  <button
                    key={st.id}
                    onClick={() => setActiveStage(idx)}
                    style={{
                      background: isSelected
                        ? isGate ? '#FEF2F2' : '#F0FDFB'
                        : '#FFFFFF',
                      border: isSelected
                        ? isGate ? '2px solid #EF4444' : '2px solid #00A896'
                        : '1px solid #E2E8F0',
                      borderRadius: 18,
                      padding: '1.1rem 0.6rem',
                      display: 'flex', flexDirection: 'column', alignItems: 'center',
                      textAlign: 'center', cursor: 'pointer',
                      boxShadow: isSelected ? '0 10px 25px rgba(0, 168, 150, 0.18)' : '0 2px 8px rgba(0,0,0,0.03)',
                      transform: isSelected ? 'scale(1.04)' : 'scale(1)',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{
                      width: 44, height: 44, borderRadius: 12,
                      background: isSelected
                        ? isGate ? '#EF4444' : '#00A896'
                        : isGate ? '#FEE2E2' : '#F1F5F9',
                      color: isSelected ? '#FFFFFF' : isGate ? '#EF4444' : '#334155',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      marginBottom: '0.6rem',
                    }}>
                      <Icon size={20} />
                    </div>
                    <span style={{ fontSize: '0.65rem', fontFamily: 'monospace', color: '#64748B', fontWeight: 800 }}>
                      {st.code}
                    </span>
                    <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0F172A', marginTop: '0.2rem', lineHeight: 1.3 }}>
                      {st.name}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Active Station Card */}
          <div
            className="metro-card"
            style={{
              background: '#FFFFFF',
              border: currentStage.isGate ? '2px solid #EF4444' : '1.5px solid rgba(0, 168, 150, 0.25)',
              borderRadius: 24, padding: '2.5rem',
              boxShadow: '0 20px 50px rgba(0, 168, 150, 0.08)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
                  <span style={{
                    padding: '0.25rem 0.65rem', borderRadius: 6,
                    background: currentStage.isGate ? '#EF4444' : '#00A896',
                    color: '#FFFFFF',
                    fontFamily: 'monospace', fontWeight: 800, fontSize: '0.78rem'
                  }}>
                    {currentStage.code}
                  </span>
                  <span style={{ fontSize: '1rem', color: '#64748B', fontWeight: 700 }}>{currentStage.hindiName}</span>
                </div>
                <h3 style={{ fontSize: '1.65rem', fontWeight: 900, color: '#0F172A', margin: '0 0 0.5rem' }}>
                  {currentStage.name}
                </h3>
                <div style={{ fontSize: '0.85rem', color: '#00A896', fontWeight: 800, marginBottom: '1rem' }}>
                  Authorized Actor: {currentStage.actor}
                </div>
                <p style={{ fontSize: '0.95rem', color: '#475569', lineHeight: 1.7, maxWidth: 800, margin: 0 }}>
                  {currentStage.description}
                </p>
              </div>

              <div style={{
                background: '#F8FAFC', border: '1px solid #E2E8F0',
                borderRadius: 16, padding: '1.5rem', minWidth: 260,
              }}>
                <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Transit Status
                </div>
                <div style={{
                  fontSize: '1.25rem', fontWeight: 900,
                  color: currentStage.isGate ? '#EF4444' : '#10B981',
                  marginTop: '0.25rem'
                }}>
                  {currentStage.status === 'ACTIVE_GATE' ? 'AI GATE ACTIVE' : currentStage.status}
                </div>
                <div style={{ fontSize: '0.76rem', color: '#64748B', marginTop: '0.5rem', lineHeight: 1.5 }}>
                  Continuous surveillance operating before public capital release.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 8. Four Layers of Protection Section ── */}
      <section id="how-it-works" style={{
        padding: '6rem 2rem', background: '#F8FAFC',
        borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0',
      }}>
        <div style={{ maxWidth: 1440, margin: '0 auto' }}>
          <div style={{
            display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: '1.5rem', marginBottom: '3.5rem',
            paddingBottom: '1.5rem', borderBottom: '1px solid #E2E8F0'
          }}>
            <div>
              <div style={{
                fontSize: '0.75rem', fontWeight: 900, letterSpacing: '0.2em',
                color: '#00A896', textTransform: 'uppercase', marginBottom: '0.5rem'
              }}>
                Integrated Surveillance Radar
              </div>
              <h2 style={{
                fontSize: 'clamp(2.4rem, 4.5vw, 3.4rem)', fontWeight: 900,
                letterSpacing: '-0.02em', color: '#0F172A', margin: 0, textTransform: 'uppercase'
              }}>
                Four Layers of Protection
              </h2>
            </div>
            <p style={{ fontSize: '0.92rem', color: '#64748B', maxWidth: 450, margin: 0, lineHeight: 1.6 }}>
              Continuous multi-vector anomaly detection operating simultaneously on every sanctioned rupee.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
            {FOUR_LAYERS.map(layer => {
              const Icon = layer.icon
              return (
                <div
                  key={layer.layerNumber}
                  className="metro-card"
                  style={{
                    background: '#FFFFFF',
                    border: '1.5px solid rgba(0, 168, 150, 0.18)',
                    borderRadius: 22,
                    padding: '2rem',
                    display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                    minHeight: 340,
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                      <div style={{
                        width: 44, height: 44, borderRadius: 12,
                        background: layer.bg,
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>
                        <Icon size={22} color={layer.color} />
                      </div>
                      <span style={{
                        fontSize: '0.72rem', fontWeight: 800, fontFamily: 'monospace',
                        padding: '0.3rem 0.75rem', borderRadius: 999,
                        background: layer.bg, color: layer.color, border: `1px solid ${layer.color}30`
                      }}>
                        {layer.metric}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700, marginBottom: '0.35rem' }}>
                      {layer.hindiTag}
                    </div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0F172A', margin: '0 0 0.35rem' }}>
                      {layer.title}
                    </h3>
                    <div style={{ fontSize: '0.78rem', fontWeight: 800, color: layer.color, marginBottom: '0.85rem' }}>
                      {layer.phrase}
                    </div>
                    <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.65, margin: 0 }}>
                      {layer.description}
                    </p>
                  </div>

                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    paddingTop: '1.25rem', marginTop: '1.5rem',
                    borderTop: '1px solid #F1F5F9',
                    fontSize: '0.74rem', fontFamily: 'monospace', color: '#64748B'
                  }}>
                    <span>LAYER {layer.layerNumber}</span>
                    <span style={{ color: '#10B981', fontWeight: 800 }}>Active ✓</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── 9. Footer (Clean Slate & Kochi Metro Teal) ── */}
      <footer style={{
        background: '#0F172A', color: '#F8FAFC',
        padding: '5rem 2rem 3rem',
      }}>
        <div style={{
          maxWidth: 1440, margin: '0 auto',
          display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: '3.5rem', marginBottom: '3rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
              <div style={{
                width: 34, height: 34, borderRadius: 10,
                background: 'linear-gradient(135deg, #00A896, #028090)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Shield size={18} color="#FFFFFF" />
              </div>
              <span style={{ fontSize: '1.35rem', fontWeight: 900, letterSpacing: '0.04em', color: '#fff' }}>
                KAVACH
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#94A3B8', lineHeight: 1.7, maxWidth: 360, margin: '0 0 1rem' }}>
              Autonomous AI-powered multi-signal monitoring and fraud detection platform for India's MPLADS scheme.
            </p>
            <div style={{ fontSize: '0.75rem', color: '#00D2C4', fontFamily: 'monospace', fontWeight: 700 }}>
              MoSPI • Government of India
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#fff', marginBottom: '1rem' }}>
              Platform Modules
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.84rem' }}>
              <li><a href="#hero" style={{ color: '#94A3B8', textDecoration: 'none' }}>Overview &amp; Mission</a></li>
              <li><a href="#gate-reveal" style={{ color: '#94A3B8', textDecoration: 'none' }}>Parliamentary Gateway</a></li>
              <li><a href="#explore-network" style={{ color: '#94A3B8', textDecoration: 'none' }}>Explore 543 Constituencies</a></li>
              <li><a href="#fund-journey" style={{ color: '#94A3B8', textDecoration: 'none' }}>Corridor Fund Journey</a></li>
              <li>
                <button onClick={() => navigate('/dashboard')} style={{ background: 'none', border: 'none', padding: 0, color: '#00D2C4', cursor: 'pointer', fontWeight: 700 }}>
                  Live Command Console →
                </button>
              </li>
            </ul>
          </div>

          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#fff', marginBottom: '1rem' }}>
              Statutory Authority
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.82rem', color: '#94A3B8', lineHeight: 1.6 }}>
              <span style={{ color: '#F1F5F9', fontWeight: 700 }}>Ministry of Statistics &amp; Programme Implementation</span>
              <span>Government of India • New Delhi</span>
              <span>Governed under MPLADS Guidelines 2023</span>
              <span>Single Nodal Agency (SNA) Framework</span>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#fff', marginBottom: '1rem' }}>
              Actions &amp; Resources
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <a
                href="https://github.com/ShrestHitz/Kavach-prototype"
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '0.65rem 0.95rem', borderRadius: 10,
                  background: '#1E293B', color: '#F1F5F9', fontSize: '0.8rem', fontWeight: 700, textDecoration: 'none'
                }}
              >
                <span>GitHub Repository</span>
                <ExternalLink size={14} color="#00D2C4" />
              </a>

              <button
                onClick={() => setLoaded(false)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '0.65rem 0.95rem', borderRadius: 10,
                  background: '#1E293B', color: '#F1F5F9', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', border: 'none'
                }}
              >
                <span>Replay Introduction</span>
                <RotateCcw size={14} color="#00D2C4" />
              </button>

              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '0.65rem 0.95rem', borderRadius: 10,
                  background: '#1E293B', color: '#F1F5F9', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', border: 'none'
                }}
              >
                <span>Back to Top</span>
                <ArrowRight size={14} color="#00D2C4" />
              </button>
            </div>
          </div>
        </div>

        <div style={{
          maxWidth: 1440, margin: '0 auto', paddingTop: '2rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          fontSize: '0.75rem', color: '#64748B'
        }}>
          <div>KAVACH • AUTONOMOUS PARLIAMENTARY VIGILANCE PLATFORM</div>
          <div>MOSPI VIGILANCE &amp; STATUTORY AUDIT DIVISION</div>
        </div>
      </footer>

      {/* ── 10. Audit Dossier Modal ── */}
      {showDossierModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 99999,
          background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(10px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '1.5rem'
        }}>
          <div style={{
            width: '100%', maxWidth: 680, background: '#FFFFFF',
            borderRadius: 24, overflow: 'hidden', boxShadow: '0 25px 60px rgba(0, 0, 0, 0.35)',
            border: '1.5px solid rgba(0, 168, 150, 0.3)'
          }}>
            <div style={{
              padding: '1.25rem 1.75rem', background: '#F8FAFC',
              borderBottom: '1px solid #E2E8F0',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <FileText size={20} color="#00A896" />
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 900, color: '#0F172A' }}>
                  KAVACH Statutory Audit Dossier
                </h3>
              </div>
              <button onClick={() => setShowDossierModal(false)} style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: '1.75rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ background: '#F0FDFB', border: '1px solid #CCFBF1', padding: '1rem', borderRadius: 14, textAlign: 'center' }}>
                  <div style={{ fontSize: '0.7rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 800 }}>National Outlay</div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#00A896', marginTop: '0.25rem' }}>₹83,180 Cr</div>
                </div>
                <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '1rem', borderRadius: 14, textAlign: 'center' }}>
                  <div style={{ fontSize: '0.7rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 800 }}>Active Works</div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0F172A', marginTop: '0.25rem' }}>1,269 Works</div>
                </div>
                <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', padding: '1rem', borderRadius: 14, textAlign: 'center' }}>
                  <div style={{ fontSize: '0.7rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 800 }}>Flagged Anomalies</div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#EF4444', marginTop: '0.25rem' }}>20 Works</div>
                </div>
              </div>

              <div style={{
                background: '#F8FAFC', border: '1px solid #E2E8F0',
                borderRadius: 14, padding: '1.15rem', marginBottom: '1.5rem', fontSize: '0.85rem', color: '#475569', lineHeight: 1.7
              }}>
                <strong style={{ color: '#0F172A' }}>MoSPI Statutory Vigilance Mandate:</strong> All 543 Lok Sabha parliamentary constituencies are continuously screened through the 4-layer autonomous defense grid before fund release tranches are cleared on the Single Nodal Agency (SNA) portal.
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.85rem' }}>
                <button
                  onClick={() => setShowDossierModal(false)}
                  className="btn-metro-outline"
                  style={{ padding: '0.65rem 1.4rem', fontSize: '0.82rem' }}
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowDossierModal(false)
                    navigate('/dashboard')
                  }}
                  className="btn-metro-primary"
                  style={{ padding: '0.65rem 1.6rem', fontSize: '0.82rem' }}
                >
                  Inspect in Command Console →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
