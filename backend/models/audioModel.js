const mongoose = require('mongoose');

const audioSchema = new mongoose.Schema({
  fileName: String,
  classification: String,
  uploadDate: { type: Date, default: Date.now },
});

const Audio = mongoose.model('Audio', audioSchema);

module.exports = Audio;
