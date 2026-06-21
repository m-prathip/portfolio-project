const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Words that can't be used as a username because they'd clash with
// publisher routes or are otherwise misleading as a personal handle.
const RESERVED_USERNAMES = [
  'admin', 'administrator', 'api', 'app', 'auth', 'login', 'logout',
  'signup', 'signin', 'register', 'settings', 'dashboard', 'support',
  'help', 'about', 'contact', 'portfolio', 'portfolios', 'public',
  'static', 'assets', 'root', 'null', 'undefined', 'me', 'user', 'users',
  'u', 'www', 'mail', 'ftp', 'share', 'verify', 'reset', 'forgot'
];

// 3-30 characters, lowercase letters/numbers/hyphens, can't start or end
// with a hyphen. Shows up in every user's portfolio URL: /u/<username>
const USERNAME_REGEX = /^[a-z0-9][a-z0-9-]{1,28}[a-z0-9]$/;

// Strong password policy: min 8 chars, at least one lowercase, one
// uppercase, one digit and one special character.
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
const PASSWORD_MESSAGE =
  'Password must be at least 8 characters and include uppercase, lowercase, a number and a special character';

// A stored (hashed) refresh token. We never store the raw refresh token —
// only its SHA-256 hash — so a DB leak can't be used to mint sessions.
const refreshTokenSchema = new mongoose.Schema({
  tokenHash: { type: String, required: true },
  device: { type: String },
  ip: { type: String },
  userAgent: { type: String },
  expiresAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now }
}, { _id: true });

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [USERNAME_REGEX, 'Username must be 3-30 characters: lowercase letters, numbers, and hyphens only']
  },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  // select:false → password is never returned unless explicitly asked for
  // with .select('+password'). Prevents accidental hash leakage.
  password: { type: String, required: true, minlength: 8, select: false },

  // Account is inactive until the email is verified via OTP.
  isVerified: { type: Boolean, default: false },

  role: { type: String, enum: ['user', 'admin'], default: 'user' },

  // Active sessions (rotating refresh tokens). Revoking = pulling an entry.
  refreshTokens: { type: [refreshTokenSchema], default: [], select: false },

  // Used to invalidate access tokens issued before a password change.
  passwordChangedAt: { type: Date },
  lastLoginAt: { type: Date }
}, { timestamps: true });

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  if (!this.isNew) this.passwordChangedAt = new Date();
  next();
});

userSchema.methods.matchPassword = async function (entered) {
  return bcrypt.compare(entered, this.password);
};

// True if the token was issued before the password was last changed.
userSchema.methods.passwordChangedAfter = function (tokenIssuedAtSec) {
  if (!this.passwordChangedAt) return false;
  return Math.floor(this.passwordChangedAt.getTime() / 1000) > tokenIssuedAtSec;
};

const User = mongoose.model('User', userSchema);

User.RESERVED_USERNAMES = RESERVED_USERNAMES;
User.USERNAME_REGEX = USERNAME_REGEX;
User.PASSWORD_REGEX = PASSWORD_REGEX;
User.PASSWORD_MESSAGE = PASSWORD_MESSAGE;

module.exports = User;
