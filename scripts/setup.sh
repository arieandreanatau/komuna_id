#!/bin/bash
set -e
echo "Setting up KomunaID..."
cd apps/api
composer install
if [ ! -f .env ]; then cp .env.example .env; php artisan key:generate; fi
php artisan migrate --force
php artisan db:seed --force
cd ../..
cd apps/web
npm install
cd ../..
echo "Setup complete! Run: cd apps/api && php artisan serve"
