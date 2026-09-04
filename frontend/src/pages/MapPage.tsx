/**
 * MapPage — Risk Map with OpenStreetMap + Fading World Map Background Watermark
 * Matches Kochi Metro "Explore the Network" aesthetic
 */
import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import WorldMapWatermark from '../components/ui/WorldMapWatermark'

interface MapProject {
  id: number
  name: string
  latitude: number
  longitude: number
  status: string
  riskLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
  riskScore: number
  stateName: string
  amount: string
}

// ── 30 demo projects with coordinates across India ───────────
const DEMO_POINTS: MapProject[] = [
  { id: 1,  name: 'NH-24 Road Widening — Lucknow',        latitude: 26.85,  longitude: 80.95,  status: 'IN_PROGRESS', riskLevel: 'HIGH',     riskScore: 72, stateName: 'Uttar Pradesh',  amount: '₹4.50 Cr' },
  { id: 2,  name: 'Community Health Centre — Patna',       latitude: 25.61,  longitude: 85.14,  status: 'STALLED',     riskLevel: 'CRITICAL', riskScore: 91, stateName: 'Bihar',          amount: '₹3.20 Cr' },
  { id: 3,  name: 'Rural Water Supply — Hooghly',          latitude: 22.90,  longitude: 88.40,  status: 'IN_PROGRESS', riskLevel: 'MEDIUM',   riskScore: 48, stateName: 'West Bengal',    amount: '₹1.80 Cr' },
  { id: 4,  name: 'Desert Highway — Jodhpur',              latitude: 26.29,  longitude: 73.03,  status: 'SANCTIONED',  riskLevel: 'HIGH',     riskScore: 65, stateName: 'Rajasthan',      amount: '₹5.40 Cr' },
  { id: 5,  name: 'Govt Primary School — Nagpur',          latitude: 21.15,  longitude: 79.09,  status: 'COMPLETED',   riskLevel: 'LOW',      riskScore: 18, stateName: 'Maharashtra',    amount: '₹2.10 Cr' },
  { id: 6,  name: 'PHC Renovation — Mysuru',               latitude: 12.30,  longitude: 76.65,  status: 'IN_PROGRESS', riskLevel: 'MEDIUM',   riskScore: 42, stateName: 'Karnataka',      amount: '₹1.95 Cr' },
  { id: 7,  name: 'Narmada Pipeline — Jabalpur',           latitude: 23.17,  longitude: 79.95,  status: 'STALLED',     riskLevel: 'HIGH',     riskScore: 78, stateName: 'Madhya Pradesh', amount: '₹3.60 Cr' },
  { id: 8,  name: 'Industrial Road — Surat GIDC',          latitude: 21.17,  longitude: 72.83,  status: 'COMPLETED',   riskLevel: 'LOW',      riskScore: 12, stateName: 'Gujarat',        amount: '₹3.80 Cr' },
  { id: 9,  name: 'Digital Classroom — Vijayawada',        latitude: 16.51,  longitude: 80.62,  status: 'IN_PROGRESS', riskLevel: 'MEDIUM',   riskScore: 44, stateName: 'Andhra Pradesh', amount: '₹1.40 Cr' },
  { id: 10, name: 'Model School — Chennai',                latitude: 13.08,  longitude: 80.27,  status: 'COMPLETED',   riskLevel: 'LOW',      riskScore: 9,  stateName: 'Tamil Nadu',     amount: '₹2.75 Cr' },
  { id: 11, name: 'Agra-Mathura Link Road',                latitude: 27.18,  longitude: 77.98,  status: 'IN_PROGRESS', riskLevel: 'HIGH',     riskScore: 69, stateName: 'Uttar Pradesh',  amount: '₹2.90 Cr' },
  { id: 12, name: 'Sub-district Hospital — Pune',          latitude: 18.52,  longitude: 73.86,  status: 'SANCTIONED',  riskLevel: 'MEDIUM',   riskScore: 35, stateName: 'Maharashtra',    amount: '₹4.20 Cr' },
  { id: 13, name: 'Kosi Embankment Road — Supaul',         latitude: 26.12,  longitude: 86.60,  status: 'STALLED',     riskLevel: 'HIGH',     riskScore: 81, stateName: 'Bihar',          amount: '₹3.10 Cr' },
  { id: 14, name: 'Skill Centre — Gurugram',               latitude: 28.46,  longitude: 77.03,  status: 'COMPLETED',   riskLevel: 'LOW',      riskScore: 14, stateName: 'Haryana',        amount: '₹2.30 Cr' },
  { id: 15, name: 'Groundwater Recharge — Amritsar',       latitude: 31.63,  longitude: 74.87,  status: 'IN_PROGRESS', riskLevel: 'LOW',      riskScore: 22, stateName: 'Punjab',         amount: '₹1.65 Cr' },
  { id: 16, name: 'Coastal Highway — Puri to Konark',      latitude: 19.81,  longitude: 85.83,  status: 'IN_PROGRESS', riskLevel: 'MEDIUM',   riskScore: 51, stateName: 'Odisha',         amount: '₹4.80 Cr' },
  { id: 17, name: 'Tribal Health Post — Bastar',           latitude: 19.12,  longitude: 81.95,  status: 'SANCTIONED',  riskLevel: 'HIGH',     riskScore: 74, stateName: 'Chhattisgarh',   amount: '₹1.20 Cr' },
  { id: 18, name: 'Govt High School — Ranchi',             latitude: 23.36,  longitude: 85.33,  status: 'COMPLETED',   riskLevel: 'LOW',      riskScore: 11, stateName: 'Jharkhand',      amount: '₹1.85 Cr' },
  { id: 19, name: 'Brahmaputra Drainage — Guwahati',       latitude: 26.14,  longitude: 91.74,  status: 'STALLED',     riskLevel: 'CRITICAL', riskScore: 88, stateName: 'Assam',          amount: '₹2.70 Cr' },
  { id: 20, name: 'Backwater Bridge — Alappuzha',          latitude: 9.49,   longitude: 76.33,  status: 'COMPLETED',   riskLevel: 'LOW',      riskScore: 7,  stateName: 'Kerala',         amount: '₹2.40 Cr' },
  { id: 21, name: 'PHC Renovation — Warangal',             latitude: 17.98,  longitude: 79.60,  status: 'IN_PROGRESS', riskLevel: 'MEDIUM',   riskScore: 46, stateName: 'Telangana',      amount: '₹1.55 Cr' },
  { id: 22, name: 'Digital Library — Varanasi',            latitude: 25.32,  longitude: 83.00,  status: 'IN_PROGRESS', riskLevel: 'HIGH',     riskScore: 67, stateName: 'Uttar Pradesh',  amount: '₹1.10 Cr' },
  { id: 23, name: 'Smart Water Metering — Thane',          latitude: 19.22,  longitude: 72.98,  status: 'SANCTIONED',  riskLevel: 'LOW',      riskScore: 28, stateName: 'Maharashtra',    amount: '₹3.30 Cr' },
  { id: 24, name: 'Anganwadi Cluster — Muzaffarpur',       latitude: 26.12,  longitude: 85.39,  status: 'STALLED',     riskLevel: 'HIGH',     riskScore: 76, stateName: 'Bihar',          amount: '₹0.90 Cr' },
  { id: 25, name: 'Desert Medical Unit — Barmer',          latitude: 25.75,  longitude: 71.39,  status: 'IN_PROGRESS', riskLevel: 'MEDIUM',   riskScore: 53, stateName: 'Rajasthan',      amount: '₹2.05 Cr' },
  { id: 26, name: 'Chennai Water Augmentation',            latitude: 13.00,  longitude: 80.18,  status: 'COMPLETED',   riskLevel: 'LOW',      riskScore: 15, stateName: 'Tamil Nadu',     amount: '₹4.10 Cr' },
  { id: 27, name: 'Bengaluru Ring Road Segment 7',         latitude: 12.97,  longitude: 77.59,  status: 'IN_PROGRESS', riskLevel: 'HIGH',     riskScore: 71, stateName: 'Karnataka',      amount: '₹5.20 Cr' },
  { id: 28, name: 'Science Lab — Bhopal Schools',          latitude: 23.26,  longitude: 77.41,  status: 'COMPLETED',   riskLevel: 'LOW',      riskScore: 19, stateName: 'Madhya Pradesh', amount: '₹1.75 Cr' },
  { id: 29, name: 'Trauma Care Centre — Ahmedabad',        latitude: 23.03,  longitude: 72.59,  status: 'SANCTIONED',  riskLevel: 'MEDIUM',   riskScore: 38, stateName: 'Gujarat',        amount: '₹3.70 Cr' },
  { id: 30, name: 'Kolkata Suburb Road — Barasat',         latitude: 22.72,  longitude: 88.48,  status: 'IN_PROGRESS', riskLevel: 'HIGH',     riskScore: 70, stateName: 'West Bengal',    amount: '₹3.95 Cr' },
]

