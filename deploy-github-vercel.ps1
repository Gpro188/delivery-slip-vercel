# Quick GitHub + Vercel Deployment Script

Write-Host "=== GitHub + Vercel Deployment ===" -ForegroundColor Green
Write-Host ""

Write-Host "STEP 1: Create GitHub Repository" -ForegroundColor Cyan
Write-Host "1. Go to: https://github.com/new" -ForegroundColor Yellow
Write-Host "2. Repository name: delivery-slip-vercel" -ForegroundColor Yellow
Write-Host "3. Set to Public or Private" -ForegroundColor Yellow
Write-Host "4. DO NOT initialize with README" -ForegroundColor Yellow
Write-Host "5. Click 'Create repository'" -ForegroundColor Yellow
Write-Host ""

$repoUrl = Read-Host "Paste your GitHub repository URL (e.g., https://github.com/username/delivery-slip-vercel.git)"

Write-Host ""
Write-Host "STEP 2: Pushing to GitHub..." -ForegroundColor Cyan
git remote add origin $repoUrl
git branch -M main
git push -u origin main

Write-Host ""
Write-Host "STEP 3: Deploying to Vercel..." -ForegroundColor Cyan
Write-Host "Going to Vercel dashboard..." -ForegroundColor Yellow
Start-Process "https://vercel.com/new"

Write-Host ""
Write-Host "=== DEPLOYMENT INSTRUCTIONS ===" -ForegroundColor Green
Write-Host "1. On Vercel, click 'Import Git Repository'" -ForegroundColor Yellow
Write-Host "2. Select your 'delivery-slip-vercel' repo" -ForegroundColor Yellow
Write-Host "3. Add Environment Variables (from .env.local):" -ForegroundColor Yellow
Write-Host "   - POSTGRES_URL" -ForegroundColor White
Write-Host "   - POSTGRES_PRISMA_URL" -ForegroundColor White
Write-Host "   - POSTGRES_USER" -ForegroundColor White
Write-Host "   - POSTGRES_HOST" -ForegroundColor White
Write-Host "   - POSTGRES_PASSWORD" -ForegroundColor White
Write-Host "   - POSTGRES_DATABASE" -ForegroundColor White
Write-Host "   - NEXTAUTH_SECRET" -ForegroundColor White
Write-Host "   - NEXTAUTH_URL" -ForegroundColor White
Write-Host "4. Click 'Deploy'" -ForegroundColor Yellow
Write-Host ""
Write-Host "Done! Your app will be live on Vercel!" -ForegroundColor Green
