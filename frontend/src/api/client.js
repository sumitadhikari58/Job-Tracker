import axios from "axios";

// one axios instance for the whole app.
// baseURL comes from .env (VITE_API_URL), so it's easy to swap
// localhost for your deployed EC2/RDS URL later.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// interceptor: runs before every request.
// it grabs the JWT from localStorage and attaches it to the
// Authorization header, so protected routes on the backend accept it.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
