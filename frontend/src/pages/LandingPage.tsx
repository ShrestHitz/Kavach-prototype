import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Shield, Activity, ArrowRight, CheckCircle2, AlertTriangle,
  Zap, MapPin, Clock, Users, IndianRupee, FileText, ChevronRight,
  ExternalLink, RotateCcw, X, Layers, Compass, Building2, Landmark,
  FolderOpen, ShieldCheck, Download
} from 'lucide-react'

/* ─── 1. KAVACH Loader Screen (Matches Screenshot 2) ──────────────────────── */
function KavachLoader({ onDone }: { onDone: () => void }) {
  const [percent, setPercent] = useState(15)
  const [phase, setPhase] = useState<'loading' | 'exit'>('loading')

  useEffect(() => {
    const interval = setInterval(() => {
      setPercent(p => {
        if (p >= 100) {
          clearInterval(interval)
          setTimeout(() => setPhase('exit'), 400)
          setTimeout(() => onDone(), 900)
          return 100
        }
        return p + 17 > 100 ? 100 : p + 17
      })
    }, 180)
    return () => clearInterval(interval)
  }, [onDone])

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 99999,
      background: '#07101E',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      transition: 'opacity 0.6s ease, transform 0.6s ease',
      opacity: phase === 'exit' ? 0 : 1,
      transform: phase === 'exit' ? 'scale(1.03)' : 'scale(1)',
      backgroundImage: 'radial-gradient(circle at center, rgba(0, 168, 150, 0.12) 0%, transparent 70%)',
    }}>
      {/* Center glowing shield with crosshair */}
      <div style={{ position: 'relative', width: 130, height: 130, marginBottom: '2rem' }}>
        {/* Pulsing rings */}
        <div style={{
          position: 'absolute', inset: -20, borderRadius: '50%',
          border: '1.5px solid rgba(0, 210, 196, 0.25)',
          animation: 'metro-pulse 2s infinite ease-out'
        }} />
        <div style={{
          position: 'absolute', inset: -8, borderRadius: '50%',
          border: '1px solid rgba(0, 168, 150, 0.4)',
          animation: 'metro-pulse 2s infinite ease-out 0.4s'
        }} />

        {/* Shield SVG */}
        <svg viewBox="0 0 100 120" width="130" height="130" style={{
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
          {/* Inner glowing crosshair */}
          <line x1="50" y1="36" x2="50" y2="76" stroke="#00D2C4" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="30" y1="56" x2="70" y2="56" stroke="#00D2C4" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="50" cy="56" r="5" fill="#00D2C4" />
        </svg>
      </div>

      {/* Brand Title: K A V A C H */}
      <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
        <h1 style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: 'clamp(2.5rem, 6vw, 4rem)',
          fontWeight: 900,
          letterSpacing: '0.45em',
          margin: 0, lineHeight: 1,
          color: '#fff',
          textIndent: '0.45em',
        }}>
          <span style={{ color: '#00D2C4' }}>K</span>AVACH
        </h1>

        {/* Pill Subtitle */}
        <div style={{
          marginTop: '1.25rem',
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          padding: '0.35rem 1.1rem', borderRadius: 999,
          background: '#0E1A30', border: '1px solid rgba(0, 168, 150, 0.35)',
          fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em',
          color: '#00D2C4', textTransform: 'uppercase',
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00D2C4' }} />
          Government of India • MoSPI • MPLADS AI Vigilance System
        </div>

        <p style={{
          fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.65)',
          margin: '0.85rem 0 0', letterSpacing: '0.02em',
        }}>
          A shield for every rupee, every work, every mile.
        </p>
      </div>

      {/* Progress bar */}
      <div style={{ width: '100%', maxWidth: 360, margin: '1.5rem 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', fontFamily: 'monospace', color: '#00D2C4', marginBottom: '0.4rem', fontWeight: 700 }}>
          <span>INITIALIZING SENTINEL RADAR</span>
          <span>{percent}%</span>
        </div>
        <div style={{ height: 4, background: 'rgba(255, 255, 255, 0.1)', borderRadius: 99, overflow: 'hidden' }}>
          <div style={{
            height: '100%', width: `${percent}%`,
            background: 'linear-gradient(90deg, #00A896, #00D2C4)',
            transition: 'width 0.2s ease',
            boxShadow: '0 0 10px #00D2C4',
          }} />
        </div>
      </div>

      {/* Skip button in bottom right */}
      <button
        onClick={onDone}
        style={{
          position: 'absolute', bottom: '2rem', right: '2.5rem',
          background: 'rgba(14, 26, 48, 0.8)',
          border: '1px solid rgba(0, 168, 150, 0.3)',
          borderRadius: 999, padding: '0.5rem 1.25rem',
          color: '#00D2C4', fontSize: '0.78rem', fontWeight: 700,
          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem',
          transition: 'all 0.2s'
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = '#00D2C4'
          e.currentTarget.style.background = 'rgba(0, 168, 150, 0.15)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = 'rgba(0, 168, 150, 0.3)'
          e.currentTarget.style.background = 'rgba(14, 26, 48, 0.8)'
        }}
      >
        Enter Platform <ArrowRight size={14} />
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
    gradient: 'linear-gradient(135deg, rgba(0, 168, 150, 0.2), rgba(2, 128, 144, 0.05))',
    borderColor: 'rgba(0, 210, 196, 0.35)',
    iconColor: '#00D2C4',
  },
  {
    layerNumber: '02',
    title: 'Geospatial Duplicate Shield',
    hindiTag: 'जीपीएस दोहराव ढाल',
    metric: 'Haversine < 50m',
    phrase: 'Overlaps discovered. Instantly.',
    description: 'Executes high-speed pairwise geodesic proximity sweeps within each district. Surfaces overlapping or double-billed civil works sharing identical physical GPS coordinates.',
    icon: MapPin,
    gradient: 'linear-gradient(135deg, rgba(56, 189, 248, 0.2), rgba(2, 128, 144, 0.05))',
    borderColor: 'rgba(56, 189, 248, 0.35)',
    iconColor: '#38BDF8',
  },
  {
    layerNumber: '03',
    title: 'Timeline & Stagnation Tracker',
    hindiTag: 'कार्य प्रगति एवं निष्क्रियता ट्रैकर',
    metric: '> 90 Days Dormancy',
    phrase: 'Frozen progress. Exposed.',
    description: 'Tracks temporal gaps between fund disbursement tranches and physical ground milestone uploads. Alerts authorities when works stall with substantial advance capital locked.',
    icon: Clock,
    gradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(217, 119, 6, 0.05))',
    borderColor: 'rgba(245, 158, 11, 0.35)',
    iconColor: '#F59E0B',
  },
  {
    layerNumber: '04',
    title: 'Vendor Monopoly & Collusion Index',
    hindiTag: 'ठेकेदार सिंडिकेट विश्लेषण',
    metric: '> 70% Category Allocation',
    phrase: 'Syndicates unveiled. Verified.',
    description: 'Analyzes contracting network graphs across contiguous constituencies to detect bidding cartels, single-bidder awards, and shell-agency fund diversions.',
    icon: Users,
    gradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.05))',
    borderColor: 'rgba(16, 185, 129, 0.35)',
    iconColor: '#10B981',
  },
]

