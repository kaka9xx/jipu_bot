// src/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  id: { type: Number, unique: true, required: true }, // Telegram chatId
  lang: { type: String, default: 'en' },
  points: { type: Number, default: 0 },
  replyMenu: { type: Boolean, default: false },
  coins: { type: Number, default: 100 },
  inventory: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
