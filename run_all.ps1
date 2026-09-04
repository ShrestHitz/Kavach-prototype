Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "  Starting KAVACH Full Stack System" -ForegroundColor Cyan
Write-Host "  - Python ML Service:     http://localhost:8001" -ForegroundColor Yellow
Write-Host "  - Spring Boot Backend:   http://localhost:8080" -ForegroundColor Yellow
Write-Host "  - Frontend UI:           http://localhost:5173" -ForegroundColor Green
Write-Host "===================================================" -ForegroundColor Cyan

$rootDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# 1. Start ML Service
Write-Host "[1/3] Starting Python ML FastAPI Service (Port 8001)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd `"$rootDir\ml`"; & `".\.venv\Scripts\python.exe`" -m uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload"

# 2. Start Spring Boot Backend
Write-Host "[2/3] Starting Spring Boot Backend (Port 8080)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd `"$rootDir\backend`"; .\mvnw.cmd spring-boot:run"

# 3. Start Frontend
Write-Host "[3/3] Starting Frontend Dev Server (Port 5173)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd `"$rootDir\frontend`"; npm run dev"

Write-Host "`nAll services have been launched in dedicated terminal windows!" -ForegroundColor Green
Write-Host "Open http://localhost:5173 to access the dashboard." -ForegroundColor Cyan
