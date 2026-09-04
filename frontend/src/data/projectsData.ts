/**
 * Centralized Demo Projects Repository for Kavach 2.0 / MPLADS Sentinel
 * Contains rich metadata, financial accounts, milestone tracking, and risk profiles
 * for all 30 demo projects across India.
 */

export interface Milestone {
  id: number
  title: string
  targetDate: string
  completedDate?: string | null
  disbursementAmountRs: number
  status: 'COMPLETED' | 'IN_PROGRESS' | 'PENDING'
  notes?: string
}

export interface PaymentVoucher {
  voucherNo: string
  date: string
  amountRs: number
  installment: number
  recipientAgency: string
  status: 'DISBURSED' | 'PENDING' | 'HELD'
  auditFlag?: string
}

export interface DetailedProject {
  id: number
  projectCode: string
  name: string
  description: string
  status: 'IN_PROGRESS' | 'COMPLETED' | 'STALLED' | 'SANCTIONED' | 'CANCELLED'
  stateName: string
  constituency: string
  district: string
  categoryName: 'Roads' | 'Education' | 'Health' | 'Water Supply'
  mpName: string
  agencyName: string
  sanctionedCr: number
  sanctionedAmountRs: number
  estimatedCostRs: number
  totalExpenditurePaise: number
  utilizationPct: number
  reportedProgressPct: number
  expectedProgressPct: number
  startDate: string
  expectedEndDate: string
  actualEndDate: string | null
  riskLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
  riskScore: number
  delayProbability: number
  costOverrunRatio: number
  anomalyScore: number
  riskFlags: string[]
  paymentCount: number
  latitude: number
  longitude: number
  milestones: Milestone[]
  payments: PaymentVoucher[]
}

