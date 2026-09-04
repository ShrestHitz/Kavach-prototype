# ============================================================
# MPLADS Sentinel — Phase 2 Database Setup Script
# Run this AFTER starting Docker Desktop
# Usage: .\setup_db.ps1
# ============================================================

Set-Location -Path $PSScriptRoot\..

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  MPLADS Sentinel — Database Setup" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

# ── Step 1: Check Docker ──────────────────────────────────
Write-Host "[1/4] Checking Docker..." -ForegroundColor Yellow
$dockerCheck = docker ps 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Docker Desktop is not running!" -ForegroundColor Red
    Write-Host "   Please start Docker Desktop and run this script again." -ForegroundColor Red
    exit 1
}
Write-Host "   ✅ Docker is running" -ForegroundColor Green

# ── Step 2: Start PostgreSQL + PostGIS ───────────────────
Write-Host ""
Write-Host "[2/4] Starting PostgreSQL + PostGIS container..." -ForegroundColor Yellow
docker compose up -d db
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to start database container" -ForegroundColor Red
    exit 1
}

Write-Host "   Waiting for PostgreSQL to be ready..."
$maxWait = 60
$waited = 0
while ($waited -lt $maxWait) {
    Start-Sleep -Seconds 3
    $waited += 3
    $health = docker compose ps db --format json 2>&1 | ConvertFrom-Json -ErrorAction SilentlyContinue
    $isHealthy = docker exec mplads_sentinel_db pg_isready -U sentinel_user -d mplads_sentinel 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ PostgreSQL is ready (after ${waited}s)" -ForegroundColor Green
        break
    }
    Write-Host "   ... waiting ($waited/$maxWait s)"
}
if ($waited -ge $maxWait) {
    Write-Host "❌ PostgreSQL did not become ready in time" -ForegroundColor Red
    exit 1
}

# ── Step 3: Run synthetic data generator ─────────────────
Write-Host ""
Write-Host "[3/4] Running synthetic data generator..." -ForegroundColor Yellow
Write-Host "   This seeds the database with ~500 demo projects."
Write-Host "   ⚠  DEMO DATA MODE — not real government records."
Write-Host ""

Set-Location -Path "$PSScriptRoot\..\data\synthetic"
..\ml\.venv\Scripts\python.exe generate_demo_data.py
if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "❌ Data generator failed. Check error above." -ForegroundColor Red
    Set-Location -Path "$PSScriptRoot\.."
    exit 1
}
Set-Location -Path "$PSScriptRoot\.."

# ── Step 4: Verify ────────────────────────────────────────
Write-Host ""
Write-Host "[4/4] Verifying database..." -ForegroundColor Yellow
Set-Location -Path "$PSScriptRoot\..\data\synthetic"
..\ml\.venv\Scripts\python.exe verify_db.py
Set-Location -Path "$PSScriptRoot\.."

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  Phase 2 Complete!" -ForegroundColor Green
Write-Host "  PostgreSQL is running on localhost:5432" -ForegroundColor Green
Write-Host "  Database: mplads_sentinel" -ForegroundColor Green
Write-Host "  Ready to start Phase 3 (Spring Boot Backend)" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Cyan
