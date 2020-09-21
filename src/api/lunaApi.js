import axios from 'axios';

const lunaApi = axios.create({
  baseURL:'http://localhost:3333'
});

export default lunaApi;