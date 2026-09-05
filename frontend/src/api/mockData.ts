/**
/**
 * mockData.ts — Resilient fallback API layer for Kavach 2.0
 * Provides realistic responses for all backend & ML endpoints when running on Vercel
 * or when backend services are offline.
 */
import { ALL_PROJECTS, getProjectByIdOrCode, DetailedProject } from '../data/projectsData'

export interface MockApiResponse<T = any> {
  status: number
  data: T
  headers?: Record<string, string>
}

// ── Demo Auth Users ──────────────────────────────────────────
const DEMO_USERS: Record<string, { userId: number; username: string; fullName: string; email: string; role: string; stateId?: number; stateName?: string }> = {
  ministry: {
    userId: 1,
    username: 'ministry',
    fullName: 'Ministry Admin (MoSPI)',
    email: 'ministry@sentinel.gov.in',
    role: 'MINISTRY',
  },
  'nodal.tn': {
    userId: 2,
    username: 'nodal.tn',
    fullName: 'State Nodal Officer (Tamil Nadu)',
    email: 'nodal.tn@sentinel.gov.in',
    role: 'STATE_NODAL',
    stateId: 31,
    stateName: 'Tamil Nadu',
  },
  mp_demo: {
    userId: 3,
    username: 'mp_demo',
    fullName: 'Hon. Member of Parliament',
    email: 'mp.demo@sansad.nic.in',
    role: 'MP',
  },
  district: {
    userId: 4,
    username: 'district',
    fullName: 'District Authority / Collector',
    email: 'collector@nic.in',
    role: 'DISTRICT',
  },
}

// ── Standard KPIs ─────────────────────────────────────────────
const MOCK_KPIS = {
  totalProjects: 558,
  completedProjects: 137,
  inProgressProjects: 322,
  stalledProjects: 47,
  completionRatePct: 24.6,
  totalSanctionedCrore: 125.78,
  totalExpenditureCrore: 89.43,
  overallUtilizationPct: 71.1,
  highRiskProjects: 224,
  criticalProjects: 1,
  statusDistribution: { IN_PROGRESS: 322, CANCELLED: 12, COMPLETED: 137, SANCTIONED: 40, STALLED: 47 },
  riskDistribution: { CRITICAL: 1, HIGH: 224, MEDIUM: 39, LOW: 294 },
  dataNote: '⚠ DEMO DATA — Synthetic Projects · Not Real Government Records · SIH 2026',
}

