const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  credits: { type: Number, default: 0 },
  savedFeeds: [String],
  lastLoginBonus: {
    type: Date,
    default: null,
  },
});

module.exports = mongoose.model('User', userSchema);
