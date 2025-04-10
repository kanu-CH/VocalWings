const express = require('express');
const { createTweet, getTweets } = require('../controllers/tweetController');
const router = express.Router();

router.post('/tweet', createTweet);
router.get('/tweets', getTweets);

module.exports = router;
