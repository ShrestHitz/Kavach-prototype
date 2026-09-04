/**
 * PhotoVerificationPage — Multi-photo geospatial fraud analysis
 * Phase 1: Upload 4-5 photos → full risk report (GPS clustering,
 * Haversine, Z-score cost, vendor monopoly, duplicate detection)
 */
import { useState, useRef, useCallback } from 'react'
import {
  Upload, Camera, MapPin, Clock, Hash, AlertTriangle,
  CheckCircle2, XCircle, BarChart2, Users, IndianRupee,
  FileText, ChevronDown, ChevronUp, RefreshCw, Shield, Zap
} from 'lucide-react'
import {
  analyzePhotoBatch,
  type AnalysisReport,
  type ProjectMeta,
} from '../utils/photoAnalysis'

// ── Demo project presets ────────────────────────────────────────
const DEMO_PRESETS: (ProjectMeta & { label: string; desc: string })[] = [
  {
    label: 'Road Construction — UP (Suspicious)',
    desc: 'Same-spot photos + high cost + vendor monopoly',
    projectCode: 'DEMO-ROAD-UP-001',
    declaredLat: 26.8467,
    declaredLon: 80.9462,
    sanctionDate: '2024-03-01',
    milestoneDays: 90,
    unitCost: 38.5,
    state: 'Uttar Pradesh',
    projectType: 'road',
    vendor: 'Sharma Constructions',
  },
  {
    label: 'School Building — Bihar (Clean)',
    desc: 'Valid timestamps, unique photos, normal cost',
    projectCode: 'DEMO-SCHOOL-BR-002',
    declaredLat: 25.5941,
    declaredLon: 85.1376,
    sanctionDate: '2023-06-01',
    milestoneDays: 180,
    unitCost: 26.0,
    state: 'Bihar',
    projectType: 'school',
    vendor: 'Patna Builders',
  },
  {
    label: 'Health Centre — Rajasthan (Pre-sanction)',
    desc: 'Photo timestamps pre-date sanction',
    projectCode: 'DEMO-HEALTH-RJ-003',
    declaredLat: 27.0238,
    declaredLon: 74.2179,
    sanctionDate: '2024-06-15',
    milestoneDays: 120,
    unitCost: 29.0,
    state: 'Rajasthan',
    projectType: 'health',
    vendor: 'RK Infra',
  },
]

// ── Risk level colors ──────────────────────────────────────────
const RISK_COLORS: Record<string, string> = {
  CRITICAL: '#ef4444',
  HIGH:     '#f97316',
  MEDIUM:   '#f59e0b',
  LOW:      '#10b981',
  CLEAN:    '#10b981',
}

// ── Gauge component ────────────────────────────────────────────
function RiskGauge({ score, level }: { score: number; level: string }) {
  const color = RISK_COLORS[level] || '#6b7280'
  const circumference = 2 * Math.PI * 52
  const offset = circumference - (score / 100) * circumference

  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 160, height: 160 }}>
      <svg width="160" height="160" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="80" cy="80" r="52" fill="none" stroke="#E2E8F0" strokeWidth="12" />
        <circle
          cx="80" cy="80" r="52" fill="none"
          stroke={color} strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)', filter: `drop-shadow(0 0 8px ${color}60)` }}
        />
      </svg>
      <div style={{ position: 'absolute', textAlign: 'center' }}>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2.8rem', lineHeight: 1, color }}>{score}</div>
        <div style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.12em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{level}</div>
      </div>
    </div>
  )
}

