import "../css/MovieCard.css"
import { useMovieContext } from "../contexts/MovieContext";
// src/components/MovieCard.jsx

function MovieCard({ movie }) {
  const {addToFavorites, removeToFavorites, isFavorites, openDetails} = useMovieContext()
  const favs = isFavorites(movie.id, "movie")
  
  async function onFavClick(e) {
    e.preventDefault()
    e.stopPropagation()
    try {
      if (favs) await removeToFavorites(movie.id,"movie")
      else await addToFavorites(movie,"movie")
    } catch (error) {
      alert(error.message)
    }
  }

  return (
    <article className="movieCard" onClick={() => openDetails(movie, "movie")} tabIndex="0">
      <div className="moviePoster">
        <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt ={movie.title}/>
        <div className="rating">
          ⭐ {movie.vote_average?.toFixed(1)}
        </div>
        <div className="isFavorite">
           <button className={`favoriteBtn ${favs ? "active" : ""}`} onClick={onFavClick}>
              ♥
            </button>
        </div>
      </div>
      <div className="info">
        <h3>{movie.title}</h3>
        <p>{movie.release_date
          ? new Date(movie.release_date).toLocaleDateString("en-US")
          : "N/A"}
        </p>
      </div>
    </article>
  );
}

export default MovieCard;
