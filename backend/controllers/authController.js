const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Otp = require('../models/Otp');
const LoginActivity = require('../models/LoginActivity');
const otpUtil = require('../utils/otp');
const tokenUtil = require('../utils/token');
const { parseUserAgent, getClientIp } = require('../utils/device');
const { sendMail, emails } = require('../utils/email');

const publicUser = (u) => ({
  id: u._id, email: u.email, username: u.username,
  role: u.role, isVerified: u.isVerified
});

// ── helpers ────────────────────────────────────────────
async function issueSession(user, req, res, { remember = false } = {}) {
  const { raw, hash } = tokenUtil.createRefreshToken(user._id);
  const { device } = parseUserAgent(req.headers['user-agent']);
  user.refreshTokens.push({
    tokenHash: hash,
    device,
    ip: getClientIp(req),
    userAgent: req.headers['user-agent'],
    expiresAt: tokenUtil.refreshExpiryDate(remember)
  });
  // keep at most 10 active sessions
  if (user.refreshTokens.length > 10) {
    user.refreshTokens = user.refreshTokens.slice(-10);
  }
  await user.save();
  res.cookie(tokenUtil.REFRESH_COOKIE, raw, tokenUtil.refreshCookieOptions(remember));
  return tokenUtil.signAccessToken(user);
}

async function createAndSendOtp({ user, email, purpose }) {
  const code = otpUtil.generateCode();
  await Otp.findOneAndUpdate(
    { email, purpose },
    {
      email,
      user: user?._id,
      codeHash: otpUtil.hashCode(code),
      purpose,
      attempts: 0,
      lastSentAt: new Date(),
      $inc: { resendCount: 1 },
      expiresAt: new Date(Date.now() + otpUtil.OTP_TTL_MS)
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  const tpl = purpose === 'verify' ? emails.verifyOtp(code) : emails.resetOtp(code);
  // Send email asynchronously so we don't block the API response
  sendMail({ to: email, ...tpl }).catch(e => console.error("OTP Mail Error:", e));
}

// ── REGISTER (creates an UNVERIFIED account + sends OTP) ─
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const cleanUsername = String(username).toLowerCase().trim();
    const cleanEmail = String(email).toLowerCase().trim();

    if (User.RESERVED_USERNAMES.includes(cleanUsername))
      return res.status(400).json({ message: 'That username is reserved, please choose another' });

    const existing = await User.findOne({ $or: [{ email: cleanEmail }, { username: cleanUsername }] });
    if (existing) {
      // If an unverified account exists, let them re-trigger verification.
      if (existing.email === cleanEmail && !existing.isVerified) {
        await createAndSendOtp({ user: existing, email: cleanEmail, purpose: 'verify' });
        return res.status(200).json({
          message: 'Account exists but is not verified. We sent a new code.',
          email: cleanEmail, requiresVerification: true
        });
      }
      const field = existing.username === cleanUsername ? 'Username' : 'Email';
      return res.status(400).json({ message: `${field} is already registered` });
    }

    const user = await User.create({
      username: cleanUsername,
      email: cleanEmail,
      password,
      isVerified: false
    });

    // Fire and forget the OTP sending to respond instantly
    createAndSendOtp({ user, email: cleanEmail, purpose: 'verify' })
      .catch(err => console.error('OTP EMAIL FAILED:', err));

    res.status(201).json({
      message: 'Account created. Check your email for a verification code.',
      email: cleanEmail,
      requiresVerification: true
    });
  } catch (error) {
    console.error('REGISTER ERROR:', error);

    res.status(500).json({
      message: error.message,
      stack: process.env.NODE_ENV !== 'production'
        ? error.stack
        : undefined
    });
  }
};

