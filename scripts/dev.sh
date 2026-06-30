#!/bin/bash
set -e
echo "Starting dev servers..."
cd apps/api && php artisan serve --port=8000 &
cd ../web && npm run dev &
wait
