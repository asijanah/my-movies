import axios from 'axios';
const getMostPopular = async(pageNo) => {
    const key = 'ea089a6ea65455511c68e55304c2398e';
    const response = await axios.get(`https://api.themoviedb.org/3/person/popular?api_key=${key}&language=en-US&page=${pageNo}`);
    return response;
};

export {
    getMostPopular
};