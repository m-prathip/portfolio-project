const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  techStack: [{ type: String }],
  githubLink: { type: String },
  liveLink: { type: String },
  image: { type: String },
  featured: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
  problemSolved: { type: String, default: '' },
  businessImpact: { type: String, default: '' },
  keyFeatures: { type: String, default: '' },
  performanceScore: { type: Number, default: 99 },
  timeline: { type: String, default: '' },
  completionPercentage: { type: Number, default: 100 },
  status: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Projects', projectSchema);
