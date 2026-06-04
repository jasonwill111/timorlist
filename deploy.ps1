# Build and Deploy Script for TimorUp
$ErrorActionPreference = "Continue"

Write-Host "Starting TimorUp build and deploy..." -ForegroundColor Cyan

# Navigate to project directory
Set-Location "D:\Dev Projects\timorup"

# Check if build is already running
$nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue
Write-Host "Current node processes: $($nodeProcesses.Count)"

# Clean old dist if exists
if (Test-Path "dist") {
    Write-Host "Removing old dist directory..." -ForegroundColor Yellow
    Remove-Item -Path "dist" -Recurse -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 3
}

# Run the build
Write-Host "Running pnpm build..." -ForegroundColor Cyan
$buildStart = Get-Date
$buildResult = & pnpm build 2>&1
$buildEnd = Get-Date
$buildDuration = ($buildEnd - $buildStart).TotalSeconds
Write-Host "Build completed in $buildDuration seconds" -ForegroundColor Green

# Check build output
if ($LASTEXITCODE -eq 0) {
    Write-Host "Build SUCCESS" -ForegroundColor Green
    
    # Deploy
    Write-Host "Deploying to Cloudflare..." -ForegroundColor Cyan
    $deployResult = & npx wrangler deploy --config wrangler.jsonc 2>&1
    Write-Host "Deploy output: $($deployResult | Out-String)" -ForegroundColor Gray
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Deploy SUCCESS!" -ForegroundColor Green
        Write-Host "TimorUp deployed successfully with per-IP rate limiting fix!" -ForegroundColor Green
        
        # Write success marker
        "SUCCESS: Built and deployed at $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" | Out-File -FilePath "deploy_result.txt" -Encoding utf8
    } else {
        Write-Host "Deploy FAILED" -ForegroundColor Red
        $deployResult | Out-File -FilePath "deploy_error.txt" -Encoding utf8
    }
} else {
    Write-Host "Build FAILED" -ForegroundColor Red
    $buildResult | Out-File -FilePath "build_error.txt" -Encoding utf8
}