export const ALL_PROJECTS: DetailedProject[] = [
  {
    id: 1,
    projectCode: 'MP-UP-RD-001',
    name: 'NH-24 Road Widening — Lucknow to Unnao',
    description: '4-lane rural-urban arterial road expansion with bituminous macadam overlay and storm drainage culverts.',
    status: 'IN_PROGRESS',
    stateName: 'Uttar Pradesh',
    constituency: 'Lucknow',
    district: 'Lucknow',
    categoryName: 'Roads',
    mpName: 'Shri Rajnath Singh',
    agencyName: 'UP State Highway & PWD Division 2',
    sanctionedCr: 4.50,
    sanctionedAmountRs: 45000000,
    estimatedCostRs: 52000000,
    totalExpenditurePaise: 3690000000,
    utilizationPct: 82,
    reportedProgressPct: 58,
    expectedProgressPct: 86,
    startDate: '2023-03-15',
    expectedEndDate: '2024-09-30',
    actualEndDate: null,
    riskLevel: 'HIGH',
    riskScore: 72,
    delayProbability: 0.78,
    costOverrunRatio: 1.15,
    anomalyScore: 0.68,
    riskFlags: [
      'Reported progress (58%) lags expected schedule (86%) by 28%',
      'Single installment disbursement spike (> 40% of total funds in single tranche)',
      'Contractor payment frequency slowed in Q2 2024',
      'Geospatial proximity audit recommended for asphalt supplier vouchers'
    ],
    paymentCount: 4,
    latitude: 26.85,
    longitude: 80.95,
    milestones: [
      { id: 1, title: 'Land Survey & Soil Grading', targetDate: '2023-05-15', completedDate: '2023-06-02', disbursementAmountRs: 9000000, status: 'COMPLETED', notes: 'Completed with minor 2-week weather delay.' },
      { id: 2, title: 'Sub-base Compaction & Culvert Works', targetDate: '2023-11-20', completedDate: '2023-12-10', disbursementAmountRs: 13500000, status: 'COMPLETED', notes: 'Approved by District Engineer.' },
      { id: 3, title: 'Dense Bituminous Macadam (DBM) Layer', targetDate: '2024-04-15', completedDate: null, disbursementAmountRs: 14400000, status: 'IN_PROGRESS', notes: 'Currently stalled due to aggregate raw material disputes.' },
      { id: 4, title: 'Asphalt Wearing Course & Signage', targetDate: '2024-09-30', completedDate: null, disbursementAmountRs: 8100000, status: 'PENDING', notes: 'Scheduled after DBM certification.' }
    ],
    payments: [
      { voucherNo: 'VCH-UP-2023-089', date: '2023-06-10', amountRs: 9000000, installment: 1, recipientAgency: 'UP PWD Division 2', status: 'DISBURSED' },
      { voucherNo: 'VCH-UP-2023-241', date: '2023-12-18', amountRs: 13500000, installment: 2, recipientAgency: 'UP PWD Division 2', status: 'DISBURSED' },
      { voucherNo: 'VCH-UP-2024-042', date: '2024-03-22', amountRs: 14400000, installment: 3, recipientAgency: 'UP PWD Division 2', status: 'DISBURSED', auditFlag: 'High Tranche Ratio Flag' }
    ]
  },
  {
    id: 2,
    projectCode: 'MP-MH-SC-002',
    name: 'Govt Primary School — Nagpur Rural Block',
    description: 'Construction of 8 smart classrooms, clean water filtration kiosk, solar rooftop setup, and playground.',
    status: 'COMPLETED',
    stateName: 'Maharashtra',
    constituency: 'Nagpur',
    district: 'Nagpur Rural',
    categoryName: 'Education',
    mpName: 'Shri Nitin Gadkari',
    agencyName: 'Nagpur Zilla Parishad Engineering Cell',
    sanctionedCr: 2.10,
    sanctionedAmountRs: 21000000,
    estimatedCostRs: 20800000,
    totalExpenditurePaise: 2037000000,
    utilizationPct: 97,
    reportedProgressPct: 100,
    expectedProgressPct: 100,
    startDate: '2023-01-10',
    expectedEndDate: '2023-12-20',
    actualEndDate: '2023-12-15',
    riskLevel: 'LOW',
    riskScore: 18,
    delayProbability: 0.12,
    costOverrunRatio: 0.99,
    anomalyScore: 0.14,
    riskFlags: ['Project completed ahead of schedule with zero cost overrun'],
    paymentCount: 5,
    latitude: 21.15,
    longitude: 79.09,
    milestones: [
      { id: 1, title: 'Piling & Foundation Slab', targetDate: '2023-03-30', completedDate: '2023-03-25', disbursementAmountRs: 4200000, status: 'COMPLETED' },
      { id: 2, title: 'Ground Floor Masonry & RCC Columns', targetDate: '2023-06-30', completedDate: '2023-06-28', disbursementAmountRs: 6300000, status: 'COMPLETED' },
      { id: 3, title: 'Smart Board Electrification & Interior', targetDate: '2023-09-30', completedDate: '2023-09-20', disbursementAmountRs: 6300000, status: 'COMPLETED' },
      { id: 4, title: 'Final Handover & Quality Certification', targetDate: '2023-12-20', completedDate: '2023-12-15', disbursementAmountRs: 3570000, status: 'COMPLETED' }
    ],
    payments: [
      { voucherNo: 'VCH-MH-2023-011', date: '2023-04-05', amountRs: 4200000, installment: 1, recipientAgency: 'Nagpur ZP Cell', status: 'DISBURSED' },
      { voucherNo: 'VCH-MH-2023-104', date: '2023-07-10', amountRs: 6300000, installment: 2, recipientAgency: 'Nagpur ZP Cell', status: 'DISBURSED' },
      { voucherNo: 'VCH-MH-2023-199', date: '2023-10-02', amountRs: 6300000, installment: 3, recipientAgency: 'Nagpur ZP Cell', status: 'DISBURSED' },
      { voucherNo: 'VCH-MH-2023-312', date: '2023-12-20', amountRs: 3570000, installment: 4, recipientAgency: 'Nagpur ZP Cell', status: 'DISBURSED' }
    ]
  },
  {
    id: 3,
    projectCode: 'MP-BR-HW-003',
    name: 'Community Health Centre — Patna District',
    description: '30-bed emergency care facility with pathology laboratory, maternity ward, and doctor quarters.',
    status: 'STALLED',
    stateName: 'Bihar',
    constituency: 'Patna Sahib',
    district: 'Patna',
    categoryName: 'Health',
    mpName: 'Shri Ravi Shankar Prasad',
    agencyName: 'Bihar State Building Construction Corporation',
    sanctionedCr: 3.20,
    sanctionedAmountRs: 32000000,
    estimatedCostRs: 41000000,
    totalExpenditurePaise: 1088000000,
    utilizationPct: 34,
    reportedProgressPct: 25,
    expectedProgressPct: 92,
    startDate: '2022-11-01',
    expectedEndDate: '2024-03-31',
    actualEndDate: null,
    riskLevel: 'CRITICAL',
    riskScore: 91,
    delayProbability: 0.94,
    costOverrunRatio: 1.28,
    anomalyScore: 0.89,
    riskFlags: [
      'CRITICAL: Project stalled for > 180 consecutive days without site activity',
      'Expected progress (92%) vs Reported progress (25%) gap is 67%',
      'Payment claimed for second foundation phase without geo-tagged photo verification',
      'Vendor bankruptcy notice lodged with district nodal authority'
    ],
    paymentCount: 2,
    latitude: 25.61,
    longitude: 85.14,
    milestones: [
      { id: 1, title: 'Basement Piling & Drainage', targetDate: '2023-02-28', completedDate: '2023-04-12', disbursementAmountRs: 6400000, status: 'COMPLETED' },
      { id: 2, title: 'First Floor Framework & Oxygen Line Ducting', targetDate: '2023-08-31', completedDate: null, disbursementAmountRs: 4480000, status: 'IN_PROGRESS', notes: 'Work halted due to contractor insolvency.' },
      { id: 3, title: 'Ward Finishing, Medical Gas Pipeline', targetDate: '2023-12-31', completedDate: null, disbursementAmountRs: 11200000, status: 'PENDING' },
      { id: 4, title: 'Equipment Commissioning & Certification', targetDate: '2024-03-31', completedDate: null, disbursementAmountRs: 9920000, status: 'PENDING' }
    ],
    payments: [
      { voucherNo: 'VCH-BR-2023-022', date: '2023-04-20', amountRs: 6400000, installment: 1, recipientAgency: 'Bihar BCDC', status: 'DISBURSED' },
      { voucherNo: 'VCH-BR-2023-181', date: '2023-09-05', amountRs: 4480000, installment: 2, recipientAgency: 'Bihar BCDC', status: 'DISBURSED', auditFlag: 'Zero Progress Verification Flag' }
    ]
  },
  {
    id: 4,
    projectCode: 'MP-WB-WS-004',
    name: 'Rural Water Supply Scheme — Hooghly',
    description: 'Deep tube-well installation, overhead reservoir (50,000 L capacity), and piped drinking water to 420 households.',
    status: 'IN_PROGRESS',
    stateName: 'West Bengal',
    constituency: 'Hooghly',
    district: 'Hooghly',
    categoryName: 'Water Supply',
    mpName: 'Smt. Locket Chatterjee',
    agencyName: 'West Bengal Public Health Engineering Directorate',
    sanctionedCr: 1.80,
    sanctionedAmountRs: 18000000,
    estimatedCostRs: 19200000,
    totalExpenditurePaise: 1098000000,
    utilizationPct: 61,
    reportedProgressPct: 54,
    expectedProgressPct: 68,
    startDate: '2023-06-01',
    expectedEndDate: '2024-11-30',
    actualEndDate: null,
    riskLevel: 'MEDIUM',
    riskScore: 48,
    delayProbability: 0.42,
    costOverrunRatio: 1.07,
    anomalyScore: 0.38,
    riskFlags: [
      'Minor schedule slip due to monsoon inundation in Hooghly river basin',
      'Pipe procurement invoice discrepancy cleared during District audit'
    ],
    paymentCount: 3,
    latitude: 22.90,
    longitude: 88.40,
    milestones: [
      { id: 1, title: 'Borewell Drilling & Water Potability Test', targetDate: '2023-08-15', completedDate: '2023-08-30', disbursementAmountRs: 3600000, status: 'COMPLETED' },
      { id: 2, title: 'RCC Elevated Storage Reservoir Construction', targetDate: '2024-02-28', completedDate: '2024-03-15', disbursementAmountRs: 7380000, status: 'COMPLETED' },
      { id: 3, title: 'Distribution Pipeline Laying across 4 Wards', targetDate: '2024-07-31', completedDate: null, disbursementAmountRs: 4500000, status: 'IN_PROGRESS' },
      { id: 4, title: 'Domestic Tap Connections & Water Metering', targetDate: '2024-11-30', completedDate: null, disbursementAmountRs: 2520000, status: 'PENDING' }
    ],
    payments: [
      { voucherNo: 'VCH-WB-2023-112', date: '2023-09-02', amountRs: 3600000, installment: 1, recipientAgency: 'WB PHED Hooghly', status: 'DISBURSED' },
      { voucherNo: 'VCH-WB-2024-019', date: '2024-03-20', amountRs: 7380000, installment: 2, recipientAgency: 'WB PHED Hooghly', status: 'DISBURSED' }
    ]
  },
  {
    id: 5,
    projectCode: 'MP-RJ-RD-005',
    name: 'Desert Highway Connectivity — Jodhpur',
    description: 'All-weather bituminous connectivity to 14 border and desert villages with solar street lamp installations.',
    status: 'SANCTIONED',
    stateName: 'Rajasthan',
    constituency: 'Jodhpur',
    district: 'Jodhpur',
    categoryName: 'Roads',
    mpName: 'Shri Gajendra Singh Shekhawat',
    agencyName: 'Rajasthan PWD Western Zone',
    sanctionedCr: 5.40,
    sanctionedAmountRs: 54000000,
    estimatedCostRs: 59000000,
    totalExpenditurePaise: 648000000,
    utilizationPct: 12,
    reportedProgressPct: 5,
    expectedProgressPct: 22,
    startDate: '2024-01-15',
    expectedEndDate: '2025-06-30',
    actualEndDate: null,
    riskLevel: 'HIGH',
    riskScore: 65,
    delayProbability: 0.69,
    costOverrunRatio: 1.09,
    anomalyScore: 0.55,
    riskFlags: [
      'Tender award disputed by runner-up bidder — High initial delay risk',
      'Mobilization advance disbursed without formal land clearance for Section 3'
    ],
    paymentCount: 1,
    latitude: 26.29,
    longitude: 73.03,
    milestones: [
      { id: 1, title: 'Site Clearance & Sand Ridge Leveling', targetDate: '2024-04-30', completedDate: null, disbursementAmountRs: 6480000, status: 'IN_PROGRESS' },
      { id: 2, title: 'Granular Sub-Base Laying (35 km)', targetDate: '2024-10-31', completedDate: null, disbursementAmountRs: 16200000, status: 'PENDING' },
      { id: 3, title: 'Black-top Surfacing & Desert Drainage', targetDate: '2025-03-31', completedDate: null, disbursementAmountRs: 21600000, status: 'PENDING' },
      { id: 4, title: 'Solar Street Lights & Km Markers', targetDate: '2025-06-30', completedDate: null, disbursementAmountRs: 9720000, status: 'PENDING' }
    ],
    payments: [
      { voucherNo: 'VCH-RJ-2024-004', date: '2024-02-14', amountRs: 6480000, installment: 1, recipientAgency: 'Rajasthan PWD Jodhpur', status: 'DISBURSED' }
    ]
  },
  {
    id: 6,
    projectCode: 'MP-TN-SC-006',
    name: 'Model School Building — Chennai Suburbs',
    description: '3-storey modern higher secondary school with composite science lab, library, auditorium, and sports ground.',
    status: 'COMPLETED',
    stateName: 'Tamil Nadu',
    constituency: 'Chennai South',
    district: 'Chennai',
    categoryName: 'Education',
    mpName: 'Smt. Thamizhachi Thangapandian',
    agencyName: 'Greater Chennai Corporation Works Dept',
    sanctionedCr: 2.75,
    sanctionedAmountRs: 27500000,
    estimatedCostRs: 27500000,
    totalExpenditurePaise: 2750000000,
    utilizationPct: 100,
    reportedProgressPct: 100,
    expectedProgressPct: 100,
    startDate: '2022-09-01',
    expectedEndDate: '2023-11-30',
    actualEndDate: '2023-11-20',
    riskLevel: 'LOW',
    riskScore: 9,
    delayProbability: 0.05,
    costOverrunRatio: 1.00,
    anomalyScore: 0.07,
    riskFlags: ['Flawless execution — All audit verifications passed with 100% geo-compliance'],
    paymentCount: 4,
    latitude: 13.08,
    longitude: 80.27,
    milestones: [
      { id: 1, title: 'Foundation & Ground Floor RCC', targetDate: '2022-12-31', completedDate: '2022-12-15', disbursementAmountRs: 6875000, status: 'COMPLETED' },
      { id: 2, title: 'First & Second Floor Structure', targetDate: '2023-04-30', completedDate: '2023-04-20', disbursementAmountRs: 8250000, status: 'COMPLETED' },
      { id: 3, title: 'Labs & Auditorium Fit-out', targetDate: '2023-08-31', completedDate: '2023-08-15', disbursementAmountRs: 6875000, status: 'COMPLETED' },
      { id: 4, title: 'Final Handover & Municipal NOC', targetDate: '2023-11-30', completedDate: '2023-11-20', disbursementAmountRs: 5500000, status: 'COMPLETED' }
    ],
    payments: [
      { voucherNo: 'VCH-TN-2023-005', date: '2023-01-05', amountRs: 6875000, installment: 1, recipientAgency: 'GCC Works Dept', status: 'DISBURSED' },
      { voucherNo: 'VCH-TN-2023-088', date: '2023-05-10', amountRs: 8250000, installment: 2, recipientAgency: 'GCC Works Dept', status: 'DISBURSED' },
      { voucherNo: 'VCH-TN-2023-195', date: '2023-09-01', amountRs: 6875000, installment: 3, recipientAgency: 'GCC Works Dept', status: 'DISBURSED' },
      { voucherNo: 'VCH-TN-2023-289', date: '2023-11-25', amountRs: 5500000, installment: 4, recipientAgency: 'GCC Works Dept', status: 'DISBURSED' }
    ]
  },
  {
    id: 7,
    projectCode: 'MP-KA-HW-007',
    name: 'Primary Health Centre — Mysuru Taluk',
    description: 'Upgradation of rural health sub-centre to 24x7 delivery PHC with cold chain vaccine storage.',
    status: 'IN_PROGRESS',
    stateName: 'Karnataka',
    constituency: 'Mysuru',
    district: 'Mysuru',
    categoryName: 'Health',
    mpName: 'Shri Pratap Simha',
    agencyName: 'Karnataka Health System Development Corporation',
    sanctionedCr: 1.95,
    sanctionedAmountRs: 19500000,
    estimatedCostRs: 20500000,
    totalExpenditurePaise: 1072500000,
    utilizationPct: 55,
    reportedProgressPct: 50,
    expectedProgressPct: 62,
    startDate: '2023-05-10',
    expectedEndDate: '2024-10-31',
    actualEndDate: null,
    riskLevel: 'MEDIUM',
    riskScore: 42,
    delayProbability: 0.38,
    costOverrunRatio: 1.05,
    anomalyScore: 0.31,
    riskFlags: ['Minor civil construction delay due to electrical sub-station sanctioning'],
    paymentCount: 3,
    latitude: 12.30,
    longitude: 76.65,
    milestones: [
      { id: 1, title: 'Structural Civil Extension', targetDate: '2023-09-30', completedDate: '2023-10-15', disbursementAmountRs: 4875000, status: 'COMPLETED' },
      { id: 2, title: 'Vaccine Cold Room & Backup DG Set', targetDate: '2024-03-31', completedDate: '2024-04-10', disbursementAmountRs: 5850000, status: 'COMPLETED' },
      { id: 3, title: 'Interior Finishing & Doctor Quarters', targetDate: '2024-07-31', completedDate: null, disbursementAmountRs: 4875000, status: 'IN_PROGRESS' },
      { id: 4, title: 'Medical Equipment Installation', targetDate: '2024-10-31', completedDate: null, disbursementAmountRs: 3900000, status: 'PENDING' }
    ],
    payments: [
      { voucherNo: 'VCH-KA-2023-090', date: '2023-10-25', amountRs: 4875000, installment: 1, recipientAgency: 'KHSDC Mysuru', status: 'DISBURSED' },
      { voucherNo: 'VCH-KA-2024-033', date: '2024-04-20', amountRs: 5850000, installment: 2, recipientAgency: 'KHSDC Mysuru', status: 'DISBURSED' }
    ]
  },
  {
    id: 8,
    projectCode: 'MP-MP-WS-008',
    name: 'Narmada Pipeline Extension — Jabalpur',
    description: 'Laying 28 km ductile iron (DI) feeder pipe from Narmada River pump intake to Jabalpur eastern rural belt.',
    status: 'STALLED',
    stateName: 'Madhya Pradesh',
    constituency: 'Jabalpur',
    district: 'Jabalpur',
    categoryName: 'Water Supply',
    mpName: 'Shri Rakesh Singh',
    agencyName: 'MP Jal Nigam Maryadit',
    sanctionedCr: 3.60,
    sanctionedAmountRs: 36000000,
    estimatedCostRs: 46000000,
    totalExpenditurePaise: 1044000000,
    utilizationPct: 29,
    reportedProgressPct: 18,
    expectedProgressPct: 75,
    startDate: '2023-02-01',
    expectedEndDate: '2024-08-31',
    actualEndDate: null,
    riskLevel: 'HIGH',
    riskScore: 78,
    delayProbability: 0.84,
    costOverrunRatio: 1.27,
    anomalyScore: 0.72,
    riskFlags: [
      'Forest department clearance pending for 6.2 km pipeline corridor',
      'Contractor invoked force majeure clause over raw material cost inflation',
      'Zero expenditure registered in past 120 days'
    ],
    paymentCount: 2,
    latitude: 23.17,
    longitude: 79.95,
    milestones: [
      { id: 1, title: 'Pipe Procurement & Trench Digging (Phase 1)', targetDate: '2023-06-30', completedDate: '2023-07-20', disbursementAmountRs: 7200000, status: 'COMPLETED' },
      { id: 2, title: 'Intake Well Pump Foundation', targetDate: '2023-11-30', completedDate: null, disbursementAmountRs: 3240000, status: 'IN_PROGRESS', notes: 'Stalled due to forest boundary objection.' },
      { id: 3, title: 'Feeder Main Hydrostatic Pressure Testing', targetDate: '2024-04-30', completedDate: null, disbursementAmountRs: 12600000, status: 'PENDING' },
      { id: 4, title: 'Commissioning & Community Hydrants', targetDate: '2024-08-31', completedDate: null, disbursementAmountRs: 12960000, status: 'PENDING' }
    ],
    payments: [
      { voucherNo: 'VCH-MP-2023-044', date: '2023-07-28', amountRs: 7200000, installment: 1, recipientAgency: 'MP Jal Nigam Jabalpur', status: 'DISBURSED' },
      { voucherNo: 'VCH-MP-2023-156', date: '2023-12-05', amountRs: 3240000, installment: 2, recipientAgency: 'MP Jal Nigam Jabalpur', status: 'DISBURSED' }
    ]
  },
  {
    id: 9,
    projectCode: 'MP-GJ-RD-009',
    name: 'Industrial Road Upgrade — Surat GIDC',
    description: 'Heavy duty concrete paving, stormwater drains, and LED street infrastructure for Surat textile estate.',
    status: 'COMPLETED',
    stateName: 'Gujarat',
    constituency: 'Surat',
    district: 'Surat',
    categoryName: 'Roads',
    mpName: 'Smt. Darshana Jardosh',
    agencyName: 'Gujarat Industrial Development Corporation (GIDC)',
    sanctionedCr: 3.80,
    sanctionedAmountRs: 38000000,
    estimatedCostRs: 37500000,
    totalExpenditurePaise: 3572000000,
    utilizationPct: 94,
    reportedProgressPct: 100,
    expectedProgressPct: 100,
    startDate: '2022-10-15',
    expectedEndDate: '2023-12-31',
    actualEndDate: '2023-12-10',
    riskLevel: 'LOW',
    riskScore: 12,
    delayProbability: 0.08,
    costOverrunRatio: 0.98,
    anomalyScore: 0.10,
    riskFlags: ['Executed within budget and prior to scheduled deadline'],
    paymentCount: 4,
    latitude: 21.17,
    longitude: 72.83,
    milestones: [
      { id: 1, title: 'Road Base & Box Culvert Drainage', targetDate: '2023-02-28', completedDate: '2023-02-20', disbursementAmountRs: 9500000, status: 'COMPLETED' },
      { id: 2, title: 'PQC Concrete Pavement (Segment 1 & 2)', targetDate: '2023-06-30', completedDate: '2023-06-25', disbursementAmountRs: 13300000, status: 'COMPLETED' },
      { id: 3, title: 'LED Street Lighting & Signages', targetDate: '2023-10-31', completedDate: '2023-10-18', disbursementAmountRs: 7600000, status: 'COMPLETED' },
      { id: 4, title: 'Load Testing & Quality Certificate', targetDate: '2023-12-31', completedDate: '2023-12-10', disbursementAmountRs: 5320000, status: 'COMPLETED' }
    ],
    payments: [
      { voucherNo: 'VCH-GJ-2023-019', date: '2023-03-05', amountRs: 9500000, installment: 1, recipientAgency: 'GIDC Engineering', status: 'DISBURSED' },
      { voucherNo: 'VCH-GJ-2023-109', date: '2023-07-01', amountRs: 13300000, installment: 2, recipientAgency: 'GIDC Engineering', status: 'DISBURSED' },
      { voucherNo: 'VCH-GJ-2023-220', date: '2023-10-25', amountRs: 7600000, installment: 3, recipientAgency: 'GIDC Engineering', status: 'DISBURSED' },
      { voucherNo: 'VCH-GJ-2023-305', date: '2023-12-15', amountRs: 5320000, installment: 4, recipientAgency: 'GIDC Engineering', status: 'DISBURSED' }
    ]
  },
  {
    id: 10,
    projectCode: 'MP-AP-SC-010',
    name: 'Digital Classroom — Vijayawada Municipal',
    description: 'Deployment of smart interactive panels, high-speed optic fiber, and learning software in 22 civic schools.',
    status: 'IN_PROGRESS',
    stateName: 'Andhra Pradesh',
    constituency: 'Vijayawada',
    district: 'Krishna',
    categoryName: 'Education',
    mpName: 'Shri Kesineni Srinivas',
    agencyName: 'Vijayawada Municipal Corporation Education Cell',
    sanctionedCr: 1.40,
    sanctionedAmountRs: 14000000,
    estimatedCostRs: 14800000,
    totalExpenditurePaise: 994000000,
    utilizationPct: 71,
    reportedProgressPct: 65,
    expectedProgressPct: 80,
    startDate: '2023-07-01',
    expectedEndDate: '2024-08-15',
    actualEndDate: null,
    riskLevel: 'MEDIUM',
    riskScore: 44,
    delayProbability: 0.39,
    costOverrunRatio: 1.05,
    anomalyScore: 0.32,
    riskFlags: ['Hardware delivery batch 3 delayed by customs clearance at Chennai port'],
    paymentCount: 3,
    latitude: 16.51,
    longitude: 80.62,
    milestones: [
      { id: 1, title: 'Server Room Setup & Optic Fiber Cabling', targetDate: '2023-10-31', completedDate: '2023-10-28', disbursementAmountRs: 3500000, status: 'COMPLETED' },
      { id: 2, title: 'Interactive Flat Panels Installation (Batch 1 & 2)', targetDate: '2024-02-28', completedDate: '2024-03-10', disbursementAmountRs: 6440000, status: 'COMPLETED' },
      { id: 3, title: 'Teacher Training & LMS Software Rollout', targetDate: '2024-06-30', completedDate: null, disbursementAmountRs: 2500000, status: 'IN_PROGRESS' },
      { id: 4, title: 'Final Integration & Verification Audit', targetDate: '2024-08-15', completedDate: null, disbursementAmountRs: 1560000, status: 'PENDING' }
    ],
    payments: [
      { voucherNo: 'VCH-AP-2023-140', date: '2023-11-05', amountRs: 3500000, installment: 1, recipientAgency: 'VMC Education', status: 'DISBURSED' },
      { voucherNo: 'VCH-AP-2024-021', date: '2024-03-18', amountRs: 6440000, installment: 2, recipientAgency: 'VMC Education', status: 'DISBURSED' }
    ]
  },
  {
    id: 11,
    projectCode: 'MP-UP-RD-011',
    name: 'Agra-Mathura Rural Link Road',
    description: 'Upgradation of 18 km rural road linking agricultural mandis between Agra and Mathura border.',
    status: 'IN_PROGRESS',
    stateName: 'Uttar Pradesh',
    constituency: 'Agra',
    district: 'Agra',
    categoryName: 'Roads',
    mpName: 'Prof. S. P. Singh Baghel',
    agencyName: 'UP PWD Agra Circle',
    sanctionedCr: 2.90,
    sanctionedAmountRs: 29000000,
    estimatedCostRs: 33500000,
    totalExpenditurePaise: 1392000000,
    utilizationPct: 48,
    reportedProgressPct: 35,
    expectedProgressPct: 65,
    startDate: '2023-04-01',
    expectedEndDate: '2024-10-31',
    actualEndDate: null,
    riskLevel: 'HIGH',
    riskScore: 69,
    delayProbability: 0.74,
    costOverrunRatio: 1.15,
    anomalyScore: 0.61,
    riskFlags: [
      'Progress lags schedule by 30%',
      'Rainfall water-logging damage on uncapped earthwork'
    ],
    paymentCount: 2,
    latitude: 27.18,
    longitude: 77.98,
    milestones: [
      { id: 1, title: 'Earthwork Excavation & Levelling', targetDate: '2023-07-31', completedDate: '2023-08-20', disbursementAmountRs: 5800000, status: 'COMPLETED' },
      { id: 2, title: 'WBM Stone Soling', targetDate: '2024-01-31', completedDate: '2024-03-05', disbursementAmountRs: 8120000, status: 'COMPLETED' },
      { id: 3, title: 'Blacktopping & Shoulder Dressing', targetDate: '2024-07-31', completedDate: null, disbursementAmountRs: 8700000, status: 'IN_PROGRESS' },
      { id: 4, title: 'Culverts & Road Safety Boarding', targetDate: '2024-10-31', completedDate: null, disbursementAmountRs: 6380000, status: 'PENDING' }
    ],
    payments: [
      { voucherNo: 'VCH-UP-2023-118', date: '2023-08-25', amountRs: 5800000, installment: 1, recipientAgency: 'UP PWD Agra', status: 'DISBURSED' },
      { voucherNo: 'VCH-UP-2024-031', date: '2024-03-12', amountRs: 8120000, installment: 2, recipientAgency: 'UP PWD Agra', status: 'DISBURSED' }
    ]
  },
  {
    id: 12,
    projectCode: 'MP-MH-HW-012',
    name: 'Sub-district Hospital — Pune Hinterland',
    description: '50-bed sub-district healthcare center with 2 major operation theatres, blood storage, and residential medical staff quarters.',
    status: 'SANCTIONED',
    stateName: 'Maharashtra',
    constituency: 'Pune',
    district: 'Pune',
    categoryName: 'Health',
    mpName: 'Shri Girish Bapat',
    agencyName: 'Maharashtra PWD Building Division',
    sanctionedCr: 4.20,
    sanctionedAmountRs: 42000000,
    estimatedCostRs: 44000000,
    totalExpenditurePaise: 336000000,
    utilizationPct: 8,
    reportedProgressPct: 5,
    expectedProgressPct: 15,
    startDate: '2024-02-01',
    expectedEndDate: '2025-08-31',
    actualEndDate: null,
    riskLevel: 'MEDIUM',
    riskScore: 35,
    delayProbability: 0.32,
    costOverrunRatio: 1.04,
    anomalyScore: 0.25,
    riskFlags: ['Initial architectural layout modified to incorporate seismic resistance norms'],
    paymentCount: 1,
    latitude: 18.52,
    longitude: 73.86,
    milestones: [
      { id: 1, title: 'Architectural Blueprint & Soil Bearing Testing', targetDate: '2024-04-30', completedDate: '2024-04-20', disbursementAmountRs: 3360000, status: 'COMPLETED' },
      { id: 2, title: 'Foundation Raft & Retaining Walls', targetDate: '2024-10-31', completedDate: null, disbursementAmountRs: 10500000, status: 'IN_PROGRESS' },
      { id: 3, title: 'Superstructure Framing & OT Ducts', targetDate: '2025-03-31', completedDate: null, disbursementAmountRs: 16800000, status: 'PENDING' },
      { id: 4, title: 'Hospital Equipment & Fire Safety Certification', targetDate: '2025-08-31', completedDate: null, disbursementAmountRs: 11340000, status: 'PENDING' }
    ],
    payments: [
      { voucherNo: 'VCH-MH-2024-012', date: '2024-04-25', amountRs: 3360000, installment: 1, recipientAgency: 'Maha PWD Pune', status: 'DISBURSED' }
    ]
  },
  {
    id: 13,
    projectCode: 'MP-BR-RD-013',
    name: 'Kosi River Embankment Road — Supaul',
    description: 'Flood protection embankment-cum-road of 24 km with stone boulder pitching and culverts.',
    status: 'STALLED',
    stateName: 'Bihar',
    constituency: 'Supaul',
    district: 'Supaul',
    categoryName: 'Roads',
    mpName: 'Shri Dileshwar Kamait',
    agencyName: 'Bihar Water Resources Department',
    sanctionedCr: 3.10,
    sanctionedAmountRs: 31000000,
    estimatedCostRs: 42000000,
    totalExpenditurePaise: 1271000000,
    utilizationPct: 41,
    reportedProgressPct: 30,
    expectedProgressPct: 88,
    startDate: '2022-12-01',
    expectedEndDate: '2024-05-31',
    actualEndDate: null,
    riskLevel: 'HIGH',
    riskScore: 81,
    delayProbability: 0.88,
    costOverrunRatio: 1.35,
    anomalyScore: 0.76,
    riskFlags: [
      'Embankment breach during flood season caused major wash-away of sub-base',
      'Contractor billed for boulder pitching in dry season without drone verification'
    ],
    paymentCount: 2,
    latitude: 26.12,
    longitude: 86.60,
    milestones: [
      { id: 1, title: 'Earth Bund Compaction', targetDate: '2023-04-30', completedDate: '2023-05-15', disbursementAmountRs: 6200000, status: 'COMPLETED' },
      { id: 2, title: 'Boulder Riprap Pitching (River Face)', targetDate: '2023-11-30', completedDate: null, disbursementAmountRs: 6510000, status: 'IN_PROGRESS' },
      { id: 3, title: 'WBM Road Surfacing', targetDate: '2024-03-31', completedDate: null, disbursementAmountRs: 9300000, status: 'PENDING' },
      { id: 4, title: 'Culvert Gates & Ramp Approaches', targetDate: '2024-05-31', completedDate: null, disbursementAmountRs: 8990000, status: 'PENDING' }
    ],
    payments: [
      { voucherNo: 'VCH-BR-2023-088', date: '2023-05-22', amountRs: 6200000, installment: 1, recipientAgency: 'Bihar WRD Supaul', status: 'DISBURSED' },
      { voucherNo: 'VCH-BR-2023-214', date: '2023-12-10', amountRs: 6510000, installment: 2, recipientAgency: 'Bihar WRD Supaul', status: 'DISBURSED' }
    ]
  },
  {
    id: 14,
    projectCode: 'MP-HR-SC-014',
    name: 'Skill Development Centre — Gurugram',
    description: 'Modern vocational skilling centre for robotics, CNC machining, and healthcare assistant certification.',
    status: 'COMPLETED',
    stateName: 'Haryana',
    constituency: 'Gurugram',
    district: 'Gurugram',
    categoryName: 'Education',
    mpName: 'Shri Rao Inderjit Singh',
    agencyName: 'Haryana Skill Development Mission',
    sanctionedCr: 2.30,
    sanctionedAmountRs: 23000000,
    estimatedCostRs: 22800000,
    totalExpenditurePaise: 2277000000,
    utilizationPct: 99,
    reportedProgressPct: 100,
    expectedProgressPct: 100,
    startDate: '2023-02-15',
    expectedEndDate: '2023-12-31',
    actualEndDate: '2023-12-28',
    riskLevel: 'LOW',
    riskScore: 14,
    delayProbability: 0.09,
    costOverrunRatio: 0.99,
    anomalyScore: 0.08,
    riskFlags: ['Completed with full utilization and certified audit'],
    paymentCount: 4,
    latitude: 28.46,
    longitude: 77.03,
    milestones: [
      { id: 1, title: 'Facility Lease & Civil Refurbishment', targetDate: '2023-05-31', completedDate: '2023-05-20', disbursementAmountRs: 4600000, status: 'COMPLETED' },
      { id: 2, title: 'CNC Machines & Robotics Lab Rigging', targetDate: '2023-08-31', completedDate: '2023-08-25', disbursementAmountRs: 9200000, status: 'COMPLETED' },
      { id: 3, title: 'Curriculum Software & Instructor Hiring', targetDate: '2023-11-15', completedDate: '2023-11-10', disbursementAmountRs: 5750000, status: 'COMPLETED' },
      { id: 4, title: 'Inauguration & Batch Enrollment', targetDate: '2023-12-31', completedDate: '2023-12-28', disbursementAmountRs: 3220000, status: 'COMPLETED' }
    ],
    payments: [
      { voucherNo: 'VCH-HR-2023-018', date: '2023-06-01', amountRs: 4600000, installment: 1, recipientAgency: 'HSDM Gurugram', status: 'DISBURSED' },
      { voucherNo: 'VCH-HR-2023-094', date: '2023-09-02', amountRs: 9200000, installment: 2, recipientAgency: 'HSDM Gurugram', status: 'DISBURSED' },
      { voucherNo: 'VCH-HR-2023-172', date: '2023-11-15', amountRs: 5750000, installment: 3, recipientAgency: 'HSDM Gurugram', status: 'DISBURSED' },
      { voucherNo: 'VCH-HR-2023-231', date: '2023-12-30', amountRs: 3220000, installment: 4, recipientAgency: 'HSDM Gurugram', status: 'DISBURSED' }
    ]
  },
  {
    id: 15,
    projectCode: 'MP-PB-WS-015',
    name: 'Groundwater Recharge Project — Amritsar',
    description: 'Construction of 65 percolation wells and rainwater harvesting shafts across rural Amritsar blocks.',
    status: 'IN_PROGRESS',
    stateName: 'Punjab',
    constituency: 'Amritsar',
    district: 'Amritsar',
    categoryName: 'Water Supply',
    mpName: 'Shri Gurjeet Singh Aujla',
    agencyName: 'Punjab Water Resources and Sanitation Dept',
    sanctionedCr: 1.65,
    sanctionedAmountRs: 16500000,
    estimatedCostRs: 16500000,
    totalExpenditurePaise: 1105500000,
    utilizationPct: 67,
    reportedProgressPct: 64,
    expectedProgressPct: 70,
    startDate: '2023-06-15',
    expectedEndDate: '2024-09-30',
    actualEndDate: null,
    riskLevel: 'LOW',
    riskScore: 22,
    delayProbability: 0.18,
    costOverrunRatio: 1.00,
    anomalyScore: 0.15,
    riskFlags: ['Normal steady progress across all village clusters'],
    paymentCount: 3,
    latitude: 31.63,
    longitude: 74.87,
    milestones: [
      { id: 1, title: 'Hydro-geological Survey & Site Approvals', targetDate: '2023-09-15', completedDate: '2023-09-10', disbursementAmountRs: 3300000, status: 'COMPLETED' },
      { id: 2, title: 'Shaft Drilling & Gravel Packing (Phase 1)', targetDate: '2024-01-31', completedDate: '2024-02-12', disbursementAmountRs: 7755000, status: 'COMPLETED' },
      { id: 3, title: 'Phase 2 Percolation Shafts & Inflow Desilters', targetDate: '2024-06-30', completedDate: null, disbursementAmountRs: 3300000, status: 'IN_PROGRESS' },
      { id: 4, title: 'Piezometer Telemetry & Handover', targetDate: '2024-09-30', completedDate: null, disbursementAmountRs: 2145000, status: 'PENDING' }
    ],
    payments: [
      { voucherNo: 'VCH-PB-2023-081', date: '2023-09-20', amountRs: 3300000, installment: 1, recipientAgency: 'Punjab WR Dept', status: 'DISBURSED' },
      { voucherNo: 'VCH-PB-2024-014', date: '2024-02-25', amountRs: 7755000, installment: 2, recipientAgency: 'Punjab WR Dept', status: 'DISBURSED' }
    ]
  },
  {
    id: 16,
    projectCode: 'MP-OR-RD-016',
    name: 'Coastal Highway — Puri to Konark',
    description: 'Scenic tourism and cyclone-resilient highway corridor widening with marine-grade guard rails.',
    status: 'IN_PROGRESS',
    stateName: 'Odisha',
    constituency: 'Puri',
    district: 'Puri',
    categoryName: 'Roads',
    mpName: 'Shri Pinaki Misra',
    agencyName: 'Odisha Works Department',
    sanctionedCr: 4.80,
    sanctionedAmountRs: 48000000,
    estimatedCostRs: 51000000,
    totalExpenditurePaise: 2544000000,
    utilizationPct: 53,
    reportedProgressPct: 49,
    expectedProgressPct: 60,
    startDate: '2023-03-01',
    expectedEndDate: '2024-12-31',
    actualEndDate: null,
    riskLevel: 'MEDIUM',
    riskScore: 51,
    delayProbability: 0.46,
    costOverrunRatio: 1.06,
    anomalyScore: 0.41,
    riskFlags: ['Coastal regulatory zone clearances required additional site inspects'],
    paymentCount: 3,
    latitude: 19.81,
    longitude: 85.83,
    milestones: [
      { id: 1, title: 'CRZ Compliance & Tree Relocation', targetDate: '2023-06-30', completedDate: '2023-07-15', disbursementAmountRs: 9600000, status: 'COMPLETED' },
      { id: 2, title: 'Embankment Raising & Geo-textile Lining', targetDate: '2023-12-31', completedDate: '2024-01-20', disbursementAmountRs: 15840000, status: 'COMPLETED' },
      { id: 3, title: 'Bituminous Macadam Concrete Surfacing', targetDate: '2024-07-31', completedDate: null, disbursementAmountRs: 14400000, status: 'IN_PROGRESS' },
      { id: 4, title: 'Cyclone Barrier Railing & Viewpoints', targetDate: '2024-12-31', completedDate: null, disbursementAmountRs: 8160000, status: 'PENDING' }
    ],
    payments: [
      { voucherNo: 'VCH-OR-2023-099', date: '2023-07-22', amountRs: 9600000, installment: 1, recipientAgency: 'Odisha Works Puri', status: 'DISBURSED' },
      { voucherNo: 'VCH-OR-2024-011', date: '2024-01-28', amountRs: 15840000, installment: 2, recipientAgency: 'Odisha Works Puri', status: 'DISBURSED' }
    ]
  },
  {
    id: 17,
    projectCode: 'MP-CG-HW-017',
    name: 'Tribal Health Post — Bastar District',
    description: 'Prefabricated solar-powered primary clinic with telemedicine satellite link in remote forested tribal block.',
    status: 'SANCTIONED',
    stateName: 'Chhattisgarh',
    constituency: 'Bastar',
    district: 'Bastar',
    categoryName: 'Health',
    mpName: 'Shri Deepak Baij',
    agencyName: 'Bastar District Rural Health Society',
    sanctionedCr: 1.20,
    sanctionedAmountRs: 12000000,
    estimatedCostRs: 13500000,
    totalExpenditurePaise: 60000000,
    utilizationPct: 5,
    reportedProgressPct: 3,
    expectedProgressPct: 20,
    startDate: '2024-01-10',
    expectedEndDate: '2024-11-30',
    actualEndDate: null,
    riskLevel: 'HIGH',
    riskScore: 74,
    delayProbability: 0.77,
    costOverrunRatio: 1.12,
    anomalyScore: 0.65,
    riskFlags: ['Remote logistics challenge in transporting prefab panels through interior forest'],
    paymentCount: 1,
    latitude: 19.12,
    longitude: 81.95,
    milestones: [
      { id: 1, title: 'Land Allotment & Solar Cleared Footprint', targetDate: '2024-03-31', completedDate: '2024-04-15', disbursementAmountRs: 600000, status: 'COMPLETED' },
      { id: 2, title: 'Prefab Structure Delivery & Erection', targetDate: '2024-07-31', completedDate: null, disbursementAmountRs: 4800000, status: 'IN_PROGRESS' },
      { id: 3, title: 'Satellite Telemedicine System Rigging', targetDate: '2024-09-30', completedDate: null, disbursementAmountRs: 3600000, status: 'PENDING' },
      { id: 4, title: 'Medicines Stocking & Nurse Induction', targetDate: '2024-11-30', completedDate: null, disbursementAmountRs: 3000000, status: 'PENDING' }
    ],
    payments: [
      { voucherNo: 'VCH-CG-2024-002', date: '2024-04-20', amountRs: 600000, installment: 1, recipientAgency: 'Bastar DRHS', status: 'DISBURSED' }
    ]
  },
  {
    id: 18,
    projectCode: 'MP-JH-SC-018',
    name: 'Govt High School — Ranchi Block East',
    description: 'Expansion of 6 science labs, computer centre, and girls hostel wing for secondary students.',
    status: 'COMPLETED',
    stateName: 'Jharkhand',
    constituency: 'Ranchi',
    district: 'Ranchi',
    categoryName: 'Education',
    mpName: 'Shri Sanjay Seth',
    agencyName: 'Jharkhand State Building Construction Corp',
    sanctionedCr: 1.85,
    sanctionedAmountRs: 18500000,
    estimatedCostRs: 18400000,
    totalExpenditurePaise: 1776000000,
    utilizationPct: 96,
    reportedProgressPct: 100,
    expectedProgressPct: 100,
    startDate: '2023-01-05',
    expectedEndDate: '2023-11-30',
    actualEndDate: '2023-11-15',
    riskLevel: 'LOW',
    riskScore: 11,
    delayProbability: 0.07,
    costOverrunRatio: 0.99,
    anomalyScore: 0.09,
    riskFlags: ['Verified complete with biometric geo-tagged handover records'],
    paymentCount: 4,
    latitude: 23.36,
    longitude: 85.33,
    milestones: [
      { id: 1, title: 'Foundation & Ground Slab', targetDate: '2023-03-31', completedDate: '2023-03-25', disbursementAmountRs: 3700000, status: 'COMPLETED' },
      { id: 2, title: 'Hostel Rooms Brickwork & Roof', targetDate: '2023-06-30', completedDate: '2023-06-20', disbursementAmountRs: 6475000, status: 'COMPLETED' },
      { id: 3, title: 'Lab Furniture & Computer Network', targetDate: '2023-09-30', completedDate: '2023-09-18', disbursementAmountRs: 4625000, status: 'COMPLETED' },
      { id: 4, title: 'Final Handover to Principal', targetDate: '2023-11-30', completedDate: '2023-11-15', disbursementAmountRs: 2960000, status: 'COMPLETED' }
    ],
    payments: [
      { voucherNo: 'VCH-JH-2023-014', date: '2023-04-02', amountRs: 3700000, installment: 1, recipientAgency: 'JSBCCL Ranchi', status: 'DISBURSED' },
      { voucherNo: 'VCH-JH-2023-087', date: '2023-07-01', amountRs: 6475000, installment: 2, recipientAgency: 'JSBCCL Ranchi', status: 'DISBURSED' },
      { voucherNo: 'VCH-JH-2023-159', date: '2023-09-28', amountRs: 4625000, installment: 3, recipientAgency: 'JSBCCL Ranchi', status: 'DISBURSED' },
      { voucherNo: 'VCH-JH-2023-219', date: '2023-11-20', amountRs: 2960000, installment: 4, recipientAgency: 'JSBCCL Ranchi', status: 'DISBURSED' }
    ]
  },
  {
    id: 19,
    projectCode: 'MP-AS-WS-019',
    name: 'Brahmaputra Flood Relief Drainage — Guwahati',
    description: 'Stormwater arterial box drain channel with automatic sluice gates to relieve urban waterlogging in Guwahati.',
    status: 'STALLED',
    stateName: 'Assam',
    constituency: 'Guwahati',
    district: 'Kamrup Metro',
    categoryName: 'Water Supply',
    mpName: 'Smt. Queen Oja',
    agencyName: 'Guwahati Metropolitan Development Authority',
    sanctionedCr: 2.70,
    sanctionedAmountRs: 27000000,
    estimatedCostRs: 36000000,
    totalExpenditurePaise: 594000000,
    utilizationPct: 22,
    reportedProgressPct: 15,
    expectedProgressPct: 85,
    startDate: '2022-10-01',
    expectedEndDate: '2024-04-30',
    actualEndDate: null,
    riskLevel: 'CRITICAL',
    riskScore: 88,
    delayProbability: 0.92,
    costOverrunRatio: 1.33,
    anomalyScore: 0.84,
    riskFlags: [
      'CRITICAL: Multiple land encroachments blocking arterial channel alignment',
      'Dispute between contractor and GMDA over steel reinforcement grade specifications',
      'No site expenditure registered for past 150 days'
    ],
    paymentCount: 1,
    latitude: 26.14,
    longitude: 91.74,
    milestones: [
      { id: 1, title: 'Survey & Encroachment Removal Notice', targetDate: '2022-12-31', completedDate: '2023-02-15', disbursementAmountRs: 5940000, status: 'COMPLETED' },
      { id: 2, title: 'Box Culvert Excavation (Phase 1)', targetDate: '2023-06-30', completedDate: null, disbursementAmountRs: 8100000, status: 'IN_PROGRESS', notes: 'Halted due to legal injunction.' },
      { id: 3, title: 'RCC Channel Lining & Sluice Gate Installation', targetDate: '2023-11-30', completedDate: null, disbursementAmountRs: 8100000, status: 'PENDING' },
      { id: 4, title: 'River Outfall Integration', targetDate: '2024-04-30', completedDate: null, disbursementAmountRs: 4860000, status: 'PENDING' }
    ],
    payments: [
      { voucherNo: 'VCH-AS-2023-009', date: '2023-02-28', amountRs: 5940000, installment: 1, recipientAgency: 'GMDA Guwahati', status: 'DISBURSED' }
    ]
  },
  {
    id: 20,
    projectCode: 'MP-KL-RD-020',
    name: 'Backwater Bridge — Alappuzha Sector 4',
    description: 'Prestressed concrete girder bridge replacing passenger country-boat ferry in Kuttanad wetlands.',
    status: 'COMPLETED',
    stateName: 'Kerala',
    constituency: 'Alappuzha',
    district: 'Alappuzha',
    categoryName: 'Roads',
    mpName: 'Shri A. M. Ariff',
    agencyName: 'Kerala PWD Bridges Wing',
    sanctionedCr: 2.40,
    sanctionedAmountRs: 24000000,
    estimatedCostRs: 24200000,
    totalExpenditurePaise: 2424000000,
    utilizationPct: 101,
    reportedProgressPct: 100,
    expectedProgressPct: 100,
    startDate: '2022-08-01',
    expectedEndDate: '2023-10-31',
    actualEndDate: '2023-10-25',
    riskLevel: 'LOW',
    riskScore: 7,
    delayProbability: 0.04,
    costOverrunRatio: 1.01,
    anomalyScore: 0.05,
    riskFlags: ['Completed with high community satisfaction; zero deviation flagged'],
    paymentCount: 4,
    latitude: 9.49,
    longitude: 76.33,
    milestones: [
      { id: 1, title: 'Underwater Well Sinking & Piers', targetDate: '2022-12-31', completedDate: '2022-12-20', disbursementAmountRs: 7200000, status: 'COMPLETED' },
      { id: 2, title: 'Precast PSC Girders Launching', targetDate: '2023-04-30', completedDate: '2023-04-18', disbursementAmountRs: 7200000, status: 'COMPLETED' },
      { id: 3, title: 'Deck Slab Concrete & Railings', targetDate: '2023-08-31', completedDate: '2023-08-10', disbursementAmountRs: 6000000, status: 'COMPLETED' },
      { id: 4, title: 'Approach Roads & Street Lighting', targetDate: '2023-10-31', completedDate: '2023-10-25', disbursementAmountRs: 3840000, status: 'COMPLETED' }
    ],
    payments: [
      { voucherNo: 'VCH-KL-2023-004', date: '2023-01-10', amountRs: 7200000, installment: 1, recipientAgency: 'Kerala PWD Bridges', status: 'DISBURSED' },
      { voucherNo: 'VCH-KL-2023-067', date: '2023-05-02', amountRs: 7200000, installment: 2, recipientAgency: 'Kerala PWD Bridges', status: 'DISBURSED' },
      { voucherNo: 'VCH-KL-2023-144', date: '2023-08-20', amountRs: 6000000, installment: 3, recipientAgency: 'Kerala PWD Bridges', status: 'DISBURSED' },
      { voucherNo: 'VCH-KL-2023-201', date: '2023-11-05', amountRs: 3840000, installment: 4, recipientAgency: 'Kerala PWD Bridges', status: 'DISBURSED' }
    ]
  },
  {
    id: 21,
    projectCode: 'MP-TL-HW-021',
    name: 'PHC Renovation — Warangal Rural',
    description: 'Complete overhaul of civil, diagnostic, and immunization infrastructure in Warangal rural cluster.',
    status: 'IN_PROGRESS',
    stateName: 'Telangana',
    constituency: 'Warangal',
    district: 'Warangal',
    categoryName: 'Health',
    mpName: 'Dr. Kadiyam Kavya',
    agencyName: 'Telangana State Medical Infrastructure Corp',
    sanctionedCr: 1.55,
    sanctionedAmountRs: 15500000,
    estimatedCostRs: 16200000,
    totalExpenditurePaise: 914500000,
    utilizationPct: 59,
    reportedProgressPct: 55,
    expectedProgressPct: 65,
    startDate: '2023-06-01',
    expectedEndDate: '2024-09-30',
    actualEndDate: null,
    riskLevel: 'MEDIUM',
    riskScore: 46,
    delayProbability: 0.41,
    costOverrunRatio: 1.05,
    anomalyScore: 0.35,
    riskFlags: ['Minor supplier delivery slip on medical oxygen cylinders'],
    paymentCount: 3,
    latitude: 17.98,
    longitude: 79.60,
    milestones: [
      { id: 1, title: 'Roof Waterproofing & Plumbing Overhaul', targetDate: '2023-09-30', completedDate: '2023-10-05', disbursementAmountRs: 3875000, status: 'COMPLETED' },
      { id: 2, title: 'Pathology Diagnostics Chamber & AC', targetDate: '2024-02-28', completedDate: '2024-03-12', disbursementAmountRs: 5270000, status: 'COMPLETED' },
      { id: 3, title: 'Solar Inverter Backup & Patient Beds', targetDate: '2024-06-30', completedDate: null, disbursementAmountRs: 3875000, status: 'IN_PROGRESS' },
      { id: 4, title: 'Medical Equipment Testing', targetDate: '2024-09-30', completedDate: null, disbursementAmountRs: 2480000, status: 'PENDING' }
    ],
    payments: [
      { voucherNo: 'VCH-TL-2023-099', date: '2023-10-15', amountRs: 3875000, installment: 1, recipientAgency: 'TSMSIDC Warangal', status: 'DISBURSED' },
      { voucherNo: 'VCH-TL-2024-028', date: '2024-03-25', amountRs: 5270000, installment: 2, recipientAgency: 'TSMSIDC Warangal', status: 'DISBURSED' }
    ]
  },
  {
    id: 22,
    projectCode: 'MP-UP-SC-022',
    name: 'Digital Library — Varanasi Central',
    description: 'Heritage digital repository with 100 high-speed research terminals, rare manuscript scanning stations.',
    status: 'IN_PROGRESS',
    stateName: 'Uttar Pradesh',
    constituency: 'Varanasi',
    district: 'Varanasi',
    categoryName: 'Education',
    mpName: 'Shri Narendra Modi',
    agencyName: 'Varanasi Smart City Limited',
    sanctionedCr: 1.10,
    sanctionedAmountRs: 11000000,
    estimatedCostRs: 12500000,
    totalExpenditurePaise: 484000000,
    utilizationPct: 44,
    reportedProgressPct: 38,
    expectedProgressPct: 62,
    startDate: '2023-08-01',
    expectedEndDate: '2024-10-31',
    actualEndDate: null,
    riskLevel: 'HIGH',
    riskScore: 67,
    delayProbability: 0.71,
    costOverrunRatio: 1.14,
    anomalyScore: 0.58,
    riskFlags: ['Heritage preservation protocol mandated slower interior civil works'],
    paymentCount: 2,
    latitude: 25.32,
    longitude: 83.00,
    milestones: [
      { id: 1, title: 'Structural Strengthening & Climate Control', targetDate: '2023-12-31', completedDate: '2024-01-20', disbursementAmountRs: 2750000, status: 'COMPLETED' },
      { id: 2, title: 'Server Infrastructure & High-Speed LAN', targetDate: '2024-04-30', completedDate: '2024-05-15', disbursementAmountRs: 2090000, status: 'COMPLETED' },
      { id: 3, title: 'Interactive Kiosks & High-Res Overhead Scanners', targetDate: '2024-08-31', completedDate: null, disbursementAmountRs: 3850000, status: 'IN_PROGRESS' },
      { id: 4, title: 'Public Inauguration & Digital Portal Launch', targetDate: '2024-10-31', completedDate: null, disbursementAmountRs: 2310000, status: 'PENDING' }
    ],
    payments: [
      { voucherNo: 'VCH-UP-2024-008', date: '2024-01-25', amountRs: 2750000, installment: 1, recipientAgency: 'Varanasi Smart City', status: 'DISBURSED' },
      { voucherNo: 'VCH-UP-2024-055', date: '2024-05-20', amountRs: 2090000, installment: 2, recipientAgency: 'Varanasi Smart City', status: 'DISBURSED' }
    ]
  },
  {
    id: 23,
    projectCode: 'MP-MH-WS-023',
    name: 'Smart Water Metering — Thane Municipal',
    description: 'Installation of 8,500 ultrasonic automated smart water meters with wireless NB-IoT telemetry.',
    status: 'SANCTIONED',
    stateName: 'Maharashtra',
    constituency: 'Thane',
    district: 'Thane',
    categoryName: 'Water Supply',
    mpName: 'Shri Rajan Vichare',
    agencyName: 'Thane Municipal Corporation Water Dept',
    sanctionedCr: 3.30,
    sanctionedAmountRs: 33000000,
    estimatedCostRs: 33000000,
    totalExpenditurePaise: 495000000,
    utilizationPct: 15,
    reportedProgressPct: 12,
    expectedProgressPct: 18,
    startDate: '2024-01-01',
    expectedEndDate: '2025-03-31',
    actualEndDate: null,
    riskLevel: 'LOW',
    riskScore: 28,
    delayProbability: 0.22,
    costOverrunRatio: 1.00,
    anomalyScore: 0.18,
    riskFlags: ['Early stage project on track with scheduled meter procurement'],
    paymentCount: 1,
    latitude: 19.22,
    longitude: 72.98,
    milestones: [
      { id: 1, title: 'Meter Specifications & Vendor Award', targetDate: '2024-03-31', completedDate: '2024-03-25', disbursementAmountRs: 4950000, status: 'COMPLETED' },
      { id: 2, title: 'Batch 1 Meter Fitting in Wards 1 to 4', targetDate: '2024-08-31', completedDate: null, disbursementAmountRs: 9900000, status: 'IN_PROGRESS' },
      { id: 3, title: 'IoT Telemetry Gateway Server Setup', targetDate: '2024-12-31', completedDate: null, disbursementAmountRs: 9900000, status: 'PENDING' },
      { id: 4, title: 'Billing Integration & Live Pilot', targetDate: '2025-03-31', completedDate: null, disbursementAmountRs: 8250000, status: 'PENDING' }
    ],
    payments: [
      { voucherNo: 'VCH-MH-2024-039', date: '2024-04-02', amountRs: 4950000, installment: 1, recipientAgency: 'TMC Water Dept', status: 'DISBURSED' }
    ]
  },
  {
    id: 24,
    projectCode: 'MP-BR-SC-024',
    name: 'Anganwadi Centre Cluster — Muzaffarpur',
    description: 'Construction of 12 child care and maternal nourishment centres in flood-prone rural taluks.',
    status: 'STALLED',
    stateName: 'Bihar',
    constituency: 'Muzaffarpur',
    district: 'Muzaffarpur',
    categoryName: 'Education',
    mpName: 'Shri Ajay Nishad',
    agencyName: 'Muzaffarpur DRDA Engineering Wing',
    sanctionedCr: 0.90,
    sanctionedAmountRs: 9000000,
    estimatedCostRs: 12000000,
    totalExpenditurePaise: 279000000,
    utilizationPct: 31,
    reportedProgressPct: 22,
    expectedProgressPct: 78,
    startDate: '2023-03-01',
    expectedEndDate: '2024-06-30',
    actualEndDate: null,
    riskLevel: 'HIGH',
    riskScore: 76,
    delayProbability: 0.82,
    costOverrunRatio: 1.33,
    anomalyScore: 0.69,
    riskFlags: [
      'Brick supplier default led to multi-site suspension across 8 locations',
      'Cost overrun revision pending District Collector approval'
    ],
    paymentCount: 2,
    latitude: 26.12,
    longitude: 85.39,
    milestones: [
      { id: 1, title: 'Plinth Foundation across 12 Sites', targetDate: '2023-06-30', completedDate: '2023-07-15', disbursementAmountRs: 1800000, status: 'COMPLETED' },
      { id: 2, title: 'Brick Masonry & Lintels', targetDate: '2023-11-30', completedDate: null, disbursementAmountRs: 990000, status: 'IN_PROGRESS' },
      { id: 3, title: 'RCC Roofing & Toilet Blocks', targetDate: '2024-03-31', completedDate: null, disbursementAmountRs: 3600000, status: 'PENDING' },
      { id: 4, title: 'Play Materials & Kitchen Utensils', targetDate: '2024-06-30', completedDate: null, disbursementAmountRs: 2610000, status: 'PENDING' }
    ],
    payments: [
      { voucherNo: 'VCH-BR-2023-112', date: '2023-07-20', amountRs: 1800000, installment: 1, recipientAgency: 'Muzaffarpur DRDA', status: 'DISBURSED' },
      { voucherNo: 'VCH-BR-2023-228', date: '2023-12-18', amountRs: 990000, installment: 2, recipientAgency: 'Muzaffarpur DRDA', status: 'DISBURSED' }
    ]
  },
  {
    id: 25,
    projectCode: 'MP-RJ-HW-025',
    name: 'Desert Medical Unit — Barmer Block',
    description: 'Mobile medical dispensaries equipped with ultrasound, diagnostic testing, and emergency telemetry.',
    status: 'IN_PROGRESS',
    stateName: 'Rajasthan',
    constituency: 'Barmer',
    district: 'Barmer',
    categoryName: 'Health',
    mpName: 'Shri Kailash Choudhary',
    agencyName: 'Barmer District Health Society',
    sanctionedCr: 2.05,
    sanctionedAmountRs: 20500000,
    estimatedCostRs: 21500000,
    totalExpenditurePaise: 1291500000,
    utilizationPct: 63,
    reportedProgressPct: 58,
    expectedProgressPct: 70,
    startDate: '2023-05-15',
    expectedEndDate: '2024-09-30',
    actualEndDate: null,
    riskLevel: 'MEDIUM',
    riskScore: 53,
    delayProbability: 0.49,
    costOverrunRatio: 1.05,
    anomalyScore: 0.42,
    riskFlags: ['Specialized chassis fabrication delayed by automotive parts supply chain'],
    paymentCount: 3,
    latitude: 25.75,
    longitude: 71.39,
    milestones: [
      { id: 1, title: 'Vehicle Chassis Procurement (4 Units)', targetDate: '2023-08-31', completedDate: '2023-09-10', disbursementAmountRs: 6150000, status: 'COMPLETED' },
      { id: 2, title: 'Custom Medical Interior Fabrication', targetDate: '2024-01-31', completedDate: '2024-02-25', disbursementAmountRs: 6765000, status: 'COMPLETED' },
      { id: 3, title: 'Diagnostic Equipment & Solar Auxiliary Inverters', targetDate: '2024-06-30', completedDate: null, disbursementAmountRs: 4500000, status: 'IN_PROGRESS' },
      { id: 4, title: 'Route Deployment to Desert Dhannis', targetDate: '2024-09-30', completedDate: null, disbursementAmountRs: 3085000, status: 'PENDING' }
    ],
    payments: [
      { voucherNo: 'VCH-RJ-2023-076', date: '2023-09-18', amountRs: 6150000, installment: 1, recipientAgency: 'Barmer DHS', status: 'DISBURSED' },
      { voucherNo: 'VCH-RJ-2024-022', date: '2024-03-02', amountRs: 6765000, installment: 2, recipientAgency: 'Barmer DHS', status: 'DISBURSED' }
    ]
  },
  {
    id: 26,
    projectCode: 'MP-TN-WS-026',
    name: 'Chennai Metro Water Augmentation',
    description: 'Laying 14 km high-pressure water pipeline connecting desalted water facility to South Chennai suburban areas.',
    status: 'COMPLETED',
    stateName: 'Tamil Nadu',
    constituency: 'Chennai South',
    district: 'Chennai',
    categoryName: 'Water Supply',
    mpName: 'Smt. Thamizhachi Thangapandian',
    agencyName: 'Chennai Metropolitan Water Supply & Sewerage Board',
    sanctionedCr: 4.10,
    sanctionedAmountRs: 41000000,
    estimatedCostRs: 40500000,
    totalExpenditurePaise: 4018000000,
    utilizationPct: 98,
    reportedProgressPct: 100,
    expectedProgressPct: 100,
    startDate: '2022-11-01',
    expectedEndDate: '2023-12-31',
    actualEndDate: '2023-12-15',
    riskLevel: 'LOW',
    riskScore: 15,
    delayProbability: 0.11,
    costOverrunRatio: 0.99,
    anomalyScore: 0.12,
    riskFlags: ['Successfully commissioned with zero non-conformances on pressure audit'],
    paymentCount: 4,
    latitude: 13.00,
    longitude: 80.18,
    milestones: [
      { id: 1, title: 'Road Trenching & Pipe Laying', targetDate: '2023-03-31', completedDate: '2023-03-20', disbursementAmountRs: 10250000, status: 'COMPLETED' },
      { id: 2, title: 'Booster Pump Station Installation', targetDate: '2023-07-31', completedDate: '2023-07-15', disbursementAmountRs: 14350000, status: 'COMPLETED' },
      { id: 3, title: 'Hydrostatic Pressure Testing', targetDate: '2023-10-31', completedDate: '2023-10-18', disbursementAmountRs: 9840000, status: 'COMPLETED' },
      { id: 4, title: 'Consumer Hookup & Commissioning', targetDate: '2023-12-31', completedDate: '2023-12-15', disbursementAmountRs: 5740000, status: 'COMPLETED' }
    ],
    payments: [
      { voucherNo: 'VCH-TN-2023-034', date: '2023-03-28', amountRs: 10250000, installment: 1, recipientAgency: 'CMWSSB', status: 'DISBURSED' },
      { voucherNo: 'VCH-TN-2023-118', date: '2023-07-22', amountRs: 14350000, installment: 2, recipientAgency: 'CMWSSB', status: 'DISBURSED' },
      { voucherNo: 'VCH-TN-2023-211', date: '2023-10-25', amountRs: 9840000, installment: 3, recipientAgency: 'CMWSSB', status: 'DISBURSED' },
      { voucherNo: 'VCH-TN-2023-314', date: '2023-12-20', amountRs: 5740000, installment: 4, recipientAgency: 'CMWSSB', status: 'DISBURSED' }
    ]
  },
  {
    id: 27,
    projectCode: 'MP-KA-RD-027',
    name: 'Bengaluru Peripheral Ring Road Segment 7',
    description: 'Service road widening, underpass construction, and street drainage to decongest IT corridor traffic.',
    status: 'IN_PROGRESS',
    stateName: 'Karnataka',
    constituency: 'Bengaluru Central',
    district: 'Bengaluru Urban',
    categoryName: 'Roads',
    mpName: 'Shri P. C. Mohan',
    agencyName: 'Bruhat Bengaluru Mahanagara Palike (BBMP)',
    sanctionedCr: 5.20,
    sanctionedAmountRs: 52000000,
    estimatedCostRs: 61000000,
    totalExpenditurePaise: 4004000000,
    utilizationPct: 77,
    reportedProgressPct: 56,
    expectedProgressPct: 84,
    startDate: '2023-02-15',
    expectedEndDate: '2024-09-30',
    actualEndDate: null,
    riskLevel: 'HIGH',
    riskScore: 71,
    delayProbability: 0.79,
    costOverrunRatio: 1.17,
    anomalyScore: 0.66,
    riskFlags: [
      'High traffic diversion constraints limiting night construction windows',
      'Underground optical fiber cable shift delayed by telecom agencies'
    ],
    paymentCount: 4,
    latitude: 12.97,
    longitude: 77.59,
    milestones: [
      { id: 1, title: 'Utility Shifting & Tree Translocation', targetDate: '2023-05-31', completedDate: '2023-06-25', disbursementAmountRs: 10400000, status: 'COMPLETED' },
      { id: 2, title: 'Underpass Box Pushing (Phase 1)', targetDate: '2023-11-30', completedDate: '2023-12-20', disbursementAmountRs: 15600000, status: 'COMPLETED' },
      { id: 3, title: 'Surface Road Asphalt Overhaul & Storm Drains', targetDate: '2024-05-31', completedDate: null, disbursementAmountRs: 14040000, status: 'IN_PROGRESS' },
      { id: 4, title: 'Traffic Signals & Grade Handover', targetDate: '2024-09-30', completedDate: null, disbursementAmountRs: 11960000, status: 'PENDING' }
    ],
    payments: [
      { voucherNo: 'VCH-KA-2023-071', date: '2023-07-02', amountRs: 10400000, installment: 1, recipientAgency: 'BBMP Major Roads', status: 'DISBURSED' },
      { voucherNo: 'VCH-KA-2023-219', date: '2024-01-10', amountRs: 15600000, installment: 2, recipientAgency: 'BBMP Major Roads', status: 'DISBURSED' },
      { voucherNo: 'VCH-KA-2024-049', date: '2024-04-05', amountRs: 14040000, installment: 3, recipientAgency: 'BBMP Major Roads', status: 'DISBURSED' }
    ]
  },
  {
    id: 28,
    projectCode: 'MP-MP-SC-028',
    name: 'Science Laboratory — Bhopal Block D Schools',
    description: 'Establishment of 14 STEM innovation labs with 3D printers, telescope sets, and chemistry workstations.',
    status: 'COMPLETED',
    stateName: 'Madhya Pradesh',
    constituency: 'Bhopal',
    district: 'Bhopal',
    categoryName: 'Education',
    mpName: 'Sadhvi Pragya Singh Thakur',
    agencyName: 'Bhopal District Education Office',
    sanctionedCr: 1.75,
    sanctionedAmountRs: 17500000,
    estimatedCostRs: 17200000,
    totalExpenditurePaise: 1627500000,
    utilizationPct: 93,
    reportedProgressPct: 100,
    expectedProgressPct: 100,
    startDate: '2023-03-01',
    expectedEndDate: '2023-11-30',
    actualEndDate: '2023-11-25',
    riskLevel: 'LOW',
    riskScore: 19,
    delayProbability: 0.13,
    costOverrunRatio: 0.98,
    anomalyScore: 0.11,
    riskFlags: ['Full physical equipment verification completed and signed off'],
    paymentCount: 3,
    latitude: 23.26,
    longitude: 77.41,
    milestones: [
      { id: 1, title: 'Classroom Interior & Electrical Wiring', targetDate: '2023-05-31', completedDate: '2023-05-20', disbursementAmountRs: 3500000, status: 'COMPLETED' },
      { id: 2, title: 'STEM Kits & 3D Printers Delivery', targetDate: '2023-08-31', completedDate: '2023-08-25', disbursementAmountRs: 8750000, status: 'COMPLETED' },
      { id: 3, title: 'Safety Gear & Chemistry Glassware Setup', targetDate: '2023-10-31', completedDate: '2023-10-18', disbursementAmountRs: 4025000, status: 'COMPLETED' },
      { id: 4, title: 'Teacher Orientation Workshops', targetDate: '2023-11-30', completedDate: '2023-11-25', disbursementAmountRs: 1225000, status: 'COMPLETED' }
    ],
    payments: [
      { voucherNo: 'VCH-MP-2023-059', date: '2023-06-02', amountRs: 3500000, installment: 1, recipientAgency: 'Bhopal DEO', status: 'DISBURSED' },
      { voucherNo: 'VCH-MP-2023-149', date: '2023-09-05', amountRs: 8750000, installment: 2, recipientAgency: 'Bhopal DEO', status: 'DISBURSED' },
      { voucherNo: 'VCH-MP-2023-222', date: '2023-11-02', amountRs: 4025000, installment: 3, recipientAgency: 'Bhopal DEO', status: 'DISBURSED' }
    ]
  },
  {
    id: 29,
    projectCode: 'MP-GJ-HW-029',
    name: 'Trauma Care Centre — Ahmedabad GIDC',
    description: 'Level-2 trauma resuscitation unit equipped with CT scan, digital X-ray, and dedicated trauma ICU.',
    status: 'SANCTIONED',
    stateName: 'Gujarat',
    constituency: 'Ahmedabad East',
    district: 'Ahmedabad',
    categoryName: 'Health',
    mpName: 'Shri Hasmukh Patel',
    agencyName: 'Ahmedabad Municipal Corporation Health Dept',
    sanctionedCr: 3.70,
    sanctionedAmountRs: 37000000,
    estimatedCostRs: 38500000,
    totalExpenditurePaise: 333000000,
    utilizationPct: 9,
    reportedProgressPct: 7,
    expectedProgressPct: 15,
    startDate: '2024-01-15',
    expectedEndDate: '2025-06-30',
    actualEndDate: null,
    riskLevel: 'MEDIUM',
    riskScore: 38,
    delayProbability: 0.35,
    costOverrunRatio: 1.04,
    anomalyScore: 0.28,
    riskFlags: ['Radiation safety board clearance currently in process for CT scan vault'],
    paymentCount: 1,
    latitude: 23.03,
    longitude: 72.59,
    milestones: [
      { id: 1, title: 'Lead Shielding Vault Architectural Drawing', targetDate: '2024-04-30', completedDate: '2024-04-20', disbursementAmountRs: 3330000, status: 'COMPLETED' },
      { id: 2, title: 'Civil Superstructure & Medical Gas Pipeline', targetDate: '2024-10-31', completedDate: null, disbursementAmountRs: 11100000, status: 'IN_PROGRESS' },
      { id: 3, title: 'CT Scanner Rigging & Calibration', targetDate: '2025-02-28', completedDate: null, disbursementAmountRs: 14800000, status: 'PENDING' },
      { id: 4, title: 'Staffing & Emergency Simulation Run', targetDate: '2025-06-30', completedDate: null, disbursementAmountRs: 7770000, status: 'PENDING' }
    ],
    payments: [
      { voucherNo: 'VCH-GJ-2024-015', date: '2024-04-25', amountRs: 3330000, installment: 1, recipientAgency: 'AMC Health Dept', status: 'DISBURSED' }
    ]
  },
  {
    id: 30,
    projectCode: 'MP-WB-RD-030',
    name: 'Kolkata Suburb Connectivity — Barasat NH12',
    description: 'Concrete bypass link road to divert heavy commercial freight around Barasat town congestion.',
    status: 'IN_PROGRESS',
    stateName: 'West Bengal',
    constituency: 'Barasat',
    district: 'North 24 Parganas',
    categoryName: 'Roads',
    mpName: 'Dr. Kakoli Ghosh Dastidar',
    agencyName: 'West Bengal PWD Barasat Division',
    sanctionedCr: 3.95,
    sanctionedAmountRs: 39500000,
    estimatedCostRs: 46000000,
    totalExpenditurePaise: 2291000000,
    utilizationPct: 58,
    reportedProgressPct: 44,
    expectedProgressPct: 72,
    startDate: '2023-04-01',
    expectedEndDate: '2024-11-30',
    actualEndDate: null,
    riskLevel: 'HIGH',
    riskScore: 70,
    delayProbability: 0.76,
    costOverrunRatio: 1.16,
    anomalyScore: 0.63,
    riskFlags: [
      'Sub-base waterlogging during unseasonal rains caused 2-month setback',
      'Contractor payment frequency slower than peer average in West Bengal'
    ],
    paymentCount: 3,
    latitude: 22.72,
    longitude: 88.48,
    milestones: [
      { id: 1, title: 'Land Leveling & Drainage Ditches', targetDate: '2023-07-31', completedDate: '2023-08-15', disbursementAmountRs: 7900000, status: 'COMPLETED' },
      { id: 2, title: 'Crushed Rock Soling & Culverts', targetDate: '2023-12-31', completedDate: '2024-01-20', disbursementAmountRs: 11850000, status: 'COMPLETED' },
      { id: 3, title: 'Rigid Concrete Paving (Phase 1)', targetDate: '2024-06-30', completedDate: null, disbursementAmountRs: 11850000, status: 'IN_PROGRESS' },
      { id: 4, title: 'Signboard, Signals & Handover', targetDate: '2024-11-30', completedDate: null, disbursementAmountRs: 7900000, status: 'PENDING' }
    ],
    payments: [
      { voucherNo: 'VCH-WB-2023-108', date: '2023-08-20', amountRs: 7900000, installment: 1, recipientAgency: 'WB PWD Barasat', status: 'DISBURSED' },
      { voucherNo: 'VCH-WB-2024-015', date: '2024-01-25', amountRs: 11850000, installment: 2, recipientAgency: 'WB PWD Barasat', status: 'DISBURSED' }
    ]
  }
]

/**
 * Helper to look up a project by numerical ID, project code, or string match.
 */
export function getProjectByIdOrCode(query: string | number | undefined): DetailedProject | null {
  if (!query) return null
  const str = String(query).trim().toLowerCase()
  const num = Number(query)

  // 1. Direct ID match
  if (!isNaN(num)) {
    const foundById = ALL_PROJECTS.find(p => p.id === num)
    if (foundById) return foundById
  }

  // 2. Exact or lowercase projectCode match (e.g. "MP-UP-RD-001" or "mp-up-rd-001")
  const foundByCode = ALL_PROJECTS.find(p => p.projectCode.toLowerCase() === str)
  if (foundByCode) return foundByCode

  // 3. Match code without hyphens or prefix
  const cleanStr = str.replace(/[^a-z0-9]/g, '')
  const foundFuzzy = ALL_PROJECTS.find(p => p.projectCode.toLowerCase().replace(/[^a-z0-9]/g, '') === cleanStr)
  if (foundFuzzy) return foundFuzzy

  // 4. Match partial name
  const foundByName = ALL_PROJECTS.find(p => p.name.toLowerCase().includes(str))
  if (foundByName) return foundByName

  return null
}
