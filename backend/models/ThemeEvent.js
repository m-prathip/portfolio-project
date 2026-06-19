const mongoose = require('mongoose');

// Records which theme a visitor selected on a portfolio (theme analytics).
const themeEventSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  theme: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('ThemeEvent', themeEventSchema);