// ── VERIFY EMAIL OTP (activates account, logs the user in) ─
const verifyEmail = async (req, res) => {
  try {
    const email = String(req.body.email).toLowerCase().trim();
    const { code } = req.body;

    const otp = await Otp.findOne({ email, purpose: 'verify' });
    if (!otp || otp.expiresAt < new Date())
      return res.status(400).json({ message: 'Code expired or not found. Request a new one.' });
    if (otp.attempts >= otpUtil.MAX_ATTEMPTS)
      return res.status(429).json({ message: 'Too many incorrect attempts. Request a new code.' });

    if (!otpUtil.verifyCode(code, otp.codeHash)) {
      otp.attempts += 1;
      await otp.save();
      return res.status(400).json({ message: `Incorrect code. ${otpUtil.MAX_ATTEMPTS - otp.attempts} attempts left.` });
    }

    const user = await User.findOne({ email }).select('+refreshTokens');
    if (!user) return res.status(404).json({ message: 'Account not found' });

    user.isVerified = true;
    await Otp.deleteMany({ email });

    const accessToken = await issueSession(user, req, res); // saves user
    sendMail({ to: email, ...emails.welcome(user.username) }).catch(() => { });

    res.json({ message: 'Email verified', token: accessToken, user: publicUser(user) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── RESEND OTP (cooldown enforced) ─────────────────────
const resendOtp = async (req, res) => {
  try {
    const email = String(req.body.email).toLowerCase().trim();
    const purpose = req.body.purpose === 'reset' ? 'reset' : 'verify';

    const existing = await Otp.findOne({ email, purpose });
    if (existing) {
      const since = Date.now() - new Date(existing.lastSentAt).getTime();
      if (since < otpUtil.RESEND_COOLDOWN_MS) {
        const wait = Math.ceil((otpUtil.RESEND_COOLDOWN_MS - since) / 1000);
        return res.status(429).json({ message: `Please wait ${wait}s before requesting another code.`, retryAfter: wait });
      }
    }
    // Don't reveal whether the account exists for reset flow.
    const user = await User.findOne({ email });
    if (purpose === 'verify' && !user) return res.status(404).json({ message: 'Account not found' });
    if (user) await createAndSendOtp({ user, email, purpose });

    res.json({ message: 'A new code has been sent if the account exists.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── LOGIN ──────────────────────────────────────────────
const login = async (req, res) => {
  const { identifier, password, remember } = req.body;
  const ip = getClientIp(req);
  const { device, browser, os } = parseUserAgent(req.headers['user-agent']);
  const logBase = { ip, userAgent: req.headers['user-agent'], device, browser, os };

  try {
    const clean = String(identifier).toLowerCase().trim();
    const user = await User.findOne({ $or: [{ email: clean }, { username: clean }] })
      .select('+password +refreshTokens');

    if (!user || !(await user.matchPassword(password))) {
      LoginActivity.create({ ...logBase, email: clean, event: 'login_failed', reason: 'invalid_credentials' }).catch(() => {});
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!user.isVerified) {
      LoginActivity.create({ ...logBase, user: user._id, email: user.email, event: 'login_failed', reason: 'unverified' }).catch(() => {});
      await createAndSendOtp({ user, email: user.email, purpose: 'verify' }).catch(() => { });
      return res.status(403).json({ message: 'Please verify your email first. We sent you a new code.', email: user.email, requiresVerification: true });
    }

    // New-device detection: have we seen a successful login from this device before?
    const seen = await LoginActivity.findOne({ user: user._id, event: 'login_success', device });
    if (!seen) {
      LoginActivity.create({ ...logBase, user: user._id, email: user.email, event: 'new_device' }).catch(() => {});
      sendMail({ to: user.email, ...emails.loginAlert(device, ip, new Date().toUTCString()) }).catch(() => { });
    }

    user.lastLoginAt = new Date();
    const accessToken = await issueSession(user, req, res, { remember: !!remember });
    LoginActivity.create({ ...logBase, user: user._id, email: user.email, event: 'login_success' }).catch(() => {});

    res.json({ token: accessToken, user: publicUser(user) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── REFRESH (rotates the refresh token) ────────────────
const refresh = async (req, res) => {
  try {
    const raw = req.cookies?.[tokenUtil.REFRESH_COOKIE];
    if (!raw) return res.status(401).json({ message: 'No refresh token' });

    const userId = tokenUtil.refreshUserId(raw);
    const hash = tokenUtil.hashRefreshToken(raw);
    const user = await User.findById(userId).select('+refreshTokens');
    if (!user) return res.status(401).json({ message: 'Invalid session' });

    const idx = user.refreshTokens.findIndex((t) => t.tokenHash === hash);
    if (idx === -1) {
      // Token reuse / unknown → revoke all sessions defensively.
      user.refreshTokens = [];
      await user.save();
      res.clearCookie(tokenUtil.REFRESH_COOKIE, tokenUtil.clearCookieOptions());
      return res.status(401).json({ message: 'Session invalid, please sign in again' });
    }
    if (user.refreshTokens[idx].expiresAt < new Date()) {
      user.refreshTokens.splice(idx, 1);
      await user.save();
      return res.status(401).json({ message: 'Session expired' });
    }

    // Rotate: remove old, issue new.
    user.refreshTokens.splice(idx, 1);
    const accessToken = await issueSession(user, req, res);
    res.json({ token: accessToken, user: publicUser(user) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── LOGOUT (revokes this session) ──────────────────────
const logout = async (req, res) => {
  try {
    const raw = req.cookies?.[tokenUtil.REFRESH_COOKIE];
    if (raw) {
      const userId = tokenUtil.refreshUserId(raw);
      const hash = tokenUtil.hashRefreshToken(raw);
      const user = await User.findById(userId).select('+refreshTokens');
      if (user) {
        user.refreshTokens = user.refreshTokens.filter((t) => t.tokenHash !== hash);
        await user.save();
        LoginActivity.create({ user: user._id, email: user.email, event: 'logout', ip: getClientIp(req) }).catch(() => {});
      }
    }
    res.clearCookie(tokenUtil.REFRESH_COOKIE, tokenUtil.clearCookieOptions());
    res.json({ message: 'Logged out' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── FORGOT PASSWORD (always 200 — no user enumeration) ──
const forgotPassword = async (req, res) => {
  try {
    const email = String(req.body.email).toLowerCase().trim();
    const user = await User.findOne({ email });
    if (user) {
      await createAndSendOtp({ user, email, purpose: 'reset' });
      LoginActivity.create({ user: user._id, email, event: 'password_reset', reason: 'requested', ip: getClientIp(req) }).catch(() => {});
    }
    res.json({ message: 'If that email is registered, a reset code has been sent.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── VERIFY RESET OTP → short-lived reset token ─────────
const verifyResetOtp = async (req, res) => {
  try {
    const email = String(req.body.email).toLowerCase().trim();
    const { code } = req.body;

    const otp = await Otp.findOne({ email, purpose: 'reset' });
    if (!otp || otp.expiresAt < new Date())
      return res.status(400).json({ message: 'Code expired or not found. Request a new one.' });
    if (otp.attempts >= otpUtil.MAX_ATTEMPTS)
      return res.status(429).json({ message: 'Too many incorrect attempts. Request a new code.' });

    if (!otpUtil.verifyCode(code, otp.codeHash)) {
      otp.attempts += 1;
      await otp.save();
      return res.status(400).json({ message: `Incorrect code. ${otpUtil.MAX_ATTEMPTS - otp.attempts} attempts left.` });
    }

    // Issue a one-purpose, short-lived token authorising the actual reset.
    const resetToken = jwt.sign({ email, purpose: 'reset' }, process.env.JWT_SECRET, { expiresIn: '10m' });
    await Otp.deleteMany({ email, purpose: 'reset' });
    res.json({ message: 'Code verified', resetToken });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── RESET PASSWORD (auto-login on success) ─────────────
const resetPassword = async (req, res) => {
  try {
    const { resetToken, password } = req.body;
    let decoded;
    try {
      decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    } catch {
      return res.status(400).json({ message: 'Reset link expired. Please start over.' });
    }
    if (decoded.purpose !== 'reset') return res.status(400).json({ message: 'Invalid reset token' });

    const user = await User.findOne({ email: decoded.email }).select('+password +refreshTokens');
    if (!user) return res.status(404).json({ message: 'Account not found' });

    user.password = password;          // pre-save hook hashes + sets passwordChangedAt
    user.isVerified = true;            // resetting proves email ownership
    user.refreshTokens = [];           // revoke all existing sessions
    await user.save();

    const accessToken = await issueSession(user, req, res); // fresh session (auto-login)
    LoginActivity.create({ user: user._id, email: user.email, event: 'password_reset', reason: 'completed', ip: getClientIp(req) }).catch(() => {});
    sendMail({ to: user.email, ...emails.passwordChanged() }).catch(() => { });

    res.json({ message: 'Password updated', token: accessToken, user: publicUser(user) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── username availability (unchanged behaviour) ────────
const checkUsername = async (req, res) => {
  try {
    const cleanUsername = String(req.params.username).toLowerCase().trim();
    if (!User.USERNAME_REGEX.test(cleanUsername))
      return res.json({ available: false, reason: 'Use 3-30 lowercase letters, numbers, and hyphens' });
    if (User.RESERVED_USERNAMES.includes(cleanUsername))
      return res.json({ available: false, reason: 'This username is reserved' });
    const existing = await User.findOne({ username: cleanUsername });
    res.json({ available: !existing, reason: existing ? 'Already taken' : undefined });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── current session ────────────────────────────────────
const verify = (req, res) => res.json({ valid: true, user: req.user });

// ── login activity for the logged-in user ─────────────
const myActivity = async (req, res) => {
  try {
    const items = await LoginActivity.find({ user: req.user.id }).sort('-createdAt').limit(20);
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  register, verifyEmail, resendOtp, login, refresh, logout,
  forgotPassword, verifyResetOtp, resetPassword,
  checkUsername, verify, myActivity
};
