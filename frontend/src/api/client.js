import axios from "axios";

// one axios instance for the whole app.
// baseURL comes from .env (VITE_API_URL), so it's easy to swap
// localhost for your deployed EC2/RDS URL later.
// without it we fall back to "/api", which the vite dev server proxies to the backend.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
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

// if the backend rejects our token (expired / invalid), drop it and go to login.
// login itself also returns 401 for a wrong password, so skip auth routes.
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const url = err.config?.url || "";
    if (err.response?.status === 401 && !url.startsWith("/auth/")) {
      localStorage.removeItem("token");
      window.location.assign("/login");
    }
    return Promise.reject(err);
  }
);

// pulls the backend's { message } out of an axios error
export const errorMessage = (err, fallback) => err.response?.data?.message || fallback;

export default api;
