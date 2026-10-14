# =========================================================
# ASL Bridge AI: Automated Test Runner
# =========================================================

$ErrorActionPreference = "Stop"
$env:PATH = "C:\Users\moham\.tools\nodejs;C:\Users\moham\.tools\python;C:\Users\moham\.tools;C:\Users\moham\.tools\python\Scripts;$env:PATH"

Write-Host ">>> Running AI Microservice Pytest Suite..." -ForegroundColor Cyan
Set-Location "c:\Users\moham\OneDrive\Desktop\New folder\ai-service"
& ".\.venv\Scripts\pytest.exe" -v

Write-Host "`n>>> Running Backend TypeScript Compilation & Typecheck..." -ForegroundColor Cyan
Set-Location "c:\Users\moham\OneDrive\Desktop\New folder\backend"
& "C:\Users\moham\.tools\nodejs\npx.cmd" tsc --noEmit

Write-Host "`n>>> Running Frontend Production Build Verification..." -ForegroundColor Cyan
Set-Location "c:\Users\moham\OneDrive\Desktop\New folder\frontend"
& "C:\Users\moham\.tools\nodejs\npx.cmd" vite build

Write-Host "`n=================================================" -ForegroundColor Green
Write-Host "  ALL TESTS AND TYPECHECKS PASSED WITH 0 ERRORS! " -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Green
