# Deployment Environment

## Architecture

```
                    ┌─────────────┐
                    │   Vercel    │
                    │  (Frontend) │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │     CDN     │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │  VPS/Cloud  │
                    │  (Backend)  │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │   MySQL     │
                    │ (Hostinger) │
                    └─────────────┘
```

## Environments

### Local Development
- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- Database: MySQL localhost (XAMPP)
- Cache: Database (fallback)

### Staging
- Frontend: Vercel preview deployments
- Backend: VPS staging
- Database: MySQL staging
- Cache: Redis

### Production
- Frontend: Vercel production
- Backend: VPS production
- Database: MySQL Hostinger
- Cache: Redis

## Deployment Steps

### Frontend (Vercel)
1. Push ke main branch
2. Vercel auto-deploys
3. Set environment variables di Vercel dashboard

### Backend (VPS)
1. Pull latest code
2. Run `composer install --no-dev`
3. Run `php artisan migrate --force`
4. Run `php artisan config:cache`
5. Run `php artisan route:cache`
6. Run `php artisan view:cache`
7. Restart queue worker

### Database (Hostinger)
1. Backup sebelum migrasi
2. Jalankan migrasi dari backend
3. Verifikasi data

## Monitoring
- Sentry untuk error tracking
- Logging untuk audit trail
- Uptime monitoring
