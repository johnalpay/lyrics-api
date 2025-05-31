const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/api/lyrics', async (req, res) => {
  const { title, artist } = req.query;

  if (!title || !artist) {
    return res.status(400).json({ 
      error: 'Missing title or artist',
      author: 'Sxe Ci'
    });
  }

  try {
    const response = await axios.get(`https://api.lyrics.ovh/v1/${artist}/${title}`);
    res.json({
      title,
      artist,
      lyrics: response.data.lyrics,
      author: 'Sxe Ci'
    });
  } catch (error) {
    res.status(404).json({ 
      error: 'Lyrics not found',
      author: 'Sxe Ci'
    });
  }
});

app.get('/', (req, res) => {
  res.send('🎵 Lyrics API by Sxe Ci is running!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
