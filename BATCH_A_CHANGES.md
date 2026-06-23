# Batch A — Security & Auth Core (merged)

This batch hardens security and replaces the old "register → instant login"
flow with a production-grade, OTP-verified, refresh-token-based auth system.
**All 15 end-to-end auth checks pass** (register → OTP verify → login →
refresh → forgot → reset → logout) against an in-memory MongoDB.

## What changed

### Backend — new files
| File | Purpose |
|---|---|
| `models/Otp.js` | Hashed OTP store, 5-min TTL auto-expiry |
| `models/LoginActivity.js` | Audit log (login success/fail, new device, resets) |
| `utils/otp.js` | CSPRNG 6-digit codes, HMAC hashing, constant-time verify |
| `utils/token.js` | Access (15m) + rotating refresh tokens, secure cookie opts |
| `utils/device.js` | User-agent / IP parsing for device recognition |
| `utils/email.js` | nodemailer service + 5 templates (dev console fallback) |
| `middleware/validate.js` | express-validator result handler |
| `middleware/rateLimiters.js` | Brute-force protection (auth/OTP/forgot) |

### Backend — rewritten
- **`server.js`** — `helmet`, fixed CORS (no more `'*'` + credentials), `express-mongo-sanitize`, `cookie-parser`, `trust proxy`, safe error handler (no internal leakage in prod), 404 handler, uses `config/db.js`.
- **`models/User.js`** — `isVerified`, `role`, hashed `refreshTokens[]`, `passwordChangedAt`, `password` is `select:false`, **strong password policy**, bcrypt cost 12.
- **`middleware/auth.js`** — verifies token **and** re-checks the user exists / isn't stale after a password change; adds `requireRole`.
- **`controllers/authController.js`** — full rewrite (see endpoints below).
- **`routes/auth.js`** — validators + rate limiters on every endpoint.
- **`config/db.js`** — now the single DB connection source (dead duplication removed).

### Backend — new endpoints
```
POST /api/auth/register          → creates UNVERIFIED account, emails OTP
POST /api/auth/verify-email      → OTP → activates + logs in (token + cookie)
POST /api/auth/resend-otp        → 60s cooldown enforced
POST /api/auth/login             → verified-only, Remember Me, device alert
POST /api/auth/refresh           → rotates refresh token (reuse = revoke all)
POST /api/auth/logout            → revokes this session
POST /api/auth/forgot-password   → generic 200 (no user enumeration)
POST /api/auth/verify-reset-otp  → returns short-lived reset token
POST /api/auth/reset-password    → updates pw, revokes sessions, auto-login
GET  /api/auth/activity          → recent login activity (auth)
```

### Frontend
- **`services/api.js`** — access token now lives **in memory** (not localStorage); silent refresh on 401 via httpOnly cookie; `withCredentials`.
- **`context/AuthContext.jsx`** — bootstraps session from refresh cookie; `verifyEmail`, `completeSession`, async `logout`.
- New pages: `VerifyEmail`, `ForgotPassword`, `ResetPassword`.
- New components: `PasswordStrength` (live meter + rules), `OtpInput` (6-box, paste), `AuthShell` (shared card).
- `Login` — Remember Me + Forgot password + unverified redirect.
- `Signup` — password strength meter + redirects to OTP verification.
- Routes added in `App.jsx`.

## Setup notes
1. `cd backend && npm install` (adds helmet, cookie-parser, express-rate-limit, express-mongo-sanitize, nodemailer).
2. Copy `.env.example` → `.env` and set the **new** vars: `JWT_REFRESH_SECRET`, `OTP_PEPPER`, and (optionally) the `SMTP_*` block.
   - **No SMTP?** OTPs and emails are printed to the **server console** so you can test the entire flow locally without a mail server.
   - In production over HTTPS on different domains, set `COOKIE_SECURE=true`.
3. `cd frontend && npm install && npm run build` — builds clean.

## Security improvements (OWASP-aligned)
- httpOnly + SameSite refresh cookie (XSS can't read it)
- Rotating refresh tokens with reuse-detection → revoke-all
- Rate limiting on auth/OTP/reset
- OTP hashed (HMAC), 5-min expiry, 5-attempt cap, resend cooldown
- helmet security headers, mongo-sanitize (NoSQL injection), strict CORS
- No user enumeration on forgot-password
- Strong password policy + server-side enforcement
- Audit logging + new-device email alerts
- Generic error messages in production

> Email templates here are intentionally minimal — **Batch B** replaces them
> with the premium, branded, dark-mode-aware versions.