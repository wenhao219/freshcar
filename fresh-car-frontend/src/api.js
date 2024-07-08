import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8090/', // Set the API prefix here
  withCredentials: true,
  crossDomain: true,
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        // Redirect to login page
        window.location.href = '/';
      }
      return Promise.reject(error);
    },
  );

export default api;