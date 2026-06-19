# 🚀 Full-Stack Multi-User Portfolio publisher

A modern, responsive full-stack portfolio builder. Anyone can sign up, build their
portfolio from an admin dashboard, and instantly get **their own shareable link and
QR code** — e.g. `yourapp.com/u/jane-doe` — to put on a resume, LinkedIn, or business card.

> **Note on this version:** this app was converted from a single-admin template (one
> hardcoded portfolio) into a true multi-user publisher (every account gets its own
> portfolio, scoped and isolated from everyone else's). If you're upgrading from the
> single-admin version, see [Migrating from the single-admin version](#-migrating-from-the-single-admin-version) below —
> this is a breaking change to the data model and auth flow.

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite + Tailwind CSS |
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT (each user owns their own content) |
| QR Codes | `qrcode` (generated server-side as PNG) |
| Deploy | Vercel (frontend) + Render (backend) + MongoDB Atlas |

---

## 📁 Project Structure

```
portfolio-project/
├── frontend/          # React + Vite app
│   └── src/
│       ├── components/
│       │   ├── admin/      # AdminCRUD reusable component
│       │   ├── common/     # Spinner, Section, ProtectedRoute
│       │   └── layout/     # Navbar, Footer (username-aware)
│       ├── context/        # ThemeContext, AuthContext
│       ├── pages/
│       │   ├── Landing.jsx     # publisher homepage ("/")
│       │   ├── PortfolioLayout.jsx  # Resolves /u/:username, handles not-found/not-setup
│       │   ├── Home.jsx        # Rendered inside PortfolioLayout
│       │   ├── Education.jsx
│       │   ├── Projects.jsx
│       │   ├── NotFound.jsx
│       │   └── admin/      # Login, Signup, Dashboard, Profile, Share, Sections
│       └── services/
│           └── api.js      # Axios layer — getMine() vs getPublic(username) per resource
└── backend/           # Express API
    ├── controllers/   # authController, profileController, crudController, portfolioController
    ├── middleware/    # auth.js (JWT), resolveUser.js (:username → account), upload.js
    ├── models/        # User.js + all content schemas (each owns a `user` ref)
    ├── routes/        # All API routes, incl. routes/portfolio.js (link + QR code)
    └── server.js
```

---

## ⚡ Quick Start (Local)

### 1. Setup Backend

```bash
cd portfolio-project/backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI, JWT secret, and FRONTEND_URL
npm run dev
```

### 2. Setup Frontend

```bash
cd portfolio-project/frontend
npm install
cp .env.example .env
# Set VITE_API_URL=http://localhost:5000
npm run dev
```

### 3. Create an account

There's no separate "admin setup" step anymore — anyone can create an account:

1. Visit `http://localhost:5173/admin/signup`
2. Pick a username (this becomes your permanent portfolio URL), email, and password
3. You're redirected straight to **Share Your Portfolio**, showing your link and QR code

Visit `http://localhost:5173` for the publisher homepage, `http://localhost:5173/u/<username>`
for any published portfolio, and `http://localhost:5173/admin` for the dashboard.

---

## 🌐 API Reference

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create an account (username + email + password) → JWT |
| POST | `/api/auth/login` | Login with email **or** username → JWT |
| GET | `/api/auth/check-username/:username` | Live availability check used on the signup form |
| GET | `/api/auth/verify` | Verify token / fetch current session |

### Content resources
Education, Experience, Projects, Skills, Achievements, and Activities all share the same shape at `/api/<resource>`:

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/<resource>/me` | required | The logged-in user's own items (dashboard) |
| GET | `/api/<resource>/public/:username` | none | That user's items, for their public portfolio |
| POST | `/api/<resource>` | required | Create an item (owner is the logged-in user) |
| PUT | `/api/<resource>/:id` | required | Update an item you own |
| DELETE | `/api/<resource>/:id` | required | Delete an item you own |

Profile follows the same pattern at `/api/profile/me` (GET/PUT) and `/api/profile/public/:username` (GET).

### Sharing — link & QR code
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/portfolio/me/link` | required | `{ username, url }` for the logged-in user |
| GET | `/api/portfolio/:username/qrcode` | none | Streams a PNG QR code that opens that user's portfolio. Public and hotlinkable — safe to use directly as an `<img src>` |

Protected routes require an `Authorization: Bearer <token>` header. Ownership is always
enforced server-side (by the authenticated user's id), so nobody can read, edit, or
delete another account's data even if they guess an id.

---

## 🔗 How sharing works

Every account gets a permanent portfolio at `/u/<username>` (chosen at signup, lowercase
letters/numbers/hyphens, 3-30 characters). The **Share** page in the dashboard
(`/admin/share`) shows that link with a one-click copy button, plus a QR code rendered by
the backend that points straight at it — useful as a downloadable PNG for resumes,
slides, or printed cards. Visiting an unknown username shows a friendly "not found" page;
visiting a real account that hasn't filled in their profile yet shows a "still under
construction" page instead of a broken-looking empty portfolio.

---

## 🔁 Migrating from the single-admin version

This update replaces the single `Admin` model with a `User` model (every account has a
unique `username`), and every content schema (`Profile`, `Education`, `Experience`,
`Projects`, `Skills`, `Achievements`, `Activities`) now requires a `user` reference field
for ownership. If you have existing data in MongoDB from the old single-admin version:

1. It was tied to one implicit admin with no `user` field — back it up first.
2. Create a new account via `/admin/signup` to get a real `User` document and id.
3. Either re-enter the old content through the dashboard, or run a one-off script that
   sets `user: <newUserId>` on every existing document in each collection.

There's intentionally no auto-migration script included, since assuming who the "one"
old admin should map to isn't safe to do automatically.

---

## 🚢 Deployment

### Backend → Render

1. Push `backend/` to GitHub
2. Create a new **Web Service** on [render.com](https://render.com)
3. Set **Build Command**: `npm install`
4. Set **Start Command**: `node server.js`
5. Add environment variables:
   ```
   MONGO_URI=mongodb+srv://...
   JWT_SECRET=your_secret_here
   NODE_ENV=production
   FRONTEND_URL=https://your-app.vercel.app
   ```
   `FRONTEND_URL` must exactly match your deployed frontend (no trailing slash) — it's
   used for CORS **and** to build every user's share link and QR code, so a mismatch
   here means QR codes will point to the wrong place.

### Frontend → Vercel

1. Push `frontend/` to GitHub
2. Import to [vercel.com](https://vercel.com)
3. Framework: **Vite**
4. Add environment variable:
   ```
   VITE_API_URL=https://your-api.onrender.com
   ```
5. Deploy!

### Database → MongoDB Atlas

1. Create free cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a database user
3. Whitelist `0.0.0.0/0` (or Render's IPs)
4. Copy the connection string to `MONGO_URI`

---

## 🔑 Environment Variables

**Backend `.env`**
```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/portfolio
JWT_SECRET=super_secret_random_string_here
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

**Frontend `.env`**
```env
VITE_API_URL=http://localhost:5000
```

---

## ✨ Features

- **Multi-user accounts** — anyone can sign up and get an isolated, fully-owned portfolio
- **Shareable link & downloadable QR code** for every account (`/admin/share`)
- **Permanent username-based URLs**: `yourapp.com/u/<username>`
- **Admin dashboard** with full CRUD for every section, scoped to the logged-in user
- **Dark/Light mode** with system preference detection
- **JWT authentication**, ownership-checked on every read/write
- **Image & PDF upload** support (Multer)
- **Search & filter** on the projects page
- **Scroll animations** on all sections
- **Responsive** — mobile-first design
- **Toast notifications** for all actions

---

## 🧑‍💻 VS Code Setup

Install these extensions:
- **ESLint** — linting
- **Prettier** — formatting
- **Tailwind CSS IntelliSense** — class autocomplete
- **ES7+ React snippets** — component shortcuts
- **MongoDB for VS Code** — database explorer
- **REST Client** — test APIs without Postman

---

## 📜 License

MIT — free to use and modify.
