# Environment Setup

## Overview

KomunaID menggunakan monorepo dengan dua aplikasi utama:
- `apps/web` - Next.js Frontend
- `apps/api` - Laravel API Backend

## Prerequisites

- PHP 8.2+
- Composer 2.x
- Node.js 18+ / npm
- MySQL 8+
- Redis (optional untuk local dev)

## Local Development Setup

### 1. Clone Repository

```bash
git clone <repo-url>
cd komuna_new
```

### 2. Backend Setup (Laravel API)

```bash
cd apps/api
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate
php artisan db:seed
php artisan serve
```

Backend API: http://localhost:8000

### 3. Frontend Setup (Next.js)

```bash
cd apps/web
cp .env.example .env.local
npm install
npm run dev
```

Frontend: http://localhost:3000

### 4. Database Setup

1. Buat database MySQL bernama `komuna_id`
2. Jalankan migrasi: `php artisan migrate`
3. Jalankan seeder: `php artisan db:seed`

### 5. Redis (Optional)

Jika Redis tersedia:
```env
CACHE_STORE=redis
QUEUE_CONNECTION=redis
```

Jika tidak tersedia, gunakan fallback:
```env
CACHE_STORE=database
QUEUE_CONNECTION=database
```

## Environment Variables

### Backend (.env)

| Variable | Description | Default |
|----------|-------------|---------|
| APP_NAME | Nama aplikasi | KomunaID |
| APP_ENV | Environment | local |
| APP_KEY | Application key | (auto-generated) |
| APP_URL | Backend URL | http://localhost:8000 |
| FRONTEND_URL | Frontend URL | http://localhost:3000 |
| DB_CONNECTION | Database driver | mysql |
| DB_HOST | Database host | 127.0.0.1 |
| DB_PORT | Database port | 3306 |
| DB_DATABASE | Database name | komuna_id |
| DB_USERNAME | Database user | root |
| DB_PASSWORD | Database password | |
| CACHE_STORE | Cache driver | database |
| QUEUE_CONNECTION | Queue driver | database |

### Frontend (.env.local)

| Variable | Description | Default |
|----------|-------------|---------|
| NEXT_PUBLIC_API_URL | Backend API URL | http://localhost:8000/api/v1 |
| NEXT_PUBLIC_APP_NAME | App name | KomunaID |
| NEXT_PUBLIC_APP_URL | Frontend URL | http://localhost:3000 |

## Production Setup

### Backend
1. Set `APP_ENV=production`
2. Set `APP_DEBUG=false`
3. Generate strong `APP_KEY`
4. Configure production database
5. Set up Redis for cache/queue
6. Configure mail driver
7. Set up storage links: `php artisan storage:link`

### Frontend
1. Deploy ke Vercel
2. Set environment variables di Vercel dashboard
3. Set `NEXT_PUBLIC_API_URL` ke production API URL

## Security Notes

- Jangan commit `.env` files
- Gunakan `.env.example` sebagai template
- Production harus gunakan HTTPS
- Rotasi APP_KEY secara berkala
- Gunakan strong password untuk database
