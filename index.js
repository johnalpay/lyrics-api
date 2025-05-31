const express = require('express');
const axios = require('axios');
const app = express();

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Lyrics API by Sxe Ci',
    usage: '/api/lyrics?artist=Ed Sheeran&title=Perfect',
    author: 'Sxe Ci'
  });
});

app.get('/api/lyrics', async (req, res) => {
  const { artist, title } = req.query;

  if (!artist || !title) {
    return res.status(400).json({ error: 'Missing artist or title', author: 'Sxe Ci' });
  }

  try {
    const response = await axios.get(`https://api.lyrics.ovh/v1/${artist}/${title}`);
    if (response.data && response.data.lyrics) {
      res.json({
        artist,
        title,
        lyrics: response.data.lyrics,
        author: 'Sxe Ci'
      });
    } else {
      res.status(404).json({ error: 'Lyrics not found', author: 'Sxe Ci' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error', author: 'Sxe Ci' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Lyrics API running on port ${PORT}`);
});
