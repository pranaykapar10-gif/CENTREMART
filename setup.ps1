#!/usr/bin/env pwsh
# E-Commerce Quick Start Script for Windows PowerShell

Write-Host "🚀 E-Commerce Store - Quick Start" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js not found. Please install Node.js 18+" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Node.js found: $(node --version)" -ForegroundColor Green

# Check if npm is installed
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "❌ npm not found" -ForegroundColor Red
    exit 1
}

Write-Host "✅ npm found: $(npm --version)" -ForegroundColor Green
Write-Host ""

# Setup Backend
Write-Host "📦 Setting up Backend..." -ForegroundColor Yellow
Set-Location backend

if (-not (Test-Path ".env")) {
    Write-Host "⚠️  .env not found. Creating from .env.example..." -ForegroundColor Yellow
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env"
        Write-Host "⚠️  Please edit .env with your DATABASE_URL before running!" -ForegroundColor Yellow
    }
}

if (-not (Test-Path "node_modules")) {
    Write-Host "📥 Installing backend dependencies..." -ForegroundColor Cyan
    npm install
}

Write-Host "✅ Backend setup complete!" -ForegroundColor Green
Write-Host ""

# Setup Frontend
Write-Host "📱 Setting up Frontend..." -ForegroundColor Yellow
Set-Location ../frontend

if (-not (Test-Path "node_modules")) {
    Write-Host "📥 Installing frontend dependencies..." -ForegroundColor Cyan
    npm install
}

Write-Host "✅ Frontend setup complete!" -ForegroundColor Green
Write-Host ""

# Instructions
Write-Host "════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "🎉 Setup Complete! Ready to Launch!" -ForegroundColor Green
Write-Host "════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

Write-Host "📝 NEXT STEPS:" -ForegroundColor Yellow
Write-Host ""

Write-Host "1️⃣  BACKEND - Open Terminal 1:" -ForegroundColor Cyan
Write-Host "   cd backend" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor White
Write-Host "   ✅ Backend runs on http://localhost:4000" -ForegroundColor Green
Write-Host ""

Write-Host "2️⃣  FRONTEND - Open Terminal 2:" -ForegroundColor Cyan
Write-Host "   cd frontend" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor White
Write-Host "   ✅ Frontend runs on http://localhost:3000" -ForegroundColor Green
Write-Host ""

Write-Host "3️⃣  BROWSER:" -ForegroundColor Cyan
Write-Host "   Open http://localhost:3000" -ForegroundColor White
Write-Host "   Click 'Sign Up' to create account" -ForegroundColor White
Write-Host "   Start shopping!" -ForegroundColor White
Write-Host ""

Write-Host "⚠️  BEFORE YOU START:" -ForegroundColor Yellow
Write-Host "   ✓ Make sure PostgreSQL is running" -ForegroundColor White
Write-Host "   ✓ Edit backend/.env with DATABASE_URL" -ForegroundColor White
Write-Host "   ✓ Keep both terminals running" -ForegroundColor White
Write-Host ""

Write-Host "📚 READ FIRST:" -ForegroundColor Cyan
Write-Host "   START_HERE.md - Quick overview" -ForegroundColor White
Write-Host "   README.md - Full documentation" -ForegroundColor White
Write-Host "   QUICKSTART.md - Setup details" -ForegroundColor White
Write-Host ""

Write-Host "✅ Your store is ready! 🚀" -ForegroundColor Green
