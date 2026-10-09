const express = require("express");
const crypto = require("crypto");
const pool = require("../db/pool");
const tmdb = require("../services/tmdb");
const { PROMPT_VERSION, summarizeMedia } = require("../services/gemini");

const router = express.Router();

router.get("/discover/:mediaType/:category", async (req, res, next) => {
  try {
    const data = await tmdb.getCollection(req.params.mediaType, req.params.category);
    res.json({ results: data.results || [] });
  } catch (error) {
    next(error);
  }
});

router.get("/search", async (req, res, next) => {
  try {
    const query = String(req.query.q || "").trim();
    if (!query) return res.status(400).json({ error: "Search query is required" });
    const data = await tmdb.search(query, req.query.type || "multi");
    res.json({ results: (data.results || []).filter((item) => ["movie", "tv"].includes(item.media_type || req.query.type)) });
  } catch (error) {
    next(error);
  }
});

router.get("/:mediaType/:externalId", async (req, res, next) => {
  try {
    const details = await tmdb.getDetails(req.params.mediaType, req.params.externalId);
    res.json({ ...details, media_type: req.params.mediaType });
  } catch (error) {
    next(error);
  }
});

router.get("/:mediaType/:externalId/summary", async (req, res, next) => {
  try {
    const { mediaType, externalId } = req.params;
    const details = await tmdb.getDetails(mediaType, externalId);
    details.media_type = mediaType;
    const title = details.title || details.name;
    const sourceHash = crypto
      .createHash("sha256")
      .update(JSON.stringify({ title, overview: details.overview, genres: details.genres }))
      .digest("hex");

    const cached = await pool.query(
      `SELECT summary, model, created_at
       FROM ai_summaries
       WHERE media_type = $1 AND external_id = $2
         AND source_hash = $3 AND prompt_version = $4`,
      [mediaType, externalId, sourceHash, PROMPT_VERSION]
    );
    if (cached.rows[0]) {
      return res.json({ ...cached.rows[0], cached: true });
    }

    const generated = await summarizeMedia(details);
    const saved = await pool.query(
      `INSERT INTO ai_summaries
        (media_type, external_id, title, source_hash, prompt_version, model, summary)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (media_type, external_id, source_hash, prompt_version)
       DO UPDATE SET summary = EXCLUDED.summary, model = EXCLUDED.model, updated_at = NOW()
       RETURNING summary, model, created_at`,
      [mediaType, externalId, title, sourceHash, PROMPT_VERSION, generated.model, generated.summary]
    );
    res.json({ ...saved.rows[0], cached: false });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
