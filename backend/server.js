const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const dotenv = require('dotenv');
const path = require('path');

const connectDB = require('./config/db');

dotenv.config();
console.log("SMTP_HOST =", process.env.SMTP_HOST);
console.log("SMTP_PORT =", process.env.SMTP_PORT);
console.log("SMTP_USER =", process.env.SMTP_USER);
console.log("SMTP_PASS exists =", !!process.env.SMTP_PASS);
console.log("EMAIL_FROM =", process.env.EMAIL_FROM);

const app = express();

// Behind a proxy (Render/Vercel/Heroku) so secure cookies + rate-limit
// see the real client IP and protocol.
app.set('trust proxy', 1);

// ─── Security headers ──────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' } // allow /uploads to be embedded by the frontend origin
}));

// ─── CORS (fixed) ──────────────────────────────────────
// The old config used origin '*' WITH credentials:true, which is invalid
// and insecure. We now allow only the known frontend origin(s) and only
// then enable credentials (needed for the refresh-token cookie).
const allowedOrigins = (process.env.FRONTEND_URL || 'https://portfolio-project-prathip.vercel.app')
  .split(',')
  .map((o) => o.trim().replace(/\/$/, ''));

app.use(cors({
  origin: (origin, cb) => {
    // Allow same-origin / curl / server-to-server (no Origin header)
    if (!origin) return cb(null, true);
    if (allowedOrigins.includes(origin.replace(/\/$/, ''))) return cb(null, true);
    return cb(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

// ─── Body parsing & sanitization ───────────────────────
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cookieParser());
app.use(mongoSanitize()); // strips $ and . from keys → blocks NoSQL injection

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─── Routes ────────────────────────────────────────────
app.use('/api/auth', require('./routes/auth'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/education', require('./routes/education'));
app.use('/api/experience', require('./routes/experience'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/skills', require('./routes/skills'));
app.use('/api/achievements', require('./routes/achievements'));
app.use('/api/activities', require('./routes/activities'));
app.use('/api/portfolio', require('./routes/portfolio'));

// Health check
app.get('/', (req, res) => res.json({ message: 'Portfolio API is running!' }));

// ─── 404 ───────────────────────────────────────────────
app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

// ─── Error handler (no internal leakage in production) ──
app.use((err, req, res, next) => {
  const status = err.status || 500;
  if (status >= 500) console.error(err.stack);
  const isProd = process.env.NODE_ENV === 'production';
  res.status(status).json({
    message: status >= 500 && isProd ? 'Something went wrong' : err.message
  });
});

const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

module.exports = app;
