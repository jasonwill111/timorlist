# Kill processes using dist folder
Get-Process | Where-Object { $_.Path -like '*timorup*' } | Stop-Process -Force -ErrorAction SilentlyContinue

# Wait a moment
Start-Sleep -Seconds 2

# Try to delete dist
if (Test-Path 'dist') {
    Remove-Item -Path 'dist' -Recurse -Force -ErrorAction Continue
    Write-Host "Deleted dist folder"
} else {
    Write-Host "dist folder does not exist"
}