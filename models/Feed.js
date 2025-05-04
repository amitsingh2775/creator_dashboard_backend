const mongoose = require('mongoose');

const feedSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  title: String,
  link: String,
  source: String,
  preview: String, 
  reported: { type: Boolean, default: false },
});

module.exports = mongoose.model('Feed', feedSchema);
