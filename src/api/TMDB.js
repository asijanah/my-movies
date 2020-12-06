import axios from 'axios';

// const key = '718ea0afa77356e0a5e2b18e7de231b7'; // gil 
const key = '490315f3d2a02854114c705838149f3a'; // Dori

const getTMDBconf = async() => {
    const configuration = await axios.get(`https://api.themoviedb.org/3/configuration?api_key=${key}`);
    return configuration;
}

const getTMDBmovies = async(queryType, pageNo=1) => {
    // single movie details 
    //  const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieID}?api_key=${key}`);
    let response; 
    if (queryType==="top_rated") { 
    // list of top  rated movies     
         response = await axios.get(`https://api.themoviedb.org/3/movie/top_rated?api_key=${key}&language=en-US&page=${pageNo}`);
    } else if (queryType==="discover") { 
    // list of all movies 
         response = await axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${key}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${pageNo}`);
    }
     
    
    return response;
};

const actorDetails = async (actorName) => {
    const actor = await axios.get(`https://api.themoviedb.org/3/search/person?api_key=${key}&language=en-US&page=1&include_adult=false&query=${actorName}`);
    return actor;
};

const recomendations = async (movieId) => {
    const recomendedMovies = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}/recommendations?api_key=${key}&language=en-US&page=1`);
    return recomendedMovies;                  
};

const getOneMovie = async (movieId) => {
    const movie = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${key}&language=en-US`);
    return movie;
};

const getCredits = async (movieId) => {
    const credits = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${key}&language=en-US`);
    return credits;
}

const getMoviesForActor = async (actorId) => {
    const movies = await axios.get(`https://api.themoviedb.org/3/person/${actorId}/movie_credits?api_key=${key}&language=en-US`);
    return movies;
}




export {
    getTMDBconf, 
    getTMDBmovies,
    actorDetails,
    recomendations,
    getOneMovie,
    getCredits,
    getMoviesForActor
};