import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { useParams, useHistory } from 'react-router-dom';
import { Link } from 'react-router-dom';

import './home.css';
import { getTMDBconf, getTMDBmovies } from '../../api/TMDB';
import { getOMDB } from '../../api/OMDB';
import Card from '../card/index.jsx';
import MovieDetails from '../detailsPage/index.jsx';
import MovieNav from '../../components/Navbar/index.jsx';
import People from '../../pages/actors/index.jsx';


function Home() {

    // const [conf, setConf] = useState({});
    // const [page, setPage] = useState({});
    const emptyMovieArray = [
        {
            page: 0,
            total_pages: 0,
            queryType: "discover",
            adult: '',
            base_url: '',
            logo_sizes: ["w45", "w92", "w154", "w185", "w300", "w500", "original"],
            poster_sizes: ["w92", "w154", "w185", "w342", "w500", "w780", "original"],
            profile_sizes: ["w45", "w185", "h632", "original"],
            still_sizes: ["w92", "w185", "w300", "original"],
            backdrop_path: '',
            genre_ids: [],
            id: 0,
            original_language: '',
            original_title: '',
            overview: '',
            popularity: '',
            poster_path: '',
            release_date: '',
            title: '',
            video: '',
            OMDB: null
            // attempts at returning only parts of the OMDB object failed with key doesn't exist messages 
        }
    ];

    const [movies, setMovies] = useState(emptyMovieArray);
    let search = '';

    const onSearch = ({ target: { value: text } }) => {
        if (!text) {
            setMovies(movies);
            return
        }
        const lower = text.toLowerCase();
        const filtered = movies.filter((movie) =>
            movie.title.toLowerCase().includes(lower)
        )
        setMovies(filtered)
    }

    const sortByViewers = () => {
        const populars = [...movies];
        populars.sort((a, b) => b.popularity - a.popularity);
        setMovies(populars);
    };


    // {movies.release_date} shuold be convert to date so that sortByDate function work properly
    const sortByDate = () => {
        const newest = [...movies];
        newest.sort((a, b) => new Date(b.release_date) - (new Date(a.release_date)))
        setMovies(newest);
    };

    const sortAlphabetically = () => {
        const alfaBet = [...movies];
        alfaBet.sort((a, b) => (a.title > b.title) ? 1 : -1);
        setMovies(alfaBet);
    };

    const showWhichMovieList = (e) => {
        // if (e.target.value === 'top_rated') {
        fetchMovies(e.target.value);
        //    } else if (e.target.value === 'discover') {                            
        // fetchMovies
        //    }            
    }

    async function fetchMovies(queryType, pageNo = 1) {
        // if(!localStorage.getItem('movies')){                   //stop localstorage - gs 
        let configuration = await getTMDBconf();

        // top_rated
        // discover
        let tmpMoviesPage = await getTMDBmovies(queryType, pageNo);

        //based on Esraa's example - for each movie, get data from second API 
        //const response2 = await Promise.all(movies.map(movie => secondApiRequest(movie.name)))
        const moreMoviesData = await Promise.all(tmpMoviesPage.data.results.map
            (movie => getOMDB(movie.title)));
        //console.log("=OMDB=", moreMoviesData); 
        // now, lets create a unified Array of movies                     

        // console.log("configuration=", configuration); 
        const c_base_url = configuration.data.images.base_url;
        const c_logo_sizes = configuration.data.images.logo_sizes;   // ["w45", "w92", "w154", "w185", "w300", "w500", "original"]        
        const c_poster_sizes = configuration.data.images.poster_sizes; // ["w92", "w154", "w185", "w342", "w500", "w780", "original"]
        const c_profile_sizes = configuration.data.images.profile_sizes; // ["w45", "w185", "h632", "original"]
        const c_still_sizes = configuration.data.images.still_sizes; // ["w92", "w185", "w300", "original"]

        const moviesArray = [];

        // console.log("tmpMoviesPage=", tmpMoviesPage); 
        tmpMoviesPage.data.results.map(movie => {
            // console.log("in loop OMDB movie=", moreMoviesData); 
            //console.log("in loop OMDB movie=", moreMoviesData.find(OMDBmovie=>OMDBmovie.data.Title===movie.title)); 
            moviesArray.push(
                {
                    page: tmpMoviesPage.data.page,
                    total_pages: tmpMoviesPage.data.total_pages,
                    queryType: queryType,
                    adult: movie.adult,
                    base_url: c_base_url,
                    logo_sizes: c_logo_sizes,
                    poster_sizes: c_poster_sizes,
                    profile_sizes: c_profile_sizes,
                    still_sizes: c_still_sizes,
                    backdrop_path: movie.backdrop_path,
                    genre_ids: movie.genre_ids,
                    id: movie.id,
                    original_language: movie.original_language,
                    original_title: movie.original_title,
                    overview: movie.overview,
                    popularity: movie.popularity,
                    poster_path: movie.poster_path,
                    release_date: movie.release_date,
                    title: movie.title,
                    video: movie.video,
                    OMDB: moreMoviesData.find(OMDBmovie => OMDBmovie.data.Title === movie.title)
                    // attempts at returning only parts of the OMDB object failed with key doesn't exist messages 
                });
        });

        // setConf(configuration.data.images); 
        // setPage(tmpMoviesPage.data);            // page 
        setMovies(moviesArray);     // movies   - moviesPage.data.results
    }

    useEffect(() => {
        fetchMovies("discover");
    }, []);

    // console.log("conf=",conf);    
    // console.log("base_url=",conf.base_url);    
    // console.log("page=",page);                   
    console.log("movies=", movies);
    // console.log("movies.ganer=",movies.
    // genres.name);
    return (
        <BrowserRouter>

            <MovieNav onSearch={onSearch} />

            <Switch>
                <Route path={["/home", "/"]} exact={true}>

                    <div className="filter">
                        <div className="movie-list mt-3">
                            <label className="selectMovie" htmlFor="sorting">which movie list:</label>
                            <select className="dropDown" defaultValue="discover"
                                onChange={showWhichMovieList}
                                name="whichMovieList"
                                id="whichMovieList">
                                <option value="discover">Browse </option>
                                <option value="top_rated">Top Rated</option>
                            </select>
                        </div>

                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="exampleRadios" id="exampleRadios1" value="option1"
                                onChange={sortByViewers}
                            />
                            <label class="form-check-label" for="exampleRadios1">
                                Most popular Movies
                            </label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="exampleRadios" id="exampleRadios2" value="option2"
                                onChange={sortByDate}
                            />
                            <label class="form-check-label" for="exampleRadios2">
                                Newest Movies
                            </label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="exampleRadios" id="exampleRadios2" value="option2"
                                onChange={sortAlphabetically}
                                check />
                            <label class="form-check-label" for="exampleRadios2">
                                Ascending by abc
                            </label>
                        </div>


                        <div className="pageNavigation-section">
                            <span className="displayPageNum">{`Page ${movies[0].page} of ${movies[0].total_pages}`}</span>
                            <div className="btn-wrapper">
                                {(movies[0].page > 1) &&
                                    <button className="navBtn mr-3"
                                        onClick={() =>
                                            fetchMovies(movies[0].queryType, movies[0].page - 1)}>
                                        Back</button>}
                                {(movies[0].page < movies[0].total_pages) &&
                                    <button className="navBtn mr-3"
                                        onClick={() =>
                                            fetchMovies(movies[0].queryType, movies[0].page + 1)}>
                                        Next</button>}
                                {(movies[0].page > 1) &&
                                    <button className="navBtn mr-3"
                                        onClick={() =>
                                            fetchMovies(movies[0].queryType, 1)}>
                                        First</button>}
                                {(movies[0].page < movies[0].total_pages) &&
                                    <button className="navBtn mr-3"
                                        onClick={() =>
                                            fetchMovies(movies[0].queryType, movies[0].total_pages)}>
                                        Last</button>}
                            </div>

                            {/* {movies[0].page===1 ?<p>Hello</p>:<p>World</p>}  */}
                        </div>
                    </div>

                    <div className="cards-grid" >
                        {/* <span>{`${movie.id}:  ${movie.title}`} </span>
                            <img src={`${conf.base_url}/${conf.logo_sizes[1]}/${movie.poster_path}`} alt={movie.title}/> */}

                        {movies.map(movie => {
                            return (
                                <Card key={movie.id} movie={movie} />
                            )
                        })}
                        {/* <button onClick={()=>showMovies()}> Show Movies</button> */}
                    </div>
                </Route>
                <Route path={'/actors'}>
                    <div className="actorsWrapper">
                        <People />
                    </div>
                </Route>
                <Route path="/movie/:movieId">
                    <MovieDetails movies={movies} />
                </Route>
            </Switch>
        </BrowserRouter>
    )
};

export default Home;
