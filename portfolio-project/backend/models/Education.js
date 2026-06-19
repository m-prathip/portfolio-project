const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  college: { type: String, required: true },
  degree: { type: String, required: true },
  department: { type: String, required: true },
  cgpa: { type: String },
  graduationYear: { type: String, required: true },
  order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Education', educationSchema);
