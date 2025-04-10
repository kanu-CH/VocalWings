const mongoose = require('mongoose');

const tweetSchema = new mongoose.Schema({
  name: String,
  handle: String,
  text: String,
  createdAt: { type: Date, default: Date.now }
});

const Tweet = mongoose.model('Tweet', tweetSchema);

module.exports = Tweet;
