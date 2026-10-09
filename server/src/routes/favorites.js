const express = require("express");
const pool = require("../db/pool");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();
router.use(requireAuth);

router.get("/", async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT external_id AS id, media_type, title, poster_path, vote_average, release_date
       FROM favorites WHERE user_id = $1 ORDER BY created_at DESC`,
      [req.user.id]
    );
    res.json({ favorites: result.rows });
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { externalId, mediaType, title, posterPath, voteAverage, releaseDate } = req.body;
    if (!externalId || !["movie", "tv"].includes(mediaType) || !title) {
      return res.status(400).json({ error: "Movie or show information is incomplete" });
    }
    await pool.query(
      `INSERT INTO favorites
        (user_id, media_type, external_id, title, poster_path, vote_average, release_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (user_id, media_type, external_id) DO NOTHING`,
      [req.user.id, mediaType, externalId, title, posterPath || null, voteAverage || null, releaseDate || null]
    );
    res.status(201).json({ message: "Added to favorites" });
  } catch (error) {
    next(error);
  }
});

router.delete("/:mediaType/:externalId", async (req, res, next) => {
  try {
    await pool.query(
      "DELETE FROM favorites WHERE user_id = $1 AND media_type = $2 AND external_id = $3",
      [req.user.id, req.params.mediaType, req.params.externalId]
    );
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
