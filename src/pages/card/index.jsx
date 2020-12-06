import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Link } from 'react-router-dom';

import './card.css'


function Card(props) {
    return (
        <div className="main-cards px-2">
            <div className="movie-card">
                <Link to={`/movie/${props.movie.id}`}>
                    <img className="image" src={`${props.movie.base_url}/${props.movie.logo_sizes[2]}/${props.movie.poster_path}`} />
                </Link>
                {props.movie.OMDB &&
                        <p className="categories">{props.movie.OMDB.data.Genre.split(",")[0]}</p>
                }
                <div className="card-contant">
                    <h3 className="title">{props.movie.title}</h3>
                    <p className="year">Released: {props.movie.release_date}</p>
                    <footer className="foot">
                        <div className="meta">
                            <div className="duration">
                                {props.movie.OMDB &&
                                    <span className="duration"><i className="fa fa-clock-o"></i>Duration: {props.movie.OMDB.data.Runtime}</span>
                                }
                            </div>
                            <div className='viewers'>
                                <span className="views"><i className="fa fa-comments"></i><a href="#">Viewers Rate: {props.movie.popularity}</a></span>
                            </div>
                        </div>
                    </footer>
                </div>
            </div>
        </div >
    )
}

export default Card; 