import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://tradingchatbot-frontend-51ld.onrender.com//api';

const API = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests if it exists
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
