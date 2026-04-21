# PowerShell Script to Add Environment Variables to Vercel
# This will add all required environment variables

Write-Host "=== Adding Environment Variables to Vercel ===" -ForegroundColor Green
Write-Host ""

# Environment variables from .env.local
$envVars = @{
    "POSTGRES_URL" = "postgresql://postgres.xmaeoskrocnnhgmiwvcr:188Dpro188%40@aws-1-ap-south-1.pooler.supabase.com:5432/postgres"
    "POSTGRES_PRISMA_URL" = "postgresql://postgres.xmaeoskrocnnhgmiwvcr:188Dpro188%40@aws-1-ap-south-1.pooler.supabase.com:5432/postgres?pgbouncer=true"
    "POSTGRES_URL_NO_SSL" = "postgresql://postgres.xmaeoskrocnnhgmiwvcr:188Dpro188%40@aws-1-ap-south-1.pooler.supabase.com:5432/postgres"
    "POSTGRES_URL_NON_POOLING" = "postgresql://postgres.xmaeoskrocnnhgmiwvcr:188Dpro188%40@aws-1-ap-south-1.pooler.supabase.com:5432/postgres"
    "POSTGRES_USER" = "postgres.xmaeoskrocnnhgmiwvcr"
    "POSTGRES_HOST" = "aws-1-ap-south-1.pooler.supabase.com"
    "POSTGRES_PASSWORD" = "188Dpro188@"
    "POSTGRES_DATABASE" = "postgres"
    "NEXTAUTH_SECRET" = "7f8a9b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a"
    "NEXTAUTH_URL" = "https://delivery-slip-vercel.vercel.app"
}

Write-Host "Adding environment variables for PRODUCTION..." -ForegroundColor Cyan
Write-Host ""

foreach ($key in $envVars.Keys) {
    $value = $envVars[$key]
    Write-Host "Adding $key..." -ForegroundColor Yellow
    
    # Use vercel env add command
    $value | vercel env add $key production --force 2>$null
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✓ $key added successfully" -ForegroundColor Green
    } else {
        Write-Host "  ⚠ $key may already exist or needs manual addition" -ForegroundColor Yellow
    }
    Write-Host ""
}

Write-Host "=== Environment Variables Setup Complete ===" -ForegroundColor Green
Write-Host ""
Write-Host "Now deploying to Vercel..." -ForegroundColor Cyan
vercel --prod
