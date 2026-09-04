@echo off
title KAVACH Launcher
echo ===================================================
echo   Starting KAVACH Full Stack System
echo   - Python ML Service:     http://localhost:8001
echo   - Spring Boot Backend:   http://localhost:8080
echo   - Frontend UI:           http://localhost:5173
echo ===================================================

cd /d "%~dp0"

echo [1/3] Starting Python ML FastAPI Service (Port 8001)...
start "KAVACH - ML Service (Port 8001)" cmd /k "cd /d "%~dp0ml" && .\.venv\Scripts\python.exe -m uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload"

echo [2/3] Starting Spring Boot Backend (Port 8080)...
start "KAVACH - Spring Boot (Port 8080)" cmd /k "cd /d "%~dp0backend" && .\mvnw.cmd spring-boot:run"

echo [3/3] Starting Frontend Dev Server (Port 5173)...
start "KAVACH - Frontend Vite (Port 5173)" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo.
echo All services initiated in separate windows.
echo Open http://localhost:5173 in your browser.
pause
