const router = require('express').Router();
const { body, param } = require('express-validator');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/auth');
const { authLimiter, otpLimiter, forgotLimiter } = require('../middleware/rateLimiters');
const User = require('../models/User');
const ctrl = require('../controllers/authController');

// ── validators ─────────────────────────────────────────
const emailRule = body('email').isEmail().withMessage('A valid email is required').normalizeEmail();
const codeRule = body('code').isLength({ min: 6, max: 6 }).withMessage('Enter the 6-digit code').isNumeric();
const passwordRule = body('password')
  .matches(User.PASSWORD_REGEX).withMessage(User.PASSWORD_MESSAGE);

const registerRules = [
  body('username').trim().toLowerCase()
    .matches(User.USERNAME_REGEX)
    .withMessage('Username must be 3-30 chars: lowercase letters, numbers, hyphens'),
  emailRule,
  passwordRule
];

const loginRules = [
  body('identifier').trim().notEmpty().withMessage('Email or username is required'),
  body('password').notEmpty().withMessage('Password is required')
];

// ── routes ──────────────────────────────────────────────
router.post('/register', authLimiter, registerRules, validate, ctrl.register);
router.post('/verify-email', otpLimiter, [emailRule, codeRule], validate, ctrl.verifyEmail);
router.post('/resend-otp', forgotLimiter, [emailRule], validate, ctrl.resendOtp);

router.post('/login', authLimiter, loginRules, validate, ctrl.login);
router.post('/refresh', ctrl.refresh);
router.post('/logout', ctrl.logout);

router.post('/forgot-password', forgotLimiter, [emailRule], validate, ctrl.forgotPassword);
router.post('/verify-reset-otp', otpLimiter, [emailRule, codeRule], validate, ctrl.verifyResetOtp);
router.post('/reset-password', [body('resetToken').notEmpty(), passwordRule], validate, ctrl.resetPassword);

router.get('/check-username/:username', param('username').trim(), ctrl.checkUsername);
router.get('/verify', protect, ctrl.verify);
router.get('/activity', protect, ctrl.myActivity);

module.exports = router;
