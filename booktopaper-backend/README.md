# BookToPaper — Flask Backend

AI-powered exam preparation API. Built with Flask + Supabase + OpenRouter.

## Prerequisites

- Python 3.11+
- A [Supabase](https://supabase.com) project
- An [OpenRouter](https://openrouter.ai) API key

---

## Quick Start

### 1. Create and activate virtual environment

```bash
cd booktopaper-backend

# Windows
python -m venv venv
venv\Scripts\activate

# macOS / Linux
python3 -m venv venv
source venv/bin/activate
```

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure environment variables

```bash
copy .env.example .env   # Windows
cp .env.example .env     # macOS/Linux
```

Edit `.env` and fill in:

| Variable | Where to find it |
|---|---|
| `SUPABASE_URL` | Supabase Dashboard → Project Settings → API |
| `SUPABASE_ANON_KEY` | Supabase Dashboard → Project Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Dashboard → Project Settings → API → Service Role |
| `OPENROUTER_API_KEY` | [openrouter.ai/keys](https://openrouter.ai/keys) |
| `SECRET_KEY` | Any random string (e.g. `python -c "import secrets; print(secrets.token_hex(32))"`) |

### 4. Run database migrations

1. Open your [Supabase project](https://supabase.com/dashboard)
2. Go to **SQL Editor**
3. Run `migrations/001_initial_schema.sql`
4. Run `migrations/002_rls_policies.sql`

### 5. Create Supabase Storage buckets

In the Supabase Dashboard → Storage, create two **public** buckets:
- `materials`
- `papers`

### 6. Start the development server

```bash
python run.py
```

The API will be available at `http://localhost:5000`

### Health check

```bash
curl http://localhost:5000/health
# {"status": "ok", "service": "booktopaper-api", "version": "1.0.0"}
```

---

## API Overview

All endpoints are prefixed with `/api/v1`.
Protected routes require: `Authorization: Bearer <supabase_jwt>`

| Module | Base Path | Key Actions |
|---|---|---|
| Auth | `/auth` | register, login, me |
| Materials | `/materials` | upload, list, topics |
| Papers | `/papers` | generate, download PDF |
| Exams | `/exams` | create session, auto-save, submit |
| Evaluations | `/evaluations` | AI scoring, breakdown |
| Study | `/study` | flashcards, weak areas |
| Planner | `/planner` | revision plan generation |

---

## Frontend Integration

Set in the Next.js frontend `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

All frontend `// TODO: replace with API call` boundaries in `lib/dummy/` map 1:1 to these endpoints.

---

## Project Structure

```
booktopaper-backend/
├── app/
│   ├── __init__.py          # Flask app factory
│   ├── config.py            # Environment config
│   ├── extensions.py        # Supabase client
│   ├── auth/                # JWT auth + routes
│   ├── materials/           # Upload, OCR, topic extraction
│   ├── papers/              # AI question generation + PDF export
│   ├── exams/               # Session management
│   ├── evaluations/         # AI answer scoring
│   ├── study/               # Flashcards, weak areas, sessions
│   ├── planner/             # Revision plan generation
│   └── shared/              # AI client, storage, error handlers
├── migrations/              # SQL files for Supabase
├── run.py                   # Entry point
├── requirements.txt
└── .env.example
```

---

## Production Deployment

```bash
gunicorn -w 4 -b 0.0.0.0:5000 "run:app"
```

Set `FLASK_ENV=production` and `FLASK_DEBUG=0` in production `.env`.