// ── Anomaly card ───────────────────────────────────────────────
function AnomalyCard({ icon, title, status, children }: {
  icon: React.ReactNode
  title: string
  status: 'PASS' | 'FLAG' | 'WARN' | 'NA'
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(true)
  const col = status === 'PASS' ? '#10b981' : status === 'FLAG' ? '#ef4444' : status === 'WARN' ? '#f59e0b' : '#6b7280'
  const label = status === 'PASS' ? 'PASS' : status === 'FLAG' ? 'FLAGGED' : status === 'WARN' ? 'WARNING' : 'N/A'

  return (
    <div style={{
      background: `${col}08`, border: `1px solid ${col}22`,
      borderRadius: 14, overflow: 'hidden', marginBottom: '0.85rem',
      transition: 'all 0.2s',
    }}>
      <div
        style={{
          display: 'flex', alignItems: 'center', gap: '0.85rem',
          padding: '1rem 1.25rem', cursor: 'pointer',
          borderBottom: open ? `1px solid ${col}15` : 'none',
        }}
        onClick={() => setOpen(o => !o)}
      >
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: `${col}18`, display: 'flex',
          alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>{icon}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text)' }}>{title}</div>
        </div>
        <span style={{
          fontSize: '0.62rem', fontWeight: 800, letterSpacing: '0.1em',
          padding: '0.25rem 0.7rem', borderRadius: 999,
          background: `${col}18`, color: col, border: `1px solid ${col}30`,
        }}>{label}</span>
        {open ? <ChevronUp size={14} color="var(--text-muted)" /> : <ChevronDown size={14} color="var(--text-muted)" />}
      </div>
      {open && (
        <div style={{ padding: '1rem 1.25rem', fontSize: '0.82rem', color: 'var(--text-dim)', lineHeight: 1.7 }}>
          {children}
        </div>
      )}
    </div>
  )
}

