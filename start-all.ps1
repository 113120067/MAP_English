# OMLE Master Launcher Script
# ============================
# This script starts all services with fixed ports.

$ErrorActionPreference = "Continue"

function Stop-PortProcess([int]$port) {
    Write-Host "Checking port $port..." -ForegroundColor Cyan
    $process = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($process) {
        Write-Host "Killing process $($process.OwningProcess) on port $port" -ForegroundColor Yellow
        Stop-Process -Id $process.OwningProcess -Force -ErrorAction SilentlyContinue
    }
}

# 1. Cleanup
Write-Host "--- Cleaning up existing processes ---" -ForegroundColor Magenta
Stop-PortProcess 3001 # Backend
Stop-PortProcess 5173 # Kids Vocab
Stop-PortProcess 5174 # App Store
Stop-PortProcess 5175 # Immersive Reader
Stop-PortProcess 5176 # MapWords Adventure

Start-Sleep -Seconds 1

# 2. Start Services
Write-Host "--- Launching OMLE Services ---" -ForegroundColor Green

# Use Start-Process to launch in new windows
Write-Host "[1/5] Starting Backend (3001)..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd map-core-backend; npm run dev"

Write-Host "[2/5] Starting Kids Vocab (5173)..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd app-kids-vocab; npm run dev -- --port 5173"

Write-Host "[3/5] Starting App Store (5174)..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd map-appstore; npm run dev -- --port 5174"

Write-Host "[4/5] Starting Immersive Reader (5175)..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd app-immersive-reader; npm run dev -- --port 5175"

Write-Host "[5/5] Starting MapWords Adventure (5176)..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd map-words-poc; npm run dev -- --port 5176"

Write-Host "`nAll services are launching! Please check the individual windows for status." -ForegroundColor Green
Write-Host "Portal: http://localhost:5174" -ForegroundColor White
