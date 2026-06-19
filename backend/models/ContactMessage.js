const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  message: { type: String, required: true },
  ip: { type: String },
  read: { type: Boolean, default: false }
}, { timestamps: true });

contactSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('ContactMessage', contactSchema);
