const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verifies the short-lived access token from the Authorization header,
// then confirms the user still exists and the token wasn't issued before
// the last password change (which invalidates old sessions).
const protect = async (req, res, next) => {
  try {
    const header = req.headers.authorization || '';
    if (!header.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }
    const token = header.split(' ')[1];

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }

    const user = await User.findById(decoded.id).select('email username role isVerified passwordChangedAt');
    if (!user) return res.status(401).json({ message: 'Account no longer exists' });
    if (!user.isVerified) return res.status(403).json({ message: 'Email not verified' });
    if (user.passwordChangedAfter(decoded.iat)) {
      return res.status(401).json({ message: 'Session expired, please sign in again' });
    }

    req.user = { id: user._id, email: user.email, username: user.username, role: user.role };
    next();
  } catch (err) {
    res.status(500).json({ message: 'Auth check failed' });
  }
};

// Restrict a route to a specific role (e.g. the hidden admin panel later).
const requireRole = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  next();
};

module.exports = { protect, requireRole };
