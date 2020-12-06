import React, { useState, useEffect } from 'react';
import {useParams, useHistory, Link} from 'react-router-dom';
import {Route} from 'react-router-dom'; 

import './style.css';
import { actorDetails, recomendations, getOneMovie, getTMDBconf, getCredits, getMoviesForActor} from '../../api/TMDB';
import { getOMDB } from '../../api/OMDB';

//play with material-ui
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Alert from '@material-ui/lab/Alert';
//icons
import RateReviewIcon from '@material-ui/icons/RateReview';
import ThumbUpOutlinedIcon from '@material-ui/icons/ThumbUpOutlined';
import HomeIcon from '@material-ui/icons/Home';
import TheatersIcon from '@material-ui/icons/Theaters';
//fonts
import 'fontsource-roboto';
import Typography from '@material-ui/core/Typography';

function MovieDetails () { 

    let {movieId}=useParams(); 
    const history = useHistory();

    const [movie, setMovie] = useState();
    const [confImg, setConfImg] = useState();
    const [actor, setActor] = useState();
    const [moviesForActor, setMoviesForActor] = useState();
    const [rating, getRating] = useState();
    const [recomendedMovies, setRecomendedMovies] = useState();
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false); 
    
    useEffect(async () => {
        window.scrollTo(0, 0);
        
        //add flag for loading sign
        setLoading(true);

        //get movie 
        const movieData = await getOneMovie(movieId);
        setMovie(movieData);

        //get rating from OMDB
        const omdb = await getOMDB(movieData.data.title);
        getRating(omdb);

        //get configuration for images
        const imgConf = await getTMDBconf();
        setConfImg(imgConf);

        //get actors from credits
        const credits = await getCredits(movieId);
        setActor(credits);

        //show recomended movies
        const recomendedMoviesData = await recomendations(movieId);
        setRecomendedMovies(recomendedMoviesData);

        setLoading(false);

    },[movieId]);

    //alert for Review
    const handleClick = () => {
        setOpen(true);
        };
        const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
        };

    //show movies of a specific actor
    const showMovies = async (actorId) => {
        const actorMoviesData = await getMoviesForActor(actorId);
        setMoviesForActor(actorMoviesData);
        console.log(actorMoviesData);
    }

    const removeActorMovies = () => {
        setMoviesForActor();
    }
    
    return (
        <>
            <div className="head">
                {
                    movie &&
                    <div className="detailsPage head-details"> 
                    <Typography variant="h2">
                        {movie.data.title}
                    </Typography>
                    <Typography variant="subtitle1">
                        {movie.data.tagline}
                    </Typography>
                        <h4 className="plot-summery"><i>{movie.data.overview}</i></h4>
                        <h4 className="plot-summery">Released date: {movie.data.release_date}</h4>
                        <Typography variant="h4">
                            Ratings
                        </Typography>
                        {rating && !rating.data.Error && rating.data.Ratings.map((rating, index) => 
                        {
                            return (
                                <h3 key={index}>
                                    <div><ThumbUpOutlinedIcon /> {rating.Source} : {rating.Value}</div>
                                </h3>
                            )
                        }
                        )
                        }
                        {
                            rating && rating.data.Error && 
                            <h3><i>No ratings</i></h3>

                        }
                        <Button className="detailsPage review-button" variant="contained" color="primery" startIcon={<RateReviewIcon />}
                            onClick={handleClick}
                        >
                            Add your own review
                        </Button>
                        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose} >
                            <Alert variant="filled" severity="error" >
                                Nobody cares what you think
                            </Alert>
                        </Snackbar>
                    </div>
                }
                {
                    confImg && 
                    <img className='detailsPage mainImg' src={`${confImg.data.images.base_url}/${confImg.data.images.profile_sizes[2]}/${movie.data.poster_path}`} alt={movie.data.title} />   
                }
                {/* <button onClick={goHome} >Back</button> */}
            </div>

        <hr />

        {
            loading &&
            <img className ='loading' src='/images/loading.gif' alt='Loading' />
        }
        {
            !loading &&
            <div className="afetrLoading">
                <div className="headline Lead-Actors">
                    <Typography variant="h3">
                        Lead Actors:
                    </Typography>
                </div>
                <div className="detaisPage actors">
                    <div>
                        {actor && 
                            actor.data.cast.slice(0,5).map((actorUrl, index) => 
                            {return(
                                actorUrl.profile_path && 
                                <Tooltip key={index} title={actorUrl.name} placement="top">
                                    <img key={index} className="oneActor" 
                                    src={`${confImg.data.images.base_url}/${confImg.data.images.profile_sizes[2]}/${actorUrl.profile_path}`} alt={actorUrl.name} 
                                    onClick={() => showMovies(actorUrl.id)}
                                    />
                                </Tooltip>
                                )
                            })
                        }
                        <ul>
                        <h2>Do I look familiar to you?</h2>
                            {
                                moviesForActor && 
                                moviesForActor.data.cast.slice(0,5).map(movie => 
                                <li><TheatersIcon color="primary"/> {` I played ${movie.character} in `}
                                    <Link to={`/movie/${movie.id}`} onClick={() => removeActorMovies()}>{movie.original_title}</Link>
                                </li>)
                            }
                        </ul>
                    </div>
                </div>

                <hr />

                    <div className="similarMovies-header">
                        <Typography variant="h4">
                            You may like also...
                        </Typography>
                    </div>
                <div className="similarMovies">
                    {recomendedMovies && recomendedMovies.data.results.slice(0,10).map((movieUrl, index) => 
                    {return(
                    movieUrl.poster_path &&
                        <Route path="/movie/:movieId">
                            <Link to={`/movie/${movieUrl.id}`} onClick={() => removeActorMovies()}>
                                <img key={index} className="movieSim"  
                                src={`${confImg.data.images.base_url}/${confImg.data.images.profile_sizes[2]}/${movieUrl.poster_path}`} 
                                alt={movieUrl.title}
                                />   
                            </Link>
                        </Route>
                    )}
                    )}
                </div>
                <div className="button backToMain">
                <Button href="/" variant="contained" color="secondary">
                    <HomeIcon />
                </Button>
            </div>
            </div>
            
        }
        </>
    )
}

export default MovieDetails; 