const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const ACCESS_TTL = process.env.ACCESS_TOKEN_TTL || '15m';
const REFRESH_DAYS = Number(process.env.REFRESH_TOKEN_TTL_DAYS || 7);
const REMEMBER_DAYS = Number(process.env.REMEMBER_ME_TTL_DAYS || 30);
const REFRESH_COOKIE = 'refreshToken';

// Short-lived access token (sent in the JSON body, held in memory by the SPA).
const signAccessToken = (user) =>
  jwt.sign(
    { id: user._id, email: user.email, username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: ACCESS_TTL }
  );

// Opaque refresh token of the form "<userId>.<random>". Only its hash is
// stored server-side; the raw value lives only in the httpOnly cookie.
const createRefreshToken = (userId) => {
  const raw = `${userId}.${crypto.randomBytes(48).toString('hex')}`;
  const hash = crypto.createHash('sha256').update(raw).digest('hex');
  return { raw, hash };
};

const hashRefreshToken = (raw) =>
  crypto.createHash('sha256').update(raw).digest('hex');

const refreshUserId = (raw) => String(raw || '').split('.')[0];

const refreshCookieOptions = (remember = false) => {
  const days = remember ? REMEMBER_DAYS : REFRESH_DAYS;
  return {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === 'true',
    sameSite: process.env.COOKIE_SECURE === 'true' ? 'none' : 'lax',
    domain: process.env.COOKIE_DOMAIN || undefined,
    path: '/api/auth',
    maxAge: days * 24 * 60 * 60 * 1000
  };
};

// Options for clearing the cookie — same path/domain but no maxAge
// (Express deprecates passing maxAge to clearCookie).
const clearCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.COOKIE_SECURE === 'true',
  sameSite: process.env.COOKIE_SECURE === 'true' ? 'none' : 'lax',
  domain: process.env.COOKIE_DOMAIN || undefined,
  path: '/api/auth'
});

const refreshExpiryDate = (remember = false) => {
  const days = remember ? REMEMBER_DAYS : REFRESH_DAYS;
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
};

module.exports = {
  signAccessToken,
  createRefreshToken,
  hashRefreshToken,
  refreshUserId,
  refreshCookieOptions,
  clearCookieOptions,
  refreshExpiryDate,
  REFRESH_COOKIE
};
