# Ski Planning App

This repository now contains the initial MVP implementation for the ski slope planning app:

- `backend/`: FastAPI API, seed data, ingestion helpers, and routing engine tests
- `mobile/`: Expo React Native shell for resort selection and route planning
- `infra/`: local PostGIS and Redis services
- `docs/`: MVP scope, API contracts, and MapLibre feasibility notes

## Requirements

- Node.js `18.18+`
- npm
- Python `3.11+`
- Docker Desktop

## Quick Start

### 1. Start infrastructure

From the repo root:

```bash
docker compose -f infra/docker-compose.yml up -d
```

### 2. Set up the backend

From `backend/`:

```bash
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install --upgrade pip
pip install -e .[dev]
```

Create `backend/.env`:

```env
DATABASE_URL=postgresql+psycopg://postgres:postgres@localhost:5432/ski_app
REDIS_URL=redis://localhost:6379/0
JWT_SECRET=change-me
SEED_SAMPLE_DATA_ON_STARTUP=true
```

Run the backend:

```bash
uvicorn app.main:app --reload
```

### 3. Set up the mobile app

From `mobile/`:

```bash
npm install
npx tsc --noEmit
npm test -- --runInBand
npm start
```

## Docs

- Full machine setup guide: `docs/local-setup.md`
- Current project handoff summary: `docs/session-summary.md`

## Current Status

- Mobile onboarding, preferences, dashboard, planner, and recent-route flows are implemented
- Mobile test suite is passing
- Backend scaffold, ingestion pipeline, and routing logic are present
- Some mobile behavior still falls back to mock data until the backend is fully exercised locally
