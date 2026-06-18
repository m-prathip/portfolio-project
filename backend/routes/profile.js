const router = require('express').Router();
const { getMyProfile, updateMyProfile, getPublicProfile } = require('../controllers/profileController');
const { protect } = require('../middleware/auth');
const resolveUser = require('../middleware/resolveUser');
const upload = require('../middleware/upload');

router.get('/me', protect, getMyProfile);
router.put('/me', protect, upload.fields([
  { name: 'profileImage', maxCount: 1 },
  { name: 'resume', maxCount: 1 }
]), updateMyProfile);
router.get('/public/:username', resolveUser, getPublicProfile);

module.exports = router;
