const mongoose = require('mongoose');

// One-time passwords for email verification and password reset.
// The raw 6-digit code is NEVER stored — only a salted SHA-256 hash.
// Documents auto-delete at expiresAt via a TTL index.
const otpSchema = new mongoose.Schema({
  email: { type: String, required: true, lowercase: true, trim: true, index: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  codeHash: { type: String, required: true },
  purpose: { type: String, enum: ['verify', 'reset'], required: true },

  attempts: { type: Number, default: 0 },   // wrong-code attempts (cap 5)
  resendCount: { type: Number, default: 0 }, // how many times resent
  lastSentAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true }
}, { timestamps: true });

// TTL: Mongo removes the doc once expiresAt is in the past.
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
otpSchema.index({ email: 1, purpose: 1 });

module.exports = mongoose.model('Otp', otpSchema);
