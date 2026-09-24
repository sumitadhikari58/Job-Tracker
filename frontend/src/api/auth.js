import api from "./client.js";

// POST /api/auth/register -> returns { message, token, user }
export const registerUser = (name, email, password) =>
  api.post("/auth/register", { name, email, password });

// POST /api/auth/login -> returns { message, token, user }
export const loginUser = (email, password) =>
  api.post("/auth/login", { email, password });

// GET /api/auth/me -> returns { id, name, email, created_at }
export const getMe = () => api.get("/auth/me");
