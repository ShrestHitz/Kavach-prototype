import { useState } from 'react'
import {
  Zap, MapPin, Clock, IndianRupee, ShieldAlert,
  ChevronRight, X, CheckCircle2, AlertTriangle, ArrowUpRight
} from 'lucide-react'

export interface PlantedCase {
  id: string
  badge: string
  score: number
  title: string
  constituency: string
  mp: string
  sanctioned: string
  actual: string
  type: string
  typeBadge: string
  color: string
  badgeBg: string
  signalEvidence: string
  mathematicalProof: string
  statutoryAction: string
}

export const PLANTED_CASES: PlantedCase[] = [
  {
    id: 'case-solar-varanasi',
    badge: 'Cost Outlier (5.6x)',
    score: 93,
    title: 'Solar Unit Cost ₹1.35L (Varanasi)',
    constituency: 'Varanasi (UP-VAR)',
    mp: 'Shri Narendra Modi',
    sanctioned: '₹1.35 Cr',
    actual: '₹1.20 Cr',
    type: 'Cost Inflation Outlier',
    typeBadge: 'Z-Score: +5.62σ',
    color: 'from-rose-500/20 to-orange-500/10 border-rose-500/40 text-rose-300',
    badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    signalEvidence: 'Unit rate of ₹1.35 Lakhs per solar unit is 5.6x higher than the peer state median of ₹24,000 per unit.',
    mathematicalProof: 'Z = (135000 - 24000) / 19740 = +5.62σ (Threshold Z ≥ 2.50σ for critical audit escalation).',
    statutoryAction: 'Immediate stop-payment order on remaining tranche. Mandate physical audit of procurement invoices via GeM rate comparison.',
  },
  {
    id: 'case-road-lucknow',
    badge: 'Road Outlier (4.9x)',
    score: 93,
    title: 'Road at ₹1.42 Cr/km (Lucknow)',
    constituency: 'Lucknow (UP-LUC)',
    mp: 'Shri Rajnath Singh',
    sanctioned: '₹4.26 Cr',
    actual: '₹3.90 Cr',
    type: 'Pavement Cost Anomaly',
    typeBadge: 'Z-Score: +4.88σ',
    color: 'from-rose-500/20 to-orange-500/10 border-rose-500/40 text-rose-300',
    badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    signalEvidence: 'Sanctioned rate of ₹1.42 Cr/km for standard 3.75m village link road exceeds the UP PWD scheduled rates by 488%.',
    mathematicalProof: 'IQR Outlier: Cost exceeds Q3 + 3.0*(IQR) baseline across 12 contiguous parliamentary constituencies.',
    statutoryAction: 'Requisition Measurement Book (MB) and core-sample compression test before approving Utilization Certificate.',
  },
  {
    id: 'case-geo-varanasi',
    badge: 'Geo-Duplicate (22m)',
    score: 91,
    title: 'CC Road Overlap (Varanasi)',
    constituency: 'Varanasi (UP-VAR)',
    mp: 'Shri Narendra Modi',
    sanctioned: '₹45.0 Lakhs',
    actual: '₹42.5 Lakhs',
    type: 'Geospatial Duplicate Overlap',
    typeBadge: 'Haversine: 22.4m',
    color: 'from-purple-500/20 to-indigo-500/10 border-purple-500/40 text-purple-300',
    badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    signalEvidence: 'Two independent works sanctioned with overlapping GPS coordinates (25.3176°N, 82.9739°E) within a 22.4m radius.',
    mathematicalProof: 'Geodesic Distance d = 2R · arcsin(√(sin²(Δφ/2) + cos(φ1)cos(φ2)sin²(Δλ/2))) = 22.4m (< 50m tolerance).',
    statutoryAction: 'Flag potential double-billing for identical civil ground assets. Requisition geo-tagged site photographs with altitude verification.',
  },
  {
    id: 'case-geo-pune',
    badge: 'Geo-Duplicate (18m)',
    score: 91,
    title: 'Health Clinic Overlap (Pune)',
    constituency: 'Pune (MH-PUN)',
    mp: 'Shri Murlidhar Mohol',
    sanctioned: '₹65.0 Lakhs',
    actual: '₹58.0 Lakhs',
    type: 'Municipal Asset Duplicate',
    typeBadge: 'Haversine: 18.1m',
    color: 'from-purple-500/20 to-indigo-500/10 border-purple-500/40 text-purple-300',
    badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    signalEvidence: 'Primary Health Sub-Center shares identical footprint with existing municipal clinic constructed under earlier state allocation.',
    mathematicalProof: 'Spatial proximity sweep matched centroid coordinates with 18.1m deviation, verified against 2024 municipal registry.',
    statutoryAction: 'Notify District Vigilance Committee (DVC) for on-site physical inspection and land record title check.',
  },
  {
    id: 'case-stalled-wayanad',
    badge: 'Stalled (195 Days)',
    score: 72,
    title: 'Hill Road Stuck 15% (Wayanad)',
    constituency: 'Wayanad (KL-WAY)',
    mp: 'Smt. Priyanka Gandhi Vadra',
    sanctioned: '₹1.80 Cr',
    actual: '₹1.44 Cr',
    type: 'Progress Stagnation',
    typeBadge: 'Dormancy: 195 Days',
    color: 'from-amber-500/20 to-yellow-500/10 border-amber-500/40 text-amber-300',
    badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    signalEvidence: 'Tranche advance of 80% capital released 195 days ago, but reported physical milestone remains frozen at 15%.',
    mathematicalProof: 'Temporal delta: t_last_update - t_disbursement = 195 days (Standard milestone dormancy SLA: 90 days).',
    statutoryAction: 'Issue formal notice to District Planning Officer. Initiate forfeiture of contractor performance guarantee.',
  },
  {
    id: 'case-fund-chennai',
    badge: 'Fund Mismatch (92%)',
    score: 90,
    title: '92% Paid for 12% Done (Chennai)',
    constituency: 'Chennai Central (TN-CHE)',
    mp: 'Shri Dayanidhi Maran',
    sanctioned: '₹2.10 Cr',
    actual: '₹1.93 Cr',
    type: 'Disbursement-Physical Gap',
    typeBadge: 'Gap: +80% Disparity',
    color: 'from-cyan-500/20 to-blue-500/10 border-cyan-500/40 text-cyan-300',
    badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    signalEvidence: '92% of total sanctioned project funds disbursed while verified ground civil progress remains at only 12%.',
    mathematicalProof: 'Disbursement Gap Metric: D% - P% = 92% - 12% = 80% (Maximum allowable financial-physical deviation: 20%).',
    statutoryAction: 'Freeze Single Nodal Account (SNA) disbursements. Requisition bank statement trail and vendor payment records.',
  },
]

