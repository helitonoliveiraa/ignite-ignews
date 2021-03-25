import axios from 'axios';

export const api = axios.create({
  baseURL: '/api'
}); 

// This setting was created for that front-end can to communicate with the APIs Routes