const RISK_COLORS: Record<string, string> = {
  CRITICAL: '#EF4444',
  HIGH:     '#F97316',
  MEDIUM:   '#F59E0B',
  LOW:      '#10B981'
}

function FlyToIndia() {
  const map = useMap()
  useEffect(() => { map.setView([22.5, 82.0], 5) }, [])
  return null
}

export default function MapPage() {
  const [filter, setFilter] = useState<string>('ALL')

  const filtered = filter === 'ALL' ? DEMO_POINTS : DEMO_POINTS.filter(p => p.riskLevel === filter)

  const counts = {
    CRITICAL: DEMO_POINTS.filter(p => p.riskLevel === 'CRITICAL').length,
    HIGH:     DEMO_POINTS.filter(p => p.riskLevel === 'HIGH').length,
    MEDIUM:   DEMO_POINTS.filter(p => p.riskLevel === 'MEDIUM').length,
    LOW:      DEMO_POINTS.filter(p => p.riskLevel === 'LOW').length,
  }

  return (
    <div
      className="fade-in"
      style={{
        position: 'relative',
        minHeight: 'calc(100vh - var(--nav-h))',
        background: 'linear-gradient(180deg, #FFFFFF 0%, #F5FCFB 50%, #E6FAF8 100%)',
        padding: '2rem 2.5rem',
        borderRadius: 24,
        overflow: 'hidden',
      }}
    >
      {/* Fading World Map Watermark matching Screenshot 2 */}
      <WorldMapWatermark opacity={0.16} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div className="page-header" style={{ marginBottom: '1.5rem' }}>
          <div className="demo-banner">
            GEOSPATIAL INTELLIGENCE · NATIONWIDE MESH
          </div>
          <h1 style={{ color: '#0F172A', fontWeight: 900, fontSize: '2.5rem', letterSpacing: '-0.02em' }}>
            National Risk Map
          </h1>
          <p className="page-subtitle" style={{ color: '#64748B', fontWeight: 500 }}>
            Spatial distribution of {DEMO_POINTS.length} monitored projects with autonomous AI risk overlay across India
          </p>
        </div>

        {/* Legend & Filter Buttons (Kochi Metro Style) */}
        <div style={{ display: 'flex', gap: '0.65rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setFilter('ALL')}
            style={{
              fontSize: '0.78rem',
              fontWeight: 800,
              padding: '0.45rem 1.15rem',
              borderRadius: 999,
              cursor: 'pointer',
              border: filter === 'ALL' ? '1.5px solid #00A896' : '1px solid #E2E8F0',
              background: filter === 'ALL' ? '#0F172A' : '#FFFFFF',
              color: filter === 'ALL' ? '#FFFFFF' : '#334155',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              transition: 'all 0.15s',
            }}
          >
            ALL ({DEMO_POINTS.length})
          </button>

          {(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as const).map(level => {
            const isSelected = filter === level
            return (
              <button
                key={level}
                onClick={() => setFilter(level)}
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  padding: '0.45rem 1.15rem',
                  borderRadius: 999,
                  cursor: 'pointer',
                  border: isSelected ? `1.5px solid ${RISK_COLORS[level]}` : '1px solid #E2E8F0',
                  background: isSelected ? RISK_COLORS[level] : '#FFFFFF',
                  color: isSelected ? '#FFFFFF' : '#334155',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  transition: 'all 0.15s',
                }}
              >
                <span style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: isSelected ? '#FFFFFF' : RISK_COLORS[level]
                }} />
                {level} ({counts[level]})
              </button>
            )
          })}
        </div>

        {/* Map Container (Clean White Card Frame with Rounded Corners) */}
        <div
          className="map-container"
          style={{
            height: 540,
            background: '#FFFFFF',
            border: '1.5px solid rgba(0, 168, 150, 0.25)',
            boxShadow: '0 20px 50px rgba(0, 168, 150, 0.1), 0 4px 12px rgba(15, 23, 42, 0.04)',
            borderRadius: 20,
            overflow: 'hidden',
          }}
        >
          <MapContainer center={[22.5, 82.0]} zoom={5} style={{ height: '100%', width: '100%' }}>
            <FlyToIndia />
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {filtered.map(p => (
              <CircleMarker
                key={p.id}
                center={[p.latitude, p.longitude]}
                radius={p.riskLevel === 'CRITICAL' ? 12 : p.riskLevel === 'HIGH' ? 9 : 7}
                pathOptions={{
                  color: RISK_COLORS[p.riskLevel],
                  fillColor: RISK_COLORS[p.riskLevel],
                  fillOpacity: 0.8,
                  weight: 2,
                  opacity: 1,
                }}
              >
                <Popup>
                  <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", minWidth: 220, padding: '0.25rem' }}>
                    <div style={{ fontWeight: 800, marginBottom: 4, fontSize: 13, color: '#0F172A' }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: '#64748B', marginBottom: 8 }}>{p.stateName} · {p.status.replace('_', ' ')}</div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{
                        background: `${RISK_COLORS[p.riskLevel]}15`, color: RISK_COLORS[p.riskLevel],
                        border: `1px solid ${RISK_COLORS[p.riskLevel]}40`, borderRadius: 999,
                        padding: '2px 8px', fontSize: 10, fontWeight: 800,
                      }}>
                        {p.riskLevel} · {p.riskScore}/100
                      </span>
                      <span style={{ fontSize: 12, fontWeight: 800, color: '#0F172A' }}>{p.amount}</span>
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginTop: '1.5rem' }}>
          {(Object.entries(counts) as [string, number][]).map(([level, count]) => (
            <div
              key={level}
              className="metro-card"
              style={{
                background: '#FFFFFF',
                border: `1px solid ${RISK_COLORS[level]}30`,
                padding: '1.15rem 1.4rem',
                borderRadius: 16,
                boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
              }}
            >
              <div style={{ fontSize: '0.7rem', fontWeight: 800, color: RISK_COLORS[level], textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.35rem' }}>
                {level} Risk
              </div>
              <div style={{ fontSize: '2.2rem', fontWeight: 900, color: RISK_COLORS[level], lineHeight: 1 }}>
                {count}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '0.2rem', fontWeight: 600 }}>
                monitored projects
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
