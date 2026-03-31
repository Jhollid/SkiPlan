# Local Setup Guide

## Goal

Use this guide on a fresh machine after cloning the repository so you can get the current app running locally.

This repo currently has:
- a FastAPI backend in `backend/`
- an Expo React Native mobile app in `mobile/`
- local Postgres/PostGIS and Redis services in `infra/`

## Prerequisites

Install these first:
- Git
- Node.js `18.18+` and npm
- Python `3.11+`
- Docker Desktop

Recommended checks:

```bash
node -v
npm -v
python --version
docker --version
docker compose version
```

## 1. Clone The Repo

```bash
git clone <your-repo-url>
cd SkiPlanningApp
```

## 2. Start Local Infrastructure

From the repo root:

```bash
docker compose -f infra/docker-compose.yml up -d
```

This starts:
- Postgres/PostGIS on `localhost:5432`
- Redis on `localhost:6379`

To stop them later:

```bash
docker compose -f infra/docker-compose.yml down
```

## 3. Set Up The Backend

Open a terminal in `backend/`.

### Create and activate a virtual environment

Windows PowerShell:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

macOS / Linux:

```bash
python3 -m venv .venv
source .venv/bin/activate
```

### Install backend dependencies

```bash
pip install --upgrade pip
pip install -e .[dev]
```

### Create backend environment file

Create `backend/.env` with:

```env
DATABASE_URL=postgresql+psycopg://postgres:postgres@localhost:5432/ski_app
REDIS_URL=redis://localhost:6379/0
JWT_SECRET=change-me
SEED_SAMPLE_DATA_ON_STARTUP=true
```

### Run backend tests

```bash
pytest
```

### Start the backend API

From `backend/`:

```bash
uvicorn app.main:app --reload
```

Expected local API:
- `http://127.0.0.1:8000`

If startup succeeds, sample resort data should seed automatically when `SEED_SAMPLE_DATA_ON_STARTUP=true`.

## 4. Set Up The Mobile App

Open a second terminal in `mobile/`.

### Install mobile dependencies

```bash
npm install
```

### Validate the mobile app

```bash
npx tsc --noEmit
npm test -- --runInBand
```

### Start Expo

```bash
npm start
```

Then use Expo to run on:
- Android emulator
- iOS simulator
- Expo Go / device if your environment supports it

## 5. Recommended Run Order

When working locally, use this order:

1. Start Docker services
2. Activate backend virtualenv
3. Run backend in `backend/`
4. Start Expo in `mobile/`
5. Open the mobile app and test the onboarding and planner flow

## 6. What Works Today

Current state of the repo:
- mobile onboarding flow works
- preferences flow works
- dashboard/recent-route flow works
- planner UI works
- mobile tests are passing
- backend scaffold and tests exist

Important caveat:
- some mobile flows still have fallback/mock behavior, so not every screen depends on a live backend yet

## 7. Common Problems

### Node version warnings

If `npm install` shows engine warnings for Metro packages, upgrade Node to `18.18+` or newer.

### PowerShell activation blocked

If PowerShell blocks venv activation, run:

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

Then retry:

```powershell
.\.venv\Scripts\Activate.ps1
```

### Docker services not starting

Check Docker Desktop is running, then retry:

```bash
docker compose -f infra/docker-compose.yml up -d
```

### Backend cannot connect to database

Check:
- Docker containers are running
- `backend/.env` exists
- `DATABASE_URL` matches the compose config

### Mobile app starts but API-backed flows fail

Check:
- backend is running on port `8000`
- Docker services are up
- the app is using the expected local API configuration in `mobile/src/api/client.ts`

## 8. Useful Commands

Backend:

```bash
pytest
uvicorn app.main:app --reload
```

Mobile:

```bash
npm install
npm test -- --runInBand
npx tsc --noEmit
npm start
```

Infra:

```bash
docker compose -f infra/docker-compose.yml up -d
docker compose -f infra/docker-compose.yml down
```

## 9. First Files To Check If Something Breaks

- `backend/.env`
- `backend/pyproject.toml`
- `backend/app/main.py`
- `infra/docker-compose.yml`
- `mobile/package.json`
- `mobile/src/api/client.ts`
- `docs/session-summary.md`
