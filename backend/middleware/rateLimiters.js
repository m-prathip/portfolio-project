const rateLimit = require('express-rate-limit');

const json = (msg) => (req, res) => res.status(429).json({ message: msg });

// Login / register: protects against brute force & credential stuffing.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: json('Too many attempts. Please try again in a few minutes.')
});

// OTP verification: tighter, per-IP, to slow code-guessing.
const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  handler: json('Too many OTP attempts. Please wait and try again.')
});

// Forgot-password / resend: prevents email-bombing a victim.
const forgotLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: json('Too many requests. Please try again later.')
});

module.exports = { authLimiter, otpLimiter, forgotLimiter };
