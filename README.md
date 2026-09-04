# MPLADS Sentinel

> **AI-powered project intelligence and early-warning platform for MPLAD Scheme implementation**

**Smart India Hackathon 2026 | Problem Statement ID: 26102 | MoSPI / DIID**

---

## What It Does

MPLADS Sentinel analyzes financial, geospatial, and photographic evidence from MPLADS projects to:

- **Detect** unusual financial patterns and payment anomalies
- **Predict** project delays and cost overruns using XGBoost
- **Verify** photograph evidence (GPS, timestamp, image reuse)
- **Identify** potential duplicate or overlapping projects
- **Explain** exactly *why* a project is flagged as high-risk
- **Generate** professional investigation reports for authorized officials

```
DATA → ANALYSIS → ANOMALY DETECTION → PREDICTION → VERIFICATION → RISK SCORE → EXPLANATION → REPORT
```

> ⚠️ **DEMO DATA MODE** — This platform runs on realistic synthetic project data for demonstration purposes. All data is clearly labelled. No real government records are claimed or fabricated.

---

## Architecture

```
React + Vite + TypeScript  (port 5173)
           │
           ▼
  Spring Boot REST API      (port 8080)
           │
    ┌──────┴──────┐
    ▼              ▼
PostgreSQL      Python FastAPI ML Service  (port 8000)
+ PostGIS           │
                ┌───┼───┐
                ▼   ▼   ▼
           IsoForest XGB Sentence
                        Transformers
```

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, TypeScript |
| Maps | Leaflet + React-Leaflet |
| Charts | Recharts |
| Tables | TanStack Table v8 |
| Backend | Java 21, Spring Boot 3.x, JWT |
| Database | PostgreSQL 16 + PostGIS 3 |
| ML Service | Python 3.14, FastAPI |
| ML Models | scikit-learn, XGBoost, Sentence Transformers, SHAP |
| Reports | WeasyPrint (HTML → PDF) |
| Container | Docker + Docker Compose |

---

## Quick Start

### Prerequisites
- Docker Desktop (running)
- Node.js 18+
- Java 21
- Python 3.10+

### 1. Clone and configure
```bash
git clone <repo>
cd mplads-sentinel
cp .env.example .env
# Edit .env with your values
```

### 2. Start the database
```bash
docker compose up -d db
```

### 3. Start the ML service
```bash
cd ml
python -m venv .venv
.venv\Scripts\activate        # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### 4. Start the backend
```bash
cd backend
./mvnw spring-boot:run        # Linux/Mac
mvnw.cmd spring-boot:run      # Windows
```

### 5. Start the frontend
```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### Demo credentials
| Role | Username | Password |
|------|----------|----------|
| Ministry (MoSPI) | `ministry@sentinel.gov.in` | `Demo@1234` |
| State Nodal (TN) | `nodal.tn@sentinel.gov.in` | `Demo@1234` |
| District Authority | `district@sentinel.gov.in` | `Demo@1234` |
| MP | `mp@sentinel.gov.in` | `Demo@1234` |
| Implementing Agency | `agency@sentinel.gov.in` | `Demo@1234` |

---

## Project Structure

```
mplads-sentinel/
├── frontend/          React + Vite + TypeScript
├── backend/           Spring Boot (Java 21)
├── ml/                Python FastAPI ML service
├── data/              Raw data files (real + synthetic)
│   ├── raw/           Original government data
│   └── synthetic/     Generated demo project data
├── docker-compose.yml PostgreSQL + PostGIS
├── .env.example       Environment variable template
└── README.md
```

---

## Responsible AI Notice

This system is **decision support only**. It identifies unusual patterns for human review. It does not:
- Automatically accuse any MP, official, agency, or individual of fraud
- Make legal or judicial decisions
- Claim predictions are definitive facts

All outputs use language such as:
> "Potential anomaly detected — verification recommended"

---

## Phase Status

| Phase | Status |
|-------|--------|
| 1 — Foundation | ✅ Complete |
| 2 — Database | 🔜 |
| 3–17 | 🔜 |