const FUND_JOURNEY_STAGES = [
  {
    id: 1,
    code: 'ST-01',
    name: 'MP Recommendation',
    hindiName: 'सांसद अनुशंसा',
    actor: 'Hon’ble Member of Parliament',
    description: 'Recommends community works within the statutory ₹5.00 Crore annual allocation ceiling via the MoSPI portal.',
    status: 'COMPLETED',
    icon: Landmark,
  },
  {
    id: 2,
    code: 'ST-02',
    name: 'Central Tranche Release',
    hindiName: 'केंद्रीय किस्त निर्गमन',
    actor: 'MoSPI & State Nodal Agency',
    description: 'Central treasury disburses funds to the District Nodal Account under Single Nodal Agency (SNA) guidelines.',
    status: 'COMPLETED',
    icon: IndianRupee,
  },
  {
    id: 3,
    code: 'ST-03',
    name: 'Administrative Sanction',
    hindiName: 'प्रशासनिक स्वीकृति',
    actor: 'District Magistrate / Collector',
    description: 'District Planning Cell verifies land title, feasibility, and tenders work through GeM / State e-Procurement.',
    status: 'COMPLETED',
    icon: Building2,
  },
  {
    id: 4,
    code: 'ST-04',
    name: 'Milestone Execution',
    hindiName: 'निर्माण एवं कार्य प्रगति',
    actor: 'Registered Implementing Agency',
    description: 'Contractor conducts civil works and submits milestone bills with mandatory time-stamped geotag photos.',
    status: 'COMPLETED',
    icon: Clock,
  },
  {
    id: 5,
    code: 'ST-05',
    name: 'NIC GeoTag Verification',
    hindiName: 'जीपीएस जियोटैग सत्यापन',
    actor: 'NIC Mobile Sentinel Core',
    description: 'Field officer captures high-accuracy GPS coordinates, altitude, and physical site evidence on the ground.',
    status: 'COMPLETED',
    icon: MapPin,
  },
  {
    id: 6,
    code: 'ST-06',
    name: 'KAVACH AI Inspection Gate',
    hindiName: 'कवच एआई सुरक्षा गेट',
    actor: 'Autonomous Neural Vigilance Engine',
    description: 'Simultaneous 4-signal verification: Haversine distance, Z-score cost baseline, timeline drift, and vendor monopoly.',
    status: 'ACTIVE_GATE',
    icon: ShieldCheck,
    isGate: true,
  },
  {
    id: 7,
    code: 'ST-07',
    name: 'Public Asset Commissioned',
    hindiName: 'सार्वजनिक संपत्ति लोकार्पण',
    actor: 'Citizens & Statutory Audit Portal',
    description: '100% reconciled digital asset register published with transparent public audit trail and electronic UC.',
    status: 'FINAL',
    icon: CheckCircle2,
  },
]

const CONSTITUENCIES = [
  {
    id: 'varanasi',
    code: 'UP-VAR',
    name: 'Varanasi',
    nativeName: 'वाराणसी',
    state: 'Uttar Pradesh',
    mp: 'Shri Narendra Modi',
    sanctioned: '₹24.80 Cr',
    actual: '₹21.40 Cr',
    worksCount: 48,
    flaggedCount: 3,
    status: 'ALERT',
    alertDesc: 'Geo-Duplicate Triplet detected in Solar Lighting project (28.4m overlap)',
    lat: 25.3176,
    lng: 82.9739,
    bannerColor: 'from-[#00A896] to-[#028090]',
    categorySplit: 'Solar (42%), Community Halls (28%), Roads (30%)',
    topWork: 'Solar Street Light Grid - Sector 4',
  },
  {
    id: 'gandhinagar',
    code: 'GJ-GAN',
    name: 'Gandhinagar',
    nativeName: 'ગાંધીનગર',
    state: 'Gujarat',
    mp: 'Shri Amit Shah',
    sanctioned: '₹23.50 Cr',
    actual: '₹19.80 Cr',
    worksCount: 42,
    flaggedCount: 2,
    status: 'ALERT',
    alertDesc: '210-Day Stagnation & 80% advance disbursement with 0% field milestone',
    lat: 23.2156,
    lng: 72.6369,
    bannerColor: 'from-[#F59E0B] to-[#D97706]',
    categorySplit: 'Civil Infrastructure (50%), Drainage (30%), Water (20%)',
    topWork: 'Multi-Purpose Community Hall - Shanti Nagar',
  },
  {
    id: 'bangalore_south',
    code: 'KA-BLR',
    name: 'Bangalore South',
    nativeName: 'ಬೆಂಗಳೂರು ದಕ್ಷಿಣ',
    state: 'Karnataka',
    mp: 'Shri Tejasvi Surya',
    sanctioned: '₹24.20 Cr',
    actual: '₹22.10 Cr',
    worksCount: 52,
    flaggedCount: 0,
    status: 'VERIFIED',
    alertDesc: '100% Works verified with tamper-proof GPS coordinates and audit vouchers',
    lat: 12.9716,
    lng: 77.5946,
    bannerColor: 'from-[#10B981] to-[#059669]',
    categorySplit: 'STEM Labs (45%), Digital Classrooms (35%), Parks (20%)',
    topWork: 'Government High School Digital STEM Lab',
  },
  {
    id: 'chennai_central',
    code: 'TN-CHE',
    name: 'Chennai Central',
    nativeName: 'சென்னை மத்திய',
    state: 'Tamil Nadu',
    mp: 'Shri Dayanidhi Maran',
    sanctioned: '₹22.90 Cr',
    actual: '₹21.00 Cr',
    worksCount: 38,
    flaggedCount: 2,
    status: 'ALERT',
    alertDesc: '3.8x Unit Cost Deviation in concrete stormwater drainage pipeline',
    lat: 13.0827,
    lng: 80.2707,
    bannerColor: 'from-[#EF4444] to-[#B91C1C]',
    categorySplit: 'Storm Drainage (60%), RO Water Plants (25%), Roads (15%)',
    topWork: 'Concrete Stormwater Drainage Channel',
  },
  {
    id: 'lucknow',
    code: 'UP-LUC',
    name: 'Lucknow',
    nativeName: 'लखनऊ',
    state: 'Uttar Pradesh',
    mp: 'Shri Rajnath Singh',
    sanctioned: '₹24.00 Cr',
    actual: '₹20.50 Cr',
    worksCount: 44,
    flaggedCount: 2,
    status: 'ALERT',
    alertDesc: 'Monopoly vendor award pattern & 3.24σ cost outlier on community hall roof',
    lat: 26.8467,
    lng: 80.9462,
    bannerColor: 'from-[#F59E0B] to-[#D97706]',
    categorySplit: 'Community Halls (40%), Solar High-Masts (35%), Health (25%)',
    topWork: 'District Community Hall Renovation',
  },
  {
    id: 'pune',
    code: 'MH-PUN',
    name: 'Pune',
    nativeName: 'पुणे',
    state: 'Maharashtra',
    mp: 'Shri Murlidhar Mohol',
    sanctioned: '₹23.80 Cr',
    actual: '₹19.20 Cr',
    worksCount: 40,
    flaggedCount: 1,
    status: 'ALERT',
    alertDesc: '18m Geotag proximity overlap with previously sanctioned municipal work',
    lat: 18.5204,
    lng: 73.8567,
    bannerColor: 'from-[#00A896] to-[#028090]',
    categorySplit: 'Urban Roads (45%), Smart Classrooms (30%), Solar (25%)',
    topWork: 'Ambedkar Road Pavement & LED Installation',
  },
  {
    id: 'wayanad',
    code: 'KL-WAY',
    name: 'Wayanad',
    nativeName: 'വയനാട്',
    state: 'Kerala',
    mp: 'Smt. Priyanka Gandhi Vadra',
    sanctioned: '₹22.50 Cr',
    actual: '₹18.90 Cr',
    worksCount: 36,
    flaggedCount: 1,
    status: 'ALERT',
    alertDesc: 'Disbursement > 85% with reported completion stagnant at 12%',
    lat: 11.6854,
    lng: 76.132,
    bannerColor: 'from-[#F59E0B] to-[#D97706]',
    categorySplit: 'Tribal Infrastructure (50%), Drinking Water (30%), Solar (20%)',
    topWork: 'Tribal Community Center Water Purification',
  },
  {
    id: 'new_delhi',
    code: 'DL-DEL',
    name: 'New Delhi',
    nativeName: 'नई दिल्ली',
    state: 'Delhi (UT)',
    mp: 'Smt. Bansuri Swaraj',
    sanctioned: '₹25.00 Cr',
    actual: '₹23.80 Cr',
    worksCount: 50,
    flaggedCount: 0,
    status: 'VERIFIED',
    alertDesc: 'Full electronic UC reconciliation with verified physical asset tags',
    lat: 28.6139,
    lng: 77.209,
    bannerColor: 'from-[#10B981] to-[#059669]',
    categorySplit: 'Park Gymnasium (40%), LED Mast (30%), Public Toilets (30%)',
    topWork: 'Lodhi Colony Public Health Center Upgradation',
  },
]

