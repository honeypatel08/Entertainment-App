const pool = require("./pool");

async function initializeDatabase() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id BIGSERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS favorites (
      id BIGSERIAL PRIMARY KEY,
      user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      media_type VARCHAR(20) NOT NULL CHECK (media_type IN ('movie', 'tv')),
      external_id BIGINT NOT NULL,
      title TEXT NOT NULL,
      poster_path TEXT,
      vote_average NUMERIC(4, 2),
      release_date TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE (user_id, media_type, external_id)
    );

    CREATE TABLE IF NOT EXISTS ai_summaries (
      id BIGSERIAL PRIMARY KEY,
      media_type VARCHAR(20) NOT NULL CHECK (media_type IN ('movie', 'tv')),
      external_id BIGINT NOT NULL,
      title TEXT NOT NULL,
      source_hash VARCHAR(64) NOT NULL,
      prompt_version INTEGER NOT NULL,
      model VARCHAR(100) NOT NULL,
      summary TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE (media_type, external_id, source_hash, prompt_version)
    );

    CREATE INDEX IF NOT EXISTS favorites_user_id_idx ON favorites(user_id);
    CREATE INDEX IF NOT EXISTS ai_summaries_lookup_idx
      ON ai_summaries(media_type, external_id, prompt_version);
  `);
}

module.exports = { initializeDatabase };
