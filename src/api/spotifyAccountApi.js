import axios from 'axios';

const spotifyAccountApi = axios.create({
  baseURL:'https://accounts.spotify.com'
});

spotifyAccountApi.defaults.params = {}
spotifyAccountApi.defaults.params['client_id'] = '3ecbff2c61374e7e9c089982bf8878a0';
spotifyAccountApi.defaults.params['response_type'] = 'code';
spotifyAccountApi.defaults.params['redirect_uri'] = 'http://localhost:3000/callback';
spotifyAccountApi.defaults.params['scope'] = 'user-read-currently-playing';
spotifyAccountApi.defaults.params['state'] = '34fFs29kd09';


export default spotifyAccountApi;