const TEAM_MEMBERS = [
  {
    initials: 'SK',
    name: 'Shresth & Team KAVACH',
    role: 'Lead Architect & Systems Engineering',
    specialization: 'High-concurrency Vigilance Engine • Full-Stack Orchestration • Enterprise Security',
    icon: ShieldCheck,
  },
  {
    initials: 'ML',
    name: 'ML Detection Engineer',
    role: 'Statistical & Outlier Modeling',
    specialization: 'Cost Z-Score Baselines • Dynamic IQR Models • Time-Series Drift',
    icon: Zap,
  },
  {
    initials: 'GS',
    name: 'Geospatial GIS Specialist',
    role: 'Spatial & Geodesic Intelligence',
    specialization: 'Haversine Matrix • Spatial Clustering • PostGIS & EXIF Verification',
    icon: MapPin,
  },
  {
    initials: 'DE',
    name: 'Scheme Data Pipeline Engineer',
    role: 'MoSPI & Public Finance Integration',
    specialization: '543 Constituency Official Dataset • UC Audit Reconciliations',
    icon: FileText,
  },
]

/* ─── 3. Main Landing Page ────────────────────────────────────────────────── */
export default function LandingPage() {
  const navigate = useNavigate()
  const [loaded, setLoaded] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeStage, setActiveStage] = useState(5) // Default to KAVACH AI Gate
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
    <div style={{ background: '#07101E', color: '#F1F5F9', minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* ── Kavach Animated Loader (Screenshot 2) ── */}
      {!loaded && <KavachLoader onDone={() => setLoaded(true)} />}

      {/* ── Top Navbar (Screenshot 1) ── */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        transition: 'all 0.3s ease',
        background: scrolled ? 'rgba(7, 16, 30, 0.95)' : 'rgba(7, 16, 30, 0.75)',
        backdropFilter: 'blur(16px)',
        borderBottom: scrolled ? '1px solid rgba(0, 168, 150, 0.25)' : '1px solid rgba(255, 255, 255, 0.06)',
        padding: '0.85rem 2rem',
        boxShadow: scrolled ? '0 10px 30px rgba(0, 0, 0, 0.5)' : 'none',
      }}>
        <div style={{
          maxWidth: 1520, margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem',
        }}>
          {/* Brand */}
          <a href="#hero" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12,
              background: 'linear-gradient(135deg, #00A896, #028090)',
              padding: 2, display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 15px rgba(0, 168, 150, 0.3)'
            }}>
              <div style={{
                width: '100%', height: '100%', borderRadius: 10,
                background: '#07101E', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Shield size={20} color="#00D2C4" strokeWidth={2.5} />
              </div>
            </div>
            <div>
              <div style={{ fontSize: '1.15rem', fontWeight: 900, letterSpacing: '0.08em', color: '#fff' }}>
                KAVACH
              </div>
              <div style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.12em', color: '#00D2C4', textTransform: 'uppercase' }}>
                MoSPI • MPLADS AI Vigilance System
              </div>
            </div>
          </a>

          {/* Nav Links */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '2rem' }} className="hidden lg:flex">
            {[
              { label: 'OVERVIEW', href: '#hero' },
              { label: 'FUND JOURNEY', href: '#fund-journey' },
              { label: 'VERIFICATION LAB', href: '#verification-lab' },
              { label: 'EXPLORE NETWORK', href: '#explore-network' },
              { label: 'DETECTION RADAR', href: '#how-it-works' },
              { label: 'TEAM', href: '#team' },
            ].map(item => (
              <a
                key={item.label}
                href={item.href}
                style={{
                  color: 'rgba(241, 245, 249, 0.75)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textDecoration: 'none',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = '#00D2C4')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(241, 245, 249, 0.75)')}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Action CTAs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <button
              onClick={() => setShowDossierModal(true)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.45rem',
                padding: '0.55rem 1.15rem', borderRadius: 999,
                background: 'rgba(14, 26, 48, 0.8)',
                border: '1px solid rgba(0, 168, 150, 0.3)',
                color: '#E2E8F0', fontSize: '0.78rem', fontWeight: 700,
                cursor: 'pointer', transition: 'all 0.2s'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = '#00D2C4'
                e.currentTarget.style.color = '#00D2C4'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(0, 168, 150, 0.3)'
                e.currentTarget.style.color = '#E2E8F0'
              }}
            >
              <FileText size={14} />
              Audit Dossier
            </button>

            <button
              onClick={() => navigate('/dashboard')}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.6rem 1.35rem', borderRadius: 999,
                background: 'linear-gradient(135deg, #00A896 0%, #00D2C4 100%)',
                border: 'none',
                color: '#07101E', fontSize: '0.8rem', fontWeight: 800,
                cursor: 'pointer', transition: 'all 0.2s',
                boxShadow: '0 4px 20px rgba(0, 168, 150, 0.35)'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-1px)'
                e.currentTarget.style.boxShadow = '0 6px 25px rgba(0, 210, 196, 0.5)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 168, 150, 0.35)'
              }}
            >
              <Layers size={14} />
              Launch AI Console →
            </button>
          </div>
        </div>
      </header>

      {/* ── 4. Hero Section (Screenshot 1) ── */}
      <section id="hero" style={{
        paddingTop: '8.5rem', paddingBottom: '5rem', paddingLeft: '2rem', paddingRight: '2rem',
        maxWidth: 1440, margin: '0 auto', position: 'relative', overflow: 'hidden'
      }}>
        {/* Background ambient glow */}
        <div style={{
          position: 'absolute', top: '10%', left: '20%', width: 500, height: 500,
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(0, 168, 150, 0.1) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.9fr', gap: '3.5rem', alignItems: 'center' }}>
          {/* Left Hero Column */}
          <div>
            {/* Pill Tag */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
              padding: '0.4rem 1.1rem', borderRadius: 999,
              background: '#0E1A30', border: '1px solid rgba(0, 168, 150, 0.35)',
              fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.12em',
              color: '#00D2C4', textTransform: 'uppercase', marginBottom: '1.75rem',
            }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#00D2C4' }} />
              The Heartbeat of MPLADS Vigilance
            </div>

            {/* Main Headline */}
            <h1 style={{
              fontSize: 'clamp(2.8rem, 5.5vw, 4.8rem)',
              fontWeight: 900,
              lineHeight: 1.08,
              letterSpacing: '-0.03em',
              color: '#fff',
              margin: '0 0 1.5rem',
            }}>
              Shielding <span style={{ color: '#00D2C4' }}>Funds</span><br />
              Connecting <span style={{
                background: 'linear-gradient(90deg, #00D2C4, #38BDF8)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>Citizens</span>
            </h1>

            {/* Subtext */}
            <p style={{
              fontSize: '1.05rem', color: '#94A3B8', lineHeight: 1.7,
              maxWidth: 580, margin: '0 0 2.25rem',
            }}>
              Autonomous multi-signal AI vigilance platform for India's <strong style={{ color: '#fff', fontWeight: 700 }}>₹83,180 Crore</strong> MPLADS scheme across <strong style={{ color: '#00D2C4', fontWeight: 700 }}>543 Lok Sabha constituencies</strong>. Detecting cost outliers, GPS duplicates, and milestone delays in real time.
            </p>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '3.5rem' }}>
              <button
                onClick={() => navigate('/dashboard')}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.9rem 2.25rem', borderRadius: 999,
                  background: 'linear-gradient(135deg, #00A896, #00D2C4)',
                  border: 'none', color: '#07101E', fontSize: '0.9rem', fontWeight: 800,
                  cursor: 'pointer', boxShadow: '0 8px 30px rgba(0, 168, 150, 0.4)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 12px 35px rgba(0, 210, 196, 0.55)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 168, 150, 0.4)'
                }}
              >
                <Shield size={16} strokeWidth={2.5} />
                Launch AI Command Console →
              </button>

              <button
                onClick={() => {
                  const el = document.getElementById('verification-lab')
                  if (el) el.scrollIntoView({ behavior: 'smooth' })
                }}
                style={{
                  padding: '0.9rem 2rem', borderRadius: 999,
                  background: 'rgba(14, 26, 48, 0.7)',
                  border: '1.5px solid rgba(0, 168, 150, 0.35)',
                  color: '#E2E8F0', fontSize: '0.9rem', fontWeight: 700,
                  cursor: 'pointer', transition: 'all 0.2s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = '#00D2C4'
                  e.currentTarget.style.color = '#00D2C4'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(0, 168, 150, 0.35)'
                  e.currentTarget.style.color = '#E2E8F0'
                }}
              >
                Explore Verification Lab
              </button>
            </div>

            {/* Scheme Metrics Row */}
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '1.5rem', borderTop: '1px solid rgba(148, 163, 184, 0.15)', paddingTop: '2rem'
            }}>
              <div>
                <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#fff', lineHeight: 1 }}>543</div>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#00D2C4', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '0.4rem' }}>
                  Constituencies
                </div>
              </div>
              <div>
                <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#fff', lineHeight: 1 }}>
                  ₹83,180 <span style={{ fontSize: '1.1rem', color: '#94A3B8' }}>Cr</span>
                </div>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#00D2C4', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '0.4rem' }}>
                  Scheme Outlay
                </div>
              </div>
              <div>
                <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#fff', lineHeight: 1 }}>
                  &lt; 50 <span style={{ fontSize: '1.1rem', color: '#94A3B8' }}>m</span>
                </div>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#00D2C4', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '0.4rem' }}>
                  Geo-Precision
                </div>
              </div>
            </div>
          </div>

          {/* Right Hero Column: National Sentinel Mesh Preview Card (Screenshot 1) */}
          <div>
            <div style={{
              background: '#0E1A30',
              border: '1.5px solid rgba(0, 168, 150, 0.3)',
              borderRadius: 24,
              padding: '1.75rem',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(0, 168, 150, 0.1)',
              position: 'relative', overflow: 'hidden'
            }}>
              {/* Card Header */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                paddingBottom: '1.25rem', marginBottom: '1.25rem',
                borderBottom: '1px solid rgba(148, 163, 184, 0.12)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981', boxShadow: '0 0 8px #10B981' }} />
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#E2E8F0' }}>
                    National Sentinel Mesh
                  </span>
                </div>
                <span style={{
                  fontSize: '0.7rem', fontWeight: 700, fontFamily: 'monospace',
                  color: '#00D2C4', background: 'rgba(0, 168, 150, 0.12)',
                  padding: '0.2rem 0.6rem', borderRadius: 999, border: '1px solid rgba(0, 210, 196, 0.25)'
                }}>
                  1,269 Works Active
                </span>
              </div>

              {/* Alert 1: Varanasi (Red) */}
              <div style={{
                background: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: 14, padding: '1rem', marginBottom: '0.85rem',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: 'rgba(239, 68, 68, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <AlertTriangle size={18} color="#EF4444" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#fff' }}>
                      Varanasi • Solar Street Light Grid
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#FCA5A5', marginTop: '0.15rem' }}>
                      Geo-Duplicate Triplet (28.4m overlap)
                    </div>
                  </div>
                </div>
                <span style={{
                  padding: '0.25rem 0.6rem', borderRadius: 8,
                  background: 'rgba(239, 68, 68, 0.2)', color: '#EF4444',
                  fontSize: '0.75rem', fontWeight: 800, fontFamily: 'monospace', flexShrink: 0
                }}>
                  93/100
                </span>
              </div>

              {/* Alert 2: Lucknow (Amber) */}
              <div style={{
                background: 'rgba(245, 158, 11, 0.08)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                borderRadius: 14, padding: '1rem', marginBottom: '0.85rem',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Zap size={18} color="#F59E0B" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#fff' }}>
                      Lucknow • Community Hall Roof
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#FDE68A', marginTop: '0.15rem' }}>
                      Cost Z-Score Outlier (3.24σ baseline)
                    </div>
                  </div>
                </div>
                <span style={{
                  padding: '0.25rem 0.6rem', borderRadius: 8,
                  background: 'rgba(245, 158, 11, 0.2)', color: '#F59E0B',
                  fontSize: '0.75rem', fontWeight: 800, fontFamily: 'monospace', flexShrink: 0
                }}>
                  78/100
                </span>
              </div>

              {/* Alert 3: Bangalore South (Clear Green) */}
              <div style={{
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: 14, padding: '1rem', marginBottom: '1.25rem',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <CheckCircle2 size={18} color="#10B981" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#fff' }}>
                      Bangalore South • High School Lab
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#6EE7B7', marginTop: '0.15rem' }}>
                      Milestone Verified • UC Reconciled
                    </div>
                  </div>
                </div>
                <span style={{
                  padding: '0.25rem 0.6rem', borderRadius: 8,
                  background: 'rgba(16, 185, 129, 0.2)', color: '#10B981',
                  fontSize: '0.72rem', fontWeight: 800, fontFamily: 'monospace', flexShrink: 0
                }}>
                  CLEAR
                </span>
              </div>

              {/* Card Footer */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                paddingTop: '1rem', borderTop: '1px solid rgba(148, 163, 184, 0.12)',
              }}>
                <span style={{ fontSize: '0.75rem', color: '#94A3B8', fontFamily: 'monospace' }}>
                  Haversine + Z-Score Engine
                </span>
                <button
                  onClick={() => navigate('/dashboard')}
                  style={{
                    background: 'none', border: 'none', color: '#00D2C4',
                    fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '0.3rem',
                  }}
                >
                  Inspect in Live Console →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. Explore the Network Section (Screenshot 3) ── */}
      <section id="explore-network" style={{
        padding: '5rem 2rem', background: '#050B14',
        borderTop: '1px solid rgba(0, 168, 150, 0.2)', borderBottom: '1px solid rgba(0, 168, 150, 0.2)',
        position: 'relative'
      }}>
        <div style={{ maxWidth: 1440, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2 style={{
              fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 900,
              letterSpacing: '-0.02em', color: '#fff', margin: '0 0 0.75rem',
            }}>
              Explore the Network
            </h2>
            <p style={{ fontSize: '0.95rem', color: '#94A3B8', maxWidth: 650, margin: '0 auto' }}>
              Click or select any constituency node to inspect active works, fund utilization &amp; anomaly status.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2.5rem', alignItems: 'stretch' }}>
            {/* Left Box: National Vigilance Corridors Interactive Map */}
            <div style={{
              background: '#0E1A30',
              border: '1px solid rgba(0, 168, 150, 0.3)',
              borderRadius: 20, padding: '1.75rem',
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              minHeight: 460, position: 'relative', overflow: 'hidden'
            }}>
              {/* Map Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', zIndex: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#00D2C4' }} />
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#E2E8F0' }}>
                    National Vigilance Corridors
                  </span>
                </div>
                <span style={{ fontSize: '0.7rem', color: '#94A3B8', fontFamily: 'monospace' }}>
                  543 Constituencies • 28 States
                </span>
              </div>

              {/* Interactive Node Graph */}
              <div style={{ position: 'relative', flex: 1, minHeight: 320 }}>
                {/* SVG Connecting Transit Lines */}
                <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                  <line x1="28%" y1="25%" x2="52%" y2="35%" stroke="#00A896" strokeWidth="2" strokeDasharray="4 4" />
                  <line x1="52%" y1="35%" x2="65%" y2="40%" stroke="#00D2C4" strokeWidth="2.5" />
                  <line x1="28%" y1="25%" x2="25%" y2="50%" stroke="#00A896" strokeWidth="2" />
                  <line x1="25%" y1="50%" x2="35%" y2="65%" stroke="#00A896" strokeWidth="2" />
                  <line x1="35%" y1="65%" x2="48%" y2="80%" stroke="#10B981" strokeWidth="2.5" />
                  <line x1="48%" y1="80%" x2="60%" y2="82%" stroke="#EF4444" strokeWidth="2" strokeDasharray="4 4" />
                  <line x1="48%" y1="80%" x2="42%" y2="90%" stroke="#F59E0B" strokeWidth="2" />
                </svg>

                {/* Node Buttons */}
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
                        width: isSelected ? 36 : 28,
                        height: isSelected ? 36 : 28,
                        borderRadius: '50%',
                        background: isSelected
                          ? '#00D2C4'
                          : isAlert ? 'rgba(239, 68, 68, 0.25)' : 'rgba(16, 185, 129, 0.25)',
                        border: isSelected
                          ? '3px solid #fff'
                          : isAlert ? '1.5px solid #EF4444' : '1.5px solid #10B981',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: isSelected ? '#07101E' : isAlert ? '#EF4444' : '#10B981',
                        boxShadow: isSelected ? '0 0 20px #00D2C4' : 'none',
                        transition: 'all 0.2s'
                      }}>
                        <MapPin size={isSelected ? 18 : 14} />
                      </div>
                      <span style={{
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        padding: '0.15rem 0.5rem',
                        borderRadius: 6,
                        background: isSelected ? '#fff' : 'rgba(7, 16, 30, 0.9)',
                        color: isSelected ? '#07101E' : '#E2E8F0',
                        border: isSelected ? 'none' : '1px solid rgba(148, 163, 184, 0.2)',
                        whiteSpace: 'nowrap',
                        boxShadow: isSelected ? '0 2px 8px rgba(0, 0, 0, 0.3)' : 'none',
                      }}>
                        {node.name}
                      </span>
                    </button>
                  )
                })}
              </div>

              {/* Map Footer Legend */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                paddingTop: '0.85rem', borderTop: '1px solid rgba(148, 163, 184, 0.12)',
                fontSize: '0.72rem', color: '#94A3B8'
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
                <span style={{ color: '#00D2C4', fontWeight: 700 }}>Click pin to inspect</span>
              </div>
            </div>

            {/* Right Box: Constituency Audit Card (Screenshot 3) */}
            <div style={{
              background: '#fff',
              color: '#0F172A',
              borderRadius: 20,
              padding: '1.75rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.5)',
              position: 'relative', overflow: 'hidden'
            }}>
              <div>
                {/* Top Banner */}
                <div style={{
                  background: selectedConstituency.status === 'ALERT'
                    ? 'linear-gradient(135deg, #00A896, #028090)'
                    : 'linear-gradient(135deg, #10B981, #059669)',
                  color: '#fff',
                  borderRadius: 14,
                  padding: '1rem 1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '1.5rem',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.15)'
                }}>
                  <div>
                    <div style={{ fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.9 }}>
                      {selectedConstituency.code} • {selectedConstituency.state}
                    </div>
                    <div style={{ fontSize: '1.6rem', fontWeight: 900, marginTop: '0.15rem' }}>
                      {selectedConstituency.nativeName}
                    </div>
                  </div>
                  {selectedConstituency.flaggedCount > 0 ? (
                    <span style={{
                      padding: '0.35rem 0.8rem', borderRadius: 999,
                      background: 'rgba(0, 0, 0, 0.35)', color: '#fff',
                      fontSize: '0.75rem', fontWeight: 800,
                    }}>
                      🛡️ {selectedConstituency.flaggedCount} Flagged
                    </span>
                  ) : (
                    <span style={{
                      padding: '0.35rem 0.8rem', borderRadius: 999,
                      background: 'rgba(255, 255, 255, 0.25)', color: '#fff',
                      fontSize: '0.75rem', fontWeight: 800,
                    }}>
                      ✓ 100% Clear
                    </span>
                  )}
                </div>

                {/* Constituency Name & MP */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                    <h3 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0F172A', margin: 0 }}>
                      {selectedConstituency.name}
                    </h3>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B' }}>
                      MP: {selectedConstituency.mp}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '0.15rem' }}>
                    {selectedConstituency.nativeName}
                  </div>
                </div>

                {/* 2-Column Metrics */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                  <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 12, padding: '1rem' }}>
                    <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Sanctioned Funds
                    </div>
                    <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0F172A', marginTop: '0.2rem' }}>
                      {selectedConstituency.sanctioned}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '0.15rem' }}>
                      Actual: {selectedConstituency.actual}
                    </div>
                  </div>

                  <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 12, padding: '1rem' }}>
                    <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Total Works
                    </div>
                    <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0F172A', marginTop: '0.2rem' }}>
                      {selectedConstituency.worksCount} Works
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#10B981', fontWeight: 700, marginTop: '0.15rem' }}>
                      GPS Geotagged: 100%
                    </div>
                  </div>
                </div>

                {/* Active Anomaly Finding Notice */}
                <div style={{
                  background: selectedConstituency.status === 'ALERT' ? '#FEF2F2' : '#F0FDF4',
                  border: selectedConstituency.status === 'ALERT' ? '1px solid #FECACA' : '1px solid #BBF7D0',
                  borderRadius: 12, padding: '1rem', marginBottom: '1.5rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                    {selectedConstituency.status === 'ALERT' ? (
                      <AlertTriangle size={18} color="#EF4444" style={{ marginTop: 2, flexShrink: 0 }} />
                    ) : (
                      <CheckCircle2 size={18} color="#10B981" style={{ marginTop: 2, flexShrink: 0 }} />
                    )}
                    <div>
                      <div style={{
                        fontSize: '0.75rem', fontWeight: 800,
                        color: selectedConstituency.status === 'ALERT' ? '#B91C1C' : '#15803D'
                      }}>
                        {selectedConstituency.status === 'ALERT' ? 'Active Anomaly Finding' : 'Audit Reconciled'}
                      </div>
                      <p style={{
                        fontSize: '0.78rem',
                        color: selectedConstituency.status === 'ALERT' ? '#991B1B' : '#166534',
                        margin: '0.2rem 0 0', lineHeight: 1.5
                      }}>
                        {selectedConstituency.alertDesc}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Inspect Button */}
              <button
                onClick={() => navigate('/dashboard')}
                style={{
                  width: '100%',
                  padding: '0.9rem',
                  borderRadius: 12,
                  background: '#07101E',
                  color: '#fff',
                  border: 'none',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  letterSpacing: '0.05em',
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                  boxShadow: '0 4px 15px rgba(7, 16, 30, 0.25)',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = '#0E1A30')}
                onMouseLeave={e => (e.currentTarget.style.background = '#07101E')}
              >
                INSPECT IN LIVE CONSOLE →
              </button>
            </div>
          </div>

          {/* Bottom Constituency Selector Carousel (Screenshot 3) */}
          <div style={{
            marginTop: '2.5rem',
            background: 'rgba(14, 26, 48, 0.6)',
            border: '1px solid rgba(0, 168, 150, 0.25)',
            borderRadius: 999,
            padding: '0.6rem 1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            overflowX: 'auto',
          }}>
            {CONSTITUENCIES.map(c => {
              const isSelected = activeConstId === c.id
              const isAlert = c.status === 'ALERT'
              return (
                <button
                  key={c.id}
                  onClick={() => setActiveConstId(c.id)}
                  style={{
                    flexShrink: 0,
                    display: 'flex', alignItems: 'center', gap: '0.45rem',
                    padding: '0.45rem 1.1rem', borderRadius: 999,
                    background: isSelected
                      ? '#00A896'
                      : 'rgba(7, 16, 30, 0.75)',
                    color: isSelected ? '#07101E' : '#E2E8F0',
                    border: isSelected ? '1px solid #00D2C4' : '1px solid rgba(148, 163, 184, 0.15)',
                    fontSize: '0.75rem', fontWeight: 800,
                    cursor: 'pointer', transition: 'all 0.15s'
                  }}
                >
                  <span style={{
                    width: 7, height: 7, borderRadius: '50%',
                    background: isAlert ? '#EF4444' : '#10B981'
                  }} />
                  <span>{c.name}</span>
                  <span style={{ fontSize: '0.65rem', opacity: 0.75 }}>({c.code})</span>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── 6. Fund Journey Section ── */}
      <section id="fund-journey" style={{
        padding: '5rem 2rem', background: '#07101E', position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ maxWidth: 1440, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.35rem 1rem', borderRadius: 999,
              background: '#0E1A30', border: '1px solid rgba(0, 168, 150, 0.3)',
              fontSize: '0.7rem', fontWeight: 800, color: '#00D2C4', textTransform: 'uppercase',
              marginBottom: '1rem', letterSpacing: '0.1em'
            }}>
              Corridor Transit Lifecycle
            </div>
            <h2 style={{
              fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 900,
              letterSpacing: '-0.02em', color: '#fff', margin: '0 0 0.75rem',
            }}>
              The Fund's Journey
            </h2>
            <p style={{ fontSize: '0.95rem', color: '#94A3B8', maxWidth: 650, margin: '0 auto' }}>
              From initial MP sanction to final citizen asset — every transit station monitored in real time.
            </p>
          </div>

          {/* 7-Station Interactive Rail */}
          <div style={{ position: 'relative', marginBottom: '2.5rem' }}>
            {/* Progress line */}
            <div style={{
              position: 'absolute', top: 24, left: 30, right: 30, height: 4,
              background: '#15233E', borderRadius: 99, zIndex: 0
            }}>
              <div style={{
                height: '100%',
                width: `${((activeStage + 1) / FUND_JOURNEY_STAGES.length) * 100}%`,
                background: 'linear-gradient(90deg, #00A896, #00D2C4)',
                borderRadius: 99, transition: 'width 0.3s ease',
                boxShadow: '0 0 12px #00D2C4',
              }} />
            </div>

            {/* Stations */}
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
                        ? isGate ? 'rgba(239, 68, 68, 0.2)' : 'rgba(0, 168, 150, 0.2)'
                        : 'rgba(14, 26, 48, 0.85)',
                      border: isSelected
                        ? isGate ? '2px solid #EF4444' : '2px solid #00D2C4'
                        : '1px solid rgba(148, 163, 184, 0.15)',
                      borderRadius: 16,
                      padding: '1rem 0.5rem',
                      display: 'flex', flexDirection: 'column', alignItems: 'center',
                      textAlign: 'center', cursor: 'pointer',
                      boxShadow: isSelected ? '0 10px 25px rgba(0, 168, 150, 0.25)' : 'none',
                      transform: isSelected ? 'scale(1.04)' : 'scale(1)',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{
                      width: 44, height: 44, borderRadius: 12,
                      background: isSelected
                        ? isGate ? '#EF4444' : '#00A896'
                        : isGate ? 'rgba(239, 68, 68, 0.15)' : '#15233E',
                      color: isSelected ? '#fff' : isGate ? '#EF4444' : '#94A3B8',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      marginBottom: '0.6rem',
                    }}>
                      <Icon size={20} />
                    </div>
                    <span style={{ fontSize: '0.62rem', fontFamily: 'monospace', color: '#94A3B8', fontWeight: 700 }}>
                      {st.code}
                    </span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#fff', marginTop: '0.2rem', lineHeight: 1.3 }}>
                      {st.name}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Active Station Explainer Card */}
          <div style={{
            background: '#0E1A30',
            border: currentStage.isGate ? '1.5px solid rgba(239, 68, 68, 0.5)' : '1px solid rgba(0, 168, 150, 0.3)',
            borderRadius: 20, padding: '2rem',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
                  <span style={{
                    padding: '0.2rem 0.6rem', borderRadius: 6,
                    background: currentStage.isGate ? 'rgba(239, 68, 68, 0.2)' : 'rgba(0, 168, 150, 0.2)',
                    color: currentStage.isGate ? '#EF4444' : '#00D2C4',
                    fontFamily: 'monospace', fontWeight: 800, fontSize: '0.75rem'
                  }}>
                    {currentStage.code}
                  </span>
                  <span style={{ fontSize: '0.9rem', color: '#94A3B8' }}>{currentStage.hindiName}</span>
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#fff', margin: '0 0 0.5rem' }}>
                  {currentStage.name}
                </h3>
                <div style={{ fontSize: '0.8rem', color: '#00D2C4', fontWeight: 700, marginBottom: '1rem' }}>
                  Authorized Actor: {currentStage.actor}
                </div>
                <p style={{ fontSize: '0.92rem', color: '#CBD5E1', lineHeight: 1.7, maxWidth: 800, margin: 0 }}>
                  {currentStage.description}
                </p>
              </div>

              <div style={{
                background: 'rgba(7, 16, 30, 0.8)',
                border: '1px solid rgba(148, 163, 184, 0.15)',
                borderRadius: 14, padding: '1.25rem', minWidth: 260,
              }}>
                <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Transit Status
                </div>
                <div style={{
                  fontSize: '1.1rem', fontWeight: 900,
                  color: currentStage.isGate ? '#EF4444' : '#10B981',
                  marginTop: '0.25rem'
                }}>
                  {currentStage.status === 'ACTIVE_GATE' ? 'AI GATE ACTIVE' : currentStage.status}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#94A3B8', marginTop: '0.5rem', lineHeight: 1.5 }}>
                  Continuous surveillance operating before public capital release.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. Four Layers of Protection Section (Screenshot 4) ── */}
      <section id="how-it-works" style={{
        padding: '5rem 2rem', background: '#050B14',
        borderTop: '1px solid rgba(0, 168, 150, 0.2)', borderBottom: '1px solid rgba(0, 168, 150, 0.2)',
      }}>
        <div style={{ maxWidth: 1440, margin: '0 auto' }}>
          {/* Section Header */}
          <div style={{
            display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: '1.5rem', marginBottom: '3.5rem',
            paddingBottom: '1.5rem', borderBottom: '1px solid rgba(148, 163, 184, 0.12)'
          }}>
            <div>
              <div style={{
                fontSize: '0.72rem', fontWeight: 900, letterSpacing: '0.25em',
                color: '#00D2C4', textTransform: 'uppercase', marginBottom: '0.5rem'
              }}>
                Integrated Surveillance Radar
              </div>
              <h2 style={{
                fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 900,
                letterSpacing: '-0.02em', color: '#fff', margin: 0, textTransform: 'uppercase'
              }}>
                Four Layers of Protection
              </h2>
            </div>
            <p style={{ fontSize: '0.88rem', color: '#94A3B8', maxWidth: 420, margin: 0, lineHeight: 1.6 }}>
              Continuous multi-vector anomaly detection operating simultaneously on every sanctioned rupee.
            </p>
          </div>

          {/* 4 Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
            {FOUR_LAYERS.map(layer => {
              const Icon = layer.icon
              return (
                <div
                  key={layer.layerNumber}
                  style={{
                    background: '#0E1A30',
                    border: `1px solid ${layer.borderColor}`,
                    borderRadius: 20,
                    padding: '1.75rem',
                    display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                    minHeight: 330,
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.35)',
                    transition: 'transform 0.2s, border-color 0.2s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-4px)'
                    e.currentTarget.style.borderColor = layer.iconColor
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.borderColor = layer.borderColor
                  }}
                >
                  <div>
                    {/* Icon and Metric Badge */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                      <div style={{
                        width: 44, height: 44, borderRadius: 12,
                        background: layer.gradient,
                        border: `1px solid ${layer.borderColor}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>
                        <Icon size={22} color={layer.iconColor} />
                      </div>
                      <span style={{
                        fontSize: '0.68rem', fontWeight: 800, fontFamily: 'monospace',
                        padding: '0.25rem 0.65rem', borderRadius: 999,
                        background: 'rgba(7, 16, 30, 0.8)', border: `1px solid ${layer.borderColor}`,
                        color: layer.iconColor
                      }}>
                        {layer.metric}
                      </span>
                    </div>

                    {/* Hindi Label & Title */}
                    <div style={{ fontSize: '0.72rem', color: '#94A3B8', marginBottom: '0.35rem' }}>
                      {layer.hindiTag}
                    </div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#fff', margin: '0 0 0.35rem' }}>
                      {layer.title}
                    </h3>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: layer.iconColor, marginBottom: '0.85rem' }}>
                      {layer.phrase}
                    </div>

                    {/* Description */}
                    <p style={{ fontSize: '0.82rem', color: '#94A3B8', lineHeight: 1.65, margin: 0 }}>
                      {layer.description}
                    </p>
                  </div>

                  {/* Footer */}
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    paddingTop: '1.25rem', marginTop: '1.5rem',
                    borderTop: '1px solid rgba(148, 163, 184, 0.12)',
                    fontSize: '0.72rem', fontFamily: 'monospace', color: '#64748B'
                  }}>
                    <span>LAYER {layer.layerNumber}</span>
                    <span style={{ color: '#10B981', fontWeight: 800 }}>Active ✓</span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Bottom Statement Callout Card (Screenshot 4) */}
          <div style={{
            background: 'rgba(14, 26, 48, 0.75)',
            border: '1px solid rgba(0, 168, 150, 0.3)',
            borderRadius: 20, padding: '2rem 2.5rem',
            textAlign: 'center',
            boxShadow: '0 15px 40px rgba(0, 0, 0, 0.4)'
          }}>
            <p style={{
              fontSize: '0.92rem', color: '#CBD5E1', lineHeight: 1.8,
              maxWidth: 960, margin: '0 auto 1.5rem'
            }}>
              KAVACH acts as the high-tech vigilance backbone of India's parliamentary development infrastructure, pioneering fully autonomous multi-signal anomaly discovery. Traversing 543 constituencies and over 1,200 active works across 28 states, the platform delivers instantaneous, mathematically explainable risk scores that safeguard public funds before final disbursement tranches are released.
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.75rem 2rem', borderRadius: 999,
                background: 'linear-gradient(135deg, #00A896, #00D2C4)',
                border: 'none', color: '#07101E', fontSize: '0.85rem', fontWeight: 800,
                cursor: 'pointer', boxShadow: '0 4px 20px rgba(0, 168, 150, 0.35)'
              }}
            >
              Inspect Multi-Signal Engine In Live Console →
            </button>
          </div>
        </div>
      </section>

      {/* ── 8. Interactive Verification Lab Teaser ── */}
      <section id="verification-lab" style={{ padding: '5rem 2rem', background: '#07101E' }}>
        <div style={{ maxWidth: 1440, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.35rem 1rem', borderRadius: 999,
              background: '#0E1A30', border: '1px solid rgba(0, 168, 150, 0.3)',
              fontSize: '0.7rem', fontWeight: 800, color: '#00D2C4', textTransform: 'uppercase',
              marginBottom: '1rem', letterSpacing: '0.1em'
            }}>
              Interactive Verification Laboratory
            </div>
            <h2 style={{
              fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 900,
              letterSpacing: '-0.02em', color: '#fff', margin: '0 0 0.75rem',
            }}>
              How KAVACH Verifies Ground Truth
            </h2>
            <p style={{ fontSize: '0.95rem', color: '#94A3B8', maxWidth: 680, margin: '0 auto' }}>
              Inspect real ground photographs, test autonomous multi-signal AI verification algorithms, and generate tamper-proof audit dossiers.
            </p>
          </div>

          <div style={{
            background: '#0E1A30',
            border: '1.5px solid rgba(0, 168, 150, 0.35)',
            borderRadius: 24, padding: '2.5rem',
            display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '3rem', alignItems: 'center'
          }}>
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#00D2C4', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                EXIF GPS vs Registered Geofence
              </div>
              <h3 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#fff', margin: '0 0 1rem' }}>
                Mathematical Geodesic Validation
              </h3>
              <p style={{ fontSize: '0.9rem', color: '#94A3B8', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                When project milestone evidence photos are submitted, KAVACH strips raw EXIF metadata directly inside the browser, calculating distance offsets against official MoSPI GIS records using the Haversine formula.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.85rem', color: '#CBD5E1' }}>
                  <CheckCircle2 size={16} color="#10B981" />
                  <span>Pairwise GPS Clustering: Checks if photos were taken in distinct locations</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.85rem', color: '#CBD5E1' }}>
                  <CheckCircle2 size={16} color="#10B981" />
                  <span>SHA-256 Duplicate Check: Prevents identical image re-use across milestones</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.85rem', color: '#CBD5E1' }}>
                  <CheckCircle2 size={16} color="#10B981" />
                  <span>Temporal Drift: Validates image timestamp against sanction date</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/photos')}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.85rem 2rem', borderRadius: 999,
                  background: 'linear-gradient(135deg, #00A896, #00D2C4)',
                  border: 'none', color: '#07101E', fontSize: '0.88rem', fontWeight: 800,
                  cursor: 'pointer', boxShadow: '0 4px 20px rgba(0, 168, 150, 0.35)'
                }}
              >
                Launch Verification Lab →
              </button>
            </div>

            <div style={{
              background: 'rgba(7, 16, 30, 0.9)',
              border: '1px solid rgba(0, 210, 196, 0.25)',
              borderRadius: 18, padding: '1.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid rgba(148, 163, 184, 0.12)', paddingBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: '#00D2C4' }}>
                  Live Geofence Radar Preview
                </span>
                <span style={{ fontSize: '0.68rem', fontFamily: 'monospace', color: '#10B981' }}>
                  24.2m Deviation (PASS)
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '1rem' }}>
                <div style={{ background: '#0E1A30', padding: '0.85rem', borderRadius: 10 }}>
                  <div style={{ fontSize: '0.65rem', color: '#94A3B8' }}>Declared Coordinates</div>
                  <div style={{ fontSize: '0.8rem', fontFamily: 'monospace', color: '#fff', marginTop: '0.2rem' }}>
                    26.8467°N, 80.9462°E
                  </div>
                </div>
                <div style={{ background: '#0E1A30', padding: '0.85rem', borderRadius: 10 }}>
                  <div style={{ fontSize: '0.65rem', color: '#94A3B8' }}>Extracted EXIF Geotag</div>
                  <div style={{ fontSize: '0.8rem', fontFamily: 'monospace', color: '#00D2C4', marginTop: '0.2rem' }}>
                    26.8469°N, 80.9464°E
                  </div>
                </div>
              </div>

              <div style={{
                background: 'rgba(0, 168, 150, 0.08)',
                border: '1px solid rgba(0, 210, 196, 0.2)',
                borderRadius: 10, padding: '0.85rem', fontSize: '0.78rem', color: '#94A3B8', lineHeight: 1.6
              }}>
                <strong style={{ color: '#00D2C4' }}>Haversine Tolerance &lt; 50m:</strong> Ground photographic evidence is within the verified spatial geofence envelope. No synthetic vendor attributed without declaration.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 9. Team Section ── */}
      <section id="team" style={{
        padding: '5rem 2rem', background: '#050B14',
        borderTop: '1px solid rgba(0, 168, 150, 0.2)', borderBottom: '1px solid rgba(0, 168, 150, 0.2)',
      }}>
        <div style={{ maxWidth: 1440, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.35rem 1rem', borderRadius: 999,
              background: '#0E1A30', border: '1px solid rgba(0, 168, 150, 0.3)',
              fontSize: '0.7rem', fontWeight: 800, color: '#00D2C4', textTransform: 'uppercase',
              marginBottom: '1rem', letterSpacing: '0.1em'
            }}>
              Systems Architecture &amp; Engineering
            </div>
            <h2 style={{
              fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 900,
              letterSpacing: '-0.02em', color: '#fff', margin: '0 0 0.75rem',
            }}>
              Team KAVACH
            </h2>
            <p style={{ fontSize: '0.95rem', color: '#94A3B8', maxWidth: 650, margin: '0 auto' }}>
              Architected for the Ministry of Statistics &amp; Programme Implementation (MoSPI).
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
            {TEAM_MEMBERS.map((m, idx) => {
              const Icon = m.icon
              return (
                <div
                  key={idx}
                  style={{
                    background: '#0E1A30',
                    border: '1px solid rgba(148, 163, 184, 0.15)',
                    borderRadius: 20, padding: '1.75rem',
                    display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'rgba(0, 210, 196, 0.4)'
                    e.currentTarget.style.transform = 'translateY(-3px)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'rgba(148, 163, 184, 0.15)'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                >
                  <div>
                    <div style={{
                      width: 52, height: 52, borderRadius: 14,
                      background: 'linear-gradient(135deg, #00A896, #028090)',
                      padding: 2, marginBottom: '1.25rem'
                    }}>
                      <div style={{
                        width: '100%', height: '100%', borderRadius: 12,
                        background: '#0E1A30', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 900, color: '#00D2C4', fontSize: '1.1rem'
                      }}>
                        {m.initials}
                      </div>
                    </div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#fff', margin: '0 0 0.25rem' }}>
                      {m.name}
                    </h3>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#00D2C4', marginBottom: '0.85rem' }}>
                      {m.role}
                    </div>
                    <p style={{ fontSize: '0.8rem', color: '#94A3B8', lineHeight: 1.6, margin: 0 }}>
                      {m.specialization}
                    </p>
                  </div>

                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    paddingTop: '1rem', marginTop: '1.5rem',
                    borderTop: '1px solid rgba(148, 163, 184, 0.1)',
                    fontSize: '0.7rem', color: '#64748B', fontFamily: 'monospace'
                  }}>
                    <span>MoSPI SENTINEL</span>
                    <Icon size={14} color="#00D2C4" />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── 10. Footer ── */}
      <footer style={{
        background: '#050B14',
        padding: '4rem 2rem 2.5rem',
        borderTop: '1px solid rgba(0, 168, 150, 0.2)',
      }}>
        <div style={{
          maxWidth: 1440, margin: '0 auto',
          display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: '3rem', marginBottom: '3rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
              <div style={{
                width: 32, height: 32, borderRadius: 10,
                background: 'linear-gradient(135deg, #00A896, #028090)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Shield size={16} color="#fff" />
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: 900, letterSpacing: '0.05em', color: '#fff' }}>
                KAVACH
              </span>
            </div>
            <p style={{ fontSize: '0.82rem', color: '#94A3B8', lineHeight: 1.7, maxWidth: 360, margin: '0 0 1rem' }}>
              Autonomous AI-powered multi-signal monitoring and fraud detection platform for India's MPLADS scheme.
            </p>
            <div style={{ fontSize: '0.72rem', color: '#00D2C4', fontFamily: 'monospace' }}>
              MoSPI • Government of India
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#fff', marginBottom: '1rem' }}>
              Platform Modules
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {[
                { label: 'Overview & Mission', href: '#hero' },
                { label: 'Corridor Fund Journey', href: '#fund-journey' },
                { label: 'Explore 543 Constituencies', href: '#explore-network' },
                { label: 'Interactive Verification Lab', href: '#verification-lab' },
                { label: 'Live Command Console', to: '/dashboard' },
              ].map((link, i) => (
                <li key={i}>
                  {link.to ? (
                    <button
                      onClick={() => navigate(link.to)}
                      style={{ background: 'none', border: 'none', padding: 0, color: '#94A3B8', fontSize: '0.8rem', cursor: 'pointer', textAlign: 'left' }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#00D2C4')}
                      onMouseLeave={e => (e.currentTarget.style.color = '#94A3B8')}
                    >
                      {link.label}
                    </button>
                  ) : (
                    <a
                      href={link.href}
                      style={{ color: '#94A3B8', fontSize: '0.8rem', textDecoration: 'none' }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#00D2C4')}
                      onMouseLeave={e => (e.currentTarget.style.color = '#94A3B8')}
                    >
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#fff', marginBottom: '1rem' }}>
              Statutory Authority
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8rem', color: '#94A3B8', lineHeight: 1.6 }}>
              <span style={{ color: '#E2E8F0', fontWeight: 700 }}>Ministry of Statistics &amp; Programme Implementation</span>
              <span>Government of India • New Delhi</span>
              <span>Governed under MPLADS Guidelines 2023</span>
              <span>Single Nodal Agency (SNA) Electronic Framework</span>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#fff', marginBottom: '1rem' }}>
              Actions &amp; Resources
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <a
                href="https://github.com/ShrestHitz/Kavach-prototype"
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '0.6rem 0.85rem', borderRadius: 10,
                  background: '#0E1A30', border: '1px solid rgba(148, 163, 184, 0.15)',
                  color: '#CBD5E1', fontSize: '0.78rem', fontWeight: 700, textDecoration: 'none'
                }}
              >
                <span>GitHub Repository</span>
                <ExternalLink size={13} color="#00D2C4" />
              </a>

              <button
                onClick={() => setLoaded(false)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '0.6rem 0.85rem', borderRadius: 10,
                  background: '#0E1A30', border: '1px solid rgba(148, 163, 184, 0.15)',
                  color: '#CBD5E1', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer'
                }}
              >
                <span>Replay Introduction</span>
                <RotateCcw size={13} color="#00D2C4" />
              </button>

              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '0.6rem 0.85rem', borderRadius: 10,
                  background: '#0E1A30', border: '1px solid rgba(148, 163, 184, 0.15)',
                  color: '#CBD5E1', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer'
                }}
              >
                <span>Back to Top</span>
                <ArrowRight size={13} color="#00D2C4" />
              </button>
            </div>
          </div>
        </div>

        <div style={{
          maxWidth: 1440, margin: '0 auto', paddingTop: '2rem',
          borderTop: '1px solid rgba(148, 163, 184, 0.12)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          fontSize: '0.72rem', color: '#64748B'
        }}>
          <div>
            KAVACH • AUTONOMOUS PARLIAMENTARY VIGILANCE PLATFORM
          </div>
          <div>
            MOSPI VIGILANCE &amp; STATUTORY AUDIT DIVISION
          </div>
        </div>
      </footer>

      {/* ── 11. Audit Dossier Modal ── */}
      {showDossierModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 99999,
          background: 'rgba(5, 11, 20, 0.85)', backdropFilter: 'blur(12px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '1.5rem'
        }}>
          <div style={{
            width: '100%', maxWidth: 700, background: '#0A1628',
            border: '1.5px solid rgba(0, 210, 196, 0.4)', borderRadius: 20,
            overflow: 'hidden', boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7)'
          }}>
            <div style={{
              padding: '1.25rem 1.5rem', background: '#07101E',
              borderBottom: '1px solid rgba(0, 168, 150, 0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <FileText size={18} color="#00D2C4" />
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>
                  KAVACH Statutory Audit Dossier
                </h3>
              </div>
              <button
                onClick={() => setShowDossierModal(false)}
                style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.85rem', marginBottom: '1.25rem' }}>
                <div style={{ background: '#0E1A30', padding: '0.85rem', borderRadius: 10, textAlign: 'center' }}>
                  <div style={{ fontSize: '0.65rem', color: '#94A3B8', textTransform: 'uppercase' }}>National Outlay</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#00D2C4', marginTop: '0.2rem' }}>₹83,180 Cr</div>
                </div>
                <div style={{ background: '#0E1A30', padding: '0.85rem', borderRadius: 10, textAlign: 'center' }}>
                  <div style={{ fontSize: '0.65rem', color: '#94A3B8', textTransform: 'uppercase' }}>Active Works</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#fff', marginTop: '0.2rem' }}>1,269 Works</div>
                </div>
                <div style={{ background: '#0E1A30', padding: '0.85rem', borderRadius: 10, textAlign: 'center' }}>
                  <div style={{ fontSize: '0.65rem', color: '#94A3B8', textTransform: 'uppercase' }}>Flagged Anomalies</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#EF4444', marginTop: '0.2rem' }}>20 Works</div>
                </div>
              </div>

              <div style={{
                background: 'rgba(0, 168, 150, 0.08)', border: '1px solid rgba(0, 210, 196, 0.25)',
                borderRadius: 12, padding: '1rem', marginBottom: '1.25rem', fontSize: '0.82rem', color: '#CBD5E1', lineHeight: 1.7
              }}>
                <strong>MoSPI Statutory Audit Summary:</strong> All 543 Lok Sabha parliamentary constituencies are enrolled under the 4-layer autonomous vigilance grid. Disbursed capital is protected via Haversine distance geofencing, Z-Score cost modeling, timeline dormancy verification, and vendor network monopoly scanning.
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  onClick={() => setShowDossierModal(false)}
                  style={{
                    padding: '0.65rem 1.25rem', borderRadius: 999,
                    background: 'none', border: '1px solid rgba(148, 163, 184, 0.25)',
                    color: '#94A3B8', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer'
                  }}
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowDossierModal(false)
                    navigate('/dashboard')
                  }}
                  style={{
                    padding: '0.65rem 1.5rem', borderRadius: 999,
                    background: 'linear-gradient(135deg, #00A896, #00D2C4)',
                    border: 'none', color: '#07101E', fontSize: '0.82rem', fontWeight: 800, cursor: 'pointer'
                  }}
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
