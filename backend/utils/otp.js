const crypto = require('crypto');

const PEPPER = process.env.OTP_PEPPER || process.env.JWT_SECRET || 'dev-pepper';
const OTP_TTL_MS = 5 * 60 * 1000;       // 5 minutes
const MAX_ATTEMPTS = 5;                  // wrong-code attempts before lockout
const RESEND_COOLDOWN_MS = 60 * 1000;    // 60s between sends

// 6-digit numeric code, generated with a CSPRNG.
const generateCode = () => crypto.randomInt(0, 1_000_000).toString().padStart(6, '0');

// Codes are stored hashed (salted with a server-side pepper) so a DB leak
// can't reveal valid OTPs.
const hashCode = (code) =>
  crypto.createHmac('sha256', PEPPER).update(String(code)).digest('hex');

const verifyCode = (code, hash) => {
  const candidate = hashCode(code);
  // constant-time compare
  const a = Buffer.from(candidate);
  const b = Buffer.from(hash);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
};

module.exports = {
  generateCode,
  hashCode,
  verifyCode,
  OTP_TTL_MS,
  MAX_ATTEMPTS,
  RESEND_COOLDOWN_MS
};
