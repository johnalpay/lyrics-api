const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get('/api/lyrics', async (req, res) => {
  const title = req.query.title;

  if (!title) {
    return res.status(400).json({ error: 'Missing title parameter' });
  }

  try {
    const response = await axios.get(`https://betadash-api-swordslush-production.up.railway.app/lyrics-finder?title=${encodeURIComponent(title)}`);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch lyrics' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
