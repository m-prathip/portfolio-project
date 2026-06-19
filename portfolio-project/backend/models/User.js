const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Words that can't be used as a username because they'd clash with
// platform routes or are otherwise misleading as a personal handle.
const RESERVED_USERNAMES = [
  'admin', 'administrator', 'api', 'app', 'auth', 'login', 'logout',
  'signup', 'signin', 'register', 'settings', 'dashboard', 'support',
  'help', 'about', 'contact', 'portfolio', 'portfolios', 'public',
  'static', 'assets', 'root', 'null', 'undefined', 'me', 'user', 'users',
  'u', 'www', 'mail', 'ftp', 'share'
];

// 3-30 characters, lowercase letters/numbers/hyphens, can't start or end
// with a hyphen. This is what shows up in every user's portfolio URL:
// yourapp.com/u/<username>
const USERNAME_REGEX = /^[a-z0-9][a-z0-9-]{1,28}[a-z0-9]$/;

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
  password: { type: String, required: true, minlength: 6 }
}, { timestamps: true });

// Hash password before save
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

// Attached as static helpers so auth/validation logic in controllers and
// (mirrored) on the frontend stays in sync with the schema rule.
User.RESERVED_USERNAMES = RESERVED_USERNAMES;
User.USERNAME_REGEX = USERNAME_REGEX;

module.exports = User;