// ── Router / Dispatcher for mock requests ──────────────────────
export function handleMockApi(url: string, method = 'GET', body?: any): MockApiResponse | null {
  // Normalize url
  const cleanUrl = url.replace(/^\/api/, '').split('?')[0].replace(/\/$/, '')
  const queryStr = url.includes('?') ? url.split('?')[1] : ''
  const searchParams = new URLSearchParams(queryStr)
  const normMethod = method.toUpperCase()

  // 1. Auth routes
  if (cleanUrl === '/auth/login' && normMethod === 'POST') {
    const username = body?.usernameOrEmail?.toLowerCase() || 'ministry'
    const matchedUser = DEMO_USERS[username] || DEMO_USERS['ministry']
    return {
      status: 200,
      data: {
        token: `kavach-jwt-${matchedUser.username}-${Date.now()}`,
        userId: matchedUser.userId,
        username: matchedUser.username,
        fullName: matchedUser.fullName,
        email: matchedUser.email,
        role: matchedUser.role,
        stateId: matchedUser.stateId,
        stateName: matchedUser.stateName,
      },
    }
  }

  if (cleanUrl === '/auth/me' && normMethod === 'GET') {
    return { status: 200, data: DEMO_USERS['ministry'] }
  }

  if (cleanUrl === '/auth/logout') {
    return { status: 200, data: { status: 'success', message: 'Logged out' } }
  }

  // 2. Dashboard routes
  if (cleanUrl === '/dashboard/kpis' && normMethod === 'GET') {
    return { status: 200, data: MOCK_KPIS }
  }

  if (cleanUrl === '/dashboard/risk-distribution' && normMethod === 'GET') {
    return { status: 200, data: MOCK_KPIS.riskDistribution }
  }

  if (cleanUrl === '/dashboard/status-distribution' && normMethod === 'GET') {
    return { status: 200, data: MOCK_KPIS.statusDistribution }
  }

  // 3. Projects routes
  if (cleanUrl === '/projects/high-risk' && normMethod === 'GET') {
    const size = parseInt(searchParams.get('size') || '10', 10)
    const highRisk = ALL_PROJECTS
      .filter(p => p.riskLevel === 'CRITICAL' || p.riskLevel === 'HIGH')
      .slice(0, size)
    return { status: 200, data: highRisk }
  }

  if (cleanUrl === '/projects' && normMethod === 'GET') {
    const status = searchParams.get('status')
    const search = (searchParams.get('search') || '').toLowerCase()
    let filtered = [...ALL_PROJECTS]
    if (status) filtered = filtered.filter(p => p.status === status)
    if (search) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(search) ||
        p.projectCode.toLowerCase().includes(search) ||
        p.stateName.toLowerCase().includes(search)
      )
    }
    const page = parseInt(searchParams.get('page') || '0', 10)
    const size = parseInt(searchParams.get('size') || '10', 10)
    const content = filtered.slice(page * size, (page + 1) * size)
    return {
      status: 200,
      data: {
        content,
        totalElements: filtered.length,
        totalPages: Math.ceil(filtered.length / size),
        page,
        size,
      },
    }
  }

  // Match /projects/:id or /projects/:code
  const projectMatch = cleanUrl.match(/^\/projects\/([^/]+)$/)
  if (projectMatch && normMethod === 'GET') {
    const idOrCode = projectMatch[1]
    const proj = getProjectByIdOrCode(idOrCode)
    if (proj) {
      return { status: 200, data: proj }
    }
    // Return first demo project if not found
    return { status: 200, data: ALL_PROJECTS[0] }
  }

  // 4. ML routes
  if (cleanUrl === '/ml/health' || cleanUrl === '/health') {
    return {
      status: 200,
      data: {
        status: 'UP',
        service: 'kavach-ml-sentinel',
        version: '2.0.0',
        environment: 'production',
        models_loaded: {
          xgboost_delay_classifier: true,
          xgboost_cost_overrun: true,
          isolation_forest_anomaly: true,
          sentence_transformer_duplicates: true,
          fourier_2d_fft_authenticity: true,
        },
        uptime_seconds: 86400,
        timestamp: new Date().toISOString(),
      },
    }
  }

  if (cleanUrl === '/ml/anomalies' && normMethod === 'GET') {
    return {
      status: 200,
      data: {
        total_scored: 30,
        anomalies_found: 8,
        top_anomalies: [
          {
            project_code: 'MP-UP-RD-001',
            project_name: 'NH-24 Road Widening & Pavement Strengthening — Lucknow Sector 4',
            anomaly_score: 0.87,
            anomaly_score_normalized: 87,
            anomaly_label: 'CRITICAL ANOMALY',
            flags: ['Cost ratio: 1.48x', 'Progress gap: -35%', 'Disbursement spike detected'],
          },
          {
            project_code: 'MP-BR-HC-002',
            project_name: 'Community Health Centre Sub-centre Construction — Patna Ward 12',
            anomaly_score: 0.91,
            anomaly_score_normalized: 91,
            anomaly_label: 'CRITICAL ANOMALY',
            flags: ['Progress stalled at 18%', 'Utilization at 85%', 'Zero activity 120+ days'],
          },
          {
            project_code: 'MP-MP-WS-007',
            project_name: 'Narmada Water Pipeline Extension — Jabalpur East',
            anomaly_score: 0.78,
            anomaly_score_normalized: 78,
            anomaly_label: 'HIGH ANOMALY',
            flags: ['Contractor monopoly warning', 'Cost overrun ratio 1.35x'],
          },
          {
            project_code: 'MP-AS-DR-019',
            project_name: 'Brahmaputra Flood Protection Drainage — Guwahati Ward 8',
            anomaly_score: 0.88,
            anomaly_score_normalized: 88,
            anomaly_label: 'CRITICAL ANOMALY',
            flags: ['Physical vs financial divergence -52%', 'Exceeded completion deadline'],
          },
          {
            project_code: 'MP-RJ-WS-004',
            project_name: 'Desert Solar Water Desalination Unit — Jodhpur Rural',
            anomaly_score: 0.65,
            anomaly_score_normalized: 65,
            anomaly_label: 'HIGH ANOMALY',
            flags: ['Procurement price escalation 28%', 'Milestone 2 unverified'],
          },
          {
            project_code: 'MP-UP-RD-011',
            project_name: 'Agra-Mathura Link Road Bypass Improvement Segment 3',
            anomaly_score: 0.69,
            anomaly_score_normalized: 69,
            anomaly_label: 'HIGH ANOMALY',
            flags: ['Milestone progress variance -22%', 'Single invoice concentration'],
          },
          {
            project_code: 'MP-BR-RD-013',
            project_name: 'Kosi River Embankment Approach Road — Supaul',
            anomaly_score: 0.81,
            anomaly_score_normalized: 81,
            anomaly_label: 'CRITICAL ANOMALY',
            flags: ['Geotag coordinate drift 1.8km', 'Payment spike ratio 6.2x'],
          },
          {
            project_code: 'MP-CG-HC-017',
            project_name: 'Tribal Health Post & Diagnostic Sub-Centre — Bastar',
            anomaly_score: 0.74,
            anomaly_score_normalized: 74,
            anomaly_label: 'HIGH ANOMALY',
            flags: ['Material supply ledger discontinuity', 'Delayed foundation audit'],
          },
        ],
      },
    }
  }

  if (cleanUrl === '/ml/score-all' && normMethod === 'POST') {
    return {
      status: 200,
      data: {
        status: 'success',
        message: 'Batch scoring completed successfully for 558 projects across all states.',
        scored_count: 558,
        anomalies_detected: 224,
        critical_count: 1,
        timestamp: new Date().toISOString(),
      },
    }
  }

  if (cleanUrl === '/ml/predict-delay' && normMethod === 'POST') {
    const p = body || {}
    const exp = Number(p.expected_progress_pct ?? 60)
    const rep = Number(p.reported_progress_pct ?? 40)
    const gap = exp - rep
    const est = Number(p.estimated_cost ?? 1)
    const sanc = Number(p.sanctioned_amount ?? 1)
    const costRatio = sanc > 0 ? est / sanc : 1

    let delayProb = 0.35
    if (gap > 20) delayProb += 0.35
    else if (gap > 10) delayProb += 0.2
    if (costRatio > 1.2) delayProb += 0.2
    delayProb = Math.min(Math.max(delayProb, 0.05), 0.96)
    delayProb = Number(delayProb.toFixed(2))

    return {
      status: 200,
      data: {
        status: 'OK',
        delay_probability: delayProb,
        is_delayed: delayProb >= 0.5,
        prediction_label: delayProb >= 0.5 ? 'LIKELY_DELAYED' : 'ON_TRACK',
        confidence_pct: Math.round(Math.max(delayProb, 1 - delayProb) * 100),
        cost_overrun_ratio: Number(costRatio.toFixed(2)),
        shap_top_factors: [
          { feature: 'Progress Gap (Schedule vs Physical)', shap_value: Number((gap / 100).toFixed(3)) },
          { feature: 'Cost Escalation Factor', shap_value: Number(((costRatio - 1) * 0.4).toFixed(3)) },
          { feature: 'Single Disbursement Spike Ratio', shap_value: 0.118 },
          { feature: 'Timeline Elapsed %', shap_value: -0.035 },
        ],
        risk_drivers: [
          gap > 15 ? `Physical progress lags expected schedule by ${gap.toFixed(0)}%` : 'Physical progress aligns with schedule',
          costRatio > 1.1 ? `Cost estimate exceeds sanction by ${((costRatio - 1) * 100).toFixed(0)}%` : 'Budget within sanctioned limits',
          'Autonomous milestone gate verification active',
        ],
      },
    }
  }

  if (cleanUrl === '/ml/detect-anomaly' && normMethod === 'POST') {
    return {
      status: 200,
      data: {
        status: 'OK',
        anomaly_score: 0.76,
        anomaly_score_normalized: 76,
        anomaly_label: 'HIGH_RISK_ANOMALY',
        flags: ['Divergence in fund drawdown vs verified milestone'],
      },
    }
  }

  // Match /ml/report/:code
  const reportMatch = cleanUrl.match(/^\/ml\/report\/([^/]+)$/)
  if (reportMatch) {
    const code = reportMatch[1]
    const proj = getProjectByIdOrCode(code) || ALL_PROJECTS[0]
    const reportText = `================================================================================
          GOVERNMENT OF INDIA • MINISTRY OF STATISTICS & PROGRAMME IMPLEMENTATION
                     MPLADS SENTINEL / KAVACH 2.0 AUDIT INTELLIGENCE
                       OFFICIAL PROJECT INVESTIGATION REPORT
================================================================================
Generated On: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
Security Classification: CONFIDENTIAL / DECISION SUPPORT ONLY
Target Scheme: Members of Parliament Local Area Development Scheme (MPLADS)

--------------------------------------------------------------------------------
1. PROJECT IDENTIFICATION & ADMINISTRATIVE METADATA
--------------------------------------------------------------------------------
Project Code            : ${proj.projectCode}
Project Name            : ${proj.name}
Scope of Work           : ${proj.description}
Current Status          : ${proj.status}
State & District        : ${proj.stateName}, ${proj.district}
Constituency            : ${proj.constituency}
Hon'ble MP In-Charge    : ${proj.mpName}
Implementing Agency     : ${proj.agencyName}
Geospatial Coordinates  : ${proj.latitude.toFixed(4)}° N, ${proj.longitude.toFixed(4)}° E

--------------------------------------------------------------------------------
2. FINANCIAL APPRAISAL & FUND DISBURSEMENT LEDGER
--------------------------------------------------------------------------------
Sanctioned Budget       : ₹${(proj.sanctionedAmountRs / 1e7).toFixed(2)} Cr
Estimated Final Cost    : ₹${(proj.estimatedCostRs / 1e7).toFixed(2)} Cr
Total Funds Released    : ₹${(proj.totalExpenditurePaise / 1e9).toFixed(2)} Cr
Fund Utilization Rate   : ${proj.utilizationPct.toFixed(1)}%
Cost Overrun Multiplier : ${proj.costOverrunRatio.toFixed(2)}x

--------------------------------------------------------------------------------
3. SENTINEL ML RISK INTELLIGENCE & AUDIT VERDICT
--------------------------------------------------------------------------------
Composite Risk Level    : ${proj.riskLevel} (${proj.riskScore}/100)
Schedule Delay Risk     : ${(proj.delayProbability * 100).toFixed(1)}% probability of slippage >30 days
Audit Flags             : ${proj.riskFlags.join('; ')}

================================================================================
End of Confidential Audit Extract • Ministry of Statistics & PI (MoSPI)
================================================================================`
    return {
      status: 200,
      data: reportText,
      headers: { 'Content-Type': 'text/plain' },
    }
  }

  // Not handled
  return null
}
