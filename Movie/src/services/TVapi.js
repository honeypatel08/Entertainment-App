import { apiRequest } from "./client";

const results = (request) => request.then((data) => data.results || []);

export const getPopularTV = () => results(apiRequest("/api/movies/discover/tv/popular"));
export const getTopRatedTV = () => results(apiRequest("/api/movies/discover/tv/top_rated"));
export const getAiringTodayTV = () => results(apiRequest("/api/movies/discover/tv/airing_today"));
export const getOnTV = () => results(apiRequest("/api/movies/discover/tv/on_the_air"));