// ── Main Page ──────────────────────────────────────────────────
export default function PhotoVerificationPage() {
  const [report, setReport] = useState<AnalysisReport | null>(null)
  const [loading, setLoading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [dragOver, setDragOver] = useState(false)
  const [selectedPreset, setSelectedPreset] = useState<number | 'custom'>('custom')
  const [customVendor, setCustomVendor] = useState('')
  const [customState, setCustomState] = useState('Uttar Pradesh')
  const [customType, setCustomType] = useState('road')
  const [progress, setProgress] = useState(0)
  const fileRef = useRef<HTMLInputElement>(null)
  const resultRef = useRef<HTMLDivElement>(null)

  const runAnalysis = useCallback(async (files: File[]) => {
    if (files.length === 0) return
    setLoading(true)
    setReport(null)
    setProgress(10)

    let meta: ProjectMeta
    if (selectedPreset === 'custom') {
      meta = {
        projectCode: `UPLOAD-${Date.now().toString().slice(-4)}`,
        declaredLat: 26.8467,
        declaredLon: 80.9462,
        sanctionDate: new Date(Date.now() - 60 * 86400000).toISOString().split('T')[0],
        milestoneDays: 120,
        unitCost: 0,
        state: customState,
        projectType: customType,
        vendor: customVendor.trim(), // Empty if user did not specify!
      }
    } else {
      const preset = DEMO_PRESETS[selectedPreset]
      meta = {
        projectCode: preset.projectCode,
        declaredLat: preset.declaredLat,
        declaredLon: preset.declaredLon,
        sanctionDate: preset.sanctionDate,
        milestoneDays: preset.milestoneDays,
        unitCost: preset.unitCost,
        state: preset.state,
        projectType: preset.projectType,
        vendor: preset.vendor,
      }
    }

    // Fake progress steps
    const progressSteps = [20, 40, 60, 80]
    let si = 0
    const pTimer = setInterval(() => {
      if (si < progressSteps.length) setProgress(progressSteps[si++])
    }, 400)

    try {
      const result = await analyzePhotoBatch(files, meta)
      clearInterval(pTimer)
      setProgress(100)
      setTimeout(() => {
        setReport(result)
        setLoading(false)
        setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
      }, 300)
    } catch (err) {
      clearInterval(pTimer)
      console.error(err)
      setLoading(false)
    }
  }, [selectedPreset, customVendor, customState, customType])

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return
    const arr = Array.from(files).filter(f => f.type.startsWith('image/') || f.name.match(/\.(jpg|jpeg|png|tiff|heic)$/i))
    if (arr.length === 0) return
    setUploadedFiles(arr)
    runAnalysis(arr)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    handleFiles(e.dataTransfer.files)
  }

  const activeMeta = selectedPreset === 'custom' ? {
    projectCode: 'LIVE-UPLOAD',
    declaredLat: 26.8467,
    declaredLon: 80.9462,
    sanctionDate: 'Current Cycle',
    milestoneDays: 120,
    unitCost: 0,
    state: customState,
    projectType: customType,
    vendor: customVendor.trim() ? customVendor.trim() : 'Not Specified',
  } : DEMO_PRESETS[selectedPreset]

  return (
    <div className="fade-in" style={{ paddingBottom: '4rem' }}>
      {/* ── Page Header ── */}
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <div className="demo-banner">AUTONOMOUS GEOSPATIAL LAB · EVIDENCE VERIFICATION</div>
        <h1>Photo Verification Lab</h1>
        <p className="page-subtitle">
          Multi-photo geospatial analysis · GPS clustering · Haversine distance · Z-score cost · Metadata integrity check
        </p>
      </div>

      {/* ── Upload + Config grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Left: Preset selector + upload zone */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Preset / Mode selector */}
          <div className="card">
            <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--km-cyan)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>
              Verification Mode
            </div>
            
            {/* Custom file upload option */}
            <div
              onClick={() => setSelectedPreset('custom')}
              style={{
                padding: '0.85rem 1rem', borderRadius: 12, marginBottom: '0.5rem', cursor: 'pointer',
                border: selectedPreset === 'custom' ? '1.5px solid #00A896' : '1px solid #E2E8F0',
                background: selectedPreset === 'custom' ? 'rgba(0,168,150,0.1)' : '#FFFFFF',
                boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                transition: 'all 0.15s',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: selectedPreset === 'custom' ? '#008E80' : '#0F172A' }}>
                    Custom File Inspection (Clean / No Preset)
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '0.15rem' }}>
                    Inspect uploaded photos without assigning pre-configured vendors or fake contractors
                  </div>
                </div>
                {selectedPreset === 'custom' && <CheckCircle2 size={17} color="#00A896" />}
              </div>
            </div>

            <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0.75rem 0 0.4rem' }}>
              Or Test With Benchmark Scenarios:
            </div>

            {DEMO_PRESETS.map((p, i) => (
              <div
                key={i}
                onClick={() => setSelectedPreset(i)}
                style={{
                  padding: '0.75rem 0.95rem', borderRadius: 12, marginBottom: '0.45rem', cursor: 'pointer',
                  border: selectedPreset === i ? '1.5px solid #00A896' : '1px solid #E2E8F0',
                  background: selectedPreset === i ? 'rgba(0,168,150,0.1)' : '#FFFFFF',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                  transition: 'all 0.15s',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: '0.84rem', fontWeight: 700, color: selectedPreset === i ? '#008E80' : '#0F172A' }}>{p.label}</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '0.15rem' }}>{p.desc}</div>
                  </div>
                  {selectedPreset === i && <CheckCircle2 size={17} color="#00A896" />}
                </div>
              </div>
            ))}
          </div>

          {/* Drop zone */}
          <div
            className="card"
            onDrop={handleDrop}
            onDragOver={e => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onClick={() => fileRef.current?.click()}
            style={{
              border: `2px dashed ${dragOver ? 'var(--gold)' : 'var(--glass-b)'}`,
              textAlign: 'center', padding: '2.5rem 1.5rem',
              cursor: 'pointer', minHeight: 200,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
              background: dragOver ? 'rgba(201,168,76,0.04)' : 'var(--glass)',
              transition: 'all 0.2s',
            }}
          >
            <input ref={fileRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={e => handleFiles(e.target.files)} />
            {loading ? (
              <>
                <RefreshCw size={32} style={{ animation: 'spin 1s linear infinite', color: 'var(--gold)' }} />
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Analysing photos…</div>
                <div style={{ width: '80%', height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 999, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', borderRadius: 999,
                    background: 'linear-gradient(90deg, var(--gold), var(--saffron))',
                    width: `${progress}%`, transition: 'width 0.4s ease',
                  }} />
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  Extracting EXIF · Computing Haversine · Checking hashes…
                </div>
              </>
            ) : (
              <>
                <div style={{
                  width: 56, height: 56, borderRadius: 16,
                  background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Upload size={24} color="var(--gold)" />
                </div>
                <div style={{ fontWeight: 700, fontSize: '1rem' }}>Drop 4–5 project photos here</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>JPEG / PNG / TIFF with EXIF · Click or drag & drop</div>
                {uploadedFiles.length > 0 && (
                  <div style={{ fontSize: '0.72rem', color: 'var(--gold)', marginTop: '0.25rem' }}>
                    ✓ {uploadedFiles.length} file(s) loaded — click to replace
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Right: Project meta summary */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--km-cyan)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Analysis Parameters
          </div>

          {[
            ['Project Code',     activeMeta.projectCode],
            ['Declared Location', `${activeMeta.declaredLat}°N, ${activeMeta.declaredLon}°E`],
            ['Sanction Date',    activeMeta.sanctionDate],
            ['Milestone Window', `${activeMeta.milestoneDays} days`],
            ['Declared Unit Cost', activeMeta.unitCost > 0 ? `₹${activeMeta.unitCost} Lakhs` : 'Not Applicable (Photo-only inspection)'],
            ['State',            activeMeta.state],
            ['Project Type',     activeMeta.projectType],
            ['Vendor',          activeMeta.vendor],
          ].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid #F1F5F9', fontSize: '0.8rem' }}>
              <span style={{ color: '#64748B', fontWeight: 600 }}>{k}</span>
              <span style={{ fontWeight: 700, color: '#0F172A', fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>{v}</span>
            </div>
          ))}

          {selectedPreset === 'custom' && (
            <div style={{ padding: '0.95rem', background: '#F0FDFB', borderRadius: 12, border: '1px solid rgba(0,168,150,0.25)' }}>
              <label style={{ display: 'block', fontSize: '0.7rem', color: '#00A896', fontWeight: 800, marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Optional: Declare Vendor / Contractor Name
              </label>
              <input
                type="text"
                placeholder="Leave blank if unknown / not applicable"
                value={customVendor}
                onChange={e => setCustomVendor(e.target.value)}
                style={{
                  width: '100%', padding: '0.55rem 0.85rem', borderRadius: 8,
                  background: '#FFFFFF', border: '1.5px solid #CBD5E1',
                  color: '#0F172A', fontSize: '0.82rem', outline: 'none'
                }}
              />
              <span style={{ display: 'block', fontSize: '0.68rem', color: '#64748B', marginTop: '0.35rem', fontWeight: 500 }}>
                No vendor will be invented or displayed unless provided here.
              </span>
            </div>
          )}

          <div style={{ marginTop: 'auto', padding: '0.85rem', background: '#F0FDFB', border: '1px solid rgba(0,168,150,0.25)', borderRadius: 12, fontSize: '0.75rem', color: '#334155', lineHeight: 1.6 }}>
            <strong style={{ color: '#0F172A' }}>Vigilance checks:</strong> GPS geotag extraction · Pairwise Haversine distance · SHA-256 duplicate detection · Timestamp window validation · Metadata integrity
          </div>
        </div>
      </div>

      {/* ── Empty state ── */}
      {!report && !loading && (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem', color: 'var(--text-muted)' }}>
          <Camera size={48} strokeWidth={1.2} style={{ margin: '0 auto 1rem', display: 'block', opacity: 0.4 }} />
          <div style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>Upload photos to begin fraud analysis</div>
          <div style={{ fontSize: '0.82rem', lineHeight: 1.7, maxWidth: 500, margin: '0 auto' }}>
            Select a project preset on the left, then upload 4–5 project completion photos. The AI engine will extract EXIF geotags, compute pairwise Haversine distances, detect duplicate hashes, validate timestamps, and cross-check cost against state baselines.
          </div>
        </div>
      )}

      {/* ── RESULTS ── */}
      {report && (
        <div ref={resultRef} style={{ animation: 'fadeIn 0.5s ease both' }}>
          {/* ── Overall verdict ── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '1.5rem', marginBottom: '1.5rem', alignItems: 'center' }}>
            <div className="card" style={{ textAlign: 'center', padding: '1.5rem 2rem', borderColor: `${RISK_COLORS[report.riskLevel]}30` }}>
              <RiskGauge score={report.riskScore} level={report.riskLevel} />
              <div style={{ marginTop: '0.75rem', fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Risk Score</div>
            </div>

            <div className="card" style={{ borderColor: `${RISK_COLORS[report.riskLevel]}20` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                {report.riskLevel === 'CLEAN' || report.riskLevel === 'LOW'
                  ? <CheckCircle2 size={22} color="#10b981" />
                  : <AlertTriangle size={22} color={RISK_COLORS[report.riskLevel]} />
                }
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1rem' }}>
                    {report.riskLevel === 'CRITICAL' ? '🚨 Critical Risk Detected' :
                     report.riskLevel === 'HIGH'     ? '⚠️ High Risk Detected' :
                     report.riskLevel === 'MEDIUM'   ? '🔶 Medium Risk' :
                     report.riskLevel === 'LOW'      ? '🔷 Low Risk' : '✅ Verification Passed'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{report.photos.length} photo(s) analysed · {activeMeta.projectCode}</div>
                </div>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', lineHeight: 1.7, marginBottom: '1rem' }}>{report.summary}</p>

              {report.anomalies.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {report.anomalies.map((a, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'flex-start', gap: '0.5rem',
                      fontSize: '0.78rem', padding: '0.4rem 0.7rem',
                      background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.18)',
                      borderRadius: 8, color: '#fca5a5',
                    }}>
                      <Zap size={13} color="#ef4444" style={{ marginTop: 2, flexShrink: 0 }} />
                      {a}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── Anomaly breakdown ── */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>
              Detailed Check Breakdown
            </div>

            {/* GPS Cluster */}
            <AnomalyCard
              icon={<MapPin size={16} color={report.geoCluster.allWithin30m ? '#ef4444' : '#10b981'} />}
              title="Geospatial Clustering (Haversine ≤30m)"
              status={
                report.geoCluster.pairwiseDistances.length === 0 ? 'NA' :
                report.geoCluster.allWithin30m ? 'FLAG' : 'PASS'
              }
            >
              {report.geoCluster.pairwiseDistances.length === 0 ? (
                <div>Fewer than 2 photos with GPS data — cannot compute clustering.</div>
              ) : (
                <>
                  <div style={{ marginBottom: '0.5rem' }}>
                    Max spread: <strong style={{ color: 'var(--text)' }}>{report.geoCluster.maxDistanceMeters}m</strong> ·
                    Centroid: {report.geoCluster.centroidLat?.toFixed(5)}°N, {report.geoCluster.centroidLon?.toFixed(5)}°E
                  </div>
                  {report.geoCluster.allWithin30m && (
                    <div style={{ color: '#fca5a5', marginBottom: '0.75rem' }}>
                      ⚠ All photos taken within 30m — likely photographed from same position, not multiple project sites.
                    </div>
                  )}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.4rem', marginTop: '0.5rem' }}>
                    {report.geoCluster.pairwiseDistances.map((p, i) => (
                      <div key={i} style={{
                        padding: '0.4rem 0.65rem', borderRadius: 8,
                        background: p.distanceMeters <= 30 ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.08)',
                        fontSize: '0.72rem', fontFamily: 'monospace',
                        color: p.distanceMeters <= 30 ? '#fca5a5' : '#6ee7b7',
                      }}>
                        Photo {p.i + 1} ↔ {p.j + 1}: {p.distanceMeters}m
                      </div>
                    ))}
                  </div>
                </>
              )}
            </AnomalyCard>

            {/* Duplicate Detection */}
            <AnomalyCard
              icon={<Hash size={16} color={report.duplicates.hasDuplicates ? '#ef4444' : '#10b981'} />}
              title="Duplicate Photo Detection (SHA-256)"
              status={report.duplicates.hasDuplicates ? 'FLAG' : 'PASS'}
            >
              {report.duplicates.hasDuplicates ? (
                <>
                  <div style={{ color: '#fca5a5', marginBottom: '0.5rem' }}>⚠ Identical photos detected — progress photos may be reused across milestone reports.</div>
                  {report.duplicates.duplicatePairs.filter(p => p.identical).map((p, i) => (
                    <div key={i} style={{ padding: '0.3rem 0.6rem', background: 'rgba(239,68,68,0.1)', borderRadius: 6, fontSize: '0.72rem', marginBottom: '0.3rem', fontFamily: 'monospace' }}>
                      Photo {p.i + 1} = Photo {p.j + 1} (identical SHA-256)
                    </div>
                  ))}
                </>
              ) : (
                <div style={{ color: '#6ee7b7' }}>✓ All {report.photos.length} photos have unique SHA-256 hashes — no duplicates detected.</div>
              )}
            </AnomalyCard>

            {/* Timestamp */}
            <AnomalyCard
              icon={<Clock size={16} color={report.timestamps.outsideMilestoneWindow ? '#f59e0b' : '#10b981'} />}
              title="Timestamp Validation"
              status={!report.timestamps.allPresent ? 'WARN' : report.timestamps.outsideMilestoneWindow ? 'FLAG' : 'PASS'}
            >
              {!report.timestamps.allPresent && (
                <div style={{ color: '#fcd34d', marginBottom: '0.5rem' }}>
                  ⚠ {report.photos.filter(p => !p.datetime).length} photo(s) missing EXIF timestamps — possible metadata stripping.
                </div>
              )}
              {report.timestamps.earliest && (
                <div>
                  Earliest: <strong style={{ color: 'var(--text)' }}>{report.timestamps.earliest}</strong> ·
                  Latest: <strong style={{ color: 'var(--text)' }}>{report.timestamps.latest}</strong> ·
                  Span: <strong style={{ color: 'var(--text)' }}>{report.timestamps.spanDays} days</strong> (milestone: {report.timestamps.milestoneDays} days)
                </div>
              )}
              {report.timestamps.outsideMilestoneWindow && (
                <div style={{ color: '#fca5a5', marginTop: '0.5rem' }}>
                  ⚠ Photo span exceeds milestone window by {Math.abs((report.timestamps.spanDays ?? 0) - report.timestamps.milestoneDays)} days.
                </div>
              )}
            </AnomalyCard>

            {/* Cost Baseline */}
            {report.costAnomaly && (
              <AnomalyCard
                icon={<IndianRupee size={16} color={report.costAnomaly.isAnomaly ? '#f97316' : '#10b981'} />}
                title={`Cost Baseline Check (Z-score) — ${report.costAnomaly.state}`}
                status={report.costAnomaly.isAnomaly ? 'FLAG' : 'PASS'}
              >
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  {[
                    ['Declared Cost', `₹${report.costAnomaly.unitCost}L`],
                    ['State Median', `₹${report.costAnomaly.stateMedian}L`],
                    ['Z-Score', report.costAnomaly.zScore > 0 ? `+${report.costAnomaly.zScore}σ` : `${report.costAnomaly.zScore}σ`],
                  ].map(([k, v]) => (
                    <div key={k} style={{ padding: '0.6rem', background: 'rgba(255,255,255,0.04)', borderRadius: 8, textAlign: 'center' }}>
                      <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>{k}</div>
                      <div style={{ fontSize: '1rem', fontWeight: 700, color: k === 'Z-Score' && report.costAnomaly!.isAnomaly ? '#f97316' : 'var(--text)' }}>{v}</div>
                    </div>
                  ))}
                </div>
                {report.costAnomaly.isAnomaly
                  ? <div style={{ color: '#fdba74' }}>⚠ Unit cost deviates {Math.abs(report.costAnomaly.zScore)}σ from state median — potential cost inflation.</div>
                  : <div style={{ color: '#6ee7b7' }}>✓ Unit cost within normal range of state median.</div>
                }
              </AnomalyCard>
            )}

            {/* Vendor Monopoly */}
            {report.vendorMonopoly && (
              <AnomalyCard
                icon={<Users size={16} color={report.vendorMonopoly.isMonopoly ? '#f97316' : '#10b981'} />}
                title="Vendor Monopoly Detection"
                status={report.vendorMonopoly.isMonopoly ? 'WARN' : 'PASS'}
              >
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  {[
                    ['Vendor', report.vendorMonopoly.vendor],
                    ['Projects Won', String(report.vendorMonopoly.projectCount)],
                    ['State Share', `${report.vendorMonopoly.monopolyPct}%`],
                  ].map(([k, v]) => (
                    <div key={k} style={{ padding: '0.6rem', background: 'rgba(255,255,255,0.04)', borderRadius: 8, textAlign: 'center' }}>
                      <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>{k}</div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text)' }}>{v}</div>
                    </div>
                  ))}
                </div>
                {report.vendorMonopoly.isMonopoly
                  ? <div style={{ color: '#fdba74' }}>⚠ Vendor holds {report.vendorMonopoly.monopolyPct}% of projects in state (threshold: 25%) — possible collusion or preferential treatment.</div>
                  : <div style={{ color: '#6ee7b7' }}>✓ Vendor project share within acceptable range.</div>
                }
              </AnomalyCard>
            )}
          </div>

          {/* ── Per-photo breakdown table ── */}
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <FileText size={16} color="var(--gold)" />
              <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Per-Photo Evidence Table
              </div>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Filename</th>
                    <th>GPS Latitude</th>
                    <th>GPS Longitude</th>
                    <th>Datetime (EXIF)</th>
                    <th>Size</th>
                    <th>SHA-256 (12 chars)</th>
                  </tr>
                </thead>
                <tbody>
                  {report.photos.map((p, i) => (
                    <tr key={i}>
                      <td style={{ fontWeight: 700, color: 'var(--text)' }}>{i + 1}</td>
                      <td style={{ maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.fileName}</td>
                      <td style={{ fontFamily: 'monospace', fontSize: '0.72rem' }}>
                        {p.lat !== null ? <span style={{ color: '#6ee7b7' }}>{p.lat.toFixed(6)}°</span> : <span style={{ color: 'var(--text-muted)' }}>—</span>}
                      </td>
                      <td style={{ fontFamily: 'monospace', fontSize: '0.72rem' }}>
                        {p.lon !== null ? <span style={{ color: '#6ee7b7' }}>{p.lon.toFixed(6)}°</span> : <span style={{ color: 'var(--text-muted)' }}>—</span>}
                      </td>
                      <td style={{ fontFamily: 'monospace', fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                        {p.datetime ? p.datetime.replace('T', ' ').slice(0, 19) : <span style={{ color: 'var(--text-muted)' }}>No EXIF</span>}
                      </td>
                      <td style={{ fontSize: '0.72rem' }}>{p.sizeKB} KB</td>
                      <td style={{ fontFamily: 'monospace', fontSize: '0.7rem', color: 'var(--text-muted)' }}>{p.hash.slice(0, 12)}…</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Audit report block ── */}
          <div className="card" style={{ borderColor: 'rgba(0,168,150,0.3)', background: 'rgba(0,168,150,0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
              <Shield size={18} color="var(--km-cyan)" />
              <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: '1.1rem', letterSpacing: '0.05em', color: '#FFFFFF' }}>
                AUDIT DOSSIER — {activeMeta.projectCode}
              </div>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', lineHeight: 1.8, fontFamily: 'var(--font-mono)' }}>
              <div>Generated: {new Date().toISOString()}</div>
              <div>Project: {activeMeta.projectCode} · {activeMeta.state} · {activeMeta.projectType}</div>
              {activeMeta.vendor && activeMeta.vendor !== 'Not Specified' && (
                <div>Vendor: {activeMeta.vendor}</div>
              )}
              <div>Photos Analysed: {report.photos.length}</div>
              <div>Composite Risk Score: {report.riskScore}/100 ({report.riskLevel})</div>
              <div style={{ margin: '0.5rem 0' }}>━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
              {report.anomalies.length === 0
                ? <div style={{ color: '#6ee7b7' }}>RESULT: NO ANOMALIES DETECTED — APPROVED FOR DISBURSEMENT</div>
                : <>
                    <div style={{ color: '#fca5a5' }}>RESULT: {report.anomalies.length} ANOMALY FLAG(S) — ESCALATE FOR MANUAL REVIEW</div>
                    {report.anomalies.map((a, i) => <div key={i} style={{ color: '#fdba74' }}>  [{i + 1}] {a}</div>)}
                  </>
              }
              <div style={{ margin: '0.5rem 0' }}>━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
              <div style={{ color: 'var(--text-muted)' }}>KAVACH · MoSPI MPLADS AI Vigilance System</div>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
