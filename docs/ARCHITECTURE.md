# Architecture

Full-stack multi-user portfolio publisher. Each account owns an isolated
portfolio served at `/u/:username`, manageable from an admin dashboard.

## Stack
- **Frontend:** React 18 + Vite + Tailwind (CSS-variable theme engine), React Router (lazy routes), framer-motion, three.js / @react-three/fiber (3D backgrounds), react-helmet-async (SEO).
- **Backend:** Node + Express, Mongoose, JWT (access) + rotating refresh tokens, nodemailer, OTP, rate limiting, helmet, mongo-sanitize.
- **DB:** MongoDB.
- **Infra:** Docker + docker-compose, GitHub Actions CI, nginx (SPA + API proxy).

## Folder structure
```
portfolio-project/
├── backend/
│   ├── config/db.js              # single DB connection
│   ├── controllers/              # auth, profile, crud, portfolio, analytics, assistant
│   ├── middleware/               # auth, validate, rateLimiters, resolveUser, upload
│   ├── models/                   # User, Profile, content models, Otp, LoginActivity,
│   │                             #   Visit, ContactMessage, ResumeDownload, ThemeEvent
│   ├── routes/                   # /api/* routers
│   ├── utils/                    # otp, token, device, email
│   ├── tests/                    # auth + api flow tests (in-memory Mongo)
│   └── server.js
├── frontend/
│   └── src/
│       ├── components/  (common, admin, layout, three)
│       ├── context/     (Auth, Theme, Background)
│       ├── hooks/       (useTypewriter)
│       ├── pages/       (Landing, PortfolioLayout, Home, Projects, Education, admin/*)
│       └── services/api.js
├── docker-compose.yml
└── .github/workflows/ci.yml
```

## Database schema (high level)
```
User { username*, email*, password(hashed), isVerified, role,
       refreshTokens[{tokenHash,device,ip,expiresAt}], passwordChangedAt, lastLoginAt }
Profile { user→User (1:1), name, title, about, email, phone, location,
          profileImage, resumeUrl, social{}, domains[] }
Projects/Skills/Experience/Education/Achievements/Activities { user→User, ... }
Otp { email, user, codeHash, purpose(verify|reset), attempts, lastSentAt, expiresAt(TTL) }
LoginActivity { user, email, event, ip, device, browser, os, reason }
Visit { user, path, referrer, ip, device }   ResumeDownload { user, ip, device }
ContactMessage { user, name, email, message, read }   ThemeEvent { user, theme }
```
Every content document carries a `user` ref and all queries are ownership-scoped.

## Authentication flow
```mermaid
sequenceDiagram
  participant U as User
  participant F as Frontend (SPA)
  participant B as Backend
  U->>F: Sign up (username,email,password)
  F->>B: POST /api/auth/register
  B->>B: create UNVERIFIED user + generate OTP
  B-->>U: email OTP (5-min, hashed)
  B-->>F: { requiresVerification }
  U->>F: enter OTP
  F->>B: POST /api/auth/verify-email
  B->>B: verify OTP, isVerified=true
  B-->>F: access token (15m) + Set-Cookie refresh (httpOnly)
  Note over F,B: On 401, F silently POST /api/auth/refresh (cookie) → new access token (rotation)
  U->>F: Logout
  F->>B: POST /api/auth/logout → revoke this refresh token
```

## OTP / password-reset flow
```mermaid
flowchart TD
  A[Forgot password] --> B[POST /forgot-password]
  B --> C{User exists?}
  C -- always 200 (no enumeration) --> D[email reset OTP]
  D --> E[POST /verify-reset-otp]
  E --> F{Correct & < 5 attempts & not expired?}
  F -- no --> E
  F -- yes --> G[issue short-lived resetToken JWT 10m]
  G --> H[POST /reset-password]
  H --> I[hash new password, revoke all sessions]
  I --> J[auto-login: new access token + refresh cookie]
```
Security: OTP hashed (HMAC), 5-min TTL, max 5 attempts, 60s resend cooldown,
rate limiting, audit logging via LoginActivity.

## AI assistant architecture
```mermaid
flowchart LR
  W[Floating chat widget] -->|message + history| R[POST /portfolio/:username/assistant]
  R --> CTX[Build context from Profile/Skills/Projects/Experience/Education/Achievements]
  CTX --> K{OPENAI_API_KEY set?}
  K -- yes --> AI[OpenAI chat completion w/ portfolio facts as system prompt]
  K -- no --> OFF[Rule-based offline answers]
  AI -->|on error| OFF
  AI --> W
  OFF --> W
```
The assistant only answers from the owner's portfolio data and never exposes
secrets. Offline mode means the chatbot works with zero external dependencies.

## Theme & 3D background engine
- 10 palettes defined as CSS variables (`--c-primary-*`); Tailwind maps
  `primary`/`accent` to them, so the whole app recolours when `data-theme`
  changes on `<html>`.
- 6 selectable WebGL backgrounds (particles, neural, galaxy, grid, spheres,
  waves) lazy-loaded via React.lazy; automatic CSS-gradient fallback on
  low-end devices / `prefers-reduced-motion`.
