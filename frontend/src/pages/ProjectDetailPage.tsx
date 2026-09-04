/**
 * ProjectDetailPage — full project deep-dive
 * Shows: project metadata, risk score, SHAP explanation, ML predictions, payment timeline, PDF download
 */
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, AlertTriangle, FileText, TrendingUp, TrendingDown,
  MapPin, Calendar, Building2, IndianRupee, Activity, RefreshCw,
  CheckCircle2, XCircle, Clock
} from 'lucide-react'
import api from '../api/client'

// ── Types ─────────────────────────────────────────────────────
interface ProjectDetail {
  id: number
  projectCode: string
  name: string
  status: string
  stateName: string
  categoryName: string
  mpName: string
  constituency: string
  sanctionedAmountRs: number
  estimatedCostRs: number
  totalExpenditurePaise: number
  utilizationPct: number
  reportedProgressPct: number
  expectedProgressPct: number
  startDate: string
  expectedEndDate: string
  actualEndDate: string | null
  riskLevel: string
  riskScore: number
  delayProbability: number | null
  costOverrunRatio: number | null
  anomalyScore: number | null
  riskFlags: string[]
  paymentCount: number
}

interface MlPrediction {
  delay_probability?: number
  is_delayed?: boolean
  cost_overrun_ratio?: number
  anomaly_label?: string
  anomaly_score_normalized?: number
  top_features?: { feature: string; shap_value: number }[]
  status?: string
}

// ── Helpers ────────────────────────────────────────────────────
function riskColor(level?: string) {
  return { CRITICAL: '#ef4444', HIGH: '#f97316', MEDIUM: '#f59e0b', LOW: '#10b981' }[level || ''] || '#6b7280'
}
function statusColor(s: string) {
  return { COMPLETED: '#10b981', IN_PROGRESS: '#3b82f6', STALLED: '#f97316', SANCTIONED: '#8b5cf6', CANCELLED: '#6b7280' }[s] || '#6b7280'
}
function crore(paise: number) { return (paise / 1e9).toFixed(2) }
function rs(paise: number)    { return (paise / 100).toLocaleString('en-IN') }

function InfoRow({ label, value, mono }: { label: string; value: string | number; mono?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.55rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{label}</span>
      <span style={{ fontSize: '0.8rem', fontWeight: 600, fontFamily: mono ? 'monospace' : undefined }}>{value}</span>
    </div>
  )
}

