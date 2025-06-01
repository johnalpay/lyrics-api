import express from "express";
import axios from "axios";

const app = express();
const port = process.env.PORT || 3000;

app.get("/lyrics", async (req, res) => {
  const artist = req.query.artist;
  const title = req.query.title;

  if (!artist || !title) {
    return res.status(400).json({ error: "Missing artist or title parameter" });
  }

  try {
    // Call lyrics.ovh API
    const response = await axios.get(
      `https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(title)}`
    );

    if (response.data && response.data.lyrics) {
      return res.json({
        artist,
        title,
        lyrics: response.data.lyrics,
        author: "Sxe Ci"
      });
    } else {
      return res.status(404).json({ error: "Lyrics not found" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch lyrics" });
  }
});

app.listen(port, () => {
  console.log(`Lyrics API running at http://localhost:${port}`);
});
