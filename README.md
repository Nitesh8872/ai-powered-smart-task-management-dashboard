# AI-Powered Smart Task Management Dashboard

A full-stack student task dashboard with authentication, task management, analytics, calendar views, and AI-assisted productivity tools.

**Recommended live setup:** one Render URL serves **both** the website and the API (no CORS issues).

---

## One live link (fix login/register permanently)

Use **only Render** for production. The server hosts the frontend and API on the **same domain**.

| What | URL |
|------|-----|
| App (login) | `https://YOUR-SERVICE.onrender.com/login.html` |
| Register | `https://YOUR-SERVICE.onrender.com/register.html` |
| API | `https://YOUR-SERVICE.onrender.com/api` |

### Deploy steps (do once)

1. Push this repo to GitHub.
2. [Render](https://render.com) → **New Web Service** → connect repo.
3. **Root Directory:** leave empty or `.` (not `backend` only).
4. **Build Command:** `cd backend && npm ci --omit=dev`
5. **Start Command:** `cd backend && npm start`
6. Environment variables:

   | Key | Value |
   |-----|--------|
   | `NODE_ENV` | `production` |
   | `MONGO_URI` | Your MongoDB Atlas connection string |
   | `JWT_SECRET` | Long random string |
   | `REFRESH_SECRET` | Different long random string |

7. Deploy. Open `https://YOUR-SERVICE.onrender.com/login.html` and register.

**MongoDB Atlas:** Network Access → **Allow access from anywhere** (`0.0.0.0/0`) so Render can connect.

CORS is **open in production** by default so Vercel/GitHub still work. Login on Render does not depend on CORS at all.

---

## Features

- **Authentication** — register, login, JWT access tokens (15 min), refresh tokens (7 days)
- **Tasks** — create, read, update, delete with title, deadline, priority, category, and completion status
- **Dashboard views** — list view, Kanban board, calendar, priority and velocity charts
- **AI assistant** — chatbot for task/productivity help (authenticated)
- **Summarizer** — summarize long text (authenticated)
- **UX** — dark/light theme, skeleton loaders, toasts, responsive layout

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | HTML, CSS, vanilla JavaScript (ES modules) |
| Backend | Node.js, Express 5 |
| Database | MongoDB (Mongoose) |
| Auth | JWT + bcrypt, refresh token rotation |
| Security | Helmet, CORS, rate limiting, express-validator |
| Deploy | Render (app + API, recommended), optional Vercel/GitHub Pages |

---

## Project Structure

```text
.
├── index.html                    # Root redirect → frontend/
├── .github/workflows/
│   └── github-pages.yml          # Auto-deploy frontend to GitHub Pages
├── backend/
│   ├── app.js                    # Express app setup
│   ├── server.js                 # Entry point
│   ├── config/
│   │   ├── cors.js               # CORS rules (Vercel, GitHub Pages, local)
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/              # Route handlers
│   ├── middleware/               # Auth, validation, errors
│   ├── models/                   # User, Task schemas
│   ├── routes/                   # API routes
│   ├── services/                 # Business logic + AI helpers
│   ├── .env.example
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── index.html                # Redirects to login or dashboard
│   ├── login.html
│   ├── register.html
│   ├── dashboard.html
│   ├── style.css
│   ├── vercel.json               # API proxy to Render
│   ├── env.example.js
│   └── src/
│       ├── api/                  # userService, taskService, apiClient
│       ├── components/           # Calendar, Charts, AIChatbot, etc.
│       ├── pages/                # loginPage, registerPage
│       ├── state/                  # appState
│       └── utils/                  # storage, toast, dom
├── docker-compose.yml
├── render.yaml                   # Render Blueprint
└── README.md
```

---

## Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [MongoDB Atlas](https://www.mongodb.com/atlas) account (or local MongoDB)
- Git + GitHub account (for deployment)

---

## Local Development

### 1. Backend

```bash
cd backend
npm install
```

Copy the example env file and edit it:

```bash
cp .env.example .env
```

Example `backend/.env` for local work:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/student-dashboard
JWT_SECRET=your-long-random-jwt-secret
REFRESH_SECRET=your-different-refresh-secret
CORS_ORIGIN=*.vercel.app,*.github.io,http://localhost:5500,http://127.0.0.1:5500
RATE_LIMIT_MAX=100
```

Start the API:

```bash
npm run dev
```

API runs at `http://localhost:5000`. Health check: `http://localhost:5000/health`

### 2. Frontend

Serve the `frontend` folder (do **not** open HTML files directly with `file://`):

```bash
npx serve frontend
```

Or use **VS Code Live Server** on the `frontend` folder.

The app uses `http://localhost:5000/api` when served from `localhost` or `127.0.0.1`.

### 3. Docker (optional)

Runs backend + local MongoDB:

```bash
docker compose up --build
```

API: `http://localhost:5000` — serve `frontend` separately as above.

---

## API Reference

Base URL: `/api`

### Auth (public)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/users/register` | Register (`name`, `email`, `password`) |
| `POST` | `/users/login` | Login (`email`, `password`) → JWT + refresh token |
| `POST` | `/users/refresh` | Refresh access token (`refreshToken`) |

### Tasks (Bearer token required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/tasks` | List all tasks for user |
| `GET` | `/tasks/:id` | Get one task |
| `POST` | `/tasks/add` | Create task |
| `PUT` | `/tasks/:id` | Update task |
| `DELETE` | `/tasks/:id` | Delete task |

### AI (Bearer token required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/ai/chat` | AI chat (`prompt`, optional `context`) |
| `POST` | `/ai/summarize` | Summarize text (`text`) |

### Health

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Server health |
| `GET` | `/health/config` | Env/CORS config status (no secrets) |

---

## Environment Variables (Render / Production)

| Variable | Required | Description |
|----------|----------|-------------|
| `NODE_ENV` | Yes | `production` on Render |
| `PORT` | No | Default `5000` |
| `MONGO_URI` | Yes | MongoDB Atlas connection string |
| `JWT_SECRET` | Yes | Long random secret for access tokens |
| `REFRESH_SECRET` | Yes | Different secret for refresh tokens |
| `CORS_ORIGIN` | Recommended | Comma-separated origins, e.g. `*.vercel.app,*.github.io` |
| `RATE_LIMIT_MAX` | No | Default `100` requests per 15 min per IP |
| `CORS_TRUST_VERCEL` | No | Default allows all `*.vercel.app` in production |
| `CORS_TRUST_GITHUB_PAGES` | No | Default allows all `*.github.io` in production |

**CORS tips**

- Do **not** add trailing slashes to URLs in `CORS_ORIGIN`.
- Vercel gives a new URL per deploy; use `*.vercel.app` or rely on built-in Vercel trust.
- After changing env vars on Render, redeploy the backend.

---

## Deployment

### Option A — Vercel + Render (recommended)

Full app with login, tasks, and API proxy.

#### Backend (Render)

1. Create a [MongoDB Atlas](https://www.mongodb.com/atlas) cluster and copy the connection string.
2. On [Render](https://render.com), create a **Web Service** from this GitHub repo.
3. **Root Directory:** `backend`
4. **Build Command:** `npm ci --omit=dev`
5. **Start Command:** `npm start`
6. Add environment variables (see table above). Example `CORS_ORIGIN`:

   ```text
   *.vercel.app,*.github.io,http://localhost:5500,http://127.0.0.1:5500
   ```

7. Deploy and verify: `https://YOUR-SERVICE.onrender.com/health`

You can also use the included `render.yaml` Blueprint.

#### Frontend (Vercel)

1. In `frontend/vercel.json`, set the `destination` to your Render API URL:

   ```json
   "destination": "https://YOUR-SERVICE.onrender.com/api/:path*"
   ```

2. On [Vercel](https://vercel.com), import the GitHub repo.
3. **Root Directory:** `frontend`
4. **Build Command:** none (static site)
5. Deploy.

Your live link will look like:

```text
https://your-project-name.vercel.app
```

The frontend calls `/api/...` on the same domain; Vercel proxies those requests to Render.

---

### Option B — GitHub Pages + Render

Static frontend hosted on GitHub; API calls go directly to Render.

1. Deploy the backend on Render (same as above).
2. Push this repo to GitHub (`main` branch).
3. Repo → **Settings** → **Pages** → **Source:** GitHub Actions.
4. Wait for the workflow **Deploy frontend to GitHub Pages** to finish.
5. Open your Pages URL:

   ```text
   https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/
   ```

6. Redeploy Render with the latest backend code so `*.github.io` CORS is allowed.

Entry points:

- `index.html` (repo root) → redirects to `frontend/login.html`
- `frontend/index.html` → redirects to login or dashboard

---

## How the Frontend Picks the API URL

Configured in `frontend/src/config.js`:

| Where you open the app | API base URL |
|------------------------|--------------|
| `localhost` / Live Server | `http://localhost:5000/api` |
| `*.vercel.app` | `/api` (proxied via `vercel.json`) |
| `*.github.io` | `https://smart-task-dashboard-api.onrender.com/api` (or `env.js` override) |

Optional override: copy `frontend/env.example.js` to `frontend/env.js` and set `API_BASE_URL` (do not commit `env.js`).

---

## Post-Deploy Checklist

1. Open your live URL (Vercel or GitHub Pages).
2. Register a new account.
3. Log in and create a task.
4. Refresh the page — tasks should still load.
5. Test AI chat and summarizer on the dashboard.
6. If you see **403 CORS** errors, redeploy Render and hard-refresh the browser (`Ctrl+Shift+R`).

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| **403 on login/register** | Redeploy Render; set `CORS_ORIGIN` without trailing slashes; use `*.vercel.app` for Vercel |
| **Cannot reach API locally** | Run `npm run dev` in `backend`; use Live Server on `frontend`, not `file://` |
| **Blank page / scripts fail** | Serve from `frontend/` folder; paths use `/src/...` |
| **MongoDB errors** | Check `MONGO_URI`; allow your IP in Atlas Network Access |
| **Session expires** | Refresh token flow runs automatically via `apiClient.js` |

---

## Security Notes

- Never commit `backend/.env`, `frontend/env.js`, or secrets.
- Use strong, unique values for `JWT_SECRET` and `REFRESH_SECRET`.
- Restrict MongoDB Atlas network access where possible.
- Rotate credentials if they are ever exposed in a public repo or chat.

---

## Scripts

| Command | Location | Description |
|---------|----------|-------------|
| `npm run dev` | `backend/` | Start API server |
| `npm start` | `backend/` | Production start |
| `npm run check` | `backend/` | Syntax-check main files |
| `npx serve frontend` | project root | Local static frontend |
| `docker compose up` | project root | Backend + MongoDB in Docker |

---

## License

ISC (see `backend/package.json`).
