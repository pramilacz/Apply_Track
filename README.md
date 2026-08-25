# ApplyTrack

A clean, minimal internship & job application tracker for students — rebuilt as a
**React (Vite) frontend** talking to a **Flask JSON API** backend.

This is a full redesign and migration of the original Flask/Jinja app. The backend's
core logic (auth, database, CRUD, Google login) is preserved; only the interface layer
changed. If you're new to this stack, follow the steps below in order — you don't need
to understand everything up front, just run the commands.

---

## 1. What's in this project

```text
applytrack/
├── backend/          Flask app: models, routes, auth (used locally with `python app.py`)
├── api/index.py       Same Flask app, wrapped for Vercel's serverless functions
├── frontend/          React + Vite app (all the UI)
├── requirements.txt    Python dependencies (root level, for local dev + Vercel)
├── vercel.json         Vercel build & routing configuration
└── .env.example         Template for backend environment variables
```

---

## 2. Requirements

Install these first if you don't have them:

- **Node.js** 18 or newer — https://nodejs.org
- **Python** 3.11 or newer — https://python.org
- **Git** — https://git-scm.com

---

## 3. Run it locally

### Step 1 — Get the backend running

Open a terminal in the project's root folder (`applytrack/`):

```bash
python -m venv venv
source venv/bin/activate        # on Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Copy the environment template and fill it in:

```bash
cp .env.example .env
```

Open `.env` and set at minimum:

```text
SECRET_KEY=any-random-string-for-local-dev
```

You can leave `DATABASE_URL` empty for local development — the app automatically
falls back to a local SQLite file (`applytrack.db`). Leave `GOOGLE_CLIENT_ID` /
`GOOGLE_CLIENT_SECRET` empty too if you don't need Google login yet — the app runs
fine without them (the Google button will just fail gracefully).

Start the backend:

```bash
python -m backend.app
```

You should see Flask running on `http://localhost:5000`. Leave this terminal open.

### Step 2 — Get the frontend running

Open a **second terminal** in the `frontend/` folder:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Open the link Vite prints (usually `http://localhost:5173`). The frontend
automatically proxies `/api` requests to your Flask server on port 5000 — so
registration, login, and CRUD all work immediately.

### Step 3 — Try it out

1. Go to `http://localhost:5173`
2. Click **Get started free**, create an account
3. Add an application, edit it, delete it — everything writes to your local
   SQLite database at `applytrack.db`

---

## 4. Environment variables reference

### Backend (`.env` at project root)

| Variable | Required? | Description |
|---|---|---|
| `SECRET_KEY` | Yes | Flask session signing key. Any random string locally; a strong secret in production. |
| `DATABASE_URL` | Production only | Postgres connection string. Omit locally (uses SQLite). |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Only for Google login | From Google Cloud Console. |
| `CORS_ORIGINS` | Only if frontend/API are on different domains | Comma-separated allowed origins. |
| `FRONTEND_URL` | Yes | Where to redirect after Google login completes. |

### Frontend (`frontend/.env`)

| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL for API calls. `http://localhost:5000/api` locally, `/api` in production. |

Never commit real secrets — only `.env.example` (with placeholders) should be in git.

---

## 5. Deploying to Vercel

This project deploys as **one Vercel project**: the React app is served as static
files, and the Flask API runs as a Python serverless function at `/api/*`. Because
both live under the same domain, there's no CORS to configure in production.

### Step 1 — Push to GitHub

```bash
git init
git add .
git commit -m "ApplyTrack redesign"
git branch -M main
git remote add origin https://github.com/<your-username>/applytrack.git
git push -u origin main
```

### Step 2 — Create a production database

Vercel's serverless functions don't have a persistent disk, so SQLite won't work
in production. Create a free Postgres database with one of:

- **Neon** — https://neon.tech
- **Supabase** — https://supabase.com
- **Vercel Postgres** (if available on your account) via the Vercel dashboard

Copy the connection string it gives you (starts with `postgres://` or
`postgresql://` — either works, the app normalizes it).

### Step 3 — Create the Vercel project

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Vercel will detect `vercel.json` automatically — you don't need to change the
   build/output settings, they're already configured in that file.

### Step 4 — Add environment variables

In the Vercel project: **Settings → Environment Variables**. Add these for
**Production** (and Preview, if you want preview deployments to work fully):

```text
SECRET_KEY=<generate a long random string>
DATABASE_URL=<your Neon/Supabase connection string>
GOOGLE_CLIENT_ID=<if using Google login>
GOOGLE_CLIENT_SECRET=<if using Google login>
FRONTEND_URL=https://<your-project>.vercel.app
```

You do **not** need to set `VITE_API_URL` in production — the frontend defaults to
same-origin `/api`, which is correct here since both frontend and API are on the
same Vercel domain.

### Step 5 — Deploy

Click **Deploy**. Vercel will:
1. Run `npm install && npm run build` inside `frontend/`
2. Serve the resulting `frontend/dist` as static files
3. Deploy `api/index.py` as a Python serverless function
4. Route `/api/*` to that function and everything else to `index.html`, so React
   Router routes (like `/dashboard`) work correctly on refresh and direct visits.

### Step 6 — Redeploy after changing env vars

Any time you add or change an environment variable, trigger a redeploy
(**Deployments → ⋯ → Redeploy**) — Vercel doesn't pick up env var changes on
already-built deployments automatically.

### Step 7 — Configure Google OAuth for production (optional)

If you're using Google login, open your project in
[Google Cloud Console → APIs & Services → Credentials](https://console.cloud.google.com/apis/credentials)
and add your production callback URL to **Authorized redirect URIs**:

```text
https://<your-project>.vercel.app/api/auth/google/callback/done
```

Keep your local one too:

```text
http://localhost:5000/api/auth/google/callback/done
```

### Step 8 — Test the production app

Visit your `*.vercel.app` domain and check:
- Register / login / logout
- Google login (if configured)
- Add / edit / delete an application
- Refreshing `/dashboard` directly (should not 404)
- Mobile view

---

## 6. Notes on what changed vs. the original app

- The Flask routes that used to render HTML templates (`/add`, `/edit`, `/login`,
  etc.) now live under `/api/*` and return JSON. The database, models, field names
  (`company`, `role`, `date`, `status`, `notes`), and status values (`Applied`,
  `Interview`, `Offer`, `Rejected`) are unchanged.
- Flash messages became toast notifications in the UI.
- The hardcoded opportunities from the old templates were moved to
  `frontend/src/data/opportunities.js` — edit that file to add or change listings.
- No existing user data is deleted or migrated automatically. If you already have
  a production SQLite database from the old app, you'll need to move that data
  into your new Postgres database (a simple one-off script reading from SQLite and
  inserting into Postgres works fine — ask if you'd like help writing one).

---

## 7. Common issues

- **"Network error" on login/register locally** — make sure the Flask backend
  (`python -m backend.app`) is running on port 5000 before starting the frontend.
- **Google login redirects to an error page** — double-check the redirect URI in
  Google Cloud Console matches exactly, including `http` vs `https`.
- **Production build fails on Vercel** — check the deployment logs; the most common
  cause is a missing environment variable (`SECRET_KEY` is required for the app to
  start).
