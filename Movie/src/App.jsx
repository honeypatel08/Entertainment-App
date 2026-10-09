import './css/App.css'
import Home from './pages/Home'
import Favorites from './pages/Favorites'
import {Routes, Route} from "react-router-dom"
import NavBar from './components/NavBar'
import {MovieProvider} from "./contexts/MovieContext"
import {AuthProvider} from "./contexts/AuthContext"
import MediaDetails from './components/MediaDetails'
import Auth from './pages/Auth'
import ProtectedRoute from './components/ProtectedRoute'
import Popular from './pages/Popular'
import TopRate from './pages/TopRate'
import Upcoming from './pages/Upcoming'
import TVPopular from './pages/TVPopular'
import TVAiringToday from './pages/TVAiringToday'
import TVOnTV from './pages/TVOnTV'
import TVTopRated from './pages/TVTopRated'
import './css/Theme.css'

// import {MovieCart} from "./components/MovieCard" named export 

function App(){
  return(
    
    <AuthProvider>
      <MovieProvider>
        <NavBar />
        <main className='MainContent'>
          <Routes>
            <Route path="/auth/:mode" element={<Auth />} />
            <Route element={<ProtectedRoute />}>
              <Route path='*' element ={<Home />} />
              <Route path='/movies/popular' element ={<Popular />} />
              <Route path='/movies/top-rated' element ={<TopRate />} />
              <Route path='/movies/upcoming' element ={<Upcoming />} />
              <Route path='/favorites' element ={<Favorites />} />
              <Route path="/tv-show/popular" element={<TVPopular />} />
              <Route path="/tv-show/top-rated" element={<TVTopRated />} />
              <Route path="/tv-show/airing-today" element={<TVAiringToday />} />
              <Route path="/tv-show/on-tv" element={<TVOnTV />} />
            </Route>
          </Routes>
        </main>
        <MediaDetails />
      </MovieProvider>
    </AuthProvider>
  );
}

export default App
