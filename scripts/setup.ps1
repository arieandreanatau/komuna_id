$ErrorActionPreference = "Stop"
Write-Host "Setting up KomunaID..." -ForegroundColor Cyan
Set-Location apps/api
composer install
if (-not (Test-Path .env)) { Copy-Item .env.example .env; php artisan key:generate }
php artisan migrate --force
php artisan db:seed --force
Set-Location ../..
Set-Location apps/web
npm install
Set-Location ../..
Write-Host "Setup complete!" -ForegroundColor Green
