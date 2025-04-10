const express = require('express');
const { uploadAudio } = require('../controllers/audioController');
const upload = require('../middlewares/multerMiddleware');
const router = express.Router();

router.post('/upload', upload.single('audioFile'), uploadAudio);

module.exports = router;
