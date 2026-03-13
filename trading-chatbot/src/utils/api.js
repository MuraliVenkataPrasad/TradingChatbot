import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api', // Make sure this matches your backend URL
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

// import axios from 'axios';

// const API = axios.create({
//   baseURL: 'http://localhost:5000/api', // Make sure this matches your backend port
//   withCredentials: true,
// });

// // Add token to requests if it exists
// API.interceptors.request.use((req) => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     req.headers.Authorization = `Bearer ${token}`;
//   }
//   return req;
// });

// export default API;