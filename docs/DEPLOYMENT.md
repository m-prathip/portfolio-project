# Deployment Guide

## Option A — Docker (everything, one command)
```bash
# from the project root
export JWT_SECRET=$(openssl rand -hex 32)
export JWT_REFRESH_SECRET=$(openssl rand -hex 32)
export OTP_PEPPER=$(openssl rand -hex 32)
# optional: SMTP_* and OPENAI_API_KEY
docker compose up --build
```
- Frontend: http://localhost:8080  (nginx serves the SPA + proxies `/api`)
- Backend:  http://localhost:5000
- MongoDB:  localhost:27017 (data persisted in the `mongo_data` volume)

No SMTP set → OTP/emails print to the backend container logs (`docker compose logs backend`).
For production over HTTPS set `COOKIE_SECURE=true` and a real `FRONTEND_URL`.

## Option B — Managed (Vercel + Render + Atlas)
**Backend (Render / Railway / Fly):**
1. Root dir `backend/`, build `npm ci`, start `npm start`.
2. Env: `MONGO_URI` (Atlas), `JWT_SECRET`, `JWT_REFRESH_SECRET`, `OTP_PEPPER`,
   `FRONTEND_URL` (your Vercel URL), `COOKIE_SECURE=true`, `SMTP_*`, optional `OPENAI_API_KEY`.
3. Because frontend and backend are on different domains, the refresh cookie
   needs `COOKIE_SECURE=true` (SameSite=None) — both must be HTTPS.

**Frontend (Vercel / Netlify):**
1. Root dir `frontend/`, build `npm run build`, output `dist/`.
2. Env `VITE_API_URL=https://your-backend.onrender.com`.
3. Add a SPA rewrite (all routes → `/index.html`). `vercel.json` is included.

**Database:** MongoDB Atlas free tier; whitelist your backend host; paste the
connection string into `MONGO_URI`.

## Email (production)
Set `SMTP_HOST/PORT/USER/PASS` and `EMAIL_FROM` (e.g. SendGrid, Mailgun, Gmail
app password, Postmark). Without them the app still works — codes are logged.

## Uploads
Local disk by default (`backend/uploads`, persisted via the `uploads` Docker
volume). For multi-instance / serverless hosting, move to S3/Cloudinary
(swap `middleware/upload.js`).

## CI/CD
`.github/workflows/ci.yml` runs on every push/PR:
1. **backend** — `npm ci` + `npm test` (auth + API flow tests on in-memory Mongo)
2. **frontend** — `npm ci` + `npm run build`
3. **docker** — builds both images
Add a deploy job (Render/Vercel deploy hook or `docker push`) after `docker`.

## Smoke test after deploy
```
curl https://your-backend/            # {"message":"Portfolio API is running!"}
```
Then sign up in the UI → check the OTP arrives (email or backend logs) → verify → log in.
