@echo off
echo ============================================
echo Delivery Slip Generator - Setup Script
echo ============================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed!
    echo Please install Node.js 18+ from https://nodejs.org
    pause
    exit /b 1
)

echo [OK] Node.js found: 
node --version
echo.

REM Install dependencies
echo [INFO] Installing dependencies...
echo This may take a few minutes...
echo.
call npm install

if %errorlevel% neq 0 (
    echo [ERROR] Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo [OK] Dependencies installed successfully!
echo.

REM Setup environment file
if not exist .env.local (
    echo [INFO] Creating environment file...
    copy .env.example .env.local
    echo [OK] .env.local created
    echo.
    echo [IMPORTANT] Please edit .env.local and add:
    echo   - PostgreSQL connection string
    echo   - NEXTAUTH_SECRET (generate at: https://generate-secret.vercel.app/32^)
    echo   - NEXTAUTH_URL=http://localhost:3000
    echo.
) else (
    echo [OK] .env.local already exists
    echo.
)

echo ============================================
echo Setup Complete!
echo ============================================
echo.
echo Next steps:
echo 1. Configure your .env.local file with database credentials
echo 2. Run: npm run dev
echo 3. Open http://localhost:3000
echo.
echo For deployment to Vercel:
echo 1. Push to GitHub
echo 2. Import at vercel.com
echo 3. Add environment variables
echo 4. Deploy!
echo.
pause
