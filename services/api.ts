import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.223.147:5000/api', // Replace with your API base URL
  timeout: 10000, // Set a timeout for requests
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export default api;
