/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { apiRequest } from "../services/client";
import { useAuth } from "./AuthContext";

const MovieContext = createContext(null);
export const useMovieContext = () => useContext(MovieContext);

export function MovieProvider({ children }) {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [selectedMedia, setSelectedMedia] = useState(null);

  const loadFavorites = useCallback(async () => {
    if (!user) return;
    try {
      const data = await apiRequest("/api/favorites");
      setFavorites(data.favorites || []);
    } catch (error) {
      console.error(error);
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;
    let active = true;
    apiRequest("/api/favorites")
      .then((data) => active && setFavorites(data.favorites || []))
      .catch((error) => console.error(error));
    return () => { active = false; };
  }, [user]);

  async function addToFavorites(item, mediaType) {
    if (!user) throw new Error("Sign in to save favorites");
    await apiRequest("/api/favorites", {
      method: "POST",
      body: JSON.stringify({
        externalId: item.id,
        mediaType,
        title: item.title || item.name,
        posterPath: item.poster_path,
        voteAverage: item.vote_average,
        releaseDate: item.release_date || item.first_air_date,
      }),
    });
    await loadFavorites();
  }

  async function removeToFavorites(id, mediaType) {
    if (!user) throw new Error("Sign in to manage favorites");
    await apiRequest(`/api/favorites/${mediaType}/${id}`, { method: "DELETE" });
    setFavorites((current) => current.filter(
      (favorite) => !(Number(favorite.id) === Number(id) && favorite.media_type === mediaType)
    ));
  }

  const isFavorites = (id, mediaType) => favorites.some(
    (favorite) => Number(favorite.id) === Number(id) && favorite.media_type === mediaType
  );

  const value = {
    favorites: user ? favorites : [],
    addToFavorites,
    removeToFavorites,
    isFavorites,
    selectedMedia,
    openDetails: (item, mediaType) => setSelectedMedia({ id: item.id, mediaType }),
    closeDetails: () => setSelectedMedia(null),
  };

  return <MovieContext.Provider value={value}>{children}</MovieContext.Provider>;
}
