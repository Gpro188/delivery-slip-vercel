# Vercel Environment Variables Setup Script
# Run this script to add all environment variables to Vercel

Write-Host "Adding environment variables to Vercel..." -ForegroundColor Green

# Read .env.local file
$envFile = Get-Content .env.local

# Parse and add each environment variable
foreach ($line in $envFile) {
    # Skip comments and empty lines
    if ($line -match '^#' -or $line -match '^$') { continue }
    
    # Split key=value
    $parts = $line -split '=', 2
    if ($parts.Length -eq 2) {
        $key = $parts[0].Trim()
        $value = $parts[1].Trim()
        
        Write-Host "`nAdding $key..." -ForegroundColor Yellow
        Write-Output $value | vercel env add $key production --force
    }
}

Write-Host "`nAll environment variables added!" -ForegroundColor Green
Write-Host "Now run: vercel --prod" -ForegroundColor Cyan
