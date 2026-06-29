# KomunaID

**Platform Ekosistem Komunitas**

> CONNECT • COMMUNITY • GROW

KomunaID adalah platform yang menghubungkan Member, Komunitas, Organisasi, Brand, Event, Volunteer, Marketplace, Venue, Community Media, dan Admin Platform dalam satu ekosistem terintegrasi.

## Tech Stack

### Frontend (`apps/web`)
- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- React Hook Form + Zod
- TanStack Query

### Backend (`apps/api`)
- Laravel 11+ (API mode)
- PHP 8.2+
- MySQL 8+
- Eloquent ORM
- Laravel Sanctum

### Infrastructure
- Redis (cache & queue)
- GitHub Actions (CI/CD)
- Vercel (frontend deployment)
- VPS / Cloud (backend deployment)

## Monorepo Structure

```
komuna_new/
├── apps/
│   ├── web/          # Next.js frontend
│   └── api/          # Laravel API backend
├── docs/             # Documentation
├── database/         # ERD, data dictionary, seed data
├── design/           # Brand identity, UI reference
├── deployment/       # Docker, nginx, CI/CD
├── scripts/          # Utility scripts
└── README.md
```

## Getting Started

### Prerequisites

- PHP 8.2+
- Composer 2.x
- Node.js 18+
- MySQL 8+
- Redis (optional for local dev)

### Backend Setup

```bash
cd apps/api
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate
php artisan db:seed
php artisan serve
```

### Frontend Setup

```bash
cd apps/web
cp .env.example .env.local
npm install
npm run dev
```

Frontend: http://localhost:3000
Backend API: http://localhost:8000/api/v1

## Documentation

- [Technical Docs](docs/technical/)
- [API Docs](docs/api/)
- [Business Docs](docs/business/)
- [Brand Identity](design/brand-identity/)

## Brand Identity

- Primary: Navy (#0A2A66)
- Secondary: Blue (#1478FF)
- Support: Teal (#00B8A9)
- Accent: Aqua (#00D4C6)
- Highlight: Orange (#FF9A1A)
- Background: Light Gray (#F5F7FA)

Font: Poppins (SemiBold / Regular)

## License

Proprietary - All rights reserved.
