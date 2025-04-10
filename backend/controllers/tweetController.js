const Tweet = require('../models/tweetModel');

exports.createTweet = async (req, res) => {
  try {
    const { name, handle, text } = req.body;
    const newTweet = new Tweet({ name, handle, text });
    await newTweet.save();
    res.status(201).json(newTweet);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getTweets = async (req, res) => {
  try {
    const tweets = await Tweet.find().sort({ createdAt: -1 }).limit(10); // Fetch recent tweets
    res.status(200).json(tweets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
