const Audio = require('../models/audioModel');
const { classifyAudio } = require('../utils/audioClassification');
const path = require('path');

exports.uploadAudio = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).send('No file uploaded');
    }

    const classification = await classifyAudio(path.join(__dirname, '../uploads', file.filename));

    // Store file info and classification in the database
    const newAudio = new Audio({
      fileName: file.filename,
      classification,
    });
    await newAudio.save();

    res.status(201).json({ classification, file: file.filename });
  } catch (err) {
    res.status(500).send(err.message);
  }
};
