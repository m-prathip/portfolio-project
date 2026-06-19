# API Reference

Base URL: `/api`. Auth uses a Bearer **access token** (15m) in the
`Authorization` header; the **refresh token** is an httpOnly cookie.

## Auth
| Method | Endpoint | Auth | Body | Notes |
|---|---|---|---|---|
| POST | `/auth/register` | – | `{username,email,password}` | Creates unverified user, emails OTP |
| POST | `/auth/verify-email` | – | `{email,code}` | Activates + returns token + refresh cookie |
| POST | `/auth/resend-otp` | – | `{email,purpose}` | 60s cooldown |
| POST | `/auth/login` | – | `{identifier,password,remember}` | 403 if unverified |
| POST | `/auth/refresh` | cookie | – | Rotates refresh token, returns new access token |
| POST | `/auth/logout` | cookie | – | Revokes current session |
| POST | `/auth/forgot-password` | – | `{email}` | Always 200 (no enumeration) |
| POST | `/auth/verify-reset-otp` | – | `{email,code}` | Returns short-lived `resetToken` |
| POST | `/auth/reset-password` | – | `{resetToken,password}` | Updates password, auto-login |
| GET | `/auth/verify` | Bearer | – | Current session |
| GET | `/auth/activity` | Bearer | – | Recent login activity |
| GET | `/auth/check-username/:username` | – | – | Availability |

Rate limits: login/register 10 / 15 min; OTP 20 / 15 min; forgot/resend 5 / hr.

## Profile & content
| Method | Endpoint | Auth | Notes |
|---|---|---|---|
| GET | `/profile/me` | Bearer | Own profile |
| PUT | `/profile/me` | Bearer | Multipart (profileImage, resume) |
| GET | `/profile/public/:username` | – | Public profile (`isSetup` flag) |

Each of `education, experience, projects, skills, achievements, activities`:
```
GET    /:resource/me                 (Bearer)  own items
GET    /:resource/public/:username    (–)       public items
POST   /:resource                     (Bearer)  create
PUT    /:resource/:id                 (Bearer)  update (ownership-scoped)
DELETE /:resource/:id                 (Bearer)  delete (ownership-scoped)
```

## Portfolio, tracking, contact, assistant
| Method | Endpoint | Auth | Notes |
|---|---|---|---|
| GET | `/portfolio/me/link` | Bearer | Shareable URL |
| GET | `/portfolio/:username/qrcode` | – | PNG QR code |
| POST | `/portfolio/:username/visit` | – | Record page view |
| POST | `/portfolio/:username/theme` | – | Record theme selection |
| POST | `/portfolio/:username/resume-download` | – | Record download |
| POST | `/portfolio/:username/contact` | – | `{name,email,message}` → emails owner |
| POST | `/portfolio/:username/assistant` | – | `{message,history}` → `{reply,mode}` |
| GET | `/portfolio/me/analytics` | Bearer | Visitor/device/referrer/theme stats + activity |
| GET | `/portfolio/me/messages` | Bearer | Contact messages |
| PATCH | `/portfolio/me/messages/:id/read` | Bearer | Mark read |
