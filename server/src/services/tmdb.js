const BASE_URL = "https://api.themoviedb.org/3";

async function tmdbRequest(path, params = {}) {
  const url = new URL(`${BASE_URL}${path}`);
  url.searchParams.set("api_key", process.env.TMDB_API_KEY);
  url.searchParams.set("language", "en-US");
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") url.searchParams.set(key, value);
  });

  const response = await fetch(url);
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.status_message || `TMDB returned HTTP ${response.status}`);
  }
  return data;
}

function assertMediaType(mediaType) {
  if (!["movie", "tv"].includes(mediaType)) {
    const error = new Error("Media type must be movie or tv");
    error.status = 400;
    throw error;
  }
}

async function getCollection(mediaType, category) {
  assertMediaType(mediaType);
  const allowed = mediaType === "movie"
    ? ["popular", "top_rated", "upcoming", "now_playing"]
    : ["popular", "top_rated", "airing_today", "on_the_air"];
  if (!allowed.includes(category)) {
    const error = new Error("Unsupported category");
    error.status = 400;
    throw error;
  }
  return tmdbRequest(`/${mediaType}/${category}`);
}

async function search(query, mediaType = "multi") {
  if (!["movie", "tv", "multi"].includes(mediaType)) {
    const error = new Error("Unsupported search type");
    error.status = 400;
    throw error;
  }
  return tmdbRequest(`/search/${mediaType}`, { query, include_adult: "false" });
}

async function getDetails(mediaType, externalId) {
  assertMediaType(mediaType);
  return tmdbRequest(`/${mediaType}/${externalId}`, {
    append_to_response: "credits,videos,recommendations",
  });
}

module.exports = { getCollection, getDetails, search };