function ProgressBar({ value, max = 100, color }: { value: number; max?: number; color: string }) {
  const pct = Math.min((value / max) * 100, 100)
  return (
    <div style={{ background: 'rgba(255,255,255,0.07)', borderRadius: 999, height: 8, overflow: 'hidden' }}>
      <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 999, transition: 'width 0.6s ease' }} />
    </div>
  )
}

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [project, setProject] = useState<ProjectDetail | null>(null)
  const [mlData, setMlData]   = useState<MlPrediction | null>(null)
  const [loading, setLoading] = useState(true)
  const [mlLoading, setMlLoading] = useState(false)
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    api.get(`/projects/${id}`)
      .then(r => { setProject(r.data); setLoading(false); fetchMl(r.data) })
      .catch(() => setLoading(false))
  }, [id])

  const fetchMl = async (p: ProjectDetail) => {
    setMlLoading(true)
    try {
      const res = await api.post('/ml/predict-delay', {
        project_id:            p.projectCode,
        category:              p.categoryName,
        state:                 p.stateName,
        sanctioned_amount:     p.sanctionedAmountRs,
        estimated_cost:        p.estimatedCostRs,
        total_expenditure:     p.totalExpenditurePaise / 100,
        project_duration_days: p.startDate && p.expectedEndDate
          ? Math.round((new Date(p.expectedEndDate).getTime() - new Date(p.startDate).getTime()) / 86400000)
          : 365,
        elapsed_days:          p.startDate
          ? Math.round((Date.now() - new Date(p.startDate).getTime()) / 86400000)
          : 180,
        reported_progress_pct: p.reportedProgressPct || 0,
        expected_progress_pct: p.expectedProgressPct || 0,
        payment_count:         p.paymentCount || 1,
        max_single_payment:    p.totalExpenditurePaise / 100 * 0.4,
      })
      setMlData(res.data)
    } catch { /* ML offline — show static risk from DB */ }
    finally { setMlLoading(false) }
  }

  const downloadReport = async () => {
    setDownloading(true)
    try {
      const res = await api.get(`/ml/reports/${id}`, { responseType: 'blob' })
      const url = URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }))
      const a = document.createElement('a'); a.href = url
      a.download = `${project?.projectCode || id}_report.pdf`; a.click()
      URL.revokeObjectURL(url)
    } catch { alert('PDF report: ensure ML service is running on :8001') }
    finally { setDownloading(false) }
  }

  if (loading) return (
    <div className="fade-in">
      <button onClick={() => navigate('/projects')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
        <ArrowLeft size={15} /> Back to Projects
      </button>
      {Array(3).fill(0).map((_, i) => <div key={i} className="card skeleton" style={{ height: 160, marginBottom: '1rem' }} />)}
    </div>
  )

  if (!project) return (
    <div className="fade-in card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
      <AlertTriangle size={32} style={{ marginBottom: '0.5rem' }} />
      <div>Project not found.</div>
    </div>
  )

  const col = riskColor(project.riskLevel)
  const progressGap = (project.expectedProgressPct || 0) - (project.reportedProgressPct || 0)
  const overrunRatio = project.estimatedCostRs / project.sanctionedAmountRs

  return (
    <div className="fade-in">
      {/* Back + actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <button onClick={() => navigate('/projects')} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.85rem' }}>
          <ArrowLeft size={15} /> Back
        </button>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={downloadReport} disabled={downloading}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1.1rem', borderRadius: 8, background: 'rgba(200,149,44,0.12)', border: '1px solid rgba(200,149,44,0.3)', color: 'var(--gold)', cursor: 'pointer', fontWeight: 600, fontSize: '0.82rem' }}
          >
            {downloading ? <RefreshCw size={13} style={{ animation: 'spin 1s linear infinite' }} /> : <FileText size={13} />}
            {downloading ? 'Generating...' : 'Download PDF Report'}
          </button>
        </div>
      </div>

      {/* Project header */}
      <div className="card" style={{ borderColor: `${col}25`, position: 'relative', overflow: 'hidden', marginBottom: '1.25rem' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: col }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1.5rem', alignItems: 'start' }}>
          <div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
              <code style={{ fontSize: '0.72rem', background: 'rgba(59,130,246,0.12)', color: 'var(--accent-blue)', padding: '0.15rem 0.5rem', borderRadius: 4 }}>{project.projectCode}</code>
              <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.55rem', borderRadius: 999, background: `${statusColor(project.status)}20`, color: statusColor(project.status), fontWeight: 700 }}>
                {project.status.replace('_', ' ')}
              </span>
            </div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.4rem', lineHeight: 1.4 }}>{project.name}</h2>
            <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.78rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><MapPin size={12} />{project.stateName}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Building2 size={12} />{project.categoryName}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Calendar size={12} />Started {project.startDate || 'N/A'}</span>
            </div>
          </div>
          <div style={{ textAlign: 'center', minWidth: 100 }}>
            <div style={{ fontSize: '3.5rem', fontFamily: 'var(--font-display)', color: col, lineHeight: 1 }}>{project.riskScore ?? '—'}</div>
            <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>RISK SCORE</div>
            <span className={`badge badge-${(project.riskLevel || 'LOW').toLowerCase()}`}>{project.riskLevel || 'N/A'}</span>
          </div>
        </div>
      </div>

      {/* 3-column grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>

        {/* Financial */}
        <div className="card">
          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <IndianRupee size={11} /> Financial
          </div>
          <InfoRow label="Sanctioned"   value={`₹${crore(project.sanctionedAmountRs * 100)} Cr`} />
          <InfoRow label="Estimated"    value={`₹${crore(project.estimatedCostRs * 100)} Cr`} />
          <InfoRow label="Spent"        value={`₹${crore(project.totalExpenditurePaise)} Cr`} />
          <InfoRow label="Utilization"  value={`${project.utilizationPct?.toFixed(1)}%`} />
          {overrunRatio > 1.05 && (
            <div style={{ marginTop: '0.75rem', fontSize: '0.7rem', color: '#ef4444', background: 'rgba(239,68,68,0.08)', padding: '0.4rem 0.6rem', borderRadius: 6, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <AlertTriangle size={11} /> Cost ratio {overrunRatio.toFixed(2)}× above sanctioned
            </div>
          )}
        </div>

        {/* Progress */}
        <div className="card">
          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Activity size={11} /> Progress
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.35rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Reported</span>
              <span style={{ fontWeight: 600, color: '#3b82f6' }}>{project.reportedProgressPct?.toFixed(0)}%</span>
            </div>
            <ProgressBar value={project.reportedProgressPct || 0} color="#3b82f6" />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.35rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Expected</span>
              <span style={{ fontWeight: 600, color: '#8b5cf6' }}>{project.expectedProgressPct?.toFixed(0)}%</span>
            </div>
            <ProgressBar value={project.expectedProgressPct || 0} color="#8b5cf6" />
          </div>
          <div style={{ fontSize: '0.75rem', padding: '0.4rem 0.6rem', borderRadius: 6, background: progressGap > 10 ? 'rgba(239,68,68,0.08)' : 'rgba(16,185,129,0.08)', color: progressGap > 10 ? '#ef4444' : '#10b981', fontWeight: 700 }}>
            {progressGap > 0 ? `⚠ ${progressGap.toFixed(0)}% behind schedule` : '✓ On schedule'}
          </div>
        </div>

        {/* Timeline */}
        <div className="card">
          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Clock size={11} /> Timeline
          </div>
          <InfoRow label="Start Date"   value={project.startDate || '—'} />
          <InfoRow label="Expected End" value={project.expectedEndDate || '—'} />
          <InfoRow label="Actual End"   value={project.actualEndDate || 'Ongoing'} />
          <InfoRow label="Payments"     value={project.paymentCount || '—'} />
          {!project.actualEndDate && project.expectedEndDate && new Date(project.expectedEndDate) < new Date() && (
            <div style={{ marginTop: '0.75rem', fontSize: '0.7rem', color: '#f97316', background: 'rgba(249,115,22,0.08)', padding: '0.4rem 0.6rem', borderRadius: 6 }}>
              ⚠ Deadline passed — {Math.round((Date.now() - new Date(project.expectedEndDate).getTime()) / 86400000)} days overdue
            </div>
          )}
        </div>
      </div>

      {/* ML Prediction Panel */}
      <div className="card" style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>🤖 AI Prediction (XGBoost)</div>
          {mlLoading && <RefreshCw size={13} style={{ animation: 'spin 1s linear infinite', color: 'var(--text-muted)' }} />}
        </div>

        {mlData && mlData.status !== 'ML_OFFLINE' ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            {/* Delay prob */}
            <div style={{ textAlign: 'center', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: '2.5rem', fontFamily: 'var(--font-display)', color: (mlData.delay_probability || 0) > 0.7 ? '#ef4444' : '#10b981', lineHeight: 1 }}>
                {((mlData.delay_probability || 0) * 100).toFixed(0)}%
              </div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>DELAY PROBABILITY</div>
              <div style={{ marginTop: '0.5rem' }}>
                {mlData.is_delayed
                  ? <span style={{ fontSize: '0.7rem', color: '#ef4444', background: 'rgba(239,68,68,0.1)', padding: '0.2rem 0.5rem', borderRadius: 4, fontWeight: 700 }}>PREDICTED DELAYED</span>
                  : <span style={{ fontSize: '0.7rem', color: '#10b981', background: 'rgba(16,185,129,0.1)', padding: '0.2rem 0.5rem', borderRadius: 4, fontWeight: 700 }}>ON TRACK</span>
                }
              </div>
            </div>

            {/* Cost overrun */}
            <div style={{ textAlign: 'center', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: '2.5rem', fontFamily: 'var(--font-display)', color: (mlData.cost_overrun_ratio || 1) > 1.1 ? '#f59e0b' : '#10b981', lineHeight: 1 }}>
                {(mlData.cost_overrun_ratio || 1).toFixed(2)}×
              </div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>COST OVERRUN RATIO</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                {(mlData.cost_overrun_ratio || 1) > 1.05 ? '⚠ Above sanctioned budget' : '✓ Within budget'}
              </div>
            </div>

            {/* SHAP top feature */}
            <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Top Risk Drivers</div>
              {mlData.top_features?.slice(0, 4).map((f, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', padding: '0.2rem 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{f.feature.replace(/_/g, ' ')}</span>
                  <span style={{ fontWeight: 700, color: f.shap_value > 0 ? '#ef4444' : '#10b981', fontFamily: 'monospace', fontSize: '0.68rem' }}>
                    {f.shap_value > 0 ? '+' : ''}{f.shap_value.toFixed(3)}
                  </span>
                </div>
              ))}
              {!mlData.top_features?.length && <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>No SHAP data available</div>}
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            {[
              { label: 'Risk Score (DB)', val: project.riskScore ?? '—', col: col },
              { label: 'Risk Level', val: project.riskLevel || '—', col: col },
              { label: 'Progress Gap', val: `${progressGap.toFixed(0)}%`, col: progressGap > 10 ? '#ef4444' : '#10b981' },
            ].map((item, i) => (
              <div key={i} style={{ textAlign: 'center', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontSize: '2rem', fontFamily: 'var(--font-display)', color: item.col, lineHeight: 1 }}>{item.val}</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>{item.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Risk flags */}
      {project.riskFlags && project.riskFlags.length > 0 && (
        <div className="card">
          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>⚑ Risk Flags</div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {project.riskFlags.map((flag, i) => (
              <span key={i} style={{ fontSize: '0.72rem', padding: '0.25rem 0.65rem', borderRadius: 6, background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)', fontWeight: 600 }}>
                {flag}
              </span>
            ))}
          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
