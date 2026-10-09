import "../css/MovieCard.css";
import { useMovieContext } from "../contexts/MovieContext";

function ShowCard({ show }) {
  const { addToFavorites, removeToFavorites, isFavorites, openDetails } = useMovieContext();
  const favs = isFavorites(show.id, "tv");
  const rating = Number(show.vote_average);

  async function onFavClick(e) {
    e.preventDefault();
    e.stopPropagation();
    try {
      if (favs) await removeToFavorites(show.id, "tv");
      else await addToFavorites(show, "tv");
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <article className="movieCard" onClick={() => openDetails(show, "tv")} tabIndex="0">
      <div className="moviePoster">
        <img
          src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
          alt={show.name}
        />
        <div className="rating">⭐ {Number.isFinite(rating) ? rating.toFixed(1) : "N/A"}</div>
        <button className={`favoriteBtn ${favs ? "active" : ""}`} onClick={onFavClick}>
          ♥
        </button>
      </div>

      <div className="info">
        <h3>{show.name}</h3>
        <p>
          {show.first_air_date
            ? new Date(show.first_air_date).toLocaleDateString()
            : "N/A"}
        </p>
      </div>
    </article>
  );
}

export default ShowCard;
