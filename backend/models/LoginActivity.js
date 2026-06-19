const mongoose = require('mongoose');

// Audit log of every login attempt (success and failure) plus password
// resets. Powers "login activity tracking", device recognition and the
// security/admin analytics in later batches.
const loginActivitySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  email: { type: String, lowercase: true, index: true },
  event: {
    type: String,
    enum: ['login_success', 'login_failed', 'logout', 'password_reset', 'new_device'],
    required: true
  },
  ip: { type: String },
  userAgent: { type: String },
  device: { type: String },
  browser: { type: String },
  os: { type: String },
  reason: { type: String } // e.g. "invalid_password", "unverified"
}, { timestamps: true });

module.exports = mongoose.model('LoginActivity', loginActivitySchema);
