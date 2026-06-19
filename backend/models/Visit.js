const mongoose = require('mongoose');

// A single page view on a public /u/:username portfolio.
const visitSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  path: { type: String },
  referrer: { type: String },
  ip: { type: String },
  device: { type: String },
  browser: { type: String },
  os: { type: String }
}, { timestamps: true });

visitSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Visit', visitSchema);
