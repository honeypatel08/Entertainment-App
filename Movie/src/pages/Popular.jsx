import MovieCard from "../components/MovieCard"
import '../css/Popular.css'
import { useState, useEffect} from "react"
import { searchMovies, getPopularMovies } from "../services/api"; 

// this is pages 
/* 
    naviagate pagges ie home, fav, etc 
    without reloading the entier webside 
    concept of the single page application 
    
    page routing 
*/

function Popular(){

    //useState → This is the hook
    // state -> store user type in input later use any logic api do something 
    // searchQuerry value of the state and setSearchQuerry function that allow the update the change 
    const [searchQuerry, setSearchQuerry] = useState(""); 
    // below will re-render baed on the stage
    const [movies, setMovies] = useState([]); // automatic re-render the list for user 
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    ///const location = useLocation(); // detect route changes

    useEffect(() => {
        const loadPopularMovies = async () => {
        try {
            const popularMovies = await getPopularMovies();
            setMovies(popularMovies);
            setError(null);
        } catch (err) {
            console.log(err);
            setError("Failed to load movies...");
        } finally {
            setLoading(false);
        }
     };

        loadPopularMovies();
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
        // setSearchQuerry("Search Movie") // update is the state retunr re-render  
    }; 
    return(
        <div className="HomePage">
            <form onSubmit={handleSearchMovie} className="searchMovie">
                <input 
                    type="text" 
                    placeholder="Search Movie" 
                    className="searchMovieInput"
                    value={searchQuerry} // connect state 
                    onChange={(e) => setSearchQuerry(e.target.value)}
                // start typing chnage function call call state and page auto render baesd on the input 
                />
                <button type="submit" className="searchBtn">Search</button>
            </form>
            {error && <div className="error-message">{error}</div>}

                {loading ? <div className="loading"> Loading... </div> :
                <div className="movieInGrid">
                    {movies.map((movie) => <MovieCard movie={movie} key={movie.id}/>) }
                </div>
            } 
        </div>
    )
}

export default Popular

/*
        call function when array changes 
        check after evry reender 
        if chnage call the function and run the effect  
    
    // handle ist of movie dynamiclly instead of single 
    // const movies = [
    //     {id:1, title: "My Oxford Year", 
    //     releaseDate: "Aug 2025", 
    //     url: "https://via.placeholder.com/150"}, 
    //     {id:2, title: "One Battle After Another", 
    //     releaseDate: "Sep 2025", 
    //     url: "https://via.placeholder.com/150"},
    //     {id:3, title: "Wicked: For Good", 
    //     releaseDate: "Nov 2025", 
    //     url: "https://via.placeholder.com/150"} 
    // ]; */
