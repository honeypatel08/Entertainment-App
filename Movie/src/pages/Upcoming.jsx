import MovieCard from "../components/MovieCard"
import '../css/Popular.css'
import { useState, useEffect} from "react"
import { searchMovies, getUpcomingMovies } from "../services/api";


function Upcoming(){
    const [searchQuerry, setSearchQuerry] = useState(""); 
    const [movies, setMovies] = useState([]); // automatic re-render the list for user 
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUpcomingMovies = async () => {
        try {
            const upcomingMovies = await getUpcomingMovies();
            setMovies(upcomingMovies);
            setError(null);
        } catch (err) {
            console.log(err);
            setError("Failed to load movies...");
        } finally {
            setLoading(false);
        }
     };

        loadUpcomingMovies();
    }, []);

    const handleSearchMovie = async (e) =>{
        e.preventDefault(); 
        if(!searchQuerry.trim()) return 
        if(loading) return

        setLoading(true)
        try {
            const searchResult = await searchMovies(searchQuerry);
            setMovies(searchResult);
            setError(null)
        } catch (err) {
            console.log(err);
            setError("Failed to Search movies... Try Agian");
        } finally {
            setLoading(false);
        }
    }; 

    return(
        <>
            <form onSubmit={handleSearchMovie} className="searchMovie">
                <input 
                    type="text" 
                    placeholder="Search Movie" 
                    className="searchMovieInput"
                    value={searchQuerry} // connect state 
                    onChange={(e) => setSearchQuerry(e.target.value)}
                />
                <button type="submit" className="searchBtn">Search</button>
            </form>
            {error && <div className="error-message">{error}</div>}
                {loading ? <div className="loading"> Loading... </div> :
                <div className="movieInGrid">
                    {movies.map((movie) => ( <MovieCard movie={movie} key={movie.id}/> ))}
                </div>
            } 
        </>
    )
}

export default Upcoming
