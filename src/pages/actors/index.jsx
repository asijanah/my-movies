import React, { useState, useEffect } from 'react';

import { getMostPopular } from '../../api/People';
import './actors.css';

function People() {

    const [mostPopular, setMostPopular] = useState([]);
    const [btn, setBtn] = useState(1);

    const next = (pageNo) => {
        setBtn(pageNo + 1)
        console.log(pageNo);
    };
    const back = (pageNo) => {
        setBtn(pageNo - 1)
        console.log(pageNo);
    };

    useEffect(async () => {
        const response = await getMostPopular(btn);
        setMostPopular(response.data.results);

    }, [btn]);

    const imgAddress = 'https://image.tmdb.org/t/p/w500'
    return (

        <div>

            <button onClick={() => next(btn)} className="actors-btn">Next</button>
            <button onClick={() => back(btn)} className="actors-btn">Back</button>

            <div className="actors-card px-2">
                {
                    mostPopular && mostPopular.map(item =>
                        <div className="actors">
                            <div className="img-wrapper">
                                <img className="actor-img" src={`${imgAddress}${item.profile_path}`} />
                            </div>
                            <h2 className="actor-name">{item.name}</h2>
                            <ul>
                                {item.known_for.map(movie => {
                                    return <li>{movie.title}</li>
                                })}
                            </ul>
                            <footer className="actor-popularity">
                                <h5>Actor Rating: {item.popularity}</h5>
                            </footer>
                        </div>
                    )
                }
            </div>
        </div>
    )
}
export default People
