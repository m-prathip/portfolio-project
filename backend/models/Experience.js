const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  company: { type: String, required: true },
  role: { type: String, required: true },
  duration: { type: String, required: true },
  description: { type: String, required: true },
  order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Experience', experienceSchema);
