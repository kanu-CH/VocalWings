const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const tweetRoutes = require('./routes/tweetRoutes');
const audioRoutes = require('./routes/audioRoutes');
const { MONGODB_URI, PORT } = require('./config');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/tweets', tweetRoutes);
app.use('/api/audio', audioRoutes);

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.log('Error connecting to MongoDB:', err));
