const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

const publicUser = (user) => ({ id: user._id, email: user.email, username: user.username });

// @desc    Register a new account — every account gets its own portfolio
//          at /u/:username, so this replaces the old single-admin setup.
// @route   POST /api/auth/register
const register = async (req, res) => {
  try {
    const { email, password, username } = req.body;
    if (!email || !password || !username)
      return res.status(400).json({ message: 'Username, email and password are required' });
    if (password.length < 6)
      return res.status(400).json({ message: 'Password must be at least 6 characters' });

    const cleanUsername = username.toLowerCase().trim();

    if (!User.USERNAME_REGEX.test(cleanUsername))
      return res.status(400).json({ message: 'Username must be 3-30 characters: lowercase letters, numbers, and hyphens only' });
    if (User.RESERVED_USERNAMES.includes(cleanUsername))
      return res.status(400).json({ message: 'That username is reserved, please choose another' });

    const existing = await User.findOne({ $or: [{ email: email.toLowerCase() }, { username: cleanUsername }] });
    if (existing) {
      const message = existing.username === cleanUsername ? 'Username is already taken' : 'Email is already registered';
      return res.status(400).json({ message });
    }

    const user = await User.create({ email, password, username: cleanUsername });
    res.status(201).json({ token: generateToken(user), user: publicUser(user) });
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern || {})[0] || 'Field';
      return res.status(400).json({ message: `That ${field} is already taken` });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login with either email or username
// @route   POST /api/auth/login
const login = async (req, res) => {
  const { identifier, password } = req.body;
  try {
    if (!identifier || !password)
      return res.status(400).json({ message: 'Please provide your email/username and password' });

    const clean = identifier.toLowerCase().trim();
    const user = await User.findOne({ $or: [{ email: clean }, { username: clean }] });
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: 'Invalid credentials' });

    res.json({ token: generateToken(user), user: publicUser(user) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Check whether a username is still available, used for live
//          feedback on the signup form.
// @route   GET /api/auth/check-username/:username
const checkUsername = async (req, res) => {
  try {
    const cleanUsername = req.params.username.toLowerCase().trim();
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

// @desc    Verify token / fetch current session
// @route   GET /api/auth/verify
const verify = (req, res) => {
  res.json({ valid: true, user: req.user });
};

module.exports = { register, login, checkUsername, verify };
