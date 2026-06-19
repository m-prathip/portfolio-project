const QRCode = require('qrcode');

// The link encoded in the QR code points at the FRONTEND app (where
// /u/:username is actually rendered), not at this API.
const FRONTEND_URL = (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/$/, '');

const buildPortfolioUrl = (username) => `${FRONTEND_URL}/u/${username}`;

// @desc   Get the logged-in user's shareable portfolio link
// @route  GET /api/portfolio/me/link
const getMyLink = (req, res) => {
  res.json({ username: req.user.username, url: buildPortfolioUrl(req.user.username) });
};

// @desc   Get a scannable PNG QR code that opens a user's portfolio.
//         Public + hotlinkable on purpose, so it can be dropped into a
//         resume, slide, or printed card as a plain <img>/download link.
// @route  GET /api/portfolio/:username/qrcode
const getQRCode = (req, res) => {
  const url = buildPortfolioUrl(req.portfolioUser.username);
  QRCode.toBuffer(url, {
    type: 'png',
    width: 480,
    margin: 2,
    color: { dark: '#111827', light: '#ffffff' }
  }, (err, buffer) => {
    if (err) {
      console.error('QR generation error:', err.message);
      return res.status(500).json({ message: 'Failed to generate QR code' });
    }
    res.set('Content-Type', 'image/png');
    res.set('Cache-Control', 'no-cache');
    res.send(buffer);
  });
};

module.exports = { getMyLink, getQRCode, buildPortfolioUrl };
