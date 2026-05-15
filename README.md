# AI-Powered Smart Task Management Dashboard

A full-stack task management dashboard for students with authentication, task CRUD, analytics, calendar views, and AI-style productivity insights.

## Tech Stack

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express.js
- Database: MongoDB Atlas
- Deployment: Vercel frontend, Render backend

## Project Structure

```text
.
├── backend
│   ├── app.js
│   ├── server.js
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── services
│   ├── utils
│   ├── .env.example
│   └── package.json
├── frontend
│   ├── dashboard.html
│   ├── login.html
│   ├── register.html
│   ├── style.css
│   ├── env.example.js
│   ├── vercel.json
│   └── src
├── render.yaml
├── docker-compose.yml
└── README.md
```

## Local Setup

1. Install backend dependencies:

```bash
cd backend
npm install
```

2. Create `backend/.env` from `backend/.env.example`.

3. Start the backend:

```bash
npm run dev
```

4. Open the frontend with a static server from the `frontend` folder. For example, VS Code Live Server or:

```bash
npx serve frontend
```

The frontend uses `http://localhost:5000/api` locally and `/api` in production.

## Backend Environment Variables

```env
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>/<database>?retryWrites=true&w=majority
JWT_SECRET=<long-random-secret>
REFRESH_SECRET=<different-long-random-secret>
CORS_ORIGIN=https://your-vercel-app.vercel.app
RATE_LIMIT_MAX=100
```

## Deploy Backend on Render

1. Create a MongoDB Atlas cluster.
2. Create a database user and copy the Atlas connection string.
3. In Render, create a new Web Service from this GitHub repo.
4. Set Root Directory to `backend`.
5. Build Command: `npm ci --omit=dev`
6. Start Command: `npm start`
7. Add the backend environment variables above.
8. Deploy and confirm `https://your-render-backend.onrender.com/health` returns healthy JSON.

## Deploy Frontend on Vercel

1. In `frontend/vercel.json`, replace:

```json
"https://your-render-backend.onrender.com/api/$1"
```

with your real Render backend URL.

2. In Vercel, import the same GitHub repo.
3. Set Root Directory to `frontend`.
4. No build command is required for this static app.
5. Deploy.
6. Copy the final Vercel URL and add it to Render as `CORS_ORIGIN`.

If you prefer direct browser-to-Render API calls, copy `frontend/env.example.js` to `frontend/env.js`, set the Render API URL, and deploy that file. The default recommended setup uses the Vercel `/api` rewrite.

## JWT Deployment Verification

After both deployments:

1. Open the Vercel URL.
2. Register a new user.
3. Log in.
4. Create a task.
5. Refresh the dashboard page.
6. Confirm tasks still load with the stored JWT.
7. Wait longer than 15 minutes and confirm the refresh token flow renews the session.

## Production Notes

- Do not commit `.env`, `frontend/env.js`, or `node_modules`.
- Use different strong values for `JWT_SECRET` and `REFRESH_SECRET`.
- Keep `CORS_ORIGIN` restricted to your deployed Vercel URL.
- Keep MongoDB Atlas network access as narrow as your deployment allows.
- Rotate secrets if they are ever exposed.
- Add automated API tests before making this a team or portfolio-scale project.
