import { apiRequest } from "./client";

const results = (request) => request.then((data) => data.results || []);

export const getPopularMovies = () => results(apiRequest("/api/movies/discover/movie/popular"));
export const getUpcomingMovies = () => results(apiRequest("/api/movies/discover/movie/upcoming"));
export const getNowPlaying = () => results(apiRequest("/api/movies/discover/movie/now_playing"));
export const getTop = () => results(apiRequest("/api/movies/discover/movie/top_rated"));
export const searchMovies = (query) => results(apiRequest(`/api/movies/search?type=movie&q=${encodeURIComponent(query)}`));
