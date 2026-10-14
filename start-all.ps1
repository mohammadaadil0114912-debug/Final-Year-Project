# =========================================================
# ASL Bridge AI: Unified System Startup Script
# =========================================================

$ErrorActionPreference = "Stop"

# Ensure tools are in PATH
$env:PATH = "C:\Users\moham\.tools\nodejs;C:\Users\moham\.tools\python;C:\Users\moham\.tools;C:\Users\moham\.tools\python\Scripts;$env:PATH"

Write-Host "=================================================" -ForegroundColor Cyan
Write-Host "     ASL BRIDGE AI — MULTIMODAL PLATFORM         " -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan

# 1. Start Python FastAPI AI Service (Port 8000)
Write-Host "[1/3] Launching FastAPI AI Microservice on http://localhost:8000..." -ForegroundColor Yellow
$aiProcess = Start-Process -FilePath "powershell.exe" -ArgumentList "-NoExit", "-Command", "cd 'c:\Users\moham\OneDrive\Desktop\New folder\ai-service'; .\.venv\Scripts\python.exe -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload" -PassThru

# 2. Start Express Backend (Port 5000)
Write-Host "[2/3] Launching Express Application Gateway on http://localhost:5000..." -ForegroundColor Yellow
$backendProcess = Start-Process -FilePath "powershell.exe" -ArgumentList "-NoExit", "-Command", "`$env:PATH='C:\Users\moham\.tools\nodejs;' + `$env:PATH; cd 'c:\Users\moham\OneDrive\Desktop\New folder\backend'; npm run dev" -PassThru

# 3. Start Vite Frontend (Port 5173)
Write-Host "[3/3] Launching Vite React Client on http://localhost:5173..." -ForegroundColor Yellow
$frontendProcess = Start-Process -FilePath "powershell.exe" -ArgumentList "-NoExit", "-Command", "`$env:PATH='C:\Users\moham\.tools\nodejs;' + `$env:PATH; cd 'c:\Users\moham\OneDrive\Desktop\New folder\frontend'; npm run dev" -PassThru

Write-Host ""
Write-Host "All three application layers launched successfully!" -ForegroundColor Green
Write-Host "Frontend:   http://localhost:5173" -ForegroundColor White
Write-Host "Backend:    http://localhost:5000/api" -ForegroundColor White
Write-Host "AI Service: http://localhost:8000/docs" -ForegroundColor White
Write-Host "=================================================" -ForegroundColor Cyan
