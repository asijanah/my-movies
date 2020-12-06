import axios from 'axios';
const getOMDB = async(movieName) => {
    const key = '5a52e586'; //gil 
    const response = await axios.get(`http://www.omdbapi.com/?apikey=${key}&t=${movieName}&r=json`);
    return response;
};

export {
    getOMDB
};