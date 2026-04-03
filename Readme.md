# StepSync

> Visualize your daily step counts as a GitHub-style contribution heatmap, powered by Google Fit.

![Tech Stack](https://img.shields.io/badge/Next.js-14-black?logo=next.js) ![Tech Stack](https://img.shields.io/badge/FastAPI-0.111-009688?logo=fastapi) ![Tech Stack](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwindcss)

---

## Features

- **Google OAuth** — Secure login with Google
- **Google Fit Integration** — Real step count data from your phone/watch
- **GitHub-Style Heatmap** — Daily steps visualized as a contribution graph
- **Filters** — Browse by year and month
- **Dashboard Metrics** — Total steps, daily average, active days, consistency score
- **AI Insights** — Smart analysis of your walking habits

---

## Architecture

```
frontend/          → Next.js 14 (App Router) + Tailwind CSS
backend/           → FastAPI + SQLAlchemy + SQLite/PostgreSQL
```

---

## Prerequisites

- **Node.js** ≥ 18
- **Python** ≥ 3.10
- **Google Cloud Project** with OAuth 2.0 credentials

---

## Google Cloud Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select an existing one)
3. Enable the **Fitness API**:
   - Navigate to **APIs & Services → Library**
   - Search for **Fitness API** and enable it
4. Create OAuth 2.0 credentials:
   - Go to **APIs & Services → Credentials**
   - Click **Create Credentials → OAuth client ID**
   - Application type: **Web application**
   - Authorized redirect URIs: `http://localhost:8000/auth/callback`
5. Configure the OAuth consent screen:
   - Add test users (your Google account email)
   - Add scope: `https://www.googleapis.com/auth/fitness.activity.read`
6. Copy the **Client ID** and **Client Secret**

---

## Local Setup

### 1. Backend

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate   # Linux/Mac
venv\Scripts\activate      # Windows

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your Google credentials and a JWT secret

# Run the server
uvicorn app.main:app --reload --port 8000
```

### 2. Frontend

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local

# Run the dev server
npm run dev
```

### 3. Open the app

Visit [http://localhost:3000](http://localhost:3000) and click **Login with Google**.

---

## API Endpoints

| Method | Endpoint               | Description                          |
| ------ | ---------------------- | ------------------------------------ |
| GET    | `/auth/login`          | Get Google OAuth URL                 |
| GET    | `/auth/callback`       | Handle OAuth callback                |
| GET    | `/auth/me`             | Get current user profile             |
| POST   | `/auth/logout`         | Clear session                        |
| GET    | `/steps?year=&month=`  | Fetch step data with metrics/insights|
| GET    | `/health`              | Health check                         |

---

## Deployment

### Frontend → Vercel

1. Push the `frontend/` folder to a Git repo
2. Import into [Vercel](https://vercel.com)
3. Set environment variable: `NEXT_PUBLIC_API_URL` = your backend URL
4. Deploy

### Backend → Render

1. Push the `backend/` folder to a Git repo
2. Create a new **Web Service** on [Render](https://render.com)
3. Build command: `pip install -r requirements.txt`
4. Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Add all environment variables from `.env.example`
6. Update `GOOGLE_REDIRECT_URI` to your Render URL
7. Update the Authorized redirect URI in Google Cloud Console

---

## Project Structure

```
backend/
├── app/
│   ├── main.py              # FastAPI app entry point
│   ├── config.py            # Settings from environment
│   ├── database.py          # SQLAlchemy setup
│   ├── models/
│   │   └── user.py          # User model
│   ├── routes/
│   │   ├── auth.py          # OAuth login/callback/logout
│   │   └── steps.py         # Step data + insights endpoint
│   ├── services/
│   │   └── google_fit.py    # Google Fit API + insights logic
│   └── utils/
│       └── auth.py          # JWT token utilities
├── requirements.txt
└── .env.example

frontend/
├── app/
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Login page
│   ├── globals.css          # Global styles + heatmap colors
│   └── dashboard/
│       └── page.tsx         # Main dashboard
├── components/
│   ├── Heatmap.tsx          # Calendar heatmap component
│   ├── Filters.tsx          # Year/month filter dropdowns
│   ├── Metrics.tsx          # Statistics cards
│   └── Insights.tsx         # AI insights panel
├── package.json
├── tailwind.config.js
├── next.config.js
├── tsconfig.json
└── .env.example
```

---

## License

MIT