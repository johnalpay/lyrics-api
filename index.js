const express = require('express');
const axios = require('axios');
const app = express();

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Lyrics API by Sxe Ci',
    usage: '/api/lyrics?artist=Ed Sheeran&title=Perfect',
    search_usage: '/api/search?query=perfect',
    author: 'Sxe Ci'
  });
});

// Lyrics fetch endpoint
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

// Artist/Title search suggestion endpoint
app.get('/api/search', async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: 'Missing query parameter', author: 'Sxe Ci' });
  }

  try {
    const response = await axios.get(`https://api.deezer.com/search?q=${encodeURIComponent(query)}`);
    const results = response.data.data.slice(0, 10).map(track => ({
      artist: track.artist.name,
      title: track.title
    }));

    res.json({
      results,
      author: 'Sxe Ci'
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch search results', author: 'Sxe Ci' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Lyrics API running on port ${PORT}`);
});
