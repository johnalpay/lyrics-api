const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const PORT = process.env.PORT || 3000;
const GENIUS_TOKEN = process.env.GENIUS_TOKEN || 'x5JfP7-Vg_cLW_eS6zFM10cSyT9oWwg_TIooYgv5ShDpGmF4rTxikUzPs4RPcjB7'; // Token dapat ilagay sa env vars

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Lyrics API by Sxe Ci',
    usage: '/api/lyrics?query=Perfect Ed Sheeran',
    author: 'Sxe Ci'
  });
});

app.get('/api/lyrics', async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: 'Missing query parameter', author: 'Sxe Ci' });
  }
  if (!GENIUS_TOKEN) {
    return res.status(500).json({ error: 'Missing Genius API Token in environment', author: 'Sxe Ci' });
  }

  try {
    // Step 1: Search Genius API for song info
    const searchUrl = `https://api.genius.com/search?q=${encodeURIComponent(query)}`;
    const searchRes = await axios.get(searchUrl, {
      headers: {
        Authorization: `Bearer ${GENIUS_TOKEN}`
      }
    });

    const hits = searchRes.data.response.hits;
    if (!hits.length) {
      return res.status(404).json({ error: 'No results found', author: 'Sxe Ci' });
    }

    // Get first hit song path
    const songPath = hits[0].result.path;
    const songTitle = hits[0].result.title;
    const songArtist = hits[0].result.primary_artist.name;

    // Step 2: Scrape lyrics page from Genius website
    const lyricsUrl = `https://genius.com${songPath}`;
    const pageRes = await axios.get(lyricsUrl);
    const $ = cheerio.load(pageRes.data);

    // Genius lyrics container might change, try multiple selectors:
    let lyrics = $('.lyrics').text().trim();

    if (!lyrics) {
      // New Genius page layout
      lyrics = '';
      $('div[class^="Lyrics__Container"]').each((i, elem) => {
        const snippet = $(elem).text().trim();
        if (snippet.length !== 0) {
          lyrics += snippet + '\n\n';
        }
      });
      lyrics = lyrics.trim();
    }

    if (!lyrics) {
      return res.status(404).json({ error: 'Lyrics not found on page', author: 'Sxe Ci' });
    }

    res.json({
      title: songTitle,
      artist: songArtist,
      lyrics,
      author: 'Sxe Ci'
    });

  } catch (error) {
    console.error(error.message || error);
    res.status(500).json({ error: 'Internal Server Error', author: 'Sxe Ci' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Lyrics API running on port ${PORT}`);
});
                                   
