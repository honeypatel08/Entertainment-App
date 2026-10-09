// // all meked fav in this pade display
// import "../css/Favorites.css";
// import { useMovieContext } from "../contexts/MovieContext";
// import MovieCard from "../components/MovieCard"; 


// function favorite(){

//     const{favorites} = useMovieContext(); 
    
//     if (favorites && favorites.length > 0) {
//         return (
//             <div className="favGrid">
//             <h2>Marked Favorites Movies</h2>
//             <div className="movieInGrid">
//                 {favorites.map((movie) => (
//                 <MovieCard movie={movie} key={movie.id} />
//                 ))}
//             </div>
//             </div>
//         );
//     }
//         // When no favorites
//     return (
//         <div className="favoriteEmpty">
//             <h2>No Favorite Marked Movie Yet</h2>
//             <p>Start adding and they will appear here</p>
//         </div>
//     );

// } 

// export default favorite


import "../css/Favorites.css";
import { Link } from "react-router-dom";
import { useMovieContext } from "../contexts/MovieContext";
import { useAuth } from "../contexts/AuthContext";
import MovieCard from "../components/MovieCard";
import ShowCard from "../components/ShowCard";
import { useState } from "react";

function Favorites() {
  const { favorites } = useMovieContext();
  const { user } = useAuth();
  const [filter, setFilter] = useState("all"); // all | movie | tv

  if (!user) {
    return (
      <div className="favoriteEmpty">
        <h2>Your favorites travel with you</h2>
        <p>Sign in to save movies and shows to your personal collection.</p>
        <Link className="primaryButton" to="/auth/login">Sign in</Link>
      </div>
    );
  }

  if (!favorites || favorites.length === 0) {
    return (
      <div className="favoriteEmpty">
        <h2>No Favorite Marked Movie Yet</h2>
        <p>Start adding ❤️ and they will appear here</p>
      </div>
    );
  }

  const filteredFavorites =
    filter === "all"
      ? favorites
      : favorites.filter((item) => item.media_type === filter);

  return (
    <div className="favGrid">
      <h2>My Favorites</h2>

      {/* Filter Buttons */}
      <div className="favFilter">
        <button onClick={() => setFilter("all")}>All</button>
        <button onClick={() => setFilter("movie")}>Movies</button>
        <button onClick={() => setFilter("tv")}>TV Shows</button>
      </div>

      <div className="movieInGrid">
        {filteredFavorites.map((item) =>
          item.media_type === "movie" ? (
            <MovieCard movie={item} key={`movie-${item.id}`} />
          ) : (
            <ShowCard show={item} key={`tv-${item.id}`} />
          )
        )}
      </div>
    </div>
  );
}

export default Favorites;
