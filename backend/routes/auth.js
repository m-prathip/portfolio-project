const router = require('express').Router();
const { register, login, checkUsername, verify } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/check-username/:username', checkUsername);
router.get('/verify', protect, verify);

module.exports = router;