export default function PlantedAnomalyInspector({ onSelectCase }: { onSelectCase?: (c: PlantedCase) => void }) {
  const [selectedCase, setSelectedCase] = useState<PlantedCase | null>(null)
  const [trancheFrozen, setTrancheFrozen] = useState(false)

  const handleOpen = (c: PlantedCase) => {
    setSelectedCase(c)
    setTrancheFrozen(false)
    if (onSelectCase) onSelectCase(c)
  }

  return (
    <div style={{
      background: 'rgba(14, 26, 48, 0.85)',
      backdropFilter: 'blur(16px)',
      border: '1px solid rgba(0, 168, 150, 0.3)',
      borderRadius: 16,
      padding: '1rem 1.25rem',
      marginBottom: '1.75rem',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 0 16px rgba(0, 168, 150, 0.05)'
    }}>
      {/* Top Strip Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '0.85rem',
        flexWrap: 'wrap',
        gap: '0.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            padding: '0.3rem',
            borderRadius: 6,
            background: 'linear-gradient(135deg, #F59E0B, #EF4444)',
            color: '#07101E',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Zap size={14} strokeWidth={2.5} />
          </div>
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 800,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#E2E8F0'
          }}>
            Live Pitch Walkthrough (1-Click Planted Anomaly Inspector)
          </span>
          <span style={{
            fontSize: '0.7rem',
            color: '#94A3B8',
            marginLeft: '0.25rem'
          }}>
            — Click any test case below to inspect explainable AI scoring &amp; geo-clustering live
          </span>
        </div>

        <span style={{
          fontSize: '0.68rem',
          fontFamily: 'monospace',
          fontWeight: 700,
          color: '#00D2C4',
          background: 'rgba(0, 168, 150, 0.15)',
          padding: '0.2rem 0.6rem',
          borderRadius: 6,
          border: '1px solid rgba(0, 210, 196, 0.3)'
        }}>
          18 Planted Cases Ready
        </span>
      </div>

      {/* Horizontal Scrollable Case Buttons */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        overflowX: 'auto',
        paddingBottom: '0.35rem'
      }}>
        {PLANTED_CASES.map(c => {
          const isSelected = selectedCase?.id === c.id
          return (
            <button
              key={c.id}
              onClick={() => handleOpen(c)}
              style={{
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                padding: '0.6rem 0.85rem',
                borderRadius: 12,
                textAlign: 'left',
                border: isSelected
                  ? '1.5px solid #00D2C4'
                  : '1px solid rgba(148, 163, 184, 0.18)',
                background: isSelected
                  ? 'rgba(0, 168, 150, 0.22)'
                  : 'rgba(7, 16, 30, 0.85)',
                color: '#fff',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: isSelected ? '0 0 16px rgba(0, 210, 196, 0.25)' : 'none'
              }}
              onMouseEnter={e => {
                if (!isSelected) {
                  e.currentTarget.style.borderColor = 'rgba(0, 210, 196, 0.4)'
                  e.currentTarget.style.background = 'rgba(14, 26, 48, 0.95)'
                }
              }}
              onMouseLeave={e => {
                if (!isSelected) {
                  e.currentTarget.style.borderColor = 'rgba(148, 163, 184, 0.18)'
                  e.currentTarget.style.background = 'rgba(7, 16, 30, 0.85)'
                }
              }}
            >
              <div style={{
                padding: '0.35rem',
                borderRadius: 8,
                background: 'rgba(0, 0, 0, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Zap size={14} color={c.score >= 90 ? '#F87171' : '#FBBF24'} />
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.15rem' }}>
                  <span style={{
                    fontSize: '0.62rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    padding: '0.1rem 0.4rem',
                    borderRadius: 4,
                    background: 'rgba(0, 0, 0, 0.5)',
                    color: c.score >= 90 ? '#FCA5A5' : '#FDE68A'
                  }}>
                    {c.badge}
                  </span>
                  <span style={{
                    fontSize: '0.65rem',
                    fontFamily: 'monospace',
                    color: '#94A3B8'
                  }}>
                    Score: {c.score}
                  </span>
                </div>
                <div style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#F8FAFC',
                  maxWidth: 190,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {c.title}
                </div>
              </div>

              <ChevronRight size={14} color="#64748B" style={{ marginLeft: '0.2rem' }} />
            </button>
          )
        })}
      </div>

      {/* Modal Inspector for Active Case */}
      {selectedCase && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          background: 'rgba(5, 11, 20, 0.85)',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem'
        }}>
          <div style={{
            width: '100%',
            maxWidth: 680,
            background: '#0A1628',
            border: '1.5px solid rgba(0, 210, 196, 0.4)',
            borderRadius: 20,
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7), 0 0 30px rgba(0, 168, 150, 0.2)',
            overflow: 'hidden',
            animation: 'fadeIn 0.25s ease'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '1.25rem 1.5rem',
              background: 'linear-gradient(90deg, #07101E 0%, #0E1A30 100%)',
              borderBottom: '1px solid rgba(0, 168, 150, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <ShieldAlert size={20} color="#EF4444" />
                </div>
                <div>
                  <div style={{
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.12em',
                    color: '#00D2C4'
                  }}>
                    Autonomous Vigilance Finding · {selectedCase.constituency}
                  </div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>
                    {selectedCase.title}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setSelectedCase(null)}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: 'none',
                  borderRadius: '50%',
                  width: 32,
                  height: 32,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#94A3B8',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.18)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)')}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '1.5rem', maxHeight: '75vh', overflowY: 'auto' }}>
              {/* Top Highlights Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '0.75rem',
                marginBottom: '1.25rem'
              }}>
                <div style={{
                  background: 'rgba(14, 26, 48, 0.7)',
                  border: '1px solid rgba(0, 168, 150, 0.15)',
                  borderRadius: 12,
                  padding: '0.75rem',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '0.62rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 700 }}>
                    Risk Score
                  </div>
                  <div style={{
                    fontSize: '1.4rem',
                    fontWeight: 900,
                    color: selectedCase.score >= 90 ? '#EF4444' : '#F59E0B',
                    marginTop: '0.2rem'
                  }}>
                    {selectedCase.score}/100
                  </div>
                </div>

                <div style={{
                  background: 'rgba(14, 26, 48, 0.7)',
                  border: '1px solid rgba(0, 168, 150, 0.15)',
                  borderRadius: 12,
                  padding: '0.75rem',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '0.62rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 700 }}>
                    Algorithm Signal
                  </div>
                  <div style={{
                    fontSize: '0.85rem',
                    fontWeight: 800,
                    color: '#00D2C4',
                    marginTop: '0.4rem',
                    fontFamily: 'monospace'
                  }}>
                    {selectedCase.typeBadge}
                  </div>
                </div>

                <div style={{
                  background: 'rgba(14, 26, 48, 0.7)',
                  border: '1px solid rgba(0, 168, 150, 0.15)',
                  borderRadius: 12,
                  padding: '0.75rem',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '0.62rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 700 }}>
                    Sanction Outlay
                  </div>
                  <div style={{
                    fontSize: '1.1rem',
                    fontWeight: 800,
                    color: '#fff',
                    marginTop: '0.3rem'
                  }}>
                    {selectedCase.sanctioned}
                  </div>
                </div>

                <div style={{
                  background: 'rgba(14, 26, 48, 0.7)',
                  border: '1px solid rgba(0, 168, 150, 0.15)',
                  borderRadius: 12,
                  padding: '0.75rem',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '0.62rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 700 }}>
                    Disbursed Tranche
                  </div>
                  <div style={{
                    fontSize: '1.1rem',
                    fontWeight: 800,
                    color: '#F1F5F9',
                    marginTop: '0.3rem'
                  }}>
                    {selectedCase.actual}
                  </div>
                </div>
              </div>

              {/* MP & Constituency Info */}
              <div style={{
                background: 'rgba(14, 26, 48, 0.6)',
                border: '1px solid rgba(0, 168, 150, 0.2)',
                borderRadius: 12,
                padding: '0.85rem 1.1rem',
                marginBottom: '1rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <span style={{ fontSize: '0.65rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 700 }}>
                    Nodal Parliamentary Representative
                  </span>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#fff', marginTop: '0.15rem' }}>
                    {selectedCase.mp}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.65rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 700 }}>
                    Anomaly Vector
                  </span>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#F87171', marginTop: '0.15rem' }}>
                    {selectedCase.type}
                  </div>
                </div>
              </div>

              {/* Mathematical Proof Card */}
              <div style={{
                background: 'rgba(7, 16, 30, 0.85)',
                border: '1px solid rgba(0, 210, 196, 0.25)',
                borderRadius: 14,
                padding: '1rem 1.15rem',
                marginBottom: '1rem'
              }}>
                <div style={{
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: '#00D2C4',
                  marginBottom: '0.4rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}>
                  <Zap size={13} /> Mathematical &amp; Algorithmic Evidence
                </div>
                <p style={{ margin: '0 0 0.6rem', fontSize: '0.84rem', color: '#E2E8F0', lineHeight: 1.6 }}>
                  {selectedCase.signalEvidence}
                </p>
                <div style={{
                  fontFamily: 'monospace',
                  fontSize: '0.75rem',
                  background: 'rgba(0, 0, 0, 0.5)',
                  padding: '0.5rem 0.75rem',
                  borderRadius: 8,
                  color: '#38BDF8',
                  border: '1px solid rgba(56, 189, 248, 0.2)'
                }}>
                  {selectedCase.mathematicalProof}
                </div>
              </div>

              {/* Statutory Action Recommendation */}
              <div style={{
                background: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                borderRadius: 14,
                padding: '1rem 1.15rem',
                marginBottom: '1.25rem'
              }}>
                <div style={{
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: '#F87171',
                  marginBottom: '0.35rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}>
                  <AlertTriangle size={13} /> Recommended MoSPI Statutory Action
                </div>
                <p style={{ margin: 0, fontSize: '0.82rem', color: '#FCA5A5', lineHeight: 1.6 }}>
                  {selectedCase.statutoryAction}
                </p>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                <button
                  onClick={() => setTrancheFrozen(!trancheFrozen)}
                  style={{
                    padding: '0.65rem 1.25rem',
                    borderRadius: 999,
                    border: trancheFrozen ? '1px solid #10B981' : '1px solid rgba(239, 68, 68, 0.5)',
                    background: trancheFrozen ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                    color: trancheFrozen ? '#34D399' : '#F87171',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}
                >
                  {trancheFrozen ? <CheckCircle2 size={15} /> : <ShieldAlert size={15} />}
                  {trancheFrozen ? 'Tranche Frozen on SNA ✓' : 'Simulate Tranche Freeze'}
                </button>

                <button
                  onClick={() => setSelectedCase(null)}
                  style={{
                    padding: '0.65rem 1.4rem',
                    borderRadius: 999,
                    border: 'none',
                    background: 'linear-gradient(135deg, #00A896, #00D2C4)',
                    color: '#07101E',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: '0 4px 15px rgba(0, 168, 150, 0.3)'
                  }}
                >
                  Dismiss Inspector
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
