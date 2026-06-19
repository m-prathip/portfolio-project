const mongoose = require('mongoose');

const resumeDownloadSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  ip: { type: String },
  device: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('ResumeDownload', resumeDownloadSchema);
