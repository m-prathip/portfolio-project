const router = require('express').Router();
const { protect } = require('../middleware/auth');
const resolveUser = require('../middleware/resolveUser');
const { getMyLink, getQRCode } = require('../controllers/portfolioController');

router.get('/me/link', protect, getMyLink);
router.get('/:username/qrcode', resolveUser, getQRCode);

module.exports = router;
