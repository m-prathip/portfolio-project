const User = require('../models/User');

// Resolves the :username route param to a real account and attaches the
// minimal info needed (id + username) as req.portfolioUser. Every public
// "view someone's portfolio" route uses this first, so a request for a
// username that was never registered cleanly 404s instead of returning
// an empty/misleading portfolio.
const resolveUser = async (req, res, next) => {
  try {
    const username = (req.params.username || '').toLowerCase().trim();
    const user = await User.findOne({ username }).select('_id username');
    if (!user) return res.status(404).json({ message: 'Portfolio not found' });
    req.portfolioUser = user;
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = resolveUser;
