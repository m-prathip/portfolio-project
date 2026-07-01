const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name: { type: String, required: true },
  level: { type: Number, required: true, min: 0, max: 100 },
  category: { type: String, default: 'General' },
  order: { type: Number, default: 0 },
  yearsOfExperience: { type: String, default: '' },
  projectsCount: { type: String, default: '' },
  keyAreas: { type: String, default: '' },
  proficiencyLevel: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Skills', skillSchema);
