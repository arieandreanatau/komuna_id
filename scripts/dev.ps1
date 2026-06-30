Write-Host "Starting dev servers..." -ForegroundColor Cyan
$apiJob = Start-Job -ScriptBlock { Set-Location "C:\xampp\htdocs\komuna_new\apps\api"; php artisan serve --port=8000 }
$webJob = Start-Job -ScriptBlock { Set-Location "C:\xampp\htdocs\komuna_new\apps\web"; npm run dev }
Write-Host "API: http://localhost:8000" -ForegroundColor Green
Write-Host "Web: http://localhost:3000" -ForegroundColor Green
try { while ($true) { Start-Sleep -Seconds 5 } } finally { Stop-Job $apiJob, $webJob -ErrorAction SilentlyContinue; Remove-Job $apiJob, $webJob -Force -ErrorAction SilentlyContinue